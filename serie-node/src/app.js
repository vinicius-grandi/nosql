var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOverride = require('method-override')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var projectsRouter = require('./routes/projects');

var app = express();

var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");

app.use(methodOverride('_method'));

// view engine setup
app.set('views', [
  path.join(__dirname, 'views'), 
  path.join(__dirname, 'views/auth')
]);
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {

  const allowedMethods = [
    "OPTIONS",
    "HEAD",
    "CONNECT",
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
  ];

  if (!allowedMethods.includes(req.method)) {
    res.status(405).send(`${req.method} not allowed.`);
  }

  next();
});

app.use((req, res, next) => {
  res.locals = {
    cookies: JSON.stringify(req.cookies).length
  }
  next();
});
app.use('/', indexRouter);
app.use('/login', usersRouter);
app.use('/register', registerRouter);
app.use('/projects', projectsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const liveReloadServer = livereload.createServer();

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});


app.use(connectLiveReload());

module.exports = app;
