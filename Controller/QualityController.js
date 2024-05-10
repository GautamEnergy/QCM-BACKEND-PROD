const { v4: uuidv4, v4 } = require('uuid');
const { dbConn } = require('../db.config/db.config')
const util = require('util');
const fs = require('fs');
const Path = require('path');
const { getCurrentDateTime, s3, ExcelGenerate } = require('../Utilis/IQCSolarCellUtilis');
const {QualityExcelGenerate} = require('../Utilis/QualityUtilis')
require('dotenv').config()
const PORT = process.env.PORT || 9090

/** Making Sync To Query to Loop */
const queryAsync = util.promisify(dbConn.query).bind(dbConn);



/**Get Listing of Issues Type */

const IssueTypes = async (req, res) => {
  try {
    let query = `SELECT IssueId, Issue FROM IssuesType 
    WHERE IssueId <> '9f00c67d-0b99-11ef-8005-52549f6cc694' 
    ORDER BY Issue ASC;`

    let Issues = await queryAsync(query);
    console.log(Issues);
    res.send({ Issues });
  } catch (err) {
    console.log(err);
    res.send({ err })
  }
}

/**Get Listing of Issues Type */

const GetModelListing = async (req, res) => {
  try {
    let query = `SELECT ModelId, ModelName
    FROM ModelTypes
    WHERE ModelId <> '8634275c-0b99-11ef-8005-52549f6cc694'
    ORDER BY ModelName ASC;
    `

    let Models = await queryAsync(query);
    console.log(Models);
    res.send({ Models });
  } catch (err) {
    console.log(err);
    res.send({ err })
  }
}
let a = {
  "currentuser": "personid",
  "shift": "shift",
  "shiftinchargename": "shiftinchargename",
  "shiftinchargeprelime": "shiftinchargeprelime",
  "shiftinchargepostlime": "shiftinchargepostlime",
  "productBarcode": "productBarcode",
  "wattage": "wattage",
  "modelnumber": "modelnumber",
  "othermodelnumber": "othermodelnumber",
  "issuetype": "issuetype",
  "otherissuetype": "otherissuetype",
  "stage": "stage",
  "responsibleperson": "responsibleperson",
  "reasonofissue": "reasonofissue",
  "issuecomefrom": "issuecomefrom",
  "actiontaken": "actiontaken",
}
const AddQuality = async (req, res) => {
  const { currentuser, shiftinchargename, shift,
    shiftinchargepostlime, shiftinchargeprelime,
    issuetype, otherissuetype,
    modelnumber, othermodelnumber, reasonofissue, responsibleperson,
    stage, wattage, productBarcode, issuecomefrom, actiontaken } = req.body;

  let UUID = v4();
  let IsPresent = await IsPresentSameIssue(modelnumber, othermodelnumber, otherissuetype, issuetype);
  console.log(IsPresent)
  if (!IsPresent) {
    try {


      const query = `INSERT INTO Quality(QualityId,Shift,ShiftInChargeName,ShiftInChargePreLime,ShiftInChargePostLim,ProductBarCode,Wattage,ModelNumber,OtherModelNumber,IssueType,OtherIssueType,Stage,ResposiblePerson,ReasonOfIssue,IssueComeFrom,ActionTaken,CreatedBy,CreatedOn)
              VALUES('${UUID}','${shift}','${shiftinchargename}','${shiftinchargeprelime}','${shiftinchargepostlime}','${productBarcode}','${wattage}','${modelnumber}','${othermodelnumber}','${issuetype}','${otherissuetype}','${stage}','${responsibleperson}','${reasonofissue}','${issuecomefrom}','${actiontaken}','${currentuser}','${getCurrentDateTime()}');`;

      await queryAsync(query);
      res.send({ msg: "data inserted Succesfully", UUID });
    } catch (err) {
      console.log(err);
      res.send({ err });
    }
  } else {
    res.status(400).send({ msg: 'This Issue Already exists in this Model Number' });
  }
}

