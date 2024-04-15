const express = require('express');
const {AddIPQCJobCard,JobCardList,UploadPdf,GetSpecificJobCard,UpdateJobCardStatus} = require('../Controller/IPQCJobCard');
const {AddBomVerification,BOMUploadPdf,GetSpecificBOMVerification, UpdateStatusBOM} = require('../Controller/BOMVerification');
const {AddPreLam,PreLamUploadPdf,GetSpecificPreLam,UpdatePreLamStatus} = require('../Controller/PreLamController');

const {RoleAuthentication,upload} = require('../Middleware/IPQC.Middleware');
const IPQC = express.Router();





/** Route To Add Job Card */
IPQC.post('/AddJobCard',AddIPQCJobCard);

/** Router to Upload Reference Pdf in S3 and Get The Location and Set into dbs */
IPQC.post('/UploadPdf',upload.single('Reference'),UploadPdf);

/** Router to Upload Reference Pdf in S3 and Get The Location and Set into dbs(BOM Verification Table) */
IPQC.post('/BOMUploadPdf',upload.single('ReferencePdf'),BOMUploadPdf);

/** Router to Upload Reference Pdf in S3 and Get The Location and Set into dbs(PreLamDetail Table) */
IPQC.post('/UploadPreLamPdf',upload.single('PreLamPdf'),PreLamUploadPdf);

/**Router To Add BOM Verification Data*/
IPQC.post('/AddBOMVerification',AddBomVerification);



/** Router To Add Framing Detail */
IPQC.post('/AddFraming',AddFraming);

/** Middleware to check Role Authentication */
IPQC.use(RoleAuthentication);

/**Router To Get List Of Job Card Data */
IPQC.post('/GetJobCardList',JobCardList);


/** Router to Get Specific Job Card */
IPQC.post('/GetSpecificeJobCard',GetSpecificJobCard);

/** Get Specific Bom Verification */
IPQC.post('/GetSpecificBOMVerification',GetSpecificBOMVerification);

/**Router to Get Specific PreLam */
IPQC.post('/GetSpecificPreLam',GetSpecificPreLam);

/**Router To Update Status Of Job Card  */
IPQC.post('/UpdateJobCardStatus',UpdateJobCardStatus);

/**Router to Update Status of BOM Verification */
IPQC.post('/UpdateBOMStatus',UpdateStatusBOM);

/**Router to Update Status of Pre Lam  */
IPQC.post('/UpdatePreLamStatus',UpdatePreLamStatus);

module.exports = {IPQC}  
