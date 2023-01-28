// require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'nigesppx_survey',
    password: 'BqqatZfpRwTi',
    database: 'nigesppx_survey' 
});

module.exports = pool.promise();