const AWS = require('aws-sdk');
const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer')
const Path = require('path');
const fs = require('fs');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
require('dotenv').config()

/** to Get current Date & Time */
function getCurrentDateTime() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };


  /** Config to Upload Pdf in S3 Bucket */

  /** AWS Config */

/* Set AWS region **/
AWS.config.update({ region: 'ap-south-1' });

/* Set AWS credentials **/
AWS.config.credentials = new AWS.Credentials({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
});

/* Create S3 instance **/
const s3 = new AWS.S3();

/** Nodemailer Configuration */
var transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ipqc.gautamsolar@gmail.com',
    pass: 'pyzn knth igdb cjtc'
  }
});

async function ExcelGenerate(Data) {

//   let Data = [{"JobCardDetailID":"0b75d335-58f3-4aa3-bdda-224bca2bc439", "Type":"Job Card", "DocNo":"GSPL\/IPQC\/BM\/024", "RevisionNo":"1.0", "RevisonDate":"12.08.2023", "ModuleType":"12", "ModuleNo":"0", "Date":"2024-04-29", "MatrixSize":"32", "ReferencePdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/0b75d335-58f3-4aa3-bdda-224bca2bc439.pdf", "Status":"Approved", "CreatedBy":"ad320aa6-f3f2-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"29-04-2024 13:36:24", "UpdatedOn":"29-04-2024 14:33:27", "JobCardID":"dab83636-0bfc-4ff3-a420-1631b5d524b4", "JobCardDetailID":"0b75d335-58f3-4aa3-bdda-224bca2bc439", "Process":"Glass Washing", "EmployeeId":"ad320aa6-f3f2-11ee-b439-0ac93defbbf1", "Description":"{\"Lot_No\":\"dsdsd\",\"size\":\"32\"}", "Comments":"ew3", "CreatedOn":"29-04-2024 13:33:35", "UpdatedOn":"", "PersonID":"ad320aa6-f3f2-11ee-b439-0ac93defbbf1", "EmployeeID":"eo88", "Name":"QC", "LoginID":"Krishna", "Password":"QC@3353", "WorkLocation":"fc9c906b-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"https:\/\/qcm-project-bucket.s3.ap-south-1.amazonaws.com\/ad320aa6-f3f2-11ee-b439-0ac93defbbf1", "Desgination":"1af9d9f7-e817-11ee-b439-0ac93defbbf1", "Status":"Inactive", "CreatedBy":null, "UpdatedBy":null, "CreatedOn":null, "UpdatedOn":null, "CreadtedBy":null},
//   {"JobCardDetailID":"0b75d335-58f3-4aa3-bdda-224bca2bc439", "Type":"Job Card", "DocNo":"GSPL\/IPQC\/BM\/024", "RevisionNo":"1.0", "RevisonDate":"12.08.2023", "ModuleType":"12", "ModuleNo":"0", "Date":"2024-04-29", "MatrixSize":"32", "ReferencePdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/0b75d335-58f3-4aa3-bdda-224bca2bc439.pdf", "Status":"Approved", "CreatedBy":"ad320aa6-f3f2-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"29-04-2024 13:36:24", "UpdatedOn":"29-04-2024 14:33:27", "JobCardID":"485e7af0-377c-4539-a144-905054d24ce3", "JobCardDetailID":"0b75d335-58f3-4aa3-bdda-224bca2bc439", "Process":"Tabbing & Stringing", "EmployeeId":"ad320aa6-f3f2-11ee-b439-0ac93defbbf1", "Description":"{\"Cell_Lot_No\":\"ew\",\"Cell_Type\":\"we\",\"Cell_Size\":\"w\",\"Cell_Eff\":\"ew\",\"Interconnect_Ribbon_Size\":\"ew\",\"Busbar_Size\":\"we\",\"Flux\":\"ew\"}", "Comments":"w", "CreatedOn":"29-04-2024 13:33:35", "UpdatedOn":"", "PersonID":"ad320aa6-f3f2-11ee-b439-0ac93defbbf1", "EmployeeID":"eo88", "Name":"QC", "LoginID":"Krishna", "Password":"QC@3353", "WorkLocation":"fc9c906b-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"https:\/\/qcm-project-bucket.s3.ap-south-1.amazonaws.com\/ad320aa6-f3f2-11ee-b439-0ac93defbbf1", "Desgination":"1af9d9f7-e817-11ee-b439-0ac93defbbf1", "Status":"Inactive", "CreatedBy":null, "UpdatedBy":null, "CreatedOn":null, "UpdatedOn":null, "CreadtedBy":null},
// ]

  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Job Card');

  let Border = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' }
  }

  let WrapTextAlignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

  /**Merge Cells */
  worksheet.mergeCells('A1:M3');
  worksheet.mergeCells('A4:M4');
  worksheet.mergeCells('N1:P1');
  worksheet.mergeCells('N2:P2');
  worksheet.mergeCells('N3:P3');
  worksheet.mergeCells('N4:P4');
  worksheet.mergeCells('N5:P5');
  worksheet.mergeCells('N6:P6');
  worksheet.mergeCells('E5:M5');
  worksheet.mergeCells('E6:M6');
  worksheet.mergeCells('A5:D5');
  worksheet.mergeCells('A6:D6');
  worksheet.mergeCells('A7:B7');
  worksheet.mergeCells('C7:E7');
  worksheet.mergeCells('F7:M7');
  worksheet.mergeCells('N7:P7');

  /** Increasing height */
  worksheet.getRow(7).height = 42;

  /**Width */
  var startCharCode = 'F'.charCodeAt(0);
  var endCharCode = 'M'.charCodeAt(0);
  
  for (var i = startCharCode; i <= endCharCode; i++) {
    worksheet.getColumn(`${String.fromCharCode(i)}`).width = 4;
    
  };
  /**Put Value in Cell */
  worksheet.getCell('A1').value = `Gautam Solar Pvt Ltd.`;
  worksheet.getCell('A4').value = 'JOB CARD';
  worksheet.getCell('N1').value = 'Page No. 1';
  worksheet.getCell('N2').value = `Doc No : ${Data[0]['DocNo']}`;
  worksheet.getCell('N3').value = `Revision No : ${Data[0]['RevisionNo']}`;
  worksheet.getCell('N4').value = `Revision Date : ${Data[0]['RevisonDate']}`;
  worksheet.getCell('N5').value = `Module Type : ${Data[0]['ModuleType']}`;
  worksheet.getCell('N6').value = `Model No : ${Data[0]['ModuleNo']}`;
  worksheet.getCell('A5').value = `Date  :	${Data[0]['Date']}`;
  worksheet.getCell('A6').value = `Matrix Size : ${Data[0]['MatrixSize']}`;
  worksheet.getCell('A7').value = `Process/Stage`;
  worksheet.getCell('C7').value = `Employee ID & Sign`;
  worksheet.getCell('F7').value = `Description`;
  worksheet.getCell('N7').value = `Comments`;

  /** Apply header styling */
  worksheet.getCell('A1').style = {
    alignment: { horizontal: 'center', vertical: 'middle',wrapText:true }, font: { size: 22, bold: true },fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF6DC' } // Yellow background color
    }
  };

  worksheet.getCell('A4').style = {
    alignment: { horizontal: 'center', vertical: 'middle',wrapText:true }, font: { size: 14, bold: true }
  };

  worksheet.getCell('N1').style = {
    alignment: { horizontal: 'left', vertical: 'middle',wrapText:true }, font: { size: 11, bold: true }
  };

  worksheet.getCell('N2').style = {
    alignment: { horizontal: 'left', vertical: 'middle',wrapText:true }, font: { size: 11, bold: true }
  };

  worksheet.getCell('N3').style = {
    alignment: { horizontal: 'left', vertical: 'middle',wrapText:true }, font: { size: 11, bold: true }
  };

  worksheet.getCell('N4').style = {
    alignment: { horizontal: 'left', vertical: 'middle',wrapText:true }, font: { size: 11, bold: true }
  };

  worksheet.getCell('N5').style = {
    alignment: { horizontal: 'left', vertical: 'middle',wrapText:true }, font: { size: 11, bold: true }
  };

  worksheet.getCell('N6').style = {
    alignment: { horizontal: 'left', vertical: 'middle', wrapText:true}, font: { size: 11, bold: true }
  };

  worksheet.getCell('A5').style = {
    alignment: { horizontal: 'left', vertical: 'middle', wrapText:true }, font: { size: 11, bold: true }
  };

  worksheet.getCell('A6').style = {
    alignment: { horizontal: 'left', vertical: 'middle', wrapText:true }, font: { size: 11, bold: true }
  };

  worksheet.getCell('A7').style = {
    alignment: { horizontal: 'center', vertical: 'middle', wrapText:true }, font: { size: 12, bold: true }
  };

  worksheet.getCell('C7').style = {
    alignment: { horizontal: 'center', vertical: 'middle', wrapText:true }, font: { size: 12, bold: true }
  };

  worksheet.getCell('F7').style = {
    alignment: { horizontal: 'center', vertical: 'middle', wrapText:true }, font: { size: 12, bold: true }
  };

  worksheet.getCell('N7').style = {
    alignment: { horizontal: 'center', vertical: 'middle', wrapText:true }, font: { size: 12, bold: true }
  };

  /**Apply Borders */
  worksheet.getCell('A1').border = Border;
  worksheet.getCell('N2').border = Border;
  worksheet.getCell('A4').border = Border;
  worksheet.getCell('M4').border = Border;
  worksheet.getCell('N1').border = Border;
  worksheet.getCell('P1').border = Border;
  worksheet.getCell('N2').border = Border;
  worksheet.getCell('P2').border = Border;
  worksheet.getCell('P3').border = Border;
  worksheet.getCell('N3').border = Border;
  worksheet.getCell('P4').border = Border;
  worksheet.getCell('N4').border = Border;
  worksheet.getCell('P5').border = Border;
  worksheet.getCell('N5').border = Border;
  worksheet.getCell('P6').border = Border;
  worksheet.getCell('N6').border = Border;
  worksheet.getCell('E5').border = Border;
  worksheet.getCell('M5').border = Border;
  worksheet.getCell('E6').border = Border;
  worksheet.getCell('M6').border = Border;
  worksheet.getCell('A5').border = Border;
  worksheet.getCell('D5').border = Border;
  worksheet.getCell('A6').border = Border;
  worksheet.getCell('D6').border = Border;
  worksheet.getCell('A7').border = Border;
  worksheet.getCell('B7').border = Border;
  worksheet.getCell('C7').border = Border;
  worksheet.getCell('E7').border = Border;
  worksheet.getCell('F7').border = Border;
  worksheet.getCell('M7').border = Border;
  worksheet.getCell('N7').border = Border;
  worksheet.getCell('P7').border = Border;
  
  /** Putting Values which is coming from dbs */
  let Row = 8;

  Data.forEach((Job)=>{
    //worksheet.getRow(Row).height = 23;
    let description = JSON.parse(Job['Description']);
     let intialRow = Row;
   for(let key in description){
    worksheet.getRow(Row).height = 26;
    worksheet.mergeCells(`F${Row}:M${Row}`)
    worksheet.getCell(`F${Row}`).value = `${key.split('_').join(' ')} : ${description[key]}`;
    worksheet.getCell(`F${Row}`).style = {
      alignment: { horizontal: 'left', vertical: 'middle', wrapText:true }, font: { size: 11 }
    };
    worksheet.getCell(`F${Row}`).border = Border;
    worksheet.getCell(`M${Row}`).border = Border;
     Row++;

   }
   /** Stage */
   worksheet.mergeCells(`A${intialRow}:B${Row-1}`)
   worksheet.getCell(`A${intialRow}`).value = Job['Process'];
   worksheet.getCell(`A${intialRow}`).style = {
    alignment: { horizontal: 'center', vertical: 'middle', wrapText:true }, font: { size: 12, bold:true }
  };
  worksheet.getCell(`A${intialRow}`).border = Border;
    worksheet.getCell(`B${Row-1}`).border = Border;

/** Comment */
worksheet.mergeCells(`N${intialRow}:P${Row-1}`)
worksheet.getCell(`N${intialRow}`).value = Job['Comments'];
worksheet.getCell(`N${intialRow}`).style = {
 alignment: { horizontal: 'center', vertical: 'middle', wrapText:true }, font: { size: 12}
};
worksheet.getCell(`N${intialRow}`).border = Border;
 worksheet.getCell(`P${Row-1}`).border = Border;

 /** Employee id & Sign */
worksheet.mergeCells(`C${intialRow}:E${Row-1}`)
worksheet.getCell(`C${intialRow}`).value = Job['EmployeeID'];
worksheet.getCell(`C${intialRow}`).style = {
 alignment: { horizontal: 'center', vertical: 'middle', wrapText:true }, font: { size: 12}
};
worksheet.getCell(`C${intialRow}`).border = Border;
 worksheet.getCell(`E${Row-1}`).border = Border;
  });


