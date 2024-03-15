const express = require('express')
const {dbConn} = require('./db.config/db.config')
const {PersonRouter} = require('./Routes/Person.Route')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())








app.use('/Employee',PersonRouter)


app.listen(5000,async()=>{
  try{
 dbConn
  console.log('server is running')
  
  }catch(err){
console.log(err)
  }
})