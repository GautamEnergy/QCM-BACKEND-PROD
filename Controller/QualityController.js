const { v4: uuidv4, v4 } = require('uuid');
const { dbConn } = require('../db.config/db.config')
const util = require('util');
const fs = require('fs');
const Path = require('path');
const { getCurrentDateTime, s3, ExcelGenerate } = require('../Utilis/IQCSolarCellUtilis');
const { QualityExcelGenerate } = require('../Utilis/QualityUtilis')
require('dotenv').config()
const PORT = process.env.PORT || 8080

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
  const { qualityid, currentuser, shiftinchargename, shift,
    shiftinchargepostlime, shiftinchargeprelime,
    issuetype, otherissuetype,
    modelnumber, othermodelnumber, reasonofissue, responsibleperson,
    stage, wattage, productBarcode, issuecomefrom, actiontaken, status } = req.body;

  let UUID = v4();
  //let IsPresent = await IsPresentSameIssue(qualityid, productBarcode, otherissuetype, issuetype);
  //console.log(IsPresent);
  /**Checking Duplicate Product Barcode */

  let temp = productBarcode ? await queryAsync(`SELECT ProductBarCode FROM Quality WHERE ProductBarCode = '${productBarcode}' AND Status != 'Inprogress'`) : [];

  if(temp.length){
   return res.status(409).send({ msg: 'This Product Barcode is already recorded' })
  };

  if (!qualityid) {

      try {


        const query = `INSERT INTO Quality(QualityId,Shift,ShiftInChargeName,ShiftInChargePreLime,ShiftInChargePostLim,ProductBarCode,Wattage,ModelNumber,OtherModelNumber,IssueType,OtherIssueType,Stage,ResposiblePerson,ReasonOfIssue,IssueComeFrom,ActionTaken,CreatedBy,CreatedOn,Status)
              VALUES('${UUID}','${shift}','${shiftinchargename}','${shiftinchargeprelime}','${shiftinchargepostlime}','${productBarcode}','${wattage}','${modelnumber}','${othermodelnumber}','${issuetype}','${otherissuetype}','${stage}','${responsibleperson}','${reasonofissue}','${issuecomefrom}','${actiontaken}','${currentuser}','${getCurrentDateTime()}','${status}');`;

        await queryAsync(query);
       return res.send({ msg: "data inserted Succesfully", UUID });

      } catch (err) {

        console.log(err);
       return res.send({ err });
      }
    
  } else {
    
      try {

        const query = `
      UPDATE Quality
      SET 
          Shift = '${shift}',
          ShiftInChargeName = '${shiftinchargename}',
          ShiftInChargePreLime = '${shiftinchargeprelime}',
          ShiftInChargePostLim = '${shiftinchargepostlime}',
          ProductBarCode = '${productBarcode}',
          Wattage = '${wattage}',
          ModelNumber = '${modelnumber}',
          OtherModelNumber = '${othermodelnumber}',
          IssueType = '${issuetype}',
          OtherIssueType = '${otherissuetype}',
          Stage = '${stage}',
          ResposiblePerson = '${responsibleperson}',
          ReasonOfIssue = '${reasonofissue}',
          IssueComeFrom = '${issuecomefrom}',
          ActionTaken = '${actiontaken}',
          CreatedBy = '${currentuser}',
          CreatedOn = '${getCurrentDateTime()}',
          Status = '${status}'
      WHERE QualityId = '${qualityid}';
  `;


        await queryAsync(query);
      return  res.send({ msg: "data inserted Succesfully", UUID: qualityid });
      } catch (err) {
        
        console.log(err);
       return res.send({ err });
      }
   
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
  const { QualityId, Status, PersonID, Designation } = req.body;
  console.log(req.body);
  let query;
  try {

    query = !QualityId ?
      Designation == 'Super Admin' ?
        `SELECT Q.QualityId,Q.Shift,Q.ShiftInChargeName,Q.ShiftInChargePreLime,Q.ShiftInChargePostLim,Q.ProductBarCode,Q.CreatedOn,P.Name AS CreatedBy,Q.Wattage, Q.Stage, Q.ResposiblePerson,Q.ReasonOfIssue,Q.IssueComeFrom,Q.ActionTaken,Q.OtherIssueType,Q.ModulePicture,Q.ModelNumber,Q.IssueType, Q.OtherModelNumber,Q.Status FROM Quality Q
    JOIN Person P ON P.PersonID = Q.CreatedBy
    WHERE Q.Status = '${Status}' ORDER BY STR_TO_DATE(Q.CreatedOn, '%d-%m-%Y %H:%i:%s') DESC;` :

        `SELECT Q.QualityId,Q.Shift,Q.ShiftInChargeName,Q.ShiftInChargePreLime,Q.ShiftInChargePostLim,Q.ProductBarCode,Q.CreatedOn,P.Name AS CreatedBy,Q.Wattage, Q.Stage, Q.ResposiblePerson,Q.ReasonOfIssue,Q.IssueComeFrom,Q.ActionTaken,Q.OtherIssueType,Q.ModulePicture,Q.ModelNumber,Q.IssueType, Q.OtherModelNumber,Q.Status FROM Quality Q
    JOIN Person P ON P.PersonID = Q.CreatedBy
    WHERE Q.Status = '${Status}' AND Q.CreatedBy = '${PersonID}'
    ORDER BY STR_TO_DATE(Q.CreatedOn, '%d-%m-%Y %H:%i:%s') DESC;`:

      `SELECT Q.QualityId,Q.Shift,Q.ShiftInChargeName,Q.ShiftInChargePreLime,Q.ShiftInChargePostLim,Q.ProductBarCode,Q.CreatedOn,P.Name AS CreatedBy,Q.Wattage, Q.Stage, Q.ResposiblePerson,Q.ReasonOfIssue,Q.IssueComeFrom,Q.ActionTaken,Q.OtherIssueType,Q.ModulePicture, Q.OtherModelNumber, Q.IssueType, Q.ModelNumber, Q.Status FROM Quality Q
    JOIN Person P ON P.PersonID = Q.CreatedBy WHERE QualityId = '${QualityId}';`;

    let ModelQuery = `SELECT ModelName, ModelId FROM ModelTypes;`
    let IssueQuery = `SELECT Issue, IssueId FROM IssuesType;`
    let ModelNames = await queryAsync(ModelQuery);
    let IssueNames = await queryAsync(IssueQuery);

    /** To Find name Function  */
    const findName = (Type, Id) => {
     if (Type === 'Model') {
       const model = ModelNames.find(data => data['ModelId'] === Id);
       if (model) {
         return model['ModelName'];
       }
     } else {
       const issue = IssueNames.find(data => data['IssueId'] === Id);
       if (issue) {
         return issue['Issue'];
       }
     }
     return undefined; // If no match is found, return undefined
   };
   
 
    let data = await queryAsync(query);

    if (!QualityId) {
      for (const Quality of data) {
        if (Quality['ModelNumber']) {
         Quality['ModelName'] = findName('Model',Quality['ModelNumber']);
  
        } else {
         Quality['ModelName'] = '';
  
        }
  
        if (Quality['IssueType']) {
         Quality['Issue'] = findName('Issue',Quality['IssueType']);
  
        } else {
         Quality['Issue'] = '';
  
        }
        delete data['ModelNumber'];
        delete data['IssueType'];
      };
    }
    //console.log(data)
    if (!QualityId) {

      data.forEach((el) => {
        if (el['Issue'] == 'Other') {
          el['Issue'] = el['OtherIssueType']

        }

        if (el['ModelName'] == 'Other') {
          el['ModelName'] = el['OtherModelNumber']

        }

        delete el['OtherIssueType'];
        delete el['OtherModelNumber'];
        el['CreatedOn'] = el['CreatedOn'].split(' ')[0];
      })

    }

    res.send({ data })
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

// async function IsPresentSameIssue(qualityid, ProductBarCode, otherissuetype, issuetype) {
//   // Define ModelNameQuery and IssueNameQuery to get ModelName and IssueName

//   try {

//     let IssueNameQuery = `SELECT Issue FROM IssuesType WHERE IssueId = '${issuetype}'`;
//     let IssueNameData = await queryAsync(IssueNameQuery);
//     let IssueName = IssueNameData.length ? IssueNameData[0]['Issue'] : '';

//     // Define the QualityQuery to get Quality data
//     let QualityQuery = qualityid ?
//       /** if Quality id is Defined */
//       IssueName == 'Other' ? `SELECT Q.OtherIssueType, Q.ProductBarCode, I.Issue FROM Quality Q
//    JOIN IssuesType I ON I.IssueId = Q.IssueType
//    WHERE Q.QualityId != '${qualityid}' AND Q.Status != 'Inprogress';` :

//         `SELECT Q.OtherIssueType, Q.ProductBarCode, I.Issue FROM Quality Q
//    JOIN IssuesType I ON I.IssueId = Q.IssueType
//    WHERE Q.QualityId != '${qualityid}' AND Q.Status != 'Inprogress';` :

//       /** if Qualityid is not Defined */
//       IssueName == 'Other' ? `SELECT Q.OtherIssueType, Q.ProductBarCode, I.Issue FROM Quality Q
//   JOIN IssuesType I ON I.IssueId = Q.IssueType
//   WHERE Q.Status != 'Inprogress'; ` :

//         `SELECT Q.OtherIssueType, Q.ProductBarCode, I.Issue FROM Quality Q
//    JOIN IssuesType I ON I.IssueId = Q.IssueType
//    WHERE Q.Status != 'Inprogress';`


//     console.log(IssueName);
//     let Quality = await queryAsync(QualityQuery);
//     console.log(Quality);

//     if (IssueName == 'Other') {
//       // Iterate over Quality entries using for...of loop
//       for (const element of Quality) {

//         // Check the conditions for the provided issue name
//         if (IssueName === 'Other' && otherissuetype.toUpperCase() === element['OtherIssueType'].toUpperCase()) {
//           return true;
//         }

//       }
//     } else if (Quality.length) {
//       return true;

//     }


//     // Return false if no match was found in Quality data
//     return false;
//   } catch (err) {
//     throw err
//   }
// };

const GetQualityExcel = async (req, res) => {
  const { FromDate, ToDate, CurrentUser, Status } = req.body;
  const UUID = v4()
  try {
    let query = `SELECT Q.CreatedOn, Q.QualityId, Q.Shift, Q.ShiftInChargeName, Q.ShiftInChargePreLime, Q.ShiftInChargePostLim, Q.ProductBarCode, P.Name AS CreatedBy, Q.Wattage, Q.Stage, Q.ResposiblePerson, Q.ReasonOfIssue, Q.IssueComeFrom, Q.ActionTaken, Q.OtherIssueType, Q.ModulePicture,Q.Status, Q.OtherModelNumber,Q.IssueType,Q.ModelNumber
    FROM Quality Q
    JOIN Person P ON P.PersonID = Q.CreatedBy
    WHERE Q.Status = '${Status}' AND STR_TO_DATE(Q.CreatedOn, '%d-%m-%Y %H:%i:%s') BETWEEN STR_TO_DATE('${FromDate} 00:00:00', '%d-%m-%Y %H:%i:%s') AND STR_TO_DATE('${ToDate} 23:59:59', '%d-%m-%Y %H:%i:%s')
    ORDER BY STR_TO_DATE(Q.CreatedOn, '%d-%m-%Y %H:%i:%s') DESC;`;

  //  let query = `SELECT Q.CreatedOn, Q.QualityId, Q.Shift, Q.ShiftInChargeName, Q.ShiftInChargePreLime, Q.ShiftInChargePostLim, Q.ProductBarCode, P.Name AS CreatedBy, Q.Wattage, Q.Stage, Q.ResposiblePerson, Q.ReasonOfIssue, Q.IssueComeFrom, Q.ActionTaken, Q.OtherIssueType, Q.ModulePicture, Q.OtherModelNumber, I.Issue, M.ModelName
  //  FROM Quality Q
  //  JOIN IssuesType I ON I.IssueId = Q.IssueType
  //  JOIN Person P ON P.PersonID = Q.CreatedBy
  //  JOIN ModelTypes M ON M.ModelId = Q.ModelNumber
  //  WHERE Q.Status = '${Status}' AND STR_TO_DATE(Q.CreatedOn, '%d-%m-%Y %H:%i:%s') BETWEEN STR_TO_DATE('${FromDate} 00:00:00', '%d-%m-%Y %H:%i:%s') AND STR_TO_DATE('${ToDate} 23:59:59', '%d-%m-%Y %H:%i:%s')
  //  ORDER BY STR_TO_DATE(Q.CreatedOn, '%d-%m-%Y %H:%i:%s') DESC;`

    const Quality = await queryAsync(query);
   let ModelQuery = `SELECT ModelName, ModelId FROM ModelTypes;`
   let IssueQuery = `SELECT Issue, IssueId FROM IssuesType;`
   let ModelNames = await queryAsync(ModelQuery);
   let IssueNames = await queryAsync(IssueQuery);
   /** To Find name Function  */
   const findName = (Type, Id) => {
    if (Type === 'Model') {
      const model = ModelNames.find(data => data['ModelId'] === Id);
      if (model) {
        return model['ModelName'];
      }
    } else {
      const issue = IssueNames.find(data => data['IssueId'] === Id);
      if (issue) {
        return issue['Issue'];
      }
    }
    return undefined; // If no match is found, return undefined
  };
  
    for (const data of Quality) {
      if (data['ModelNumber']) {
        data['ModelName'] = findName('Model',data['ModelNumber']);

      } else {
        data['ModelName'] = '';

      }

      if (data['IssueType']) {
        data['Issue'] = findName('Issue',data['IssueType']);

      } else {
        data['Issue'] = '';

      }
      delete data['ModelNumber'];
      delete data['IssueType'];
    }

    Quality.forEach((el) => {
      if (el['Issue'] == 'Other') {
        el['Issue'] = el['OtherIssueType']

      }

      if (el['ModelName'] == 'Other') {
        el['ModelName'] = el['OtherModelNumber']

      }
      delete el['OtherIssueType'];
      delete el['OtherModelNumber'];
      el['CreatedOn'] = el['CreatedOn'].split(' ')[0];
    })

    let QualityExcelBytes = await QualityExcelGenerate(Quality, FromDate, ToDate, Status);

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
    res.send({ URL: `http://srv515471.hstgr.cloud:${PORT}/Quality/File/${fileName}` })
  } catch (err) {
    console.log(err)
    res.status(400).send({ err });
  }
}

module.exports = { IssueTypes, GetModelListing, AddQuality, UploadModuleImage, GetModuleImage, QualityListing, GetQualityExcel }
