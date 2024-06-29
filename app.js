const express = require('express')
const { dbConn } = require('./db.config/db.config')
const { PersonRouter } = require('./Routes/Person.Route')
const { designationRouter } = require('./Routes/DesignationRoute')
const { IQCSolarCellRoute } = require('./Routes/IQCSolarCellRoute')
const { QualityRoute } = require('./Routes/QualityRoutes');
const {getCurrentDateTime} = require('./Utilis/IQCSolarCellUtilis')
const {MaintenanceRouter} = require('./Routes/MaintenanceRoutes')
const Path = require('path');
const { v4: uuidv4, v4 } = require('uuid');
const nodemailer = require('nodemailer')
const {QualityExcelGenerate} = require('./Utilis/QualityUtilis')
const cron = require('node-cron');
const util = require('util');
const chalk =  import('chalk');
const fs = require('fs');
const { IPQC } = require('./Routes/IPQCRoute')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 9090
require('dotenv').config()
app.use(express.json())
app.use(cors())

/** Making Sync To Query to Loop */
const queryAsync = util.promisify(dbConn.query).bind(dbConn);

/** Nodemailer Configuration */
var transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'qualityreport.gautamsolar@gmail.com',
    pass: 'dypg tdqb wxah xafe'
  }
});

/**Endpoints */

/** to Employee */
app.use('/Employee',PersonRouter)

/** to Department and Designation */
app.use('/QCM',designationRouter)

/** to IQC Solar Cell */
app.use('/IQCSolarCell',IQCSolarCellRoute)

/**to IPQC */
app.use('/IPQC',IPQC);

/**to Quality */
app.use('/Quality', QualityRoute)


/**to Maintenance */
app.use('/Maintenance',MaintenanceRouter)

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

