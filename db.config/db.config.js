const mysql = require('mysql')



const dbConn = mysql.createPool({
    host: 'qcm.cz2oiimue97z.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: 'qcm12345',
    database: 'QCDev',
       })
  
  dbConn.getConnection(function (error) {
    if (error) {
      console.log(error, "ERROR");
    }else{
    console.log("Database Connected Successfully!!!");
    }
  });
  

module.exports = {dbConn};
  

