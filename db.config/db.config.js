const mysql = require('mysql')
require('dotenv').config()

const dbConn = mysql.createPool({
    host: process.env.Host,
    user: process.env.User,
    password: process.env.Password,
    database: process.env.Database,
       })
  
  dbConn.getConnection(function (error) {
    if (error) {
      console.log(error, "ERROR");
    }else{
    console.log("Database Connected Successfully!!!");
    }
  });
  

module.exports = {dbConn};
  
