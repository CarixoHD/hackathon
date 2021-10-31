
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sql = require('./sql');
var app = express();
var mslogic = require('./milestoneLogic');
const { makeUser } = require('./sql');
const { doesNotMatch } = require('assert');


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
function post(path,data)
{
  app.post(path,function(req,res) {
    res.send(data);
  });
}


/*sql.makeTeam("Software","1")

sql.makeUser("Jonathan Locke","ppp","1")
sql.makeUser("Jonas Locke","ppp","1")
sql.makeUser("Martyn Black","ppp","1")
sql.makeUser("Shayan Alinejad","aaa","1")

sql.makeTask("Finish the task Jonathan","4")
sql.makeTask("Finish the other task Jonathan","4")
sql.makeTask("Finish the task Jonas","5")
sql.makeTask("Finish the task Jonas please","5")
sql.makeTask("Finish the task","6")
sql.makeTask("Go to the toilet","6")
sql.makeTask("Finish the task Alinejad","7")
sql.makeTask("Take a weekend Alinejad","7")
*/

module.exports = app;
