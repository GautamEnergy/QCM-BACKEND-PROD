const express = require('express')
const {dbConn} = require('./db.config/db.config')
const {PersonRouter} = require('./Routes/Person.Route')
const {designationRouter} = require('./Routes/DesignationRoute')
const {IQCSolarCellRoute} = require('./Routes/IQCSolarCellRoute')
const {IPQCJobCardRouter} = require('./Routes/IPQCJobCardRouter')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 8080
require('dotenv').config()
app.use(express.json())
app.use(cors())







/** to Employee */
app.use('/Employee',PersonRouter)

/** to Department and Designation */
app.use('/QCM',designationRouter)

/** to IQC Solar Cell */
app.use('/IQCSolarCell',IQCSolarCellRoute)


app.use('/IPQC',IPQCJobCardRouter);

app.listen(PORT,async()=>{
  try{
 dbConn
  console.log('server is running')
  
  }catch(err){
console.log(err)
  }
})