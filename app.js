console.log("Iniciando servidor...");

require('dotenv').config();
const { sequelize } = require('./models');

const authRouter = require('./routes/auth');
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users'); 
const authMiddleware = require('./middlewares/auth');

const { swaggerUi, swaggerSpec } = require('./swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/auth', authRouter);
app.use('/users', authMiddleware, usersRouter);

app.use('/', indexRouter);

app.get('/ping', (req, res) => {
  res.status(200).send();
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;
