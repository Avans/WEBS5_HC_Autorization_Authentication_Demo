var _ = require("lodash");
var users = require('../models/users.model.js');
var ConnectRoles = require('connect-roles');

var roles = new ConnectRoles();

module.exports = roles;