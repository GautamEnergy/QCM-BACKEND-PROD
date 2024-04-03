const express = require('express');
const IQCSolarCellRoute = express.Router()
const {AddIQCSolarCell, GetIQCSolarCellTests,GetSpecificSolarCellTest,UpdateStatus,UploadPdf} = require('../Controller/IQCSolarCell')
const {RoleAuthentication,upload} = require('../Middleware/IQCSolarCell.Middleware')


/** to add IQC Solar Cell  */
IQCSolarCellRoute.post('/AddIQCSolarCell',AddIQCSolarCell)

/**to Upload PDF */
IQCSolarCellRoute.post('/UploadPdf',upload,UploadPdf)


/** Middleware To Role Authentication  */
IQCSolarCellRoute.use(RoleAuthentication)

/** to Get All tests with checked Person*/
IQCSolarCellRoute.post('/GetIQCTests',GetIQCSolarCellTests)

/** to Get Specific Test */
IQCSolarCellRoute.post('/GetSpecificTest',GetSpecificSolarCellTest)

/** to Update Status of Solar Cell Details Table and Creating new Column in ApprovalStatus table*/
IQCSolarCellRoute.post('/UpdateStatus',UpdateStatus)



/** Exporting Routes */
module.exports = {IQCSolarCellRoute}