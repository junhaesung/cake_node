var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const request = require('request');
const cron = require('node-cron');
const FIREBASE_SERVER_KEY = require('./config/firebase').serverKey;
const DATA_SERVICE_KEY = require('./config/data').serviceKey;

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

/**
 * schedule job
 */
cron.schedule('*/10 * * * * *', () => {
  console.log('running a task every 10 seconds');
  // sendMessage();
});

/**
 * 서울
 */
function findBusNoInSeoul() {
  
}

/**
 * 경기
 */
function findBusByNoInGyeonggi() {
  
}

/**
 * 서울, 경기 제외한 나머지. 일단 인천
 */
function findBusByNoInIncheon(busNo) {
  const url = 'http://openapi.tago.go.kr/openapi/service/BusRouteInfoInqireService/getRouteNoList';
  const serviceKey = DATA_SERVICE_KEY;
  const cityCode = 23;  // 인천 cityCode
  const routeNo = 1000;

  return new promise((resolve, reject) => {
    try {
      request.get(`${url}?serviceKey=${DATA_SERVICE_KEY}&cityCode=${cityCode}&routeNo=${routeNo}`, (err, res, body) => {
        console.log(body);
        resolve(body);
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = app;
