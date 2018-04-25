'use strict';

/**
 * test for the database client class
 */

// imports and vars
var chai = require('chai');
chai.use(require('chai-as-promised'));
var assert = chai.assert,
  expect = chai.expect,
  should = chai.should(),
  p = console.log;

var mysql = require('mysql2');
var db_client = require('../src/index');

describe('DBClient', function(){
  describe('query with pool', function(){
    it('should return an array of objects', function(){
      var q = 'SELECT * FROM user';
      return db_client.master.query(q)
        .then(res => {
          expect(res).to.be.an('array');
          return res.map(e => expect(e).to.be.instanceOf(Object))
        })
    })
  })
  describe('execute with pool', function(){
    it('should return an array of objects', function(){
      var q = 'SELECT * FROM user WHERE id = ?';
      return db_client.master.execute(q, [1])
        .then(res => {
          expect(res).to.be.an('array');
          return res.map(e => expect(e).to.be.instanceOf(Object))
        })
    })
  })
  describe('getSingleConnection', function(){
    it('should return a MySqlConnection object', function(){
      return db_client.getSingleConnection()
        .then(c => {
          expect(c).to.be.instanceof(mysql.MySqlConnection);
          c.release;
          return
        })
    })
  })
});