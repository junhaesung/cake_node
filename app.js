var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const request = require('request');
const cron = require('node-cron');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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


const FIREBASE_SERVER_KEY = require('./config/firebase').serverKey;

/**
 * send message to mobile
 */
function sendMessage(data = {}) {
  const headers = {};
  headers["Content-Type"] = 'application/json';
  headers.Authorization = FIREBASE_SERVER_KEY;

  const option = {
    method: 'POST',
    url: 'https://fcm.googleapis.com/fcm/send',
    body: {
      data: {
        message: 'message from express',
      },
      to: '/topics/foo-bar',
    },
    json: true,
  };
  option.headers = headers;

  request(option, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      console.log(body);
    }
  });
}

cron.schedule('*/10 * * * * *', () => {
  console.log('running a task every 10 seconds');
  sendMessage();
});


module.exports = app;
