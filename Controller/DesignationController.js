const {dbConn} = require('../db.config/db.config')

/** Controller To Get Designation List */
const getDesignationList = async(req,res)=>{
    const query = `SELECT Designation FROM Designation`
try{
    const data = await new Promise((resolve,reject)=>{
        
       dbConn.query(query,(err,result)=>{
         if(err){
           reject(err)
         }else{
           resolve(result)
         }
       })
    })
   res.send({data:data})
   }catch(err){
     res.status(500).send({err})
   }
}

module.exports = {getDesignationList}