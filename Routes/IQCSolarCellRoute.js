const express = require('express');
const IQCSolarCellRoute = express.Router()
const {AddIQCSolarCell, GetIQCSolarCellTests,GetSpecificSolarCellTest,UpdateStatus,UploadPdf,GetPdf} = require('../Controller/IQCSolarCell');
const {AddFQC,GetFQCList,GetSpecificFQC,FQCUpdateStatus,UploadFQCPdf} = require('../Controller/IQCFQC.Controller')
const {RoleAuthentication,upload} = require('../Middleware/IQCSolarCell.Middleware')
const {FQCUpload} = require('../Middleware/FQC.Middleware')

/** to add IQC Solar Cell  */
IQCSolarCellRoute.post('/AddIQCSolarCell',AddIQCSolarCell)

/**to Upload PDF */
IQCSolarCellRoute.post('/UploadPdf',upload,UploadPdf)

/** to Get Upload Pdf */
IQCSolarCellRoute.get('/Pdf/:filename',GetPdf)

/**to Upload PDF */
IQCSolarCellRoute.post('/UploadFQCPdf',FQCUpload.single('FQCPdf'),UploadFQCPdf)

/**to Add FQC Data in FQCDetails Table And FQCTest Table */
IQCSolarCellRoute.post('/AddFQC',AddFQC);

/** Middleware To Role Authentication  */
IQCSolarCellRoute.use(RoleAuthentication)

/** to Get All tests with checked Person*/
IQCSolarCellRoute.post('/GetIQCTests',GetIQCSolarCellTests)

/** to Get Specific Test */
IQCSolarCellRoute.post('/GetSpecificTest',GetSpecificSolarCellTest)

/** to Update Status of Solar Cell Details Table and Creating new Column in ApprovalStatus table*/
IQCSolarCellRoute.post('/UpdateStatus',UpdateStatus)

/**to Get FQC Card List */
IQCSolarCellRoute.post('/FQCList',GetFQCList)

/**to Get Specific FQC Detail */
IQCSolarCellRoute.post('/GetSpecificFQC',GetSpecificFQC)

/**To Update Status of Aprrove in FQC Table */
IQCSolarCellRoute.post('/FQCUpdateStatus',FQCUpdateStatus)

/** Exporting Routes */
module.exports = {IQCSolarCellRoute}
