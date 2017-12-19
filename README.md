# promise-mysql-client
A Promise-wrapped mysql database client.
---
## Environment

### Node.js
* LTS(8.x)

### npm dependencies
```
npm install bluebird -S (this is optional)
npm install mysql2 -S
```

## Start Guide
```

var DB_CONF = {
    "host": "localhost",
    "user": "root",
    "password": "password",
    "database": "testDB",
    "port": 3306,
    "ssl": false,
    "connectTimeout": 30000
}

const DBC = require('./database/db_client');
var DBClient = new DBC(DB_CONF);

DBClient.query('select * from user')
    .then(results => { // do stuff here })
    .catch(e => console.log(e));

DBClient.execute('select * from user where user_id = ?', [39])
    .then(results => { // do stuff here })
    .catch(e => console.log(e));

```

* use query("string") to execute a raw query.
* use execute("string", Array) to build and execute a query.

