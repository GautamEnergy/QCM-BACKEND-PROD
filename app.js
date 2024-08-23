const express = require('express')
const { dbConn } = require('./db.config/db.config')
const { PersonRouter } = require('./Routes/Person.Route')
const { designationRouter } = require('./Routes/DesignationRoute')
const { IQCSolarCellRoute } = require('./Routes/IQCSolarCellRoute')
const { QualityRoute } = require('./Routes/QualityRoutes');
const {getCurrentDateTime} = require('./Utilis/IQCSolarCellUtilis')
const {MaintenanceRouter} = require('./Routes/MaintenanceRoutes')
const {setupSwagger} = require('./Controller/Swagger.controller')
const Path = require('path');
const ExcelJS = require('exceljs');
const { v4: uuidv4, v4 } = require('uuid');
const nodemailer = require('nodemailer')
const {QualityExcelGenerate} = require('./Utilis/QualityUtilis')
const cron = require('node-cron');
const util = require('util');
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

setupSwagger(app);

/** Nodemailer Configuration */
var transport1 = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'stockalert.gautamsolar@gmail.com',
    pass: 'mioh wlkb xnwd mier'
  }
});

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
      to: 'nidhi@gautamsolar.com,qualityreport@gautamsolar.com,ipqc@gautamsolar.com',
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


cron.schedule('0 10 * * *', async () => {
  try {
   
    let result =  await QualityExcelShedule();
   console.log(result);

  } catch (error) {
    console.error('Error in cron job:', error);
    //console.error('Error in cron job:', error);
  }
}, {
  timezone: 'Asia/Kolkata' 
});


/** Machine Maintenance */
cron.schedule('1 10 * * *', async () => {
  try {
    let data = await queryAsync(`
      SELECT SP.SparPartId, SP.SparePartName, S.Available_Stock, SP.SpareNumber AS SparePartModelNumber, SP.MinimumQuantityRequired 
      FROM Spare_Part_Stock S
      JOIN SparePartName SP ON SP.SparPartId = S.Spare_Part_Id;
    `);

    console.log(data);

    for (const d of data) {
      try {
        if (Number(d.Available_Stock) < Number(d.MinimumQuantityRequired)) {
          await transport1.sendMail({
            from: 'stockalert.gautamsolar@gmail.com',
            cc: 'bhanu.galo@gmail.com',
            to: 'nidhi@gautamsolar.com,maintenance@gautamsolar.com',
            subject: `Stock Deficiency In ${d.SparePartName}`,
            html: `<div style="position: relative; padding: 5px;">
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('https://galo.co.in/wp-content/uploads/2024/01/Galo-Energy-Logo-06.png'); background-size: cover; background-position: center; background-repeat: no-repeat; opacity: 0.3; z-index: -1;"></div>
                <div style="background-color: rgba(255, 255, 255, 0.8); padding: 20px; border-radius: 10px;">
                    <p style="font-size: 16px;">Dear Super Admin,</p>
                    <p style="font-size: 16px; margin-bottom: 0;">Stock deficiency alert for <strong>${d.SparePartName}</strong> (Model Number: ${d.SparePartModelNumber}).</p>
                    <p style="font-size: 16px;">Available Stock: <strong>${d.Available_Stock}</strong>, Minimum Required: <strong>${d.MinimumQuantityRequired}</strong></p>
                    <br>
                    <p style="font-size: 16px;"><em>Best regards,</em></p>
                    <p style="font-size: 16px;"><strong>Gautam Solar Maintenance Team</strong></p>
                </div>
            </div>`
          });
        }
      } catch (emailError) {
        console.error(`Failed to send email for ${d.SparePartName}:`, emailError);
        // Optionally, log this to a file or a monitoring system
      }
    }
  } catch (dbError) {
    console.error('Database query failed:', dbError);
    // Optionally, log this to a file or a monitoring system
  }
});

