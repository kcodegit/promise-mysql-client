/**
 *  Database connection and executing queries
 */

'use strict';

// imports and vars
var Promise = require('bluebird'),
  mysql = require('mysql2'),
  pRes = e => Promise.resolve(e),
  pRej = e => Promise.reject(e),
  p = console.log;

/**
 * @param { object } DB_CONF
 *  sample 
 * {
 *   "host": "localhost",
 *   "user": "root",
 *   "password": "password",
 *   "database": "testDB",
 *   "port": 3306,
 *   "ssl": false,
 *   "connectTimeout": 30000
 * } 
 */
class DBClient {
  constructor(DB_CONF) {
    this.CONF = DB_CONF;
  }

  /**
   * executes queries.
   * execute function builds a complete query with given params.
   * @param { string } query 
   * @param { Array } params
   * @return { Promise<Array<*>> }
   * @throws { Promise<Error> }
   */
  execute(query, params) {
    return new Promise((res, rej) => {
      var conn = this.getConnection();
      arguments.length !== 2 ? rej(new Error('Invalid Arguments. execute function takes two arguments.')) :
      typeof query !== 'string' ? rej(new Error('Invalid Argument. The query needs to be string.')) :
      params.length === 0 ? rej(new Error('Empty Param. Use query() for executing raw queries.')) :
      conn.execute(query, params, (err, rows) => {
        conn.end(err => { if (err) rej(err); });
        err ? rej(err) : res(Array.isArray(rows) ? _cleanResult(rows) : rows);
      });
    });
  }

  /**
   * executes raw queries.
   * @param { string } query
   * @return { Promise<Array<*>> }
   * @throws { Promise<Error> }
   */
  query(query) {
    return new Promise((res, rej) => {
      var conn = this.getConnection();
      arguments.length !== 1 ? rej(new Error('Invalid Arguments. query function takes one argument.')) :
      typeof query !== 'string' ? rej(new Error('Invalid Argument. The query needs to be string.')) :
      conn.query(query, (err, rows) => {
        conn.end(err => { if (err) rej(err); });
        err ? rej(err) : res(Array.isArray(rows) ? _cleanResult(rows) : rows);
      });
    });
  }

  /**
   * 
   * @param { Array<function> } callbacks 
   * @returns { Promise<true> }
   */
  transaction(...callbacks) {
    return Promise((res, rej) => {
      var conn = this.getConnection();
      
    });
  }

  /**
   * get connection
   * @return { Connection }
   */
  getConnection(){
    return new mysql.createConnection(this.CONF);
  }  
}

/**
 *  eliminate 'TextRow', 'BinaryRow' from the result rows and return object array
 *  if rows is empty, it returns an empty array
 * @param { [object...] } rows
 * @return { Array<*> }
 */ 
var _cleanResult = rows => rows.map(r => JSON.parse(JSON.stringify(r).replace('TextRow', '').replace('BinaryRow', '')));

module.exports = DBClient;