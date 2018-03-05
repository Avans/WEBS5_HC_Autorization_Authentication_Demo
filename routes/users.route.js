var _ = require("lodash");
var users = require('../models/users.model.js');

var express = require('express');
var router = express.Router();

var passport = require('passport');

router.get('/', function (req, res) {
    return res.json(users);
});

router.get("/me", function (req, res) {
    res.json({ message: 'Hier gaan we straks jouw eigen gebruiker teruggeven. ' });
});

module.exports = router;