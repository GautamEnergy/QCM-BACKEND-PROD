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
    const { PartyName, GSTNumber, PANNumber, Address, Country, State, Email, MobileNumber, Status, CurrentUser: CreatedBy } = req.body;

    const UUID = v4();

    try {
        const query = `INSERT INTO PartyName(PartyNameId,PartyName,GSTNumber,PANNumber,Address,Country,State,Email,MobileNumber,Status,CreatedBy,CreatedOn) VALUES
                                     ('${UUID}','${PartyName}','${GSTNumber}','${PANNumber}','${Address}','${Country}','${State}','${Email}','${MobileNumber}','${Status}','${CreatedBy}','${getCurrentDateTime()}');`

        await queryAsync(query)

        res.send({ msg: 'Inserted Succesfully!', PartyNameId: UUID });

    } catch (err) {

        console.log(err)
        res.status(400).send({ err })

    }



}



module.exports = { AddParty }
