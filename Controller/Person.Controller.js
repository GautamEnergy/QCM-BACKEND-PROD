const {dbConn} = require('../db.config/db.config')

const PersonRegister = (req, res) => {
    const { personid, employeeid, loginid, joblocation, fullname, department, designation } = req.body
     
    const query = `CALL PersonRegister('${personid}','${employeeid}','${loginid}', '${joblocation}', '${fullname}')`
}