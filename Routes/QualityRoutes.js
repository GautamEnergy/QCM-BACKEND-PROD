const express = require('express');
const QualityRoute = express.Router();
const {IssueTypes:GetIssueTypes,GetModelListing,AddQuality,UploadModuleImage, GetModuleImage, QualityListing,GetQualityExcel} = require('../Controller/QualityController')
const {upload} = require('../Middleware/IPQC.Middleware')



/** Router To Get Listing of Isssues */
QualityRoute.get('/GetIssues',GetIssueTypes);

/** Router To Get Listing of Model */
QualityRoute.get('/GetModels',GetModelListing);

/**Router To Add Quality */
QualityRoute.post('/AddQuality',AddQuality);

/**Router To Upload Module Image  */
QualityRoute.post('/UploadModuleImage',upload.single('ModuleImage'),UploadModuleImage);

/**Router to Get Uploaded Module Image */
QualityRoute.get('/File/:filename',GetModuleImage);

/**Router to Get Listing of Quality  */
QualityRoute.get('/QualityList',QualityListing);

/**Router to Get Quality Excel Report */
QualityRoute.post('/GetQualityReportExcel',GetQualityExcel);

module.exports = {QualityRoute}
