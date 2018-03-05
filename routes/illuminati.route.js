var _ = require("lodash");
var users = require('../models/users.model.js');

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    return res.json({ user: req.user, results: _.filter(users, u => _.indexOf(u.roles, 'illuminati') >= 0) });
});

router.get("/:id", function (req, res) {
    res.json(_.filter(users, u => u.id == req.params.id));
});

module.exports = router;