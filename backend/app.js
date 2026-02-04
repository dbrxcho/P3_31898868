const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const tagsRouter = require('./routes/tags');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { sequelize } = require('./models');

const app = express();

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// CORS: permitir orígenes y headers usados por Swagger UI (incluye preflight OPTIONS)
app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Accept'],
  exposedHeaders: ['Content-Length'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
// Asegura que se atiendan las solicitudes OPTIONS globalmente
app.options('*', cors());

// Log simple de CORS preflight para depuración (se puede quitar cuando esté bien)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log('CORS preflight:', req.originalUrl, 'Headers:', req.headers['access-control-request-headers']);
  }
  next();
});

// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/auth', authRouter);

// Debug temporal: endpoint sin auth para comprobar CORS desde Swagger/UI
app.get('/api/_debug/orders', (req, res) => {
  res.status(200).json({ status: 'success', data: [], message: 'debug orders OK' });
});

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health, Ping y About
app.get('/ping', (req, res) => {
  res.status(200).send();
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/about', (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      nombreCompleto: "Daniel Bracho",
      cedula: "31898868",
      seccion: "2"
    }
  });
});

// Integración del Frontend
// Sirve los archivos estáticos generados por el build del frontend
const frontendPath = path.join(__dirname, '../frontend/build'); // CRA build path

// Si existe el build, sirve los assets estáticos y un fallback para la SPA
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  // En desarrollo local sin build disponible no hacemos nada
  console.log('Frontend build no encontrado en:', frontendPath);
} 

module.exports = app;
