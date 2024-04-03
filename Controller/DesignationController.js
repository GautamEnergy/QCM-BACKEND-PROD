const {dbConn} = require('../db.config/db.config')

/** Controller To Get Designation List */
const getDesignationList = async(req,res)=>{
    const query = `SELECT *FROM Designation`
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


/**Controller to get Department List */

const getDepartmentList = async(req,res)=>{
  const query = `SELECT *FROM Department`
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

 /** Get Work Location List */
 const getWorkLocationList = async(req,res)=>{
  const query = `SELECT *FROM WorkLocation`
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
module.exports = {getDesignationList,getDepartmentList,getWorkLocationList}