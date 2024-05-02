const express = require('express');
const {AddIPQCJobCard,JobCardList,UploadPdf,GetSpecificJobCard,UpdateJobCardStatus} = require('../Controller/IPQCJobCard');
const {AddBomVerification,BOMUploadPdf,GetSpecificBOMVerification, UpdateStatusBOM} = require('../Controller/BOMVerification');
const {AddPreLam,PreLamUploadPdf,GetSpecificPreLam,UpdatePreLamStatus} = require('../Controller/PreLamController');
const {AddFraming,UploadFramingPdf,GetSpecificFraming,UpdateFramingStatus,GetPdf} = require("../Controller/FramingController");
const {AddSealentWeight,UploadSealentWeightPdf,GetSpecificSealentWeight,UpdateSealentStatus} = require('../Controller/SealentWeightController')
const {AddSolderingPeelTest,UploadSolderingPeelTestPdf,GetSpecificSolderingPeelTest,UpdateSolderingPeelTestStatus} = require('../Controller/SolderingPeelTest')
const {AddLaminator,GetSpecificLaminator} = require('../Controller/LaminatorController')
const {RoleAuthentication,upload} = require('../Middleware/IPQC.Middleware');
const IPQC = express.Router();







/** Router to Upload Reference Pdf in S3 and Get The Location and Set into dbs */
IPQC.post('/UploadPdf',upload.single('Reference'),UploadPdf);

/** Router to Upload Reference Pdf in S3 and Get The Location and Set into dbs(BOM Verification Table) */
IPQC.post('/BOMUploadPdf',upload.single('ReferencePdf'),BOMUploadPdf);

/** Router to Upload Reference Pdf in S3 and Get The Location and Set into dbs(PreLamDetail Table) */
IPQC.post('/UploadPreLamPdf',upload.single('PreLamPdf'),PreLamUploadPdf);

/** Router to Upload Reference Pdf in S3 and Get The Location and Set into dbs(PreLamDetail Table) */
IPQC.post('/UploadFramingPdf',upload.single('FramingPdf'),UploadFramingPdf);

/** Router to Upload Reference Pdf in S3 and Get The Location and Set into dbs(PreLamDetail Table) */
IPQC.post('/UploadSealentWeightPdf',upload.single('SealentWeightPdf'),UploadSealentWeightPdf);

/** Router to Upload Reference Pdf in S3 and Get The Location and Set into dbs(PreLamDetail Table) */
IPQC.post('/UploadSolderingPeelTestPdf',upload.single('SolderingPdf'),UploadSolderingPeelTestPdf);

/** Route To Add Job Card */
IPQC.post('/AddJobCard',AddIPQCJobCard);

/**Router To Add BOM Verification Data*/
IPQC.post('/AddBOMVerification',AddBomVerification);

/**Router To Add PreLam Data **/
IPQC.post("/AddPreLam",AddPreLam);

/** Router To Add Framing Detail */
IPQC.post('/AddFraming',AddFraming);

/**Router To Add Sealent Weight */
IPQC.post('/AddSealentWeight',AddSealentWeight);

/**Router To Add Soldering Peel Test */
IPQC.post('/AddSolderingPeelTest',AddSolderingPeelTest);

/** Route To Add Laminator Data */
IPQC.post('/AddLaminator',AddLaminator);


/**Router to Get Pdf */
IPQC.get('/Pdf/:filename',GetPdf);

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

/**Router to Get Specific Framing  */
IPQC.post('/GetSpecificFraming',GetSpecificFraming);

/**Router to Get Specific Sealent  */
IPQC.post('/GetSpecificSealentWeight',GetSpecificSealentWeight);

/**Router to Get Specific Soldering Peel Test */
IPQC.post('/GetSpecificSolderingPeelTest',GetSpecificSolderingPeelTest);

/**Router to Get Specific Laminator */
IPQC.post('/GetSpecificLaminator',GetSpecificLaminator);



/**Router To Update Status Of Job Card  */
IPQC.post('/UpdateJobCardStatus',UpdateJobCardStatus);

/**Router to Update Status of BOM Verification */
IPQC.post('/UpdateBOMStatus',UpdateStatusBOM);

/**Router to Update Status of Pre Lam  */
IPQC.post('/UpdatePreLamStatus',UpdatePreLamStatus);

/**Router to Update Status of Framing  */
IPQC.post('/UpdateFramingStatus',UpdateFramingStatus);

/**Router to Update Status of Sealent  */
IPQC.post('/UpdateSealentStatus',UpdateSealentStatus);

/**Router to Update Status of Soldering Peel Test  */
IPQC.post('/UpdateSolderingPeelTestStatus',UpdateSolderingPeelTestStatus);

module.exports = {IPQC}  
