'use strict';

// imports
const DBC = require('./classes/DBClient');
const DB_CONF = require('config').db.master;

module.exports = Object.freeze(new DBC(DB_CONF));