var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

module.exports = app;
