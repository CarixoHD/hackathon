var mysql = require('mysql')
var password = require('./password')
var Models = require('./models')
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: password.password,
    database: "gimep"
});
  
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected")
});
  

function doSQL(sql)
{
    return new Promise((resolve, reject) => {
        con.query(sql,function (err,result){
            if (err) {
                reject(err)
            }else{
                resolve(result)
            }
        })
    });
}

function makeUser(username,password,team)
{
    let sql = "INSERT INTO user(tp,name,team) VALUES (0,\""+username+"\","+team+")";
    doSQL(sql);
}

function makeTeam(name,pm)
{
    let sql = "INSERT INTO team(tp,name,pm) VALUES (0,\""+name+"\","+pm+")";
    doSQL(sql);
}

function makeTask(name,user)
{
    let sql = "INSERT INTO task(name,user, status) VALUES (\""+name+"\","+user+", 0)";
    doSQL(sql);
}

function makeMilestone(team,reward,tp_needed,name)
{
    let sql = "INSERT INTO milestone(team,reward,tp_needed,name,status) VALUES ("+team+",\""+reward+"\","+tp_needed+",\""+name+"\",0)";
    doSQL(sql);
}


function selectAllFrom(table) {
    let sql  = `SELECT * FROM ${table}`;
    return doSQL(sql);
}

function selectSpecificFrom(table, field, value, selectField) {
    let sql = `SELECT ${field} FROM ${table} WHERE ${selectField}=${value}`;
    return doSQL(sql);
}

function milestoneProgress(milestone,userid)
{
    let milestonetp = sql.selectSpecificFrom("milestone","tp_needed",milestone,"id");
    let tasksDoneByTeam = sql.doSQL(```
    SELECT COUNT(task.id), user.id, user.name, team.id, team.name
    FROM task 
    INNER JOIN user, team 
    WHERE user.team = team.id 
    AND task.user = user.id 
    AND task.status = 1 
    AND user.id = ${userid};```);
    progress = milestonetp/tasksDoneByTeam;
    return progress;
}

function changeStatus(taskId, table, status) {
    let sql = `UPDATE ${table} SET status = ${status} WHERE id = ${taskId}`;
    return doSQL(sql);
}

function getTasks(userId){
  let user = new Models.User(userId);

  let selectUserTask = `SELECT COUNT(task.id) AS tasksDone, user.id AS userId, user.name AS userName, team.id AS teamId, team.name AS teamName
  FROM task 
  INNER JOIN user, team 
  WHERE user.team = team.id 
  AND task.user = user.id 
  AND task.status = 1 
  AND user.id = ${user.id};`;
  let selectTask = `SELECT task.id, task.status, task.name, task.descript FROM task WHERE task.user = ${user.id}`;
  let selectMilestone = `SELECT milestone.id, milestone.reward FROM milestone,user WHERE milestone.team = user.team AND user.id = ${user.id};`;
  return Promise.all([doSQL(selectUserTask), doSQL(selectTask), doSQL(selectMilestone)])
  .then((result) => {
    user.id = result[0][0].userId;
    user.name = result[0][0].userName;
    user.team = new Models.Team(result[0][0].teamId,result[0][0].teamName);

    user.tasks = result[1].map(task => new Models.Task(task.id,task.status,task.name,task.descript))

    let tasksDone = result[0][0].tasksDone;

    user.team.milestones = result[2].map(milestone => new Models.Milestone(
      milestone.id,milestone.id,milestone.reward,0
    ));
    let life = 5;
    for (i = 0; i < user.team.milestones.length; i++)
    {
        console.log(tasksDone);
        if (tasksDone > life)
        {
            tasksDone -= life;
            user.team.milestones[i].done = true;
            user.team.milestones[i].health = 0;
        }
        else {
            user.team.milestones[i].health = (life-tasksDone)/life;
            user.team.milestones[i].done = false;
        }
    }
    console.log(JSON.stringify(user));
    return JSON.stringify(user);
  });
}

// function update(field, )


var sql = {
    con: con,
    doSQL: doSQL,
    makeUser: makeUser,
    makeTeam: makeTeam,
    makeTask: makeTask,
    makeMilestone: makeMilestone,
    selectSpecificFrom: selectSpecificFrom,
    msPro: milestoneProgress,
    changeStatus: changeStatus,
    getTasks: getTasks
}
module.exports = sql