cron.schedule('5 10 * * *', async () => {

  try{
  let data = await queryAsync(`
    SELECT 
      MM.Machine_Maintenance_Id,  
      SPN.SparePartName AS 'Spare Part Name', 
      SPN.SparPartId AS 'SparePartId',
      SPN.SpareNumber AS 'Spare Part Model Number', 
      M.MachineName AS 'Machine Name',
      M.MachineId,
      M.MachineModelNumber AS 'Machine Model Number', 
      MM.Issue,
      MM.BreakDown_Start_Time AS 'BreakDown Start Time',
      MM.BreakDown_End_Time AS 'BreakDown End Time',
      MM.BreakDown_Total_Time AS 'BreakDown Total Time',
      MM.Quantity AS 'Quantity',
      MM.Solution_Process AS 'Solution Process',
      MM.Line,
      MM.Remark,
      SPS.Available_Stock,
      MM.Chamber,
      MM.Image_URL,
      MM.Stock_After_Usage AS 'Stock After Usage',
      P.Name AS 'Maintenanced by',
      MM.Created_On AS 'Maintenance Date'
    FROM 
      Machine_Maintenance MM
    LEFT JOIN 
      SparePartName SPN ON SPN.SparPartId = MM.Spare_Part_Id
    JOIN 
      Machine M ON M.MachineId = MM.Machine_Id
    JOIN
      Machine_Maintainer MMR ON MMR.Machine_Maintenance_Id = MM.Machine_Maintenance_Id
    JOIN 
      Person P ON P.PersonID = MMR.Created_By
    LEFT JOIN
      Spare_Part_Stock SPS ON SPS.Spare_Part_Id = MM.Spare_Part_Id
    WHERE 
      MM.Created_On >= DATE_SUB(CURDATE(), INTERVAL 1 DAY) 
      AND MM.Created_On < CURDATE()
    ORDER BY 
      MM.Created_On DESC;
  `);

  const groupedData = data.reduce((acc, item) => {
    const id = item.Machine_Maintenance_Id;

    let year = item['Maintenance Date'].getFullYear();

let month = String(item['Maintenance Date'].getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
let day = String(item['Maintenance Date'].getDate()).padStart(2, '0');

       item['Maintenance Date'] = `${year}-${month}-${day}`;

    if (!acc.has(id)) {
      acc.set(id, { ...item, 'Maintenanced by': [item['Maintenanced by']], 'Chamber': JSON.parse(item['Chamber']), 
        'Available_Stock':!item['Available_Stock']?'0': item['Available_Stock']});
    } else {
      acc.get(id)['Maintenanced by'].push(item['Maintenanced by']);
    }

    return acc;
  }, new Map());



// Get the current date
let currentDate = new Date();

// Subtract one day
currentDate.setDate(currentDate.getDate() - 1);

// Format the date to YYYY-MM-DD
let year = currentDate.getFullYear();
let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
let day = String(currentDate.getDate()).padStart(2, '0');

// Combine to form the YYYY-MM-DD string
let previousDay = `${year}-${month}-${day}`;



  const uniqueData = Array.from(groupedData.values());
  
  const MachineBuffer = await QualityExcelGenerate(uniqueData, previousDay)

  await transport1.sendMail({
    from: 'stockalert.gautamsolar@gmail.com',
    cc: 'bhanu.galo@gmail.com',
    to: 'nidhi@gautamsolar.com,maintenance@gautamsolar.com',
    subject: `Machine Maintenance ${previousDay}`,
    attachments: [
    {
      filename: `Machine_Maitenance.xlsx`,
      content: MachineBuffer,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  ],
    html: `<div style="position: relative; padding: 5px;">
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('https://galo.co.in/wp-content/uploads/2024/01/Galo-Energy-Logo-06.png'); background-size: cover; background-position: center; background-repeat: no-repeat; opacity: 0.3; z-index: -1;"></div>
                <div style="background-color: rgba(255, 255, 255, 0.8); padding: 20px; border-radius: 10px;">
                    <p style="font-size: 16px;">Dear Super Admin,</p>
                    <p style="font-size: 16px; margin-bottom: 0;">In below has given Machine Maintenance Excel of Yesterday</p>
                    
                    <br>
                    <p style="font-size: 16px;"><em>Best regards,</em></p>
                    <p style="font-size: 16px;"><strong>Gautam Solar Maintenance Team</strong></p>
                </div>
            </div>`
  })

  console.log('Maintenance Report Sent it at ')

}catch(err){
  console.log(err)
}
});


async function QualityExcelGenerate(Quality, FromDate) {

  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Machine Maintenance');

  let Border = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' }
  }

  let WrapTextAlignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

  /**Merge Cells */
  worksheet.mergeCells('A1:O2');


  /**Put Value in Cell */
  worksheet.getCell('A1').value = `Machine Maintenance Report (${FromDate})`;

  /** Apply header styling */
  worksheet.getCell('A1').style = {
    alignment: { horizontal: 'center', vertical: 'middle' }, font: { size: 16, bold: true }, fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF6DC' } // Yellow background color
    }
  };

      



  /**Apply Borders */
  worksheet.getCell('A1').border = {
    top: { style: 'thin' },
    left:{ style: 'thin' },
    right: { style: 'thin' }
  
  };
  worksheet.getCell('N2').border = {
    top: { style: 'thin' },
    left:{ style: 'thin' },
    right: { style: 'thin' }
  
  };
  
   worksheet.getCell('N3').border = {
    right:{ style: 'thin' },
    bottom: { style: 'thin' },
    left:{ style: 'thin' },
   
  };;

  /** Set The Column Names in Excel */
  var startCharCode = 'A'.charCodeAt(0);
  var endCharCode = 'O'.charCodeAt(0);
  let row = 3;
  worksheet.getRow(row).height = 40;

  let index = 0;
  let ColumnNames =   ['Machine Name','Model Number','Spare Part Name', 'Spare Part Model Number', 'Quantity', 'Available Stock',
    'Issue', 'BreakDown Start Time', 'BreakDown End Time',  'BreakDown Total Time', 'Solution Process', 'Line', 'Remark',
    'Maintenanced by', 'Maintenance Date']; 

  for (let i = startCharCode; i <= endCharCode; i++) {
    worksheet.getColumn(`${String.fromCharCode(i)}`).width = 20;
    worksheet.getCell(`${String.fromCharCode(i)}${row}`).value = `${ColumnNames[index]}`;
    worksheet.getCell(`${String.fromCharCode(i)}${row}`).style = {
      alignment: { horizontal: 'center', vertical: 'middle', wrapText:true}, font: { size: 10, bold: true }
    }
    worksheet.getCell(`${String.fromCharCode(i)}${row}`).border = Border;
    index++;
  }


row = row+1;

Quality.forEach((data)=>{

  worksheet.getRow(row).height = 40
  const style = { alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }, font: { size: 9} }
  /**Put the value in cell */
  worksheet.getCell(`A${row}`).value = data['Machine Name'];
  worksheet.getCell(`B${row}`).value = data['Machine Model Number'];
 
  worksheet.getCell(`C${row}`).value = data['Spare Part Name'];
  worksheet.getCell(`D${row}`).value = data['Spare Part Model Number'];
  worksheet.getCell(`E${row}`).value = data['Quantity'];
  worksheet.getCell(`F${row}`).value = data['Available_Stock'];
  worksheet.getCell(`G${row}`).value = data['Issue'];
  worksheet.getCell(`H${row}`).value = data['BreakDown Start Time'];
  worksheet.getCell(`I${row}`).value = data['BreakDown End Time']; 
  worksheet.getCell(`J${row}`).value = data['BreakDown Total Time'];
  worksheet.getCell(`K${row}`).value = data['Solution Process'];
  worksheet.getCell(`L${row}`).value = data['Line'];
  worksheet.getCell(`M${row}`).value = data['Remark'];
  worksheet.getCell(`N${row}`).value = data['Maintenanced by'].join(', ');
  worksheet.getCell(`O${row}`).value = data['Maintenance Date'];

  /**Styling */
  worksheet.getCell(`A${row}`).style = style;
  worksheet.getCell(`B${row}`).style = style;
  worksheet.getCell(`C${row}`).style = style;
  worksheet.getCell(`D${row}`).style = style;
  worksheet.getCell(`E${row}`).style = style;
  worksheet.getCell(`F${row}`).style = style;
  worksheet.getCell(`G${row}`).style = style;
  worksheet.getCell(`H${row}`).style = style;
  worksheet.getCell(`I${row}`).style = style;
  worksheet.getCell(`J${row}`).style = style;
  worksheet.getCell(`K${row}`).style = style;
  worksheet.getCell(`L${row}`).style = style;
  worksheet.getCell(`M${row}`).style = style;
  worksheet.getCell(`N${row}`).style = style;
  worksheet.getCell(`O${row}`).style = style;
  // worksheet.getCell(`N${row}`).style = style;

  /**Border */
  worksheet.getCell(`A${row}`).border = Border;
  worksheet.getCell(`B${row}`).border = Border;
  worksheet.getCell(`C${row}`).border = Border;
  worksheet.getCell(`D${row}`).border = Border;
  worksheet.getCell(`E${row}`).border = Border;
  worksheet.getCell(`F${row}`).border = Border;
  worksheet.getCell(`G${row}`).border = Border;
  worksheet.getCell(`H${row}`).border = Border;
  worksheet.getCell(`I${row}`).border = Border;
  worksheet.getCell(`J${row}`).border = Border;
  worksheet.getCell(`K${row}`).border = Border;
  worksheet.getCell(`L${row}`).border = Border;
  worksheet.getCell(`M${row}`).border = Border;
  worksheet.getCell(`N${row}`).border = Border;
  worksheet.getCell(`O${row}`).border = Border;
  // worksheet.getCell(`N${row}`).border = Border;

  row++;
})

   //Save the workbook to a file
const excelBuffer = await workbook.xlsx.writeBuffer()
.then(buffer => {
  console.log('Excel file generated successfully!');

  return buffer; // Return the buffer
})
.catch(error => {
  console.error('Error generating Excel file:', error);
});

return excelBuffer;

}



app.listen(PORT, async () => {
  try {
   
  console.log('server is running');
    dbConn
  } catch (err) {
    console.log(err)
  }
})
