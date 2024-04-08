const express = require('express')
const {AddIPQCJobCard,JobCardList,UploadPdf,GetSpecificJobCard,UpdateJobCardStatus} = require('../Controller/IPQCJobCard')
const {AddBomVerification} = require('../Controller/BOMVerification')
const {RoleAuthentication,upload} = require('../Middleware/IPQC.Middleware')
const IPQC = express.Router();





/** Route To Add Job Card */
IPQC.post('/AddJobCard',AddIPQCJobCard);

/** Router to Upload Reference Pdf in S3 and Get The Location and Set into dbs */
IPQC.post('/UploadPdf',upload.single('Reference'),UploadPdf)

/**Router To Add BOM Verification Data*/
IPQC.post('/AddBOMVerification',AddBomVerification)

/** Middleware to check Role Authentication */
IPQC.use(RoleAuthentication)

/**Router To Get List Of Job Card Data */
IPQC.post('/GetJobCardList',JobCardList)


/** Router to Get Specific Job Card */
IPQC.post('/GetSpecificeJobCard',GetSpecificJobCard)


/**Router To Update Status Of Job Card  */
IPQC.post('/UpdateJobCardStatus',UpdateJobCardStatus)

module.exports = {IPQC}