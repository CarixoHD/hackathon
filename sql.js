var mysql = require('mysql')
var password = require('./password')
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
    return con.query(sql,function (err,result){
        if (err) return err;
        return result;
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
    console.log(milestonetp,tasksDoneByTeam);
    progress = milestonetp/tasksDoneByTeam;
    return progress;
}

function changeStatus(taskId, table, status) {
    let sql = `UPDATE ${table} SET status = ${status} WHERE id = ${taskId}`;
    return doSQL(sql);
}

function getTasks(){
  let user = new User(6);

  let selectUserTask = `SELECT COUNT(task.id) AS tasksDone, user.id AS userId, user.name AS userName, team.id AS teamId, team.name AS teamName
  FROM task 
  INNER JOIN user, team 
  WHERE user.team = team.id 
  AND task.user = user.id 
  AND task.status = 0 
  AND user.id = ${user.id};`;
  let selectTask = `SELECT task.id, task.status, task.name, task.descript FROM task WHERE task.user = ${user.id}`;
  let selectMilestone = `SELECT milestone.id, milestone.reward, milestone.status FROM milestone,user WHERE milestone.team = user.team AND user.id = ${user.id};`;
  return Promise.all([doSQL(selectUserTask), doSQL(selectTask), doSQL(selectMilestone)])
  .then((result1, result2, result3) => {
  
    user.id = result1[0].userId;
    user.name = result1[0].userName;
    user.team = new Team(result1[0].teamId,result1[0].teamName);

    user.tasks = result2.map(task => new Task(task.id,task.status,task.name,task.descript))

    user.team.milestones = result3.map(milestone => new Milestone(
      milestone.id,milestone.id,milestone.reward,milestone.status
    ))
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
