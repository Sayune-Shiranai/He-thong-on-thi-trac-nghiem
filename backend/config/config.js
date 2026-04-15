'use strict';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, "../.env") });

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_SERVER,
    dialect: 'mssql',
    logging: false,
    // port: 1433,
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
        // integratedSecurity: true
      },
    },
  },
};

// Debug check env variables
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_DATABASE:", process.env.DB_DATABASE);
console.log("DB_SERVER:", process.env.DB_SERVER);