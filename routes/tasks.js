var express = require('express');
const { getTasks } = require('../sql');
var sql = require('../sql')
var router = express.Router();



router.get('/', function(req, res, next) {
    getTasks(req.query.userId)
    .then(result => {
        res.status(200).send(result)
    })
    .catch(err => {
        console.log(err);
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