const QualityExcelShedule = async()=>{
  const currentDate = new Date();
  const previousDate = new Date(currentDate);
  previousDate.setDate(currentDate.getDate() - 1);

  const formattedCurrentDate = formatDate(currentDate);
  const formattedPreviousDate = formatDate(previousDate);

  let UUID = v4()
  try {
     let query = `SELECT Q.CreatedOn, Q.QualityId, Q.Shift, Q.ShiftInChargeName, Q.ShiftInChargePreLime, Q.ShiftInChargePostLim, Q.ProductBarCode, P.Name AS CreatedBy, Q.Wattage, Q.Stage, Q.ResposiblePerson, Q.ReasonOfIssue, Q.IssueComeFrom, Q.ActionTaken, Q.OtherIssueType, Q.ModulePicture,Q.Status, Q.OtherModelNumber,Q.IssueType,Q.ModelNumber, Q.CreatedTime
    FROM Quality Q
    JOIN Person P ON P.PersonID = Q.CreatedBy
    WHERE Q.Status = 'Completed' AND STR_TO_DATE(Q.CreatedOn, '%d-%m-%Y %H:%i:%s') BETWEEN STR_TO_DATE('${formattedPreviousDate} 00:00:00', '%d-%m-%Y %H:%i:%s') AND STR_TO_DATE('${formattedPreviousDate} 23:59:59', '%d-%m-%Y %H:%i:%s')
    ORDER BY STR_TO_DATE(Q.CreatedOn, '%d-%m-%Y %H:%i:%s') DESC;`;

    let Quality = await queryAsync(query);
    console.log(Quality)
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

    let CompletedQualityExcelBytes = await QualityExcelGenerate(Quality, formattedPreviousDate, formattedPreviousDate, 'Completed');

    // Define the folder path
    let folderPath = Path.join('Quality-Upload');

    // Create the folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {

      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Define the file path, including the desired file name and format
    let fileName = `${UUID}.xlsx`;
    let filePath = Path.join(folderPath, fileName);

    // Save the file buffer to the specified file path
    fs.writeFileSync(filePath, CompletedQualityExcelBytes);

    query = `INSERT INTO QualityReportExcel(ExcelId,FromDate,ToDate,ExcelURL,CreatedBy,CreatedOn)
                                    VALUES('${UUID}','${formattedPreviousDate}','${formattedPreviousDate}','http://srv515471.hstgr.cloud:${PORT}/Quality/File/${fileName}','','${getCurrentDateTime()}');`
    await queryAsync(query);

/*** In Progress   */
UUID = v4()
     query = `SELECT Q.CreatedOn, Q.QualityId, Q.Shift, Q.ShiftInChargeName, Q.ShiftInChargePreLime, Q.ShiftInChargePostLim, Q.ProductBarCode, P.Name AS CreatedBy, Q.Wattage, Q.Stage, Q.ResposiblePerson, Q.ReasonOfIssue, Q.IssueComeFrom, Q.ActionTaken, Q.OtherIssueType, Q.ModulePicture,Q.Status, Q.OtherModelNumber,Q.IssueType,Q.ModelNumber, Q.CreatedTime
    FROM Quality Q
    JOIN Person P ON P.PersonID = Q.CreatedBy
    WHERE Q.Status = 'Inprogress' AND STR_TO_DATE(Q.CreatedOn, '%d-%m-%Y %H:%i:%s') BETWEEN STR_TO_DATE('${formattedPreviousDate} 00:00:00', '%d-%m-%Y %H:%i:%s') AND STR_TO_DATE('${formattedPreviousDate} 23:59:59', '%d-%m-%Y %H:%i:%s')
    ORDER BY STR_TO_DATE(Q.CreatedOn, '%d-%m-%Y %H:%i:%s') DESC;`;

     Quality = await queryAsync(query);
    console.log(Quality)
    ModelQuery = `SELECT ModelName, ModelId FROM ModelTypes;`
    IssueQuery = `SELECT Issue, IssueId FROM IssuesType;`
    ModelNames = await queryAsync(ModelQuery);
    IssueNames = await queryAsync(IssueQuery);
   /** To Find name Function  */
  
  
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

     let InprogressQualityExcelBytes = await QualityExcelGenerate(Quality, formattedPreviousDate, formattedPreviousDate, 'Inprogress');

    
    // Define the folder path
     folderPath = Path.join('Quality-Upload');

    // Create the folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {

      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Define the file path, including the desired file name and format
     fileName = `${UUID}.xlsx`;
     filePath = Path.join(folderPath, fileName);

    // Save the file buffer to the specified file path
    fs.writeFileSync(filePath, InprogressQualityExcelBytes);

    query = `INSERT INTO QualityReportExcel(ExcelId,FromDate,ToDate,ExcelURL,CreatedBy,CreatedOn)
                                    VALUES('${UUID}','${formattedPreviousDate}','${formattedPreviousDate}','http://srv515471.hstgr.cloud:${PORT}/Quality/File/${fileName}','','${getCurrentDateTime()}');`
    await queryAsync(query);

    await transport.sendMail({
      from: 'qualityreport.gautamsolar@gmail.com',
      cc: 'bhanu.galo@gmail.com',
      to: 'nidhi@gautamsolar.com',
      subject: `Quality Report ${formattedPreviousDate}`,
      attachments: [{
        filename: `Quality_Report_InProgress.xlsx`,
        content: InprogressQualityExcelBytes,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      },
      {
        filename: `Quality_Report_Completed.xlsx`,
        content: CompletedQualityExcelBytes,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    ],
      html: `<div style="position: relative; padding: 5px;">
          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('https://galo.co.in/wp-content/uploads/2024/01/Galo-Energy-Logo-06.png'); background-size: cover; background-position: center; background-repeat: no-repeat; opacity: 0.3; z-index: -1;"></div>
          <div style="background-color: rgba(255, 255, 255, 0.8); padding: 20px; border-radius: 10px;">
              <p style="font-size: 16px;">Dear Super Admin,</p>
              <p style="font-size: 16px; margin-bottom: 0;">As Per Your Request, Quality Report generated, You will have data Of Previous Day in Excel.</p>
              <p style="font-size: 16px;">Please find the attached Excel report for more details.</p>
              <br>
              <p style="font-size: 16px;"><em>Best regards,</em></p>
              <p style="font-size: 16px;"><strong>Gautam Solar QCM Team</strong></p>
          </div>
      </div>`
    })

    return `Sent it Email Succesfully of Quality Report🚀`
  } catch (err) {
    console.log(err)
    return err
  }
}



app.get("/getFile", (req, res) => {
  const pathfile = Path.join(__dirname, 'check.png');
  res.download(pathfile);
});


// cron.schedule('35 17 * * *', async () => {
//   try {
   
//     let result =  await QualityExcelShedule();
//    console.log((await chalk).default.blueBright(result));

//   } catch (error) {
//     console.error((await chalk).default.red('Error in cron job:', error));
//     //console.error('Error in cron job:', error);
//   }
// }, {
//   timezone: 'Asia/Kolkata' 
// });




app.listen(PORT, async () => {
  try {
    console.log((await chalk).default.green('server is running'));
    console.log((await chalk).default.yellow('Database is connecting....'))
  
    dbConn
  } catch (err) {
    console.log(err)
  }
})
