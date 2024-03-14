const mysql = require('mysql')



const dbConn = mysql.createPool({
    host: 'databasegalo.cd60eiew6qqu.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'gautamsolar',
    database: 'QCDev',
       })
  
  dbConn.getConnection(function (error) {
    if (error) {
      console.log(error, "ERROR");
      throw error;
    }
    console.log("Database Connected Successfully!!!");
  });
  
module.exports = {dbConn};
  

 // mysql.createPool({
        //     host:'databasegalo.cd60eiew6qqu.us-east-1.rds.amazonaws.com',
        //     user:'admin',
        //     password:'gautamsolar',
        //     database:'QCVDev'
        // })