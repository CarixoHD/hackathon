
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sql = require('./sql');
var app = express();
var mslogic = require('./milestoneLogic');
const { makeUser } = require('./sql');
const { doesNotMatch } = require('assert');

class User{
  constructor (id)
  {
    this.id = id;
    this.username;
    this.team;
    this.tasks = [];
  }
}

class Team{
  constructor(id,name)
  {
    this.id = id;
    this.name = name;
    this.milestones = [];
  }
}

class Milestone{
  constructor(id,order,reward,done)
  {
    this.id = id;
    this.order = order;
    this.reward = reward;
    this.health;
    this.done = done;
  }
}

class Task{
  constructor(id,completed,name,description)
  {
    this.id = id;
    this.completed = completed;
    this.name = name;
    this.description = description;
  }
}

let user = new User(6);
let json;


let sqlLine = `SELECT COUNT(task.id) AS tasksDone, user.id AS userId, user.name AS userName, team.id AS teamId, team.name AS teamName
FROM task 
INNER JOIN user, team 
WHERE user.team = team.id 
AND task.user = user.id 
AND task.status = 0 
AND user.id = ${user.id};`
sql.con.query(sqlLine,function(err,result){
  if (err) throw err;
  user.id = result[0].userId;
  user.name = result[0].userName;
  user.team = new Team(result[0].teamId,result[0].teamName);
});


//get tasks
sqlLine = `SELECT task.id, task.status, task.name, task.descript FROM task WHERE task.user = ${user.id}`
sql.con.query(sqlLine,function(err,result){
  if (err) throw err;
  for (i=0;i<result.length;i++){
    user.tasks.push(new Task(
      result[i].id,result[i].status,result[i].name,result[i].descript
    ));
  } 
});

//get milestones
sqlLine = `SELECT milestone.id, milestone.reward, milestone.status FROM milestone,user WHERE milestone.team = user.team AND user.id = ${user.id};`
sql.con.query(sqlLine,function(err,result){
  if (err) throw err;
  for (i=0;i<result.length;i++){
    user.team.milestones.push(new Milestone(
      result[i].id,result[i].id,result[i].reward,result[i].status
    ));
  }
  json = JSON.stringify(user);
  console.log(json);
});
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

/*
sql.makeTeam("Software","1")

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
