'use strict';

// imports
const DBC = require('./classes/DBClient');
const DB_CONF = require('config').db;
var p = console.log();

var master = new DBC(DB_CONF.master, 'master');
// var slave1 = new DBC(DB_CONF.slave1, 'slave1');
// var slave2 = new DBC(DB_CONF.slave2, 'slave2'); 

// function randomClient(){
//     var i = Date.now()/3;
//     return i == 0 ? master : 1 ? slave1 : slave2;
// }

module.exports = { 
    master : master
    // slave1: slave1, 
    // slave2: slave2,
    // write: master,
    // read: randomClient()
};