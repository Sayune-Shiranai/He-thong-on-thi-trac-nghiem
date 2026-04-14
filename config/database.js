// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('QLHTOnThi', 'BINHBOONG\\admin', null, {
  host: 'localhost',
  dialect: 'mssql',
  dialectModule: require('tedious'),
  port: 1433,
  logging: false,
  dialectOptions: {
    authentication: {
      type: 'ntlm',  // Windows Authentication
      options: {
        domain: 'BINHBOONG',
        userName: 'admin',
        password: ''  // Không cần password khi dùng Windows Auth
      }
    },
    options: {
      encrypt: true,
      trustServerCertificate: true  // Tương ứng với "Trust Server Certificate"
    }
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;