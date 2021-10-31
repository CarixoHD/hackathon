var express = require('express');
var sql = require('../sql')
var router = express.Router();

router.post("/", function(req, res, next) {
  const loginInfo = req.body
  res.status(200).send({
    status: 200
  })
});

module.exports = router;