/** Checked By */
worksheet.mergeCells(`A${Row}:E${Row+2}`)
worksheet.getCell(`A${Row}`).value = `Checked By : ${Data[0]['Name']}`;
worksheet.getCell(`A${Row}`).style = {
  alignment: { horizontal: 'left', vertical: 'middle', wrapText:true }, font: { size: 12, bold:true}
 };
 worksheet.getCell(`A${Row}`).border = Border;
 worksheet.getCell(`E${Row+2}`).border = Border;

 /** Approved By */
 worksheet.mergeCells(`F${Row}:P${Row+2}`)
worksheet.getCell(`F${Row}`).value = `Approved By : ${Data[0]['ApprovedBy']}`;
worksheet.getCell(`F${Row}`).style = {
  alignment: { horizontal: 'left', vertical: 'middle', wrapText:true }, font: { size: 12, bold:true}
 };
 worksheet.getCell(`F${Row}`).border = Border;
 worksheet.getCell(`P${Row+2}`).border = Border;

 Row = Row + 2;
 //Save the workbook to a file
  const excelBuffer = await workbook.xlsx.writeBuffer()
    .then(buffer => {
      console.log('Excel file generated successfully!');

      return buffer; // Return the buffer
    })
    .catch(error => {
      console.error('Error generating Excel file:', error);
    });


  await transport.sendMail({
    from: 'ipqc.gautamsolar@gmail.com',
    cc: 'bhanu.galo@gmail.com',
    to: 'nidhi@gautamsolar.com, production@gautamsolar.com, panel@gautamsolar.com, it@gautamsolar.com',
    subject: `IPQC Job Card Report: Module No. ${Data[0]['ModuleNo']}`,
    attachments: [{
      filename: `Job_Card_${Data[0]['ModuleNo']}.xlsx`,
      content: excelBuffer,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }],
    html: `<div style="position: relative; padding: 5px;">
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('https://galo.co.in/wp-content/uploads/2024/01/Galo-Energy-Logo-06.png'); background-size: cover; background-position: center; background-repeat: no-repeat; opacity: 0.3; z-index: -1;"></div>
        <div style="background-color: rgba(255, 255, 255, 0.8); padding: 20px; border-radius: 10px;">
            <p style="font-size: 16px;">Dear Super Admin,</p>
            <p style="font-size: 16px; margin-bottom: 0;">Module No: ${Data[0]['ModuleNo']} of Job Card has been Approved by ${Data[0]['ApprovedBy']}.</p>
            <p style="font-size: 16px;">Please find the attached Excel report for more details.</p>
            <br>
            <p style="font-size: 16px;"><em>Best regards,</em></p>
            <p style="font-size: 16px;"><strong>Gautam Solar QCM Team</strong></p>
        </div>
    </div>`
  })

  try{

      /** Define the folder path */
      const folderPath = Path.join('ExcelFile');
      
    
      /** Create the folder if it doesn't exist */
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

        /** Define the file path, including the desired file name and format */
        const Excel = `${Data[0]['JobCardDetailID']}.xlsx`;
        
        const ExcelFilePath = Path.join(folderPath, Excel);
     

      /** Save the file buffer to the specified file path */
      fs.writeFileSync(ExcelFilePath, excelBuffer);
     
  }catch(err){
    console.log(err)
   throw err;
  }
  return `${Data[0]['JobCardDetailID']}.xlsx`;
}





 

module.exports = { getCurrentDateTime, s3, ExcelGenerate };
