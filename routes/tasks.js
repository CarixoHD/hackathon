var express = require('express');
const { getTasks } = require('../sql');
var sql = require('../sql')
var router = express.Router();

router.get('/', function(req, res, next) {
    getTasks()
    .then((res) => {
      res.status(200).send(res)
    })
    .catch((err) => {
      res.status(500).send(err)
    })
});

router.post("/update", function(req, res, next) {
    sql.changeStatus(req.body.taskId, "task", req.body.status);
    console.log(req.body.taskId);
    res.status(200).send({
        status: 200
    })
})

module.exports = router;
