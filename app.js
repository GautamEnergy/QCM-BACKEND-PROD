const express = require('express')
const { dbConn } = require('./db.config/db.config')
const { PersonRouter } = require('./Routes/Person.Route')
const { designationRouter } = require('./Routes/DesignationRoute')
const { IQCSolarCellRoute } = require('./Routes/IQCSolarCellRoute')
const { QualityRoute } = require('./Routes/QualityRoutes')
const path = require('path')
const { IPQC } = require('./Routes/IPQCRoute')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 9090
require('dotenv').config()
app.use(express.json())
app.use(cors())






console.log(process.env.PORT);

/**Endpoints */

/** to Employee */
app.use('/Employee',PersonRouter)

/** to Department and Designation */
app.use('/QCM',designationRouter)

/** to IQC Solar Cell */
app.use('/IQCSolarCell',IQCSolarCellRoute)

/**to IPQC */
app.use('/IPQC',IPQC);

/**to Quality */
app.use('/Quality', QualityRoute)


app.listen(PORT,async()=>{
  try{
    console.log('server is running')
    console.log('Database is connecting....')
      dbConn
  }catch(err){
console.log(err)
  }
})