const UploadModuleImage = async (req, res) => {
  const { QualityId } = req.body;
  try {
    if (req.file.size) {
      /** making file in IPQC-Pdf-Folder*/
      try {
        // Get the file buffer and the file format
        const fileBuffer = req.file.buffer;

        // Define the folder path
        const folderPath = Path.join('Quality-Upload');

        // Create the folder if it doesn't exist
        if (!fs.existsSync(folderPath)) {

          fs.mkdirSync(folderPath, { recursive: true });
        }

        // Define the file path, including the desired file name and format
        const fileName = `${QualityId}${req.file.originalname}`;
        const filePath = Path.join(folderPath, fileName);

        // Save the file buffer to the specified file path
        fs.writeFileSync(filePath, fileBuffer);
        const query = `UPDATE Quality
         SET ModulePicture = 'http://srv515471.hstgr.cloud:${PORT}/Quality/File/${fileName}'
         WHERE QualityId = '${QualityId}';`;
        const update = await queryAsync(query);

        // Send success response with the file URL
        res.send({ msg: 'Data inserted successfully!', URL: `http://srv515471.hstgr.cloud:${PORT}/Quality/File/${fileName}` });
      } catch (err) {
        console.log(err);
        res.status(401).send(err);
      }
    }
  } catch (err) {
    res.send({ status: false, 'err': 'file is empty' })
  }
}

const QualityListing = async (req, res) => {

  try {
    let query = `SELECT Q.QualityId,Q.Shift,Q.ShiftInChargeName,Q.ShiftInChargePreLime,Q.ShiftInChargePostLim,Q.ProductBarCode,Q.CreatedOn,P.Name AS CreatedBy,Q.Wattage, Q.Stage, Q.ResposiblePerson,Q.ReasonOfIssue,Q.IssueComeFrom,Q.ActionTaken,Q.OtherIssueType,Q.ModulePicture, Q.OtherModelNumber, I.Issue, M.ModelName FROM Quality Q
    JOIN IssuesType I ON I.IssueId = Q.IssueType
    JOIN Person P ON P.PersonID = Q.CreatedBy
    JOIN ModelTypes M ON M.ModelId = Q.ModelNumber ORDER BY STR_TO_DATE(Q.CreatedOn, '%d-%m-%Y %H:%i:%s') DESC;`
    let data = await queryAsync(query);

     data.forEach((el)=>{
      if(el['Issue'] == 'Other'){
        el['Issue'] = el['OtherIssueType']
      
      }

      if(el['ModelName'] == 'Other'){
        el['ModelName'] = el['OtherModelNumber']
        
      }
      delete el['OtherIssueType'];
      delete el['OtherModelNumber'];
      el['CreatedOn'] = el['CreatedOn'].split(' ')[0];
     })
     
    
    res.send({ data})
  } catch (err) {
    console.log(err);
    res.send({ err })
  }
}

const GetModuleImage = async (req, res) => {
  const filename = req.params.filename;
  // Define the absolute path to the IPQC-Pdf-Folder directory
  const pdfFolderPath = Path.resolve('Quality-Upload');

  // Construct the full file path to the requested file
  const filePath = Path.join(pdfFolderPath, filename);

  // Send the file to the client
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.send(`  <h1 style="text-align: center; font: 1em sans-serif; font-size: 50px; font-weight: 500;">
          404:Not Found
      </h1>`)
    }
  });
}


/** Function To Check Same Issue Present in That one Model Number */

async function IsPresentSameIssue(modelnumber, othermodelnumber, otherissuetype, issuetype) {
  // Define ModelNameQuery and IssueNameQuery to get ModelName and IssueName
  try{
  let ModelNameQuery = `SELECT ModelName FROM ModelTypes WHERE ModelId = '${modelnumber}'`;
  let ModelNameData = await queryAsync(ModelNameQuery);
  let ModelName = ModelNameData[0]['ModelName'];

  let IssueNameQuery = `SELECT Issue FROM IssuesType WHERE IssueId = '${issuetype}'`;
  let IssueNameData = await queryAsync(IssueNameQuery);
  let IssueName = IssueNameData[0]['Issue'];

  // Define the QualityQuery to get Quality data
  let QualityQuery = `SELECT Q.OtherIssueType, Q.OtherModelNumber, I.Issue, M.ModelName FROM Quality Q
                      JOIN IssuesType I ON I.IssueId = Q.IssueType
                      JOIN ModelTypes M ON M.ModelId = Q.ModelNumber
                      WHERE Q.ModelNumber = '${modelnumber}';`;

  console.log(IssueName, ModelName);
  let Quality = await queryAsync(QualityQuery);
  console.log(Quality);

  // Iterate over Quality entries using for...of loop
  for (const element of Quality) {
      // Check if the model is 'Other'
      if (ModelName === 'Other') {
          // Check the conditions for 'Other' model number and issue type
          if (element['OtherModelNumber'] === othermodelnumber &&
              IssueName === 'Other' &&
              otherissuetype.toUpperCase() === element['OtherIssueType'].toUpperCase()) {
              return true;
          }

          if (element['OtherModelNumber'] === othermodelnumber && IssueName!== 'Other' &&
              IssueName === element['Issue']) {
              return true;
          }
      } else {
          // Check the conditions for the provided issue name
          if (IssueName === 'Other' && otherissuetype.toUpperCase() === element['OtherIssueType'].toUpperCase()) {
              return true;
          }
          if (IssueName!=='Other' && IssueName === element['Issue']) {
            
              return true;
          }
      }
  }

  // Return false if no match was found in Quality data
  return false;
}catch(err){
  throw err
}
};

