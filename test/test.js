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