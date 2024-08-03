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
const AddParty = async (req, res) => {
  const {
      PartyNameId,
      PartyName,
      GSTNumber,
      PANNumber,
      Address,
      Country,
      State,
      Email,
      MobileNumber,
      Status,
      CurrentUser: CreatedBy,
      PinCode,
      CountryCode
  } = req.body;

  const UUID = PartyNameId || v4();
  

  try {
      if (!PartyNameId) {
          // Check for duplicate Party Name only if inserting a new record
          let getPartyNameQuery = `SELECT PartyName FROM PartyName WHERE PartyName = '${PartyName}'`;
          let getPartyName = await queryAsync(getPartyNameQuery);

          if (getPartyName.length) {
              return res.status(409).send({ msg: 'Duplicate Party Name' });
          }

          // Insert new record
          const insertQuery = `INSERT INTO PartyName(
              PartyNameId, PartyName, GSTNumber, PANNumber, Address, Country, State, Email, MobileNumber, PinCode, Status, CreatedBy, CreatedOn
          ) VALUES (
              '${UUID}', '${PartyName}', '${GSTNumber}', '${PANNumber}', '${Address}', '${Country}', '${State}', '${Email}', '${CountryCode} ${MobileNumber}', '${PinCode}', '${Status}', '${CreatedBy}', '${getCurrentDateTime()}'
          );`;

          await queryAsync(insertQuery);
          return res.send({ msg: 'Inserted Successfully!', PartyNameId: UUID });
      } else {
        // Check for duplicate Party Name only if inserting a new record
        let getPartyNameQuery = `SELECT PartyName FROM PartyName WHERE PartyName = '${PartyName}' and PartyNameId <> '${PartyNameId}'`;
        let getPartyName = await queryAsync(getPartyNameQuery);

        if (getPartyName.length) {
            return res.status(409).send({ msg: 'Duplicate Party Name' });
        }
          // Update existing record
          const updateQuery = `UPDATE PartyName SET
              PartyName = '${PartyName}',
              GSTNumber = '${GSTNumber}',
              PANNumber = '${PANNumber}',
              Address = '${Address}',
              Country = '${Country}',
              State = '${State}',
              Email = '${Email}',
              MobileNumber = '${CountryCode} ${MobileNumber}',
              PinCode = '${PinCode}',
              Status = '${Status}',
              UpdatedBy = '${CreatedBy}',
              UpdatedOn = '${getCurrentDateTime()}'
          WHERE PartyNameId = '${PartyNameId}';`;

          await queryAsync(updateQuery);
          return res.send({ msg: 'Updated Successfully!', PartyNameId: PartyNameId });
      }
  } catch (err) {
      console.log(err);
      return res.status(400).send({ err });
  }
};


const getCurrency = async(req, res)=>{
    
  try{
     const query = `SELECT CurrencyId, Country, Currency FROM Currency;`;
     let data = await queryAsync(query);
     res.send(data)
  }catch(err){
    res.status(400).send({err})
  }
}


const getPartyNames = async(req, res)=>{  
  try{
    let data = await queryAsync(`SELECT PartyName, PartyNameId, Country, Email, MobileNumber 
  FROM PartyName 
  ORDER BY createdOn DESC`);
    res.send(data)
  }catch(err){
    res.status(400).send({err})
  }


}


const getPartyListById = async (req, res) => {
  const { PartyNameId } = req.body;
  try {
    const query = `
    SELECT *
    FROM PartyName p
    WHERE p.PartyNameId = '${PartyNameId}' AND p.Status = 'Active';`;



    let data = await new Promise((resolve, reject) => {
      dbConn.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });   
    
    res.send({data:data});
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
};








module.exports = { AddParty,getCurrency,getPartyNames, getPartyListById }
