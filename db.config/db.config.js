const mysql = require('mysql')



const dbConn = mysql.createPool({
  host: '93.127.167.249',
    user: 'admin',
    password: 'QCMDev@123',
    database: 'QCMProd'
       })
  
  dbConn.getConnection(function (error) {
    if (error) {
      console.log(error, "ERROR");
    }else{
    console.log("Database Connected Successfully!!!");
    }
  });
  

module.exports = {dbConn};
  
