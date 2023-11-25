var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload = require('express-fileupload');


require('dotenv').config();//esto se completa para vincular base de datos
var session = require('express-session'); //para hacer variables de sesiones

var pool = require('./models/bd');//para base de datos

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/admin/login');// aca irá el archivo login.js
var adminRouter = require('./routes/admin/novedades'); //creacion nueva pagina novedades

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//aca ponemos este codigo para las variables de sesiones, va antes de las paginas siempre

app.use(session({
  secret: 'jjllrrttvvrr2023',
  cookie: { maxAge: null },
  resave: false,
  saveUninitialized: true
}))

//aca ponemos codigo para agregar una capa mas asegurar que haya que loguearse para ingresar en este caso a pagina novedades, funsion asyncrononica, porque se puede activar en cualquier momento

secured = async (req, res, next) => {
  try {
    console.log(req.session.id_usuario);
    if (req.session.id_usuario) {
      next();
    } else {
      res.redirect('/admin/login');
    }
  } catch (error) {
    console.log(error);
  }
} //cierro secured


app.use(fileUpload({
  useTempFiles:true,
  tempFileDir:'/temp/'
}));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin/login', loginRouter);// para el login
app.use('/admin/novedades',secured, adminRouter);


pool.query('select * from usuarios').then(function (resultados) {
  console.log(resultados)
}); //aca va el nombre de la tabla de mysql

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
