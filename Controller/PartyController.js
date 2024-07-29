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
    const { PartyName, GSTNumber, PANNumber, Address, Country, State, Email, MobileNumber, Status, CurrentUser: CreatedBy, PinCode, CountryCode } = req.body;

    const UUID = v4();

    try {
        let getPartyNameQuery = `SELECT PartyName FROM PartyName WHERE PartyName = '${PartyName}';`
        let getPartyName = await queryAsync(getPartyNameQuery);
  
        if(getPartyName.length){
  
          return res.status(409).send({msg:'Duplicate Party Name'})
        }

        const query = `INSERT INTO PartyName(PartyNameId,PartyName,GSTNumber,PANNumber,Address,Country,State,Email,MobileNumber,PinCode,Status,CreatedBy,CreatedOn) VALUES
                                     ('${UUID}','${PartyName}','${GSTNumber}','${PANNumber}','${Address}','${Country}','${State}','${Email}','${CountryCode} ${MobileNumber}','${PinCode}','${Status}','${CreatedBy}','${getCurrentDateTime()}');`

        await queryAsync(query)

       return res.send({ msg: 'Inserted Succesfully!', PartyNameId: UUID });

    } catch (err) {

        console.log(err)
       return res.status(400).send({ err })

    }



}


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
    let data = await queryAsync(`SELECT PartyName, PartyNameId, Country FROM PartyName`);
    res.send(data)
  }catch(err){
    res.status(400).send({err})
  }


}

module.exports = { AddParty,getCurrency,getPartyNames }
