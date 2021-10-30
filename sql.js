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
    con.query(sql,function (err,result){
        if (err) throw err;
        console.log("1 record inserted");
        return result;
    })
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
    let sql = "INSERT INTO task(name,user, status) VALUES (\""+name+"\","+user+", 1)";
    doSQL(sql);
}

function makeMilestone(team,reward,tp_needed,name)
{
    let sql = "INSERT INTO milestone(team,reward,tp_needed,name) VALUES ("+team+",\""+reward+"\","+tp_needed+",\""+name+"\")";
    doSQL(sql);
}


function selectAllFrom(table) {
    let sql  = `SELECT * FROM ${table}`;
    return doSQL(sql);
}

function selectSpecificFrom(table, field, value) {
    let sql = `SELECT ${field} FROM ${table} WHERE ${field}=${value}`;
    return doSQL(sql);

}

function changeStatus(taskId, table, status) {
    let sql = `UPDATE ${table} SET status = ${status} WHERE id = ${taskId}`;
    return doSQL(sql);
}

// function update(field, )


var sql = {
    doSQL: doSQL,
    makeUser: makeUser,
    makeTeam: makeTeam,
    makeTask: makeTask,
    makeMilestone: makeMilestone,
    changeStatus: changeStatus
}
module.exports = sql