const GetQualityExcel = async(req,res)=>{
  const { FromDate, ToDate, CurrentUser} = req.body;
  const UUID = v4()
  try{
   let query = `SELECT Q.CreatedOn, Q.QualityId, Q.Shift, Q.ShiftInChargeName, Q.ShiftInChargePreLime, Q.ShiftInChargePostLim, Q.ProductBarCode, P.Name AS CreatedBy, Q.Wattage, Q.Stage, Q.ResposiblePerson, Q.ReasonOfIssue, Q.IssueComeFrom, Q.ActionTaken, Q.OtherIssueType, Q.ModulePicture, Q.OtherModelNumber, I.Issue, M.ModelName
   FROM Quality Q
   JOIN IssuesType I ON I.IssueId = Q.IssueType
   JOIN Person P ON P.PersonID = Q.CreatedBy
   JOIN ModelTypes M ON M.ModelId = Q.ModelNumber
   WHERE STR_TO_DATE(Q.CreatedOn, '%d-%m-%Y %H:%i:%s') >= STR_TO_DATE('${FromDate}', '%d-%m-%Y')
   AND STR_TO_DATE(Q.CreatedOn, '%d-%m-%Y %H:%i:%s') < STR_TO_DATE('${ToDate}', '%d-%m-%Y') + INTERVAL 1 DAY
   ORDER BY STR_TO_DATE(Q.CreatedOn, '%d-%m-%Y %H:%i:%s') DESC;`;

   const Quality = await queryAsync(query);

   Quality.forEach((el)=>{
    if(el['Issue'] == 'Other'){
      el['Issue'] = el['OtherIssueType']
    
    }

    if(el['ModelName'] == 'Other'){
      el['ModelName'] = el['OtherModelNumber']
      
    }
    delete el['OtherIssueType'];
    delete el['OtherModelNumber'];
    el['CreatedOn'] = el['CreatedOn'].split(' ')[0];
   })

   let QualityExcelBytes = await QualityExcelGenerate(Quality,FromDate,ToDate);

   // Define the folder path
   const folderPath = Path.join('Quality-Upload');

   // Create the folder if it doesn't exist
   if (!fs.existsSync(folderPath)) {

     fs.mkdirSync(folderPath, { recursive: true });
   }

   // Define the file path, including the desired file name and format
   const fileName = `${UUID}.xlsx`;
   const filePath = Path.join(folderPath, fileName);
   
    // Save the file buffer to the specified file path
    fs.writeFileSync(filePath, QualityExcelBytes);

  query = `INSERT INTO QualityReportExcel(ExcelId,FromDate,ToDate,ExcelURL,CreatedBy,CreatedOn)
                                    VALUES('${UUID}','${FromDate}','${ToDate}','http://srv515471.hstgr.cloud:${PORT}/Quality/File/${fileName}','${CurrentUser}','${getCurrentDateTime()}');`
    await queryAsync(query);
  res.send({URL:`http://srv515471.hstgr.cloud:${PORT}/Quality/File/${fileName}`})
  }catch(err){
   console.log(err)
   res.send({err});
  }
}

module.exports = { IssueTypes, GetModelListing, AddQuality, UploadModuleImage, GetModuleImage, QualityListing, GetQualityExcel }
