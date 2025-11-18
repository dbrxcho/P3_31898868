const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const tagsRouter = require('./routes/tags');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { sequelize } = require('./models');
const cors = require('cors');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));
// Rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/tags', tagsRouter);
app.use('/auth', require('./routes/auth'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// Health, Ping y About
app.get('/ping', (req, res) => {
  res.status(200).send(); // simple respuesta OK
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' }); // endpoint de health para tests y Render
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

module.exports = app;

