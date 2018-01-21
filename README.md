# promise-mysql-client
A Promise-wrapped mysql database client.
---
## Environment

### Node.js
* LTS(8.x)

### npm dependencies
```
npm install bluebird -S
npm install mysql2 -S

(optional)
npm install config -S
```

## Start Guide
* import 'PATH/promise-mysql-client/index' to use npm config module
* import 'PATH/promise-mysql-client/classes/DBClient' to configure by yourself
```
// 'yourfile.js'

const DB_Client = require('./database/promise-mysql-client/index');
// for this you need the npm config module and already have your config files in the right place

// or 

var DB_CONF = {
  "host": "localhost",
  "user": "root",
  "password": "password",
  "database": "testDB",
  "port": 3306,
  "ssl": false,
  "connectTimeout": 30000
}

const DBC = require('./database/promise-mysql-client/classes/DBClient');
var DB_Client = new DBC(DB_CONF);

// and use like this

DB_Client.query('select * from user')
  .then(results => {
    // do stuff here 
  })
  .catch(e => console.log(e));

DB_Client.execute('select * from user where user_id = ?', [39])
  .then(results => {
    // do stuff here 
  })
  .catch(e => console.log(e));

```
* about the npm config module, see their document to see where to place your config files.
* get an instance with database config object. About the fields, refer to the npm 'mysql2' document => getConnection(config).
* use query("string") to execute a raw query.
* use execute("string", Array) to build and execute a query.
* execute() and query() functions both create a new connection/session.
* transaction() will create a single connection/session so if you would like to create LOCKs you can.
