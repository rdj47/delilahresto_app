+++ Welcome to Delilah Restó API Installation +++

1. Clone delilahresto_app repository from GitHub:

$ git clone https://github.com/rdj47/delilahresto_app.git



2. Please, through command line, execute SQL script to create bbdd required by Delilah Restó API:

...>mysql -u user -p
Enter password:

mysql> source ...\delilahresto_app\SQL\create_schemas_v1.sql

Query OK, 1 row affected (0.01 sec)

Query OK, 0 rows affected (0.06 sec)

Query OK, 0 rows affected (0.03 sec)

Query OK, 0 rows affected (0.02 sec)

Query OK, 0 rows affected (0.02 sec)
Records: 0  Duplicates: 0  Warnings: 0

Query OK, 0 rows affected (0.06 sec)
Records: 0  Duplicates: 0  Warnings: 0

Query OK, 0 rows affected (0.02 sec)
Records: 0  Duplicates: 0  Warnings: 0

Query OK, 0 rows affected (0.07 sec)
Records: 0  Duplicates: 0  Warnings: 0

Query OK, 0 rows affected (0.02 sec)

Query OK, 0 rows affected (0.02 sec)
Records: 0  Duplicates: 0  Warnings: 0

Query OK, 0 rows affected (0.06 sec)
Records: 0  Duplicates: 0  Warnings: 0

Query OK, 0 rows affected (0.02 sec)

Query OK, 0 rows affected (0.07 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql>



4. Install the node modules using package.json through command line:

...\delilahresto_app> npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (delilah_resto)
version: (1.0.0)
git repository: (https://github.com/rdj47/delilahresto_app.git)
keywords:
author:
license: (ISC)
About to write to C:\Users\Richard Villamizar\Dropbox\Acamica\Proyecto_3_Installation\delilahresto_app\package.json:

{
  "name": "delilah_resto",
  "version": "1.0.0",
  "description": "Delilah Restó - Proyecto 3 Acámica",
  "main": "index.js",
  "directories": {
    "doc": "doc",
    "lib": "lib"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.19.0",
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "express-jwt": "^6.0.0",
    "jsonwebtoken": "^8.5.1",
    "mysql2": "^2.2.5",
    "sequelize": "^6.3.5"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/rdj47/delilahresto_app.git"
  },
  "bugs": {
    "url": "https://github.com/rdj47/delilahresto_app/issues"
  },
  "homepage": "https://github.com/rdj47/delilahresto_app#readme"
}


Is this OK? (yes) yes



5. Install node modules required by app:

    ..\delilahresto_app>npm install bcryptjs
    ..\delilahresto_app>npm install body-parser
    ..\delilahresto_app>npm install cors
    ..\delilahresto_app>npm install express
    ..\delilahresto_app>npm install express-jwt
    ..\delilahresto_app>npm install jsonwebtoken
    ..\delilahresto_app>npm install mysql2
    ..\delilahresto_app>npm install sequelize



6. Go to JS file ...\delilahresto_app\lib\mysql_connector.js (line 3), to configure mysql bbdd connection parameters (user, password and port) and save changes.

const sequelize = new Sequelize ('mysql://user:password@localhost:port/delilahresto');  



7. Finally, run the API with the following command through command line:

...\delilahresto_app> node index.js
