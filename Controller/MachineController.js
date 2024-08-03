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
    const {MachineId, MachineName,
        MachineBrandName,
        MachineModelNumber,
        MachineNumber,
        Status,
        CurrentUser: CreatedBy } = req.body;


    const UUID = v4();

    try {    

        if (MachineId) {
          let getMachineNameQuery = `SELECT MachineName FROM Machine WHERE MachineName = '${MachineName}' and MachineId <> '${MachineId}';`
          let getMachineName = await queryAsync(getMachineNameQuery);
  
          if(getMachineName.length){
  
            return res.status(409).send({msg:'Duplicate Machine Name'});
          }
        
          let getMachineModelNumberQuery = `SELECT MachineModelNumber FROM Machine WHERE MachineModelNumber = '${MachineModelNumber}' and MachineId <> '${MachineId}';`
          let getMachineModelNumbers = await queryAsync(getMachineModelNumberQuery);
  
          if(getMachineModelNumbers.length){
  
          return res.status(409).send({msg:'Duplicate Machine Model Number'})
          }  


          const updateQuery = `UPDATE Machine SET MachineName='${MachineName}', MachineBrandName='${MachineBrandName}',
           MachineModelNumber='${MachineModelNumber}', MachineNumber='${MachineNumber}', Status='${Status}',
            UpdatedBy='${CreatedBy}', UpdatedOn='${getCurrentDateTime()}' WHERE MachineId='${MachineId}';`
          await queryAsync(updateQuery);

          return res.send({ msg: 'Updated Successfully!', MachineId: MachineId });
        } else {
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
  
           // Otherwise, add a new machine
             const insertQuery = `INSERT INTO Machine(MachineId, MachineName, MachineBrandName, MachineModelNumber, MachineNumber, Status, CreatedBy, CreatedOn)
              VALUES ('${UUID}', '${MachineName}', '${MachineBrandName}', '${MachineModelNumber}', '${MachineNumber}', '${Status}', '${CreatedBy}', '${getCurrentDateTime()}');`
            await queryAsync(insertQuery);
           return res.send({ msg: 'Inserted Successfully!', MachineId: UUID });
        }  

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


const GetMachineList = async (req, res) => {
    try {

        let query = `SELECT MachineId, MachineName, MachineBrandName, MachineModelNumber, MachineNumber FROM Machine WHERE Status = 'Active';`;

        let data = await queryAsync(query)

        res.send({data:data});

    } catch (err) {

        console.log(err)
        res.status(400).send({ err })

    }
}


const GetMachineListById = async (req, res) => {
    const { MachineId } = req.body;


    try {
        let query = `SELECT MachineId, MachineName, MachineBrandName, MachineModelNumber, MachineNumber, Status FROM Machine WHERE MachineId = '${MachineId}' and Status = 'Active';`;
        let data = await queryAsync(query)
        
        res.send({data});
    } catch (err) {

        console.log(err)
        res.status(400).send({ err })

    }
}


module.exports = { AddMachineData, MachineDetailById, GetMachineModelNumberById, GetMachineList, GetMachineListById }
