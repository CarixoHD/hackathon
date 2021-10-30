var express = require('express');
var sql = require('../sql')
var router = express.Router();

router.get('/', function(req, res, next) {
    res.status(200).send({
    status: 200
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
