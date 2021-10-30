
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sql = require('./sql')
var app = express();
var loginRouter = require('./routes/login')
var tasksRouter = require('./routes/tasks')
var cors = require('cors');

// view engine setup

app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use("/login", loginRouter);
app.use("/tasks", tasksRouter);
app.use("/task/finish", tasksRouter);




// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).send("react feilmelding ting")
});

module.exports = app;
