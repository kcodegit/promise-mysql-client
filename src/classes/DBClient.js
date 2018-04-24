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
 * @param { String } tag
 *  sample 
 * {
 *   "host": "localhost",
 *   "user": "root",
 *   "password": "password",
 *   "database": "testDB",
 *   "port": 3306,
 *   "ssl": false,
 *   "connectTimeout": 5000
 *   "connectionLimit": 100
 * } 
 */
class DBClient {
  constructor(DB_CONF, tag) {
    this.pool = mysql.createPool(DB_CONF);
    this.CONF = DB_CONF;
    this.tag = tag;
  }

  /**
   * executes queries.
   * execute function builds a complete query with given params.
   * @param { String } query 
   * @param { Array } params
   * @param { MySqlConnection } conn *optional
   * @return { Promise<Array<*>> }
   * @throws { Promise<Error> }
   */
  execute(query, params, conn) {
    return new Promise((res, rej) => {
      if(typeof query !== 'string') return rej(new Error('Invalid Argument. The query needs to be string.'));
      if(params.length === 0)       return rej(new Error('Empty Params. Use query() for executing raw queries.'));
      var connection = conn ? conn : this.pool;
      connection.execute(query, params, (err, rows) => {
        if (err) return rej(err);
        return res(Array.isArray(rows) ? _cleanResult(rows) : rows);
      });
    });
  }

  /**
   * executes raw queries.
   * @param { String } query
   * @param { MySqlConnection } conn
   * @return { Promise<Array<*>> }
   * @throws { Promise<Error> }
   */
  query(query, conn) {
    return new Promise((res, rej) => {
      if(typeof query !== 'string') return rej(new Error('Invalid Argument. The query needs to be string.'));
      var connection = conn ? conn : this.pool;
      connection.query(query, (err, rows) => {
        if (err) return rej(err);
        return res(Array.isArray(rows) ? _cleanResult(rows) : rows);
      });
    });
  }

  /**
   * get a connection for transaction
   * @return { Connection }
   */
  getSingleConnection(){
    return new Promise((res, rej) => {
      this.pool.getConnection((err, connection) => {
        if(err) return rej(new Error("Error fetching a connection from the pool"));
        return res(connection);
      })
    })
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