var createError = require('http-errors');
var express = require('express');
var path = require('path');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

// 引入你的路由處理程序
// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login'); // 新增這行
var calculateRouter = require('./routes/calculate');
// var registerRouter = require('./routes/register'); // 新增這行

var app = express();
app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 掛載你的路由處理程序
app.use('/', loginRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter); // 新增這行
app.use('/register', loginRouter); // 新增這行
app.use('/dashboard.html', loginRouter);
app.use('/saveExam', calculateRouter);
app.use('/saveSubject/:examName', calculateRouter);
app.use('/saveLeisure', calculateRouter);
app.use('/getExams', calculateRouter);
app.use('/getFreeTime', calculateRouter);

// 路由未找到（404）
app.use(function(req, res, next) {
  return res.status(404).send({ message: 'Route'+req.url+' Not found.' });
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

module.exports = app;
