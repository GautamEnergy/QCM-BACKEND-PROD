const { v4: uuidv4, v4 } = require('uuid');
const {getCurrentDateTime} = require('../Utilis/MaintenanceUtilis')
const util = require('util');
const fs = require('fs');
const Path = require('path');
const { dbConn } = require('../db.config/db.config');
require('dotenv').config();
const PORT = process.env.PORT || 9090;


/** Making Sync To Query */
const queryAsync = util.promisify(dbConn.query).bind(dbConn);


/**Add Machine Data  */
const AddMachineData = async (req, res) => {
    const { MachineName,
        MachineBrandName,
        MachineModelNumber,
        MachineNumber,
        Status,
        CurrentUser: CreatedBy } = req.body;


    const UUID = v4();

    try {
        let getMachineNameQuery = `SELECT MachineName FROM Machine WHERE MachineName = '${MachineName}';`
      let getMachineName = await queryAsync(getMachineNameQuery);

      if(getMachineName.length){

        return res.status(409).send({msg:'Duplicate Machine Name'});
      }
      
        let getMachineModelNumberQuery = `SELECT MachineModelNumber FROM Machine WHERE MachineModelNumber = '${MachineModelNumber}';`
      let getMachineModelNumbers = await queryAsync(getMachineModelNumberQuery);

      if(getMachineModelNumbers.length){

        return res.status(409).send({msg:'Duplicate Machine Model Number'})
      }
    
        const query = `INSERT INTO Machine(MachineId,MachineName,MachineBrandName,MachineModelNumber,MachineNumber,Status,CreatedBy,CreatedOn) VALUES
                                     ('${UUID}','${MachineName}','${MachineBrandName}','${MachineModelNumber}','${MachineNumber}','${Status}','${CreatedBy}','${getCurrentDateTime()}');`

        await queryAsync(query)

       return res.send({ msg: 'Inserted Succesfully!', MachineId: UUID });

    } catch (err) {

        console.log(err)
       return res.status(400).send({ err })

    }



}

/**Controller To Get MachineId & MachineName */
const MachineDetailById = async (req, res) => {
    const { MachineId } = req.body;


    try {
      
      let query =  MachineId?`SELECT MachineModelNumber FROM Machine WHERE MachineId = '${MachineId}';`:`SELECT MachineId, MachineName FROM Machine;`

       let data =  await queryAsync(query)

        res.send(data);

    } catch (err) {

        console.log(err)
        res.status(400).send({ err })

    }



}

const GetMachineModelNumberById = async (req, res) => {
    const { MachineId } = req.body;


    try {

        let query = `SELECT MachineModelNumber FROM Machine WHERE MachineId = '${MachineId}';`;

        let data = await queryAsync(query)

        res.send(data);

    } catch (err) {

        console.log(err)
        res.status(400).send({ err })

    }
}


module.exports = { AddMachineData, MachineDetailById, GetMachineModelNumberById }
