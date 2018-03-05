var _ = require("lodash");
var users = require('../models/users.model.js');
var auth = require('../config/auth-config.js');

var express = require('express');
var router = express.Router();

module.exports = function () {
    router.get('/', function (req, res) {
        return res.json(_.filter(users, u => _.indexOf(u.roles, 'illuminati') >= 0));
    });

    router.get("/:id", function (req, res) {
        res.json(_.filter(users, u => u.id == req.params.id));
    });

    return router;
};