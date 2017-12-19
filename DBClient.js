/**
 *  Database connection and executing queries
 */

 'use strict';

// imports
const Promise = require('bluebird');
const mysql   = require('mysql2');
const pRes = e => Promise.resolve(e);
const pRej = e => Promise.reject(e);

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
    this.connection = new mysql.createConnection(DB_CONF);
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
    return arguments.length !== 2 ?
      pRej(new Error('Invalid Arguments.')) :
      params.length === 0 ?
      pRej(new Error('Empty Param. Use query() for executing raw queries.')) :
      new Promise((res, rej) => {
      this.getConnection()
        .then(_ => {
          this.connection.execute(query, params, (err, rows) => {
            this.endConnection();
            err ? rej(err) : res(Array.isArray(rows) ? _cleanResult(rows) : rows);
          });
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
      this.getConnection()
        .then(_ => {
          this.connection.query(query, (err, rows) => {
            this.endConnection();
            err ? rej(err) : res(_cleanResult(rows))
          });
        });
    });
  }
  /**
   * get connection
   * @return { Promise }
   * @throws { Promise<Error> }
   */
  getConnection(){
    return new Promise((res, rej) => this.connection.connect(err => err ? rej(err) : res())); 
  }  
  /**
   * end connection
   * @return { Promise }
   * @throws { Promise<Error> }
   */
  endConnection(){
    return new Promise((res, rej) => this.connection.end(err => err ? rej(err) : res()));
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