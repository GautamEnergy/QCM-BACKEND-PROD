const express = require('express')
const { dbConn } = require('./db.config/db.config')
const { PersonRouter } = require('./Routes/Person.Route')
const { designationRouter } = require('./Routes/DesignationRoute')
const { IQCSolarCellRoute } = require('./Routes/IQCSolarCellRoute')
const { QualityRoute } = require('./Routes/QualityRoutes');
const {getCurrentDateTime} = require('./Utilis/IQCSolarCellUtilis')
const Path = require('path');
const { v4: uuidv4, v4 } = require('uuid');
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



console.log(process.env.PORT);

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







// const SolderingGenerate = async () => {

//   let Data = [
//     {
//         "TestDetailId": "7dc28b20-078d-4f5b-9c40-b1e89e39cf81",
//         "TestId": "58eb44b9-5dc5-4aa7-9065-55088998eb6a",
//         "Track": "Sample1",
//         "TrackData": "[{\"FrontController\":\"12\",\"BackController\":\"221\"},{\"FrontController\":\"32\",\"BackController\":\"45\"}]",
//         "TestDetailId": "7dc28b20-078d-4f5b-9c40-b1e89e39cf81",
//         "DocNo": "GSPL\/IPQC\/GP\/005",
//         "RevNo": "1.0 & 12.08.2023",
//         "RibbonMake": "54",
//         "CellSize": "54",
//         "RibbonSize": "654",
//         "Date": "2024-05-01",
//         "Line": "12",
//         "Shift": "Day Shift",
//         "MachineNo": "32",
//         "OperatorName": "54",
//         "CellMake": "1",
//         "Status": "Approved",
//         "CreatedBy": "08326670-ed04-11ee-b439-0ac93defbbf1",
//         "UpdatedBy": "08326670-ed04-11ee-b439-0ac93defbbf1",
//         "CreatedOn": "01-05-2024 09:51:51",
//         "UpdatedOn": "01-05-2024 11:32:08",
//         "BussingStage": "",
//         "BusBarWidth": "",
//         "Remarks": "",
//         "Type": "Soldering",
//         "Pdf": "http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/7dc28b20-078d-4f5b-9c40-b1e89e39cf81.pdf",
//         "PersonID": "08326670-ed04-11ee-b439-0ac93defbbf1",
//         "EmployeeID": "Emp003",
//         "Name": "Bhanu",
//         "LoginID": "QCM",
//         "Password": "Bhanu@3813",
//         "WorkLocation": "fc9c8db9-e817-11ee-b439-0ac93defbbf1",
//         "Email": "krishukumar7827@gmail.com",
//         "Department": "84949eb1-e816-11ee-b439-0ac93defbbf1",
//         "ProfileImg": "http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg",
//         "Desgination": "d66db440-e2ab-11ee-974e-12d6db81f661",
//         "Status": "Active",
//         "CreatedBy": null,
//         "UpdatedBy": "08326670-ed04-11ee-b439-0ac93defbbf1",
//         "CreatedOn": null,
//         "UpdatedOn": "21-05-2024 08:35:04",
//         "CreadtedBy": null
//     },
//     {
//       "TestDetailId": "7dc28b20-078d-4f5b-9c40-b1e89e39cf81",
//       "TestId": "58eb44b9-5dc5-4aa7-9065-55088998eb6a",
//       "Track": "Sample1",
//       "TrackData": "[{\"FrontController\":\"Rahul\",\"BackController\":\"Viney\"},{\"FrontController\":\"32\",\"BackController\":\"45\"},{\"FrontController\":\"Rahul\",\"BackController\":\"Viney\"}]",
//       "TestDetailId": "7dc28b20-078d-4f5b-9c40-b1e89e39cf81",
//       "DocNo": "GSPL\/IPQC\/GP\/005",
//       "RevNo": "1.0 & 12.08.2023",
//       "RibbonMake": "54",
//       "CellSize": "54",
//       "RibbonSize": "654",
//       "Date": "2024-05-01",
//       "Line": "12",
//       "Shift": "Day Shift",
//       "MachineNo": "32",
//       "OperatorName": "54",
//       "CellMake": "1",
//       "Status": "Approved",
//       "CreatedBy": "08326670-ed04-11ee-b439-0ac93defbbf1",
//       "UpdatedBy": "08326670-ed04-11ee-b439-0ac93defbbf1",
//       "CreatedOn": "01-05-2024 09:51:51",
//       "UpdatedOn": "01-05-2024 11:32:08",
//       "BussingStage": "",
//       "BusBarWidth": "",
//       "Remarks": "",
//       "Type": "Soldering",
//       "Pdf": "http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/7dc28b20-078d-4f5b-9c40-b1e89e39cf81.pdf",
//       "PersonID": "08326670-ed04-11ee-b439-0ac93defbbf1",
//       "EmployeeID": "Emp003",
//       "Name": "Bhanu",
//       "LoginID": "QCM",
//       "Password": "Bhanu@3813",
//       "WorkLocation": "fc9c8db9-e817-11ee-b439-0ac93defbbf1",
//       "Email": "krishukumar7827@gmail.com",
//       "Department": "84949eb1-e816-11ee-b439-0ac93defbbf1",
//       "ProfileImg": "http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg",
//       "Desgination": "d66db440-e2ab-11ee-974e-12d6db81f661",
//       "Status": "Active",
//       "CreatedBy": null,
//       "UpdatedBy": "08326670-ed04-11ee-b439-0ac93defbbf1",
//       "CreatedOn": null,
//       "UpdatedOn": "21-05-2024 08:35:04",
//       "CreadtedBy": null
//   }
// ]
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet('Soldering Peel Test Report');
//   let Style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 22, bold: true, italic: true
//     }
//   }

//   let MatrixData = [{
//     'Date': Data[0]['Date'],
//     'Line': Data[0]['Line'],
//     'Ribbon Make': Data[0]['RibbonMake'],
//   },
//   {
//     'Shift': Data[0]['Shift'],
//     'Machine No': Data[0]['MachineNo'],
//     'Cell Size': Data[0]['CellSize'],
//   },
//   {
//     'Operator Name': Data[0]['OperatorName'],
//     'Cell Make': Data[0]['CellMake'],
//     'Reabon Size': Data[0]['RibbonSize'],
//   }]
//   let Border = {
//     top: { style: 'thin' },
//     bottom: { style: 'thin' },
//     left: { style: 'thin' },
//     right: { style: 'thin' }
//   }

//   let row = 4;


//   /**Merging Cells */
//   worksheet.mergeCells('A1:D2')
//   worksheet.mergeCells('E1:F1')
//   worksheet.mergeCells('A3:D3')
//   worksheet.mergeCells('E2:F2')
//   worksheet.mergeCells('E3:F3')
//   // worksheet.mergeCells('C7:D7')
//   // worksheet.mergeCells('E7:F7')
//   worksheet.mergeCells('A7:F7')



//   /**putting value in cell */
//   worksheet.getCell('E1').value = 'Page No.1';
//   worksheet.getCell('A1').value = 'Gautam Solar Pvt. Ltd';
//   worksheet.getCell('A3').value = `Soldering Peel Test Report`;
//   worksheet.getCell('E2').value = `Doc No. ${Data[0]['DocNo']}`;
//   worksheet.getCell('E3').value = `Rev No. ${Data[0]['RevNo']}`;
//   worksheet.getCell('A7').value = 'Acceptance criteria: ≥ 0.5 N, effective Soldering Area should be ≥70%';
//   // worksheet.getCell('B7').value = 'Ribbon No';
//   // worksheet.getCell('C7').value = 'Peel Value(N)';
//   // worksheet.getCell('E7').value = 'Remarks';


//   /**Giving Style to Cell */
//   worksheet.getCell('E1').style = {
//     alignment: { horizontal: 'center', vertical: 'middle' },
//     font: {
//       size: 11, bold: true, italic: true
//     }
//   }

//   worksheet.getCell('A3').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 15, bold: true, italic: true
//     }
//   }

//   worksheet.getCell('A1').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 22, bold: true, italic: true
//     }
//   }

//   worksheet.getCell('E2').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 11, bold: true, italic: true
//     }
//   }
//   worksheet.getCell('E3').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 11, bold: true, italic: true
//     }
//   }
//   worksheet.getCell('A7').style = {
//     alignment: { horizontal: 'center', vertical: 'middle' },
//     font: {
//       size: 11, bold: true
//     }
//   }
//   worksheet.getCell('B7').style = {
//     alignment: { horizontal: 'center', vertical: 'middle' },
//     font: {
//       size: 11, bold: true
//     }
//   }
//   worksheet.getCell('C7').style = {
//     alignment: { horizontal: 'center', vertical: 'middle' },
//     font: {
//       size: 11, bold: true
//     }
//   }
//   worksheet.getCell('E7').style = {
//     alignment: { horizontal: 'center', vertical: 'middle' },
//     font: {
//       size: 11, bold: true
//     }
//   }


//   /**Giving Border to Cell */
//   worksheet.getCell('A1').border = Border

//   worksheet.getCell('D2').border = Border

//   worksheet.getCell('E1').border = {
//     top: { style: 'thin' },
//     bottom: { style: 'thin' }
//   }

//   worksheet.getCell('F1').border = {
//     top: { style: 'thin' },
//     right: { style: 'thin' },
//     bottom: { style: 'thin' }
//   }

//   worksheet.getCell('A3').border = Border;
//   worksheet.getCell('D3').border = Border;
//   worksheet.getCell('E2').border = Border;
//   worksheet.getCell('F2').border = Border;
//   worksheet.getCell('E3').border = Border;
//   worksheet.getCell('F3').border = Border;
//   worksheet.getCell('A7').border = Border;
//   worksheet.getCell('B7').border = Border;
//   worksheet.getCell('C7').border = Border;
//   worksheet.getCell('D7').border = Border;
//   worksheet.getCell('E7').border = Border;
//   worksheet.getCell('F7').border = Border;




//   /**Height */
//   worksheet.getRow(1).height = 15;
//   worksheet.getRow(2).height = 27;
//   worksheet.getRow(3).height = 33;
//   worksheet.getRow(row).height = 40;
//   worksheet.getRow(7).height = 25.75;

//   worksheet.getColumn('F').width = 16.86;
//   worksheet.getColumn('C').width = 15;
//   worksheet.getColumn('D').width = 9.23;

//   var startCharCode = 'A'.charCodeAt(0); // 1
//   var endCharCode = 'B'.charCodeAt(0); //3

//   for (var i = startCharCode; i <= endCharCode; i++) {

//     worksheet.getColumn(`${String.fromCharCode(i)}`).width = 21.75

//   };

//   // worksheet.getColumn('A').width = 28.40 
//   MatrixData.forEach((data) => {
//     worksheet.getRow(row).height = 25;

//     let length = 0;
//     for (let key in data) {
//       length++;
//     }

//     //2
//     //[{"date":"3323","k":"kd","Rev":"fg"},{"date":"3323","k":"kd","Rev":"fg"}]//1
//     let index = 0;
//     var i = 'A'.charCodeAt(0);
//     for (let key in data) {

//       if (index == length - 1) {

//         worksheet.mergeCells(`C${row}:F${row}`)
//         worksheet.getCell(`C${row}`).value = `${key}: ${data[key]}`;

//       } else {
//         worksheet.getCell(`${String.fromCharCode(i)}${row}`).value = `${key}: ${data[key]}`
//         worksheet.getColumn(`${String.fromCharCode(i)}`).width = 28.40
//         // worksheet.getCell(`B${row}`).value = `${key}: ${data[key]}`
//       }

//       /**Style */
//       worksheet.getCell(`C${row}`).style = {
//         alignment: { horizontal: 'left', vertical: 'middle', wrapText: true },
//         font: {
//           size: 12, bold: true
//         }
//       }
//       worksheet.getCell(`C${row}`).border = Border;
//       worksheet.getCell(`${String.fromCharCode(i)}${row}`).style = {
//         alignment: { horizontal: 'left', vertical: 'middle', wrapText: true },
//         font: {
//           size: 12, bold: true
//         }
//       }
//       worksheet.getCell(`${String.fromCharCode(i)}${row}`).border = Border




//       index++;
//       i++
//     }
//     row++;
//   })
// row++;

// /**Columns of track, Ribbon No , FrontPeel, BackPeel */
// /** Track */
// worksheet.getRow(row).height = 25;

// worksheet.getCell(`A${row}`).value = 'Track';
//       worksheet.getCell(`A${row}`).style = {
//         alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//         font: {
//           size: 11, bold: true
//         }
//       }
// worksheet.getCell(`A${row}`).border = Border;

// /** Ribbon No*/
// worksheet.getCell(`B${row}`).value = 'Ribbon No.';
//       worksheet.getCell(`B${row}`).style = {
//         alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//         font: {
//           size: 11, bold: true
//         }
//       }
// worksheet.getCell(`B${row}`).border = Border;

// /**FrontPreel Value */
// worksheet.mergeCells(`C${row}:D${row}`)
// worksheet.getCell(`C${row}`).value = 'Front Peel(N)';
//       worksheet.getCell(`C${row}`).style = {
//         alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//         font: {
//           size: 11, bold: true
//         }
//       }
// worksheet.getCell(`C${row}`).border = Border;
// worksheet.getCell(`D${row}`).border = Border;

// /**Back Peel */

// worksheet.mergeCells(`E${row}:F${row}`)
// worksheet.getCell(`E${row}`).value = 'Back Peel(N)';
//       worksheet.getCell(`E${row}`).style = {
//         alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//         font: {
//           size: 11, bold: true
//         }
//       }
// worksheet.getCell(`E${row}`).border = Border;
// worksheet.getCell(`F${row}`).border = Border;

//   row++;
  
//   Data.forEach((data, i) => {
//     data['TrackData'] = JSON.parse(data['TrackData']);

//     let SampleAControllerNo = 1;
//     let RibbonNo = 1
//     let firstRow = row;
//     data['TrackData'].forEach((Track) => {
//       //mergehhhhhh
//       worksheet.getRow(row).height = 35.27;
//       worksheet.getCell(`B${row}`).value = `R${RibbonNo}`
//       worksheet.mergeCells(`C${row}:D${row}`)
//       worksheet.mergeCells(`E${row}:F${row}`)
//       worksheet.getCell(`C${row}`).value = Track[`FrontController`];
//       worksheet.getCell(`E${row}`).value = Track['BackController'];

//       worksheet.getCell(`B${row}`).style = {
//         alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//         font: {
//           size: 12, bold: true
//         }
//       }

//       worksheet.getCell(`C${row}`).style = {
//         alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//         font: {
//           size: 12, bold: false
//         }
//       }

//       worksheet.getCell(`E${row}`).style = {
//         alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//         font: {
//           size: 12, bold: false
//         }
//       }

//       worksheet.getCell(`B${row}`).border = Border;
//       worksheet.getCell(`C${row}`).border = Border;
//       worksheet.getCell(`D${row}`).border = Border;
//       worksheet.getCell(`E${row}`).border = Border;
//       worksheet.getCell(`F${row}`).border = Border;

//       RibbonNo++;
//       SampleAControllerNo++;
//       row++;
//     })

//     worksheet.mergeCells(`A${firstRow}:A${row - 1}`);
//     worksheet.getCell(`A${firstRow}`).value = `Sample ${i + 1}`;

//     worksheet.getCell(`A${firstRow}`).style = {
//       alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//       font: {
//         size: 12, bold: true,
//       }
//     }

//     worksheet.getCell(`A${firstRow}`).border = Border;
//     worksheet.getCell(`A${row - 1}`).border = Border;
//   })

//   worksheet.getRow(row).height = 38
//   worksheet.mergeCells(`A${row}:C${row}`);
//   worksheet.mergeCells(`D${row}:F${row}`);

//   worksheet.getCell(`A${row}`).value = `Tested By: ${Data[0]['Name']}`
//   worksheet.getCell(`D${row}`).value = `Reviewed By: ${Data[0]['ReviewedBy']}`

//   worksheet.getCell(`A${row}`).style = {
//     alignment: { horizontal: 'left', vertical: 'middle', wrapText: true },
//     font: {
//       size: 12, bold: true,
//     }
//   }

//   worksheet.getCell(`D${row}`).style = {
//     alignment: { horizontal: 'left', vertical: 'middle', wrapText: true },
//     font: {
//       size: 12, bold: true,
//     }
//   }

//   worksheet.getCell(`A${row}`).border = Border;
//   worksheet.getCell(`C${row}`).border = Border;
//   worksheet.getCell(`D${row}`).border = Border;
//   worksheet.getCell(`F${row}`).border = Border;

//   //Save the workbook to a file
//   const excelBuffer = await workbook.xlsx.writeBuffer()
//     .then(buffer => {
//       console.log('Excel file generated successfully!');

//       return buffer; // Return the buffer
//     })
//     .catch(error => {
//       console.error('Error generating Excel file:', error);
//     });


//   fs.writeFileSync('output.xlsx', excelBuffer)

// }
//SolderingGenerate();

// const PreLamExcel = async () => {

//   let Data = [{"PreLamId":"035100fa-887a-4d0c-8157-86e3d58e5413", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "Stage":"Laminator", "CheckPoint":"{\"Monitoring of Laminator Process parameter\":\"yy\",\"Adhesive on backsheet of the module\":\"yy\",\"Peel Adhesive Test\":\"yh\",\"Gel Content Test\":\"hh\"}", "Frequency":"{\"Monitoring of Laminator Process parameter\":\"Once per Shift\",\"Adhesive on backsheet of the module\":\"Once per Shift\",\"Peel Adhesive Test\":\"All Position | All Laminator Once a Week\",\"Gel Content Test\":\" All Position | All Laminator once a week \"}", "AcceptanceCriteria":"{\"Monitoring of Laminator Process parameter\":\"Laminator specification GSPL\/IPQC\/LM\/008 |  GSPL\/IPQC\/LM\/009 |  GSPL\/IPQC\/LM\/010\",\"Adhesive on backsheet of the module\":\"Teflon should be clean, No EVA residue is allowed \",\"Peel Adhesive Test\":\"Eva to Glass = 70N\/cm EVA to Backsheet >= 80N\/cm\",\"Gel Content Test\":\"75 to 95% \"}", "Remark":"bh", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"Day", "Line":"Uu", "PONo":"00", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 06:47:21", "UpdatedOn":"01-06-2024 06:47:44", "Status":"Approved", "Type":"PreLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/878e9737-12f2-448a-b9a0-b5bf4a3af94b.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
// {"PreLamId":"0fe280ab-fef5-4d4b-9a3c-2b1f2ac89e52", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "Stage":"Pre lamination EL &Visual", "CheckPoint":"{\"EI Inspection after stringer Number of Stringer\":\"2\",\"EI Inspection after stringer Number of Created Input text \":[{\"PreLaminationEIinspectionrControllers1\":\"ee\"},{\"PreLaminationEIinspectionrControllers2\":\"ee\"},{\"PreLaminationEIinspectionrControllers3\":\"re\"},{\"PreLaminationEIinspectionrControllers4\":\"dr\"},{\"PreLaminationEIinspectionrControllers5\":\"dr\"},{\"PreLaminationEIinspectionrControllers6\":\"ss\"},{\"PreLaminationEIinspectionrControllers7\":\"oo\"},{\"PreLaminationEIinspectionrControllers8\":\"lll\"},{\"PreLaminationEIinspectionrControllers9\":\"pp\"},{\"PreLaminationEIinspectionrControllers10\":\"kk\"}],\"Visual inspection of string  Number of Stringer \":\"2\",\"Visual inspection of string  Number of Created Input text \":[{\"PreLaminationVisualinspectionrControllers1\":\"tt\"},{\"PreLaminationVisualinspectionrControllers2\":\"tt\"},{\"PreLaminationVisualinspectionrControllers3\":\"tt\"},{\"PreLaminationVisualinspectionrControllers4\":\"tt\"},{\"PreLaminationVisualinspectionrControllers5\":\"tt\"},{\"PreLaminationVisualinspectionrControllers6\":\"uu\"},{\"PreLaminationVisualinspectionrControllers7\":\"uu\"},{\"PreLaminationVisualinspectionrControllers8\":\"uu\"},{\"PreLaminationVisualinspectionrControllers9\":\"uu\"},{\"PreLaminationVisualinspectionrControllers10\":\"ii\"}],\"Avaibility of acceptance criteria & WI\":\"hh\"}", "Frequency":"{\"EI Inspection after stringer\":\"5 Pieces Per Shift \",\"Visual inspection of string\":\"5 Pieces Per Shift \",\"Avaibility of acceptance criteria & WI\":\"Once per Shift\"}", "AcceptanceCriteria":"{\"EI Inspection\":\"EI image should fulfil the EL Acceptance Critoria \",\"Visual inspection\":\"Visual image should fulfil the Visual Acceptance Critoria as per GSPL\/IPQC\/EL\/020\",\"Avaibility of acceptance criteria & WI\":\"Avaibility of Acceptance Criteria and operator should be aware of Criteria\"}", "Remark":"hh", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"Day", "Line":"Uu", "PONo":"00", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 06:47:21", "UpdatedOn":"01-06-2024 06:47:44", "Status":"Approved", "Type":"PreLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/878e9737-12f2-448a-b9a0-b5bf4a3af94b.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
// {"PreLamId":"47ade6ee-86ce-4601-a068-189a748e2a68", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "Stage":"Glass side EVA cutting machine", "CheckPoint":"{\"EVA dimension{LengthxWidthxThickness}\":\"vh\",\"Cutting Edge EVA \":\"bh\",\"Position of front EVA\":\"jj\",\"Avability of Specification & WI\":\"jj\"}", "Frequency":"{\"EVA dimension{LengthxWidthxThickness}\":\"Once a Shift\",\"Cutting Edge EVA \":\"Once a Shift\",\"Position of front EVA\":\"Once a Shift\",\"Avability of Specification & WI\":\"Once a Shift\"}", "AcceptanceCriteria":"{\"EVA dimension{LengthxWidthxThickness}\":\"Refer Production order & Module Drawing\",\"Cutting Edge EVA \":\"Should not be uneven\",\"Position of front EVA\":\"Shifting of EVA on Glass not allowed\",\"Avability of Specification & WI\":\"Avability of Specification and WI & operator should be aware with specification\"}", "Remark":"hj", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"Day", "Line":"Uu", "PONo":"00", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 06:47:21", "UpdatedOn":"01-06-2024 06:47:44", "Status":"Approved", "Type":"PreLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/878e9737-12f2-448a-b9a0-b5bf4a3af94b.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
// {"PreLamId":"579e2473-3ab1-49c5-b682-68925749d46d", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "Stage":"Auto Bussing & Tapping", "CheckPoint":"{\"Soldering Peel strength between Ribbon to bushbar interconnector\":\"yy\",\"Terminal busbar to edge of cell\":\"y\",\"soldering quality of Ribbon to busbar\":\"uu\",\"Clearance between RFID&Logo patch to cell in module\":\"uu\",\"Position verification of RFID& Logo Patch on Module\":\"uu\",\"Top & Bottom Creepage Distance\/Terminal busbar to Edge of Glass\":\"hu\",\"quality of auto taping\":\"uu\",\"Avaibility of specification & WI\":\"hh\"}", "Frequency":"{\"Soldering Peel strength between Ribbon to bushbar interconnector\":\"Once per Shift\",\"Terminal busbar to edge of cell\":\"Once per Shift\",\"soldering quality of Ribbon to busbar\":\"Once per Shift\",\"Clearance between RFID&Logo patch to cell in module\":\"Thrice per Shift\",\"Position verification of RFID& Logo Patch on Module\":\"Thrice per Shift\",\"Top & Bottom Creepage Distance\/Terminal busbar to Edge of Glass\":\"Thrice per Shift\",\"quality of auto taping\":\"Once per Shift\",\"Avaibility of specification & WI\":\"Once per Shift\"}", "AcceptanceCriteria":"{\"Soldering Peel strength between Ribbon to bushbar interconnector\":\">=4N | Refer\",\"Terminal busbar to edge of cell\":\"As per respective Layup Drawing\",\"soldering quality of Ribbon to busbar\":\"No Dry Soldering\",\"Clearance between RFID&Logo patch to cell in module\":\"Should not be 2mm-4mm gapfrom the cell to the patch\",\"Position verification of RFID& Logo Patch on Module\":\"Shiould not be tilt,Busbar should not visible\",\"Top & Bottom Creepage Distance\/Terminal busbar to Edge of Glass\":\"creepage distance should be 16+-1mm\",\"quality of auto taping\":\"No poor taping,cell shifting,cell breakage\",\"Avaibility of specification & WI\":\"Avaibility of specification & WI & operator should be aware of specification \"}", "Remark":"hu", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"Day", "Line":"Uu", "PONo":"00", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 06:47:21", "UpdatedOn":"01-06-2024 06:47:44", "Status":"Approved", "Type":"PreLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/878e9737-12f2-448a-b9a0-b5bf4a3af94b.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
// {"PreLamId":"57cd027e-c021-46a9-bd0b-53d5b2783cf0", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "Stage":"Tabber & Stringer", "CheckPoint":"{\"Avaibility os Specification & WI\":\"hh\"}", "Frequency":"{\"Visual Check after stringer\":\"5 string\/stringer\/shift \",\"Visual Check after stringer Number of Stringer\":\"2\",\"Visual Check after stringer Number of Created Input text \":[{\"TabberVisualStringerControllers1\":\"hh\"},{\"TabberVisualStringerControllers2\":\"hh\"},{\"TabberVisualStringerControllers3\":\"hh\"},{\"TabberVisualStringerControllers4\":\"hh\"},{\"TabberVisualStringerControllers5\":\"hh\"},{\"TabberVisualStringerControllers6\":\"hh\"},{\"TabberVisualStringerControllers7\":\"hh\"},{\"TabberVisualStringerControllers8\":\"hh\"},{\"TabberVisualStringerControllers9\":\"hh\"},{\"TabberVisualStringerControllers10\":\"hh\"}],\"EI image of string\":\"5 string\/stringer\/shift \",\"EI image of string  Number of Stringer \":\"1\",\"EI image of string  Number of Created Input text \":[{\"TabberEIimageofStringerControllers1\":\"tt\"},{\"TabberEIimageofStringerControllers2\":\"yy\"},{\"TabberEIimageofStringerControllers3\":\"gg\"},{\"TabberEIimageofStringerControllers4\":\"gg\"},{\"TabberEIimageofStringerControllers5\":\"hh\"}],\"Verification of sildering peel strength\":\"2 string\/stringer\/shift \",\"Verification of sildering peel strength  Number of Stringer \":\"5\",\"Verification of sildering peel strength Created Inputtext\":[{\"TabberVerificationofsilderingControllers1\":\"gg\"},{\"TabberVerificationofsilderingControllers2\":\"gg\"},{\"TabberVerificationofsilderingControllers3\":\"hh\"},{\"TabberVerificationofsilderingControllers4\":\"hh\"},{\"TabberVerificationofsilderingControllers5\":\"hh\"},{\"TabberVerificationofsilderingControllers6\":\"hh\"},{\"TabberVerificationofsilderingControllers7\":\"hh\"},{\"TabberVerificationofsilderingControllers8\":\"hh\"},{\"TabberVerificationofsilderingControllers9\":\"hh\"},{\"TabberVerificationofsilderingControllers10\":\"hh\"}],\"Avaibility os Specification & WI\":\"Once per Shift\"}", "AcceptanceCriteria":"{\"Visual Check after stringer\":\"As per pre Lam Visual Criteria\",\"EI image of string\":\"As per pre Lam EI Criteria \",\"Verification of sildering peel strength\":\">=0.5N  |  Refer:GSPL\/IPQC\/GP\/001\",\"Avaibility os Specification & WI\":\"Avaibility of specification and wi & operator should be aware with specification\"}", "Remark":"hh", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"Day", "Line":"Uu", "PONo":"00", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 06:47:21", "UpdatedOn":"01-06-2024 06:47:44", "Status":"Approved", "Type":"PreLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/878e9737-12f2-448a-b9a0-b5bf4a3af94b.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
// {"PreLamId":"72a85525-8608-4eb0-ac0b-bf92258496f0", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "Stage":"Cell cutting machine", "CheckPoint":"{\"cell Size\":\"ff\",\"Cell manufacture & Eff.\":\"gg\",\"cell color \":\"hh\",\"Avability of Specification & WI.\":\"hh\"}", "Frequency":"{\"cell Size\":\"Thrice per shift\",\"Cell manufacture & Eff.\":\"Thrice per Shift\",\"cell color \":\"Thrice per Shift\",\"Avability of Specification & WI.\":\"Once a Shift\"}", "AcceptanceCriteria":"{\"cell Size\":\"Refere Production Order\",\"Cell manufacture & Eff.\":\"Refer Production Order\",\"cell color \":\"Proper Segregation should be done as per color mixing not allowed\",\"Avability of Specification & WI.\":\"Avaibility of Specification and WI & operator Should be aware with specification \"}", "Remark":"ggg", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"Day", "Line":"Uu", "PONo":"00", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 06:47:21", "UpdatedOn":"01-06-2024 06:47:44", "Status":"Approved", "Type":"PreLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/878e9737-12f2-448a-b9a0-b5bf4a3af94b.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
// {"PreLamId":"739743ae-d8c8-4127-a5c0-e6e66db71f15", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "Stage":"Glass Loader", "CheckPoint":"{\"Glass dimension(LengthxWidthxThickness)\":\"yu\",\"Avaibility of WI\":\"hh\"}", "Frequency":"{\"Glass dimension(LengthxWidthxThickness)\":\"Once a Shift\",\"Avaibility of WI\":\"Once a Shift\"}", "AcceptanceCriteria":"{\"Glass dimension(LengthxWidthxThickness)\":\"Refer Production Order & Module Drawing\",\"Avaibility of WI\":\"Avability of WI & Operator Should be aware with WI\"}", "Remark":"hh", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"Day", "Line":"Uu", "PONo":"00", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 06:47:21", "UpdatedOn":"01-06-2024 06:47:44", "Status":"Approved", "Type":"PreLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/878e9737-12f2-448a-b9a0-b5bf4a3af94b.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
// {"PreLamId":"801c0ab6-3b18-43b3-a891-5e5dc6b986cf", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "Stage":"Temperature & Relative humidity(%RH)monitoring", "CheckPoint":"{\"shop floor Temperature condition\":\"hh\",\"Relative humidity(%RH)in shop floor\":\"hh\"}", "Frequency":"{\"shop floor Temperature condition\":\"Once a Shift\",\"Relative humidity(%RH)in shop floor\":\"Once per Shift\"}", "AcceptanceCriteria":"{\"shop floor Temperature condition\":\"Temperature: 25+\/- \u00B0C\",\"Relative humidity(%RH)in shop floor\":\"Humidity(%RH)<= 60%\"}", "Remark":"hh", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"Day", "Line":"Uu", "PONo":"00", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 06:47:21", "UpdatedOn":"01-06-2024 06:47:44", "Status":"Approved", "Type":"PreLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/878e9737-12f2-448a-b9a0-b5bf4a3af94b.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
// {"PreLamId":"86a9e30d-a6d3-40f9-bdb7-0d630ec6358e", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "Stage":"String Rework station", "CheckPoint":"{\"Avaibility of work instruvtion(WI)\":\"ty\",\"Cleaning of Rework station\/soldering iron sponge\":\"gg\"}", "Frequency":"{\"Avaibility of work instruvtion(WI)\":\"Once per Shift\",\"Cleaning of Rework station\/soldering iron sponge\":\"Once per Shift\"}", "AcceptanceCriteria":"{\"Avaibility of work instruvtion(WI)\":\"WI Should be available at station and operator should be aware of WI\",\"Cleaning of Rework station\/soldering iron sponge\":\"Rework Station should be Clean\"}", "Remark":"hh", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"Day", "Line":"Uu", "PONo":"00", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 06:47:21", "UpdatedOn":"01-06-2024 06:47:44", "Status":"Approved", "Type":"PreLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/878e9737-12f2-448a-b9a0-b5bf4a3af94b.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
// {"PreLamId":"8f53e47c-2d29-4187-9f88-02009ce144da", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "Stage":"Cell Loading", "CheckPoint":"{\"cellcolor\":\"gh\",\"cleanlines of cell Loading Area \":\"hh\",\"Cell loading as per WI\":\"jj\",\"Avability of WI \":\"jj\",\"Verification of process parameter\":\"jj\"}", "Frequency":"{\"cell color\":\"Thrice per Shift\",\"cleanlines of cell Loading Area \":\"Once per Shift\",\"Cell loading as per WI\":\"Once Per Shift\",\"Avability of WI \":\"Once per Shift \",\"Verification of process parameter\":\"Once per Shift\",\"string length & cell to cell gap\":\"5 string\/stringer\/shift \",\"string length Number of String\":\"2\",\"string length Number of String Number of Created Input text\":[{\"cellLoaderVerificationControllers1\":\"hh\"},{\"cellLoaderVerificationControllers2\":\"hh\"},{\"cellLoaderVerificationControllers3\":\"hh\"},{\"cellLoaderVerificationControllers4\":\"hh\"},{\"cellLoaderVerificationControllers5\":\"hh\"},{\"cellLoaderVerificationControllers6\":\"hh\"},{\"cellLoaderVerificationControllers7\":\"hh\"},{\"cellLoaderVerificationControllers8\":\"hh\"},{\"cellLoaderVerificationControllers9\":\"hh\"},{\"cellLoaderVerificationControllers10\":\"jj\"}]}", "AcceptanceCriteria":"{\"cell color\":\"Different Color of cell loading at a time not allowed\",\"cleanlines of cell Loading Area \":\"no unwanted or waste material should be near cell Loading Area\",\"Cell loading as per WI\":\"As per WI\",\"Avability of WI \":\"Avability of WI & Operator should be aware with WI\",\"Verification of process parameter\":\"As pe Machine per Specification \",\"string length & cell to cell gap\":\"Refer Production Order 7 Module Drawing\"}", "Remark":"jj", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"Day", "Line":"Uu", "PONo":"00", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 06:47:21", "UpdatedOn":"01-06-2024 06:47:44", "Status":"Approved", "Type":"PreLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/878e9737-12f2-448a-b9a0-b5bf4a3af94b.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
// {"PreLamId":"97dce91b-ba83-42ae-b1d9-526e9fcbd0bf", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "Stage":"Auto String Layup", "CheckPoint":"{\"Cell to cell gap\":\"666\",\"String to string gap\":\"yu\",\"cell edge to glass edge(Top,bottom & sides)\":\"uu\"}", "Frequency":"{\"Cell to cell gap\":\"Once per Shift\",\"String to string gap\":\"Once per Shift\",\"cell edge to glass edge(Top,bottom & sides)\":\"Once per Shift\"}", "AcceptanceCriteria":"{\"Cell to cell gap\":\"None\",\"String to string gap\":\"None\",\"cell edge to glass edge(Top,bottom & sides)\":\"None\"}", "Remark":"yu", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"Day", "Line":"Uu", "PONo":"00", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 06:47:21", "UpdatedOn":"01-06-2024 06:47:44", "Status":"Approved", "Type":"PreLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/878e9737-12f2-448a-b9a0-b5bf4a3af94b.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
// {"PreLamId":"a57bb2b8-5937-40bb-a1c1-df68a90709ae", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "Stage":"Module Rework Station", "CheckPoint":"{\"Avaibility of work instruvtion(WI)\":\"gg\",\"Method of Rework\":\"gg\",\"Handling of Modules\":\"hh\",\"Cleaning of Rework station\/soldering iron sponge\":\"hh\"}", "Frequency":"{\"Avaibility of work instruvtion(WI)\":\"Once per Shift\",\"Method of Rework\":\"Once per Shift\",\"Handling of Modules\":\"Once per Shift\",\"Cleaning of Rework station\/soldering iron sponge\":\"Once per Shift\"}", "AcceptanceCriteria":"{\"Avaibility of work instruvtion(WI)\":\"WI Should be available at station and operator should be aware of WI\",\"Method of Rework\":\"As per WI\",\"Handling of Modules\":\"Operator Should handle the rework module with both the Hands\",\"Cleaning of Rework station\/soldering iron sponge\":\"Rework station should be clean\"}", "Remark":"hh", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"Day", "Line":"Uu", "PONo":"00", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 06:47:21", "UpdatedOn":"01-06-2024 06:47:44", "Status":"Approved", "Type":"PreLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/878e9737-12f2-448a-b9a0-b5bf4a3af94b.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
// {"PreLamId":"b5e28708-c0c2-485a-8316-590ce46348a1", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "Stage":"EVA\/Backsheet cutting", "CheckPoint":"{\"Rear EVA dimension & sift cutting width(mm)\":\"gg\",\"Back-sheet dimension& slit cutting diameter\":\"hu\",\"cutting Edge of Rear EVA & Backsheet on Glass\":\"hu\",\"Position of Back EVA & Backsheet on Glass\":\"hu\",\"Avaibility of specification&wI.\":\"hu\"}", "Frequency":"{\"Rear EVA dimension & sift cutting width(mm)\":\"Once per Shift\",\"Back-sheet dimension& slit cutting diameter\":\"Once per Shift\",\"cutting Edge of Rear EVA & Backsheet on Glass\":\"Once per Shift\",\"Position of Back EVA & Backsheet on Glass\":\"Once per Shift\",\"Avaibility of acceptance criteria & WI\":\"Once per Shift\"}", "AcceptanceCriteria":"{\"Rear EVA dimension & sift cutting width(mm)\":\"As per Specification GSPL\/EVA(IQC)\/001 & production order\",\"Back-sheet dimension& slit cutting diameter\":\"As per Specification GSPL\/BS(IQC)\/001 & production order\",\"cutting Edge of Rear EVA & Backsheet on Glass\":\"Should not be uneven\",\"Position of Back EVA & Backsheet on Glass\":\"Shifting of EVA on Glass not allowed\",\"Avaibility of specification&wI.\":\"hu\"}", "Remark":"hu", "PreLamDetailId":"878e9737-12f2-448a-b9a0-b5bf4a3af94b", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"Day", "Line":"Uu", "PONo":"00", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 06:47:21", "UpdatedOn":"01-06-2024 06:47:44", "Status":"Approved", "Type":"PreLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/878e9737-12f2-448a-b9a0-b5bf4a3af94b.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null}]


  


//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet('PreLam');
//   let Style = ({size, bold, horizontal = 'center', vertical = 'middle'})=>{

//    let style =  {
//       alignment: { horizontal: horizontal, vertical: vertical, wrapText: true },
//       font: {
//         size: size, bold: bold
//       }
//     }
//     return style;
//   }

//   let Style2 = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 22, bold: false
//     }
//   }

//   let MatrixData = [{
//     'Date': Data[0]['Date'],
//     'Shift': Data[0]['Shift'],
//     'Acceptance Crieteria': ">-4N"
//   },
//   {
//     'Line': Data[0]['Line'],
//     'Buusing Stage': Data[0]['BussingStage'],
//     'Operator Name': Data[0]['OperatorName'],
//   },
//   {
//     'Ribbon Width': Data[0]['Line'],
//     'Busbar Width': Data[0]['BussingStage'],
//     'Result': "NA",
//   }]
//   let Border = {
//     top: { style: 'thin' },
//     bottom: { style: 'thin' },
//     left: { style: 'thin' },
//     right: { style: 'thin' }
//   }




//   /**Merging Cells */
//   worksheet.mergeCells('A1:I2')
//   worksheet.mergeCells('J1:L1')
//   worksheet.mergeCells('A3:I3')
//   worksheet.mergeCells('J2:L2')
//   worksheet.mergeCells('J3:L3')




//   /**putting value in cell */
//   worksheet.getCell('J1').value = 'Page No.1';
//   worksheet.getCell('A1').value = 'Gautam Solar Pvt. Ltd';
//   worksheet.getCell('A3').value = `IPQC Check Sheet`;
//   worksheet.getCell('J2').value = `Doc No. ${Data[0]['DocNo']}`;
//   worksheet.getCell('J3').value = `Rev No. ${Data[0]['RevNo']}`;
 


//   /**Giving Style to Cell */
//   worksheet.getCell('J1').style = {
//     alignment: { horizontal: 'center', vertical: 'middle' },
//     font: {
//       size: 11, bold: true, italic: false
//     }
//   }

//   worksheet.getCell('A3').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 15, bold: true
//     }
//   }

//   worksheet.getCell('A1').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 22, bold: true
//     }
//   }

//   worksheet.getCell('J2').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 11, bold: true
//     }
//   }
//   worksheet.getCell('J3').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 11, bold: true
//     }
//   }
  
// /**Border */
// worksheet.getCell('A1').border = Border;
// worksheet.getCell('I2').border = Border;
// worksheet.getCell('J1').border = Border;
// worksheet.getCell('L1').border = Border;
// worksheet.getCell('J2').border = Border;
// worksheet.getCell('L2').border = Border;
// worksheet.getCell('J3').border = Border;
// worksheet.getCell('L3').border = Border;
// worksheet.getCell('A3').border = Border;
// worksheet.getCell('I3').border = Border;
//   /**Height */
//   worksheet.getRow(1).height = 15;
//   worksheet.getRow(2).height = 27;
//   worksheet.getRow(3).height = 33;
//   worksheet.getRow(4).height = 25;
//   worksheet.getRow(5).height = 20;

//   worksheet.mergeCells('A4:B4')
//   worksheet.mergeCells('C4:D4')
//   worksheet.mergeCells('E4:F4')
//   worksheet.mergeCells('G4:L4')

//   worksheet.getCell('A4').value = `Date: ${Data[0]['Date']}`;
//   worksheet.getCell('C4').value = `Shift: ${Data[0]['Shift']}`;
//   worksheet.getCell('E4').value = `Line: ${Data[0]['Line']}`;
//   worksheet.getCell('G4').value = `PO No: ${Data[0]['PONo']}`;


//   worksheet.getCell('A4').style = Style({size:'12',bold:true});
//   worksheet.getCell('C4').style = Style({size:'12',bold:true})
//   worksheet.getCell('E4').style = Style({size:'12',bold:true})
//   worksheet.getCell('G4').style = Style({size:'12',bold:true})


//   worksheet.getCell('A4').border = Border;
//   worksheet.getCell('C4').border = Border;
//   worksheet.getCell('E4').border = Border;
//   worksheet.getCell('G4').border = Border;
//   worksheet.getCell('B4').border = Border;
//   worksheet.getCell('D4').border = Border;
//   worksheet.getCell('F4').border = Border;
//   worksheet.getCell('L4').border = Border;

//   worksheet.getColumn('G').width = 16;
//   worksheet.getColumn('H').width = 16;
//   worksheet.getColumn('I').width = 16;
//   worksheet.getColumn('E').width = 20;
//   worksheet.getColumn('F').width = 20;
//   worksheet.getColumn('C').width = 20;
//   worksheet.getColumn('D').width = 20;

//   worksheet.mergeCells('A5:B5')
//   worksheet.mergeCells('C5:D5')
//   worksheet.mergeCells('J5:L5')
//   worksheet.mergeCells('G5:I5')

//   worksheet.getCell('A5').value = `Stage`;
//   worksheet.getCell('C5').value = `Check Point`;
//   worksheet.getCell('E5').value = `Frequency`;
//   worksheet.getCell('F5').value = `Acceptance Criteria`;
//   worksheet.getCell('J5').value = `Remarks`;
//   worksheet.getCell('G5').value = `Observation`;


//   worksheet.getCell('A5').style = Style({size:'12',bold:true});
//   worksheet.getCell('C5').style = Style({size:'12',bold:true});
//   worksheet.getCell('E5').style = Style({size:'12',bold:true});
//   worksheet.getCell('F5').style = Style({size:'12',bold:true});
//   worksheet.getCell('J5').style = Style({size:'12',bold:true});
//   worksheet.getCell('G5').style = Style({size:'12',bold:true});


//   worksheet.getCell('A5').border = Border;
//   worksheet.getCell('C5').border = Border;
//   worksheet.getCell('E5').border = Border;
//   worksheet.getCell('F5').border = Border;
//   worksheet.getCell('J5').border = Border;
//   worksheet.getCell('G5').border = Border;
//   worksheet.getCell('B5').border = Border;
//   worksheet.getCell('D5').border = Border;
//   worksheet.getCell('L5').border = Border;
//   worksheet.getCell('I5').border = Border;
  
//   let Row = 6;

//   Data.forEach((data, i)=>{
//     data['CheckPoint'] = JSON.parse(data['CheckPoint'])
//     data['AcceptanceCriteria'] = JSON.parse(data['AcceptanceCriteria'])
//     data['Frequency'] = JSON.parse(data['Frequency'])
//     console.log(i,data['Stage'])
//     console.log('Checkpoint',i,data['CheckPoint'])
//     console.log('Acceptance',i,data['AcceptanceCriteria'])
//     console.log('Frequency',i,data['Frequency'])
  
//     function FindValue(temp){
//       let string = ''
    
//        temp.forEach((el,i)=>{
//         for(key in el){
//            string+=`TS0${i+1}: ${el[key]} |`;
//         } 
        
//        })

//        return string;

//     }
//     if(data['Stage'] == 'EVA/Backsheet cutting' || data['Stage'] == 'Laminator' || data['Stage'] == 'Glass Loader' || data['Stage'] == 'Module Rework Station' || data['Stage'] == 'Temperature & Relative humidity(%RH)monitoring' || i == 'Laminator' || data['Stage'] == 'Auto Bussing & Tapping' || data['Stage'] == 'String Rework station' || data['Stage'] == 'Glass side EVA cutting machine' || data['Stage'] == 'Cell cutting machine' || data['Stage'] == 'Auto String Layup'){
   
//       let intialRow = Row
      
//        for(let key in data['CheckPoint']){
//            worksheet.getRow(Row).height = 40
//            worksheet.mergeCells(`C${Row}:D${Row}`)
//            worksheet.getCell(`C${Row}`).value = key;
//            worksheet.getCell(`C${Row}`).style = Style({size:10, bold:true});
//            worksheet.getCell(`C${Row}`).border = Border;
//            worksheet.getCell(`D${Row}`).border = Border;

//            worksheet.mergeCells(`G${Row}:I${Row}`)
//            worksheet.getCell(`G${Row}`).value = data['CheckPoint'][key];
//            worksheet.getCell(`G${Row}`).style = Style({size:10, bold:false});
//            worksheet.getCell(`G${Row}`).border = Border;
//            worksheet.getCell(`I${Row}`).border = Border;

//            worksheet.getCell(`E${Row}`).value = key == 'Avaibility of specification&wI.'?data['Frequency']['Avaibility of acceptance criteria & WI']:data['Frequency'][key];
//            worksheet.getCell(`E${Row}`).style = Style({size:8, bold:true});
//            worksheet.getCell(`E${Row}`).border = Border;

//            worksheet.getCell(`F${Row}`).value = data['AcceptanceCriteria'][key];
//            worksheet.getCell(`F${Row}`).style = Style({size:8, bold:true});
//            worksheet.getCell(`F${Row}`).border = Border;
//            Row++;
//        }
     
//       worksheet.mergeCells(`A${intialRow}:B${Row-1}`)
//       worksheet.getCell(`A${intialRow}`).value = data['Stage']
//       worksheet.getCell(`A${intialRow}`).style = Style({size:12, bold:true});
//       worksheet.getCell(`A${intialRow}`).border = Border;
//       worksheet.getCell(`B${Row-1}`).border = Border;

//       worksheet.mergeCells(`J${intialRow}:L${Row-1}`)
//       worksheet.getCell(`J${intialRow}`).value = data['Remark'];
//       worksheet.getCell(`J${intialRow}`).style = Style({size:12, bold:true});
//       worksheet.getCell(`J${intialRow}`).border = Border;
//       worksheet.getCell(`L${Row-1}`).border = Border;

//     }else if(data['Stage'] == 'Pre lamination EL &Visual'){
//       let intialRow = Row

//       for(let key in data['AcceptanceCriteria']){
//         let tempValue = ''
//         worksheet.getRow(Row).height = 40
//         worksheet.mergeCells(`C${Row}:D${Row}`)
//         worksheet.getCell(`C${Row}`).value = key;
//         worksheet.getCell(`C${Row}`).style = Style({size:10, bold:true});
//         worksheet.getCell(`C${Row}`).border = Border;
//         worksheet.getCell(`D${Row}`).border = Border;

//         worksheet.mergeCells(`G${Row}:I${Row}`)
//         worksheet.getCell(`G${Row}`).value = key == 'EI Inspection'?FindValue(data['CheckPoint']['EI Inspection after stringer Number of Created Input text '])
//         :key == 'Visual inspection'?FindValue(data['CheckPoint']['Visual inspection of string  Number of Created Input text ']):data['CheckPoint'][key] ;

//         worksheet.getCell(`G${Row}`).style = Style({size:8, bold:true});
//         worksheet.getCell(`G${Row}`).border = Border;
//         worksheet.getCell(`I${Row}`).border = Border;

//         worksheet.getCell(`E${Row}`).value = key == 'EI Inspection'? data['Frequency']['EI Inspection after stringer']:key == 'Visual inspection'? data['Frequency']['Visual inspection of string']:data['Frequency'][key]
//         worksheet.getCell(`E${Row}`).style = Style({size:8, bold:true});
//         worksheet.getCell(`E${Row}`).border = Border;

//         worksheet.getCell(`F${Row}`).value = data['AcceptanceCriteria'][key];
//         worksheet.getCell(`F${Row}`).style = Style({size:8, bold:true});
//         worksheet.getCell(`F${Row}`).border = Border;
//         Row++;
//     }
//     worksheet.mergeCells(`A${intialRow}:B${Row-1}`)
//     worksheet.getCell(`A${intialRow}`).value = data['Stage']
//     worksheet.getCell(`A${intialRow}`).style = Style({size:12, bold:true});
//     worksheet.getCell(`A${intialRow}`).border = Border;
//     worksheet.getCell(`B${Row-1}`).border = Border;

//     worksheet.mergeCells(`J${intialRow}:L${Row-1}`)
//     worksheet.getCell(`J${intialRow}`).value = data['Remark'];
//     worksheet.getCell(`J${intialRow}`).style = Style({size:12, bold:true});
//     worksheet.getCell(`J${intialRow}`).border = Border;
//     worksheet.getCell(`L${Row-1}`).border = Border;

//     }else if(data['Stage'] == 'Tabber & Stringer'){

//       let intialRow = Row

//       for(let key in data['AcceptanceCriteria']){
//         let tempValue = ''
//         worksheet.getRow(Row).height = 40
//         worksheet.mergeCells(`C${Row}:D${Row}`)
//         worksheet.getCell(`C${Row}`).value = key;
//         worksheet.getCell(`C${Row}`).style = Style({size:10, bold:true});
//         worksheet.getCell(`C${Row}`).border = Border;
//         worksheet.getCell(`D${Row}`).border = Border;

//         worksheet.mergeCells(`G${Row}:I${Row}`)
//         worksheet.getCell(`G${Row}`).value = key == 'Visual Check after stringer'?FindValue(data['Frequency']['Visual Check after stringer Number of Created Input text '])
//         :key == 'EI image of string'?FindValue(data['Frequency']['EI image of string  Number of Created Input text ']):key == 'Verification of sildering peel strength'?FindValue(data['Frequency']['Verification of sildering peel strength Created Inputtext']):data['CheckPoint'][key] ;

//         worksheet.getCell(`G${Row}`).style = Style({size:8, bold:true});
//         worksheet.getCell(`G${Row}`).border = Border;
//         worksheet.getCell(`I${Row}`).border = Border;

//         worksheet.getCell(`E${Row}`).value = key == 'Visual Check after stringer'?data['Frequency']['Visual Check after stringer']
//         :key == 'EI image of string'?data['Frequency'][key]:key == 'Verification of sildering peel strength'?data['Frequency'][key]:data['Frequency'][key] ;
//         worksheet.getCell(`E${Row}`).style = Style({size:8, bold:true});
//         worksheet.getCell(`E${Row}`).border = Border;

//         worksheet.getCell(`F${Row}`).value = data['AcceptanceCriteria'][key];
//         worksheet.getCell(`F${Row}`).style = Style({size:8, bold:true});
//         worksheet.getCell(`F${Row}`).border = Border;
//         Row++;
//     }
//     worksheet.mergeCells(`A${intialRow}:B${Row-1}`)
//     worksheet.getCell(`A${intialRow}`).value = data['Stage']
//     worksheet.getCell(`A${intialRow}`).style = Style({size:12, bold:true});
//     worksheet.getCell(`A${intialRow}`).border = Border;
//     worksheet.getCell(`B${Row-1}`).border = Border;

//     worksheet.mergeCells(`J${intialRow}:L${Row-1}`)
//     worksheet.getCell(`J${intialRow}`).value = data['Remark'];
//     worksheet.getCell(`J${intialRow}`).style = Style({size:12, bold:true});
//     worksheet.getCell(`J${intialRow}`).border = Border;
//     worksheet.getCell(`L${Row-1}`).border = Border;

//     }else if(data['Stage'] == 'Cell Loading'){
//       let intialRow = Row

//       for(let key in data['AcceptanceCriteria']){
//         let tempValue = ''
//         worksheet.getRow(Row).height = 40
//         worksheet.mergeCells(`C${Row}:D${Row}`)
//         worksheet.getCell(`C${Row}`).value = key;
//         worksheet.getCell(`C${Row}`).style = Style({size:10, bold:true});
//         worksheet.getCell(`C${Row}`).border = Border;
//         worksheet.getCell(`D${Row}`).border = Border;


//         /**Observation */
//         worksheet.mergeCells(`G${Row}:I${Row}`)
//         worksheet.getCell(`G${Row}`).value = key == 'string length & cell to cell gap'?FindValue(data['Frequency']['string length Number of String Number of Created Input text']):data['CheckPoint'][key == 'cell color'?'cellcolor':key];

//         worksheet.getCell(`G${Row}`).style = Style({size:8, bold:true});
//         worksheet.getCell(`G${Row}`).border = Border;
//         worksheet.getCell(`I${Row}`).border = Border;

//         /**Freq */
//         worksheet.getCell(`E${Row}`).value = data['Frequency'][key]
//         worksheet.getCell(`E${Row}`).style = Style({size:8, bold:true});
//         worksheet.getCell(`E${Row}`).border = Border;

//         /**acceptance */
//         worksheet.getCell(`F${Row}`).value = data['AcceptanceCriteria'][key];
//         worksheet.getCell(`F${Row}`).style = Style({size:8, bold:true});
//         worksheet.getCell(`F${Row}`).border = Border;
//         Row++;
//     }
//     worksheet.mergeCells(`A${intialRow}:B${Row-1}`)
//     worksheet.getCell(`A${intialRow}`).value = data['Stage']
//     worksheet.getCell(`A${intialRow}`).style = Style({size:12, bold:true});
//     worksheet.getCell(`A${intialRow}`).border = Border;
//     worksheet.getCell(`B${Row-1}`).border = Border;

//     worksheet.mergeCells(`J${intialRow}:L${Row-1}`)
//     worksheet.getCell(`J${intialRow}`).value = data['Remark'];
//     worksheet.getCell(`J${intialRow}`).style = Style({size:12, bold:true});
//     worksheet.getCell(`J${intialRow}`).border = Border;
//     worksheet.getCell(`L${Row-1}`).border = Border;

//     }
//   })

//   worksheet.getRow(Row).height = 48;

//   worksheet.mergeCells(`A${Row}:E${Row}`)
//   worksheet.getCell(`A${Row}`).value = `Audited By: ${Data[0]['Name']}`;
//   worksheet.getCell(`A${Row}`).style = Style({size:12, bold:true, horizontal:'left'});
//   worksheet.getCell(`A${Row}`).border = Border;
//   worksheet.getCell(`E${Row}`).border = Border;


//   worksheet.mergeCells(`F${Row}:L${Row}`)
//   worksheet.getCell(`F${Row}`).value = `Reviewed By: ${Data[0]['ReviewedBy'] || 'Unknown'}`;
//   worksheet.getCell(`F${Row}`).style = Style({size:12, bold:true, horizontal:'left'});
//   worksheet.getCell(`F${Row}`).border = Border;
//   worksheet.getCell(`L${Row}`).border = Border;

//   //Save the workbook to a file
//   const excelBuffer = await workbook.xlsx.writeBuffer()
//     .then(buffer => {
//       console.log('Excel file generated successfully!');

//       return buffer; // Return the buffer
//     })
//     .catch(error => {
//       console.error('Error generating Excel file:', error);
//     });


//   fs.writeFileSync('output.xlsx', excelBuffer)

// }

// const PostLamExcel = async () => {

//   let Data = [{"PreLamId":"0a040a55-d4bc-4e52-8760-28ce80be2b1d", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "Stage":"Final EL TEST", "CheckPoint":"{\"Avaibillity of WI\":\"bb\",\"Voltage & Current Verification in DC power supply\":\"bb\",\"EL Defect\":{\"Observation 1\":\"bb\",\"Observation 2\":\"bb\",\"Observation 3\":\"bb\",\"Observation 4\":\"bb\",\"Observation 5\":\"bb\"}}", "Frequency":"{\"Avaibillity of WI\":\"Once a Shift\",\"Voltage & Current Verification in DC power supply\":\"Once a Shift\",\"EL Defect\":\"5 Piece per Shift\"}", "AcceptanceCriteria":"{\"Avaibillity of WI\":\"Must be Present\",\"Voltage & Current Verification in DC power supply\":\"As per Voc & Isc\",\"EL Defect\":\"As per GSPL\/IPQC\/EL\/020\"}", "Remark":"", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"vv", "Line":"hh", "PONo":"bb", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 11:28:40", "UpdatedOn":"01-06-2024 11:29:11", "Status":"Approved", "Type":"PostLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/b6fbb530-3ddb-4046-92ce-078c7a848426.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
//   {"PreLamId":"1242c713-6b68-4321-91a6-a592c51d2904", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "Stage":"Hipot", "CheckPoint":"{\"Avaibillity of WI\":\"bb\",\"parameter\":\"bh\",\"DCW-4.0KV\":{\"Observation 1\":\"hb\",\"Observation 2\":\"bb\",\"Observation 3\":\"bb\",\"Observation 4\":\"bb\",\"Observation 5\":\"bb\"},\"IR-2.5KV\":{\"Observation 1\":\"bh\",\"Observation 2\":\"bb\",\"Observation 3\":\"bb\",\"Observation 4\":\"bbb\",\"Observation 5\":\"bbb\"},\"Ground Continuity-62.5A\":{\"Observation 1\":\"bb\",\"Observation 2\":\"bb\",\"Observation 3\":\"bb\",\"Observation 4\":\"bb\",\"Observation 5\":\"bb\"}}", "Frequency":"{\"Avaibillity of WI\":\"Once a Shift\",\"parameter\":\"Once a Shift\",\"DCW-4.0KV\":\"5 Piece per Shift\",\"IR-1.5 KV\":\"5 Piece per Shift\",\"Ground Continuity-62.5A\":\"5 Piece per Shift\"}", "AcceptanceCriteria":"{\"Avaibillity of WI\":\"Must be Present\",\"parameter\":\"As per UL\/As per IEC\",\"DCW-4.0KV\":\"As per GSPL technical Specification\",\"IR-1.5 KV\":\"As per GSPL technical Specification\",\"Ground Continuity-62.5A\":\"As per GSPL technical Specification\"}", "Remark":"", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"vv", "Line":"hh", "PONo":"bb", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 11:28:40", "UpdatedOn":"01-06-2024 11:29:11", "Status":"Approved", "Type":"PostLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/b6fbb530-3ddb-4046-92ce-078c7a848426.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
//   {"PreLamId":"17224e68-1c57-48f9-af1d-d454788898f7", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "Stage":"Cleaning", "CheckPoint":"{\"Avaibillity of WI\":\"bb\",\"Module should be free from -Protective Film,Scratches on Frame-Backsheet,Corner cleaning of module,Silicon Sealant glue\/backsheet,frame cleaning,jb cleaning,No burr\":{\"Observation 1\":\"bb\",\"Observation 2\":\"bb\",\"Observation 3\":\"bb\",\"Observation 4\":\"bb\",\"Observation 5\":\"bb\"}}", "Frequency":"{\"Avaibillity of WI\":\"Once a Shift\",\"Module should be free from -Protective Film,Scratches on Frame-Backsheet,Corner cleaning of module,Silicon Sealant glue\/backsheet,frame cleaning,jb cleaning,No burr\":\"5 Piece per Shift\"}", "AcceptanceCriteria":"{\"Avaibillity of WI\":\"Must be Present\",\"Module should be free from -Protective Film,Scratches on Frame-Backsheet,Corner cleaning of module,Silicon Sealant glue\/backsheet,frame cleaning,jb cleaning,No burr\":\"As per visual inspection criteria Annexure-A8\"}", "Remark":"", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"vv", "Line":"hh", "PONo":"bb", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 11:28:40", "UpdatedOn":"01-06-2024 11:29:11", "Status":"Approved", "Type":"PostLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/b6fbb530-3ddb-4046-92ce-078c7a848426.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
//   {"PreLamId":"1db03f8d-3be0-402d-91d7-099d46f9a41b", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "Stage":"Back Label", "CheckPoint":"{\"Data Verification\":{\"Observation 1\":\"bh\",\"Observation 2\":\"bh\",\"Observation 3\":\"bb\",\"Observation 4\":\"bb\",\"Observation 5\":\"bh\"},\"Air Bubbles,Tilt & Misprint\":{\"Observation 1\":\"bb\",\"Observation 2\":\"bb\",\"Observation 3\":\"bb\",\"Observation 4\":\"hh\",\"Observation 5\":\"bb\"}}", "Frequency":"{\"Data Verification\":\"5 Piece per  Shift\",\"Air Bubbles,Tilt & Misprint\":\"5 Piece per Shift\"}", "AcceptanceCriteria":"{\"Data Verification\":\"As per Datasheet\/process card\",\"Air Bubbles,Tilt & Misprint\":\"Not Acceptable\"}", "Remark":"", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"vv", "Line":"hh", "PONo":"bb", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 11:28:40", "UpdatedOn":"01-06-2024 11:29:11", "Status":"Approved", "Type":"PostLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/b6fbb530-3ddb-4046-92ce-078c7a848426.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
//   {"PreLamId":"4c3e1264-52dc-4ec4-a895-ad8497270aae", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "Stage":"Final Visual Inspection", "CheckPoint":"{\"Visual inspection\":{\"Observation 1\":\"hh\",\"Observation 2\":\"bb\",\"Observation 3\":\"hh\",\"Observation 4\":\"bh\",\"Observation 5\":\"bh\"},\"Fitment of JB cover\":{\"Observation 1\":\"bh\",\"Observation 2\":\"bh\",\"Observation 3\":\"vv\",\"Observation 4\":\"bh\",\"Observation 5\":\"bh\"},\"Availability of acceptance Criteri & WI\":\"bb\"}", "Frequency":"{\"Visual inspection\":\"5 Piece per  Shift\",\"Fitment of JB cover\":\"5 Piece per Shift\",\"Availability of acceptance Criteri & WI\":\"Once per Shift\"}", "AcceptanceCriteria":"{\"Visual inspection\":\"As per Visual Inspection criteria GSPl\/IPQC\/VI\/021\",\"Fitment of JB cover\":\"Partial fitment of JB cover not allowed\",\"Availability of acceptance Criteri & WI\":\"Must be present\"}", "Remark":"", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"vv", "Line":"hh", "PONo":"bb", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 11:28:40", "UpdatedOn":"01-06-2024 11:29:11", "Status":"Approved", "Type":"PostLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/b6fbb530-3ddb-4046-92ce-078c7a848426.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
//   {"PreLamId":"4e1a4d73-2a79-45c6-adea-8fd71a8aa550", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "Stage":"Packaging", "CheckPoint":"{\"Barcode Defects(unclear\/duplication)\":{\"Observation 1\":\"bh\",\"Observation 2\":\"vv\",\"Observation 3\":\"bh\",\"Observation 4\":\"vh\",\"Observation 5\":\"bh\"},\"Packing Label & Contents\":{\"Observation 1\":\"gg\",\"Observation 2\":\"bb\",\"Observation 3\":\"vv\",\"Observation 4\":\"vv\",\"Observation 5\":\"gg\"},\"Box Condition\":{\"Observation 1\":\"hh\",\"Observation 2\":\"gg\",\"Observation 3\":\"gg\",\"Observation 4\":\"vv\",\"Observation 5\":\"gg\"},\"Stretch wrapping\":{\"Observation 1\":\"hh\",\"Observation 2\":\"bb\",\"Observation 3\":\"bb\",\"Observation 4\":\"bh\",\"Observation 5\":\"bh\"}}", "Frequency":"{\"Barcode Defects(unclear\/duplication)\":\"5 Piece per  Shift\",\"Packing Label & Contents\":\"5 box per Shift\",\"Box Condition\":\"5 Box per Shift\",\"Stretch wrapping\":\"5 Box per Shift\"}", "AcceptanceCriteria":"{\"Barcode Defects(unclear\/duplication)\":\"As per GSPL\/FQC\/PV\/001\",\"Packing Label & Contents\":\"As per GSPL\/FQC\/PV\/001\",\"Box Condition\":\"No Damage\/Dull printing\",\"Stretch wrapping\":\"Should be all around\"}", "Remark":"", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"vv", "Line":"hh", "PONo":"bb", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 11:28:40", "UpdatedOn":"01-06-2024 11:29:11", "Status":"Approved", "Type":"PostLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/b6fbb530-3ddb-4046-92ce-078c7a848426.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
//   {"PreLamId":"50b73bc6-1e89-4fb0-886d-495e90e04874", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "Stage":"Curing", "CheckPoint":"{\"Avaibility of WI\":\"b \",\"Curing Time\":\"bb\",\"Temperature & Humidity\":\"bb\"}", "Frequency":"{\"Avaibility of WI\":\"Once a Shift\",\"Curing Time\":\"Continuos\",\"Temperature & Humidity\":\"Once a Shift\"}", "AcceptanceCriteria":"{\"Avaibility of WI\":\"Must be Present\",\"Curing Time\":\">=4Hr\",\"Temperature & Humidity\":\"25+-5oc &>=50%RH\"}", "Remark":"", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"vv", "Line":"hh", "PONo":"bb", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 11:28:40", "UpdatedOn":"01-06-2024 11:29:11", "Status":"Approved", "Type":"PostLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/b6fbb530-3ddb-4046-92ce-078c7a848426.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
//   {"PreLamId":"5d148ec6-3b6d-4fb1-8c0f-a9661286edf3", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "Stage":"Sun Simulator Calibration", "CheckPoint":"{\"Avaibillity of WI\":\"bb\",\"Temperature\":\"bh\",\"Irradiance\":\"hh\",\"Each sun simulator validated after every four hours using valid silver reference PV module\":{\"Inspection First\":{\"Time\":\"bh\",\"Room Temp\":\"bh\",\"Module Temp\":\"bh\",\"Module Id\":\"bh\"},\"Inspection Second\":{\"Time\":\"bh\",\"Room Temp\":\"bb\",\"Module Temp\":\"bb\",\"Module Id\":\"bb\"},\"Inspection Third\":{\"Time\":\"bb\",\"Room Temp\":\"bh\",\"Module Temp\":\"bh\",\"Module Id\":\"bb\"}},\"Last Validation or calibration date and time\":{\"First Inspection\":\"bb\",\"Second Inspection\":\"bb\",\"Third Inspection\":\"bb\"},\"Expiry Date of Silver Module Verification\":\"bb\"}", "Frequency":"{\"Avaibillity of WI\":\"Once a Shift\",\"Temperature\":\"Once a Shift\",\"Irradiance\":\"Once a Shift\",\"Each sun simulator validated after every four hours using valid silver reference PV module\":\"Every Four Hour\",\"Last Validation or calibration date and time\":\"Every Four Hour\",\"Expiry Date of Silver Module Verification\":\"Once a Shift\"}", "AcceptanceCriteria":"{\"Avaibillity of WI\":\"Must be Present\",\"Temperature\":\"25+-2\u00B0C\",\"Irradiance\":\"1000W\/m\u00B2\",\"Each sun simulator validated after every four hours using valid silver reference PV module\":\" Calibration performed at 25+-2\u00B0C room temperature\",\"Last Validation or calibration date and time\":\" verify also its result\",\"Expiry Date of Silver Module Verification\":\"3 Months\"}", "Remark":"", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"vv", "Line":"hh", "PONo":"bb", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 11:28:40", "UpdatedOn":"01-06-2024 11:29:11", "Status":"Approved", "Type":"PostLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/b6fbb530-3ddb-4046-92ce-078c7a848426.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
//   {"PreLamId":"8657f4fb-d8d8-4028-9761-a6ba778b297e", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "Stage":"Buffing", "CheckPoint":"{\"Avaibillity of WI\":\"hh\",\"Edge of corner, Buffing belt condition\":{\"Observation 1\":\"hb\",\"Observation 2\":\"hh\",\"Observation 3\":\"bb\",\"Observation 4\":\"bb\",\"Observation 5\":\"bh\"}}", "Frequency":"{\"Avaibillity of WI\":\"Once a Shift\",\"Edge of corner, Buffing belt condition\":\"5 Piece per Shift\"}", "AcceptanceCriteria":"{\"Avaibillity of WI\":\"Must be Present\",\"Edge of corner, Buffing belt condition\":\"should not be sharp & Buffing belt should be properly working\"}", "Remark":"", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"vv", "Line":"hh", "PONo":"bb", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 11:28:40", "UpdatedOn":"01-06-2024 11:29:11", "Status":"Approved", "Type":"PostLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/b6fbb530-3ddb-4046-92ce-078c7a848426.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
//   {"PreLamId":"9128ea99-c4da-44f8-9d59-4d45ea45ed3b", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "Stage":"Post Lam Visual Inspection", "CheckPoint":"{\"Avaibility of WI & criteria\":\"bb\",\"Visual Defects\":{\"Observation 1\":\"hh\",\"Observation 2\":\"jj\",\"Observation 3\":\"nn\",\"Observation 4\":\"nb\",\"Observation 5\":\"nn\"}}", "Frequency":"{\"Avaibility of WI & criteria\":\"Once a Shift\",\"Visual Defects\":\"5 Piece per Shift\"}", "AcceptanceCriteria":"{\"Avaibility of WI & criteria\":\"Must be Present\",\"Visual Defects\":\"As per Visual inspection criteria : GSPl\/IPQC\/VI\/021\"}", "Remark":"", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"vv", "Line":"hh", "PONo":"bb", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 11:28:40", "UpdatedOn":"01-06-2024 11:29:11", "Status":"Approved", "Type":"PostLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/b6fbb530-3ddb-4046-92ce-078c7a848426.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
//   {"PreLamId":"b52413e6-17b1-4d2e-bdda-10213a4a4fc9", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "Stage":"Framing", "CheckPoint":"{\"Avaibility of WI & Sealant weight Specification\":\"bb\",\"Glue uniformity & continuity in frame groove\":{\"Observation 1\":\"hh\",\"Observation 2\":\"hh\",\"Observation 3\":\"bh\",\"Observation 4\":\"bb\",\"Observation 5\":\"jn\"},\"Glue Weight\":\"jb\",\"Corner Gap\":{\"Observation 1\":\"bb\",\"Observation 2\":\"hb\",\"Observation 3\":\"bn\",\"Observation 4\":\"nh\",\"Observation 5\":\"nn\"},\"Top & Buttom cut Length side cut length\":\"jb\",\"Mounting hole x,y pitch\":\"nn\",\"Anodizing thicknes\":\"nn\"}", "Frequency":"{\"Avaibility of WI & Sealant weight Specification\":\"Once a Shift\",\"Glue uniformity & continuity in frame groove\":\"5 Piece per Shift\",\"Glue Weight\":\"Once a Shift\",\"Corner Gap\":\"5 Piece per Shift\",\"Top & Buttom cut Length side cut length\":\"Once a Shift\",\"Mounting hole x,y pitch\":\"once a Shift\",\"Anodizing thicknes\":\"onc a Shift\"}", "AcceptanceCriteria":"{\"Avaibility of WI & Sealant weight Specification\":\"Must be Present\",\"Glue uniformity & continuity in frame groove\":\"should be continious & uniform,no gap between frame and backsheet\",\"Glue Weight\":\"As per GSPL\/IPQC\/FG\/013\",\"Corner Gap\":\"No Corner Gap,No overlapping\",\"Top & Buttom cut Length side cut length\":\"As per PO or process card\",\"Mounting hole x,y pitch\":\"+-1mm \",\"Anodizing thicknes\":\">=15micron \"}", "Remark":"", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"vv", "Line":"hh", "PONo":"bb", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 11:28:40", "UpdatedOn":"01-06-2024 11:29:11", "Status":"Approved", "Type":"PostLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/b6fbb530-3ddb-4046-92ce-078c7a848426.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
//   {"PreLamId":"bbcab2ac-8bdb-4c4e-9a75-fb7e54213db8", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "Stage":"Trimming", "CheckPoint":"{\"Avaibility of WI\":\"bb\",\"Physical verification of Union trimming & Blade replacing frequency\":{\"Observation 1\":\"bb\",\"Observation 2\":\"bb\",\"Observation 3\":\"bb\",\"Observation 4\":\"bb\",\"Observation 5\":\"bb\"}}", "Frequency":"{\"Avaibility of WI\":\"Once a Shift\",\"Physical verification of Union trimming & Blade replacing frequency\":\"5 Piece per Shift\"}", "AcceptanceCriteria":"{\"Avaibility of WI\":\"Must be Present\",\"Physical verification of Union trimming & Blade replacing frequency\":\"Uniniform trimming without any burr & residue\"}", "Remark":"", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"vv", "Line":"hh", "PONo":"bb", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 11:28:40", "UpdatedOn":"01-06-2024 11:29:11", "Status":"Approved", "Type":"PostLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/b6fbb530-3ddb-4046-92ce-078c7a848426.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
//   {"PreLamId":"db87a37e-dd81-4740-8057-8545b33eadd7", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "Stage":"Junction Box Assembly", "CheckPoint":"{\"Avaibility of WI & sealant weight specification\":\"bb\",\"Glue around jB\":{\"Observation 1\":\"bb\",\"Observation 2\":\"bb\",\"Observation 3\":\"bb\",\"Observation 4\":\"bb\",\"Observation 5\":\"bb\"},\"JB tilt\":{\"Observation 1\":\"bb\",\"Observation 2\":\"bb\",\"Observation 3\":\"bb\",\"Observation 4\":\"bb\",\"Observation 5\":\"bb\"},\"Glue Weight\":\"bb\",\"Glue(Base+Catalyst)potting Ratio & Weight\":\"bb\"}", "Frequency":"{\"Avaibility of WI & sealant weight specification\":\"Once a Shift\",\"Glue around jB\":\"5 Piece per Shift\",\"JB tilt\":\"5 piece per Shift\",\"Glue Weight\":\"Once a  Shift\",\"Glue(Base+Catalyst)potting Ratio & Weight\":\"Once a  Shift\"}", "AcceptanceCriteria":"{\"Avaibility of WI & sealant weight specification\":\"Must be Present\",\"Glue around jB\":\"5 Piece per Shift\",\"JB tilt\":\"No Tilting\",\"Glue Weight\":\"As per GSPL\/IPQC\/JB\/014\",\"Glue(Base+Catalyst)potting Ratio & Weight\":\"As per GSPL\/IPQC\/JB\/015\"}", "Remark":"", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"vv", "Line":"hh", "PONo":"bb", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 11:28:40", "UpdatedOn":"01-06-2024 11:29:11", "Status":"Approved", "Type":"PostLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/b6fbb530-3ddb-4046-92ce-078c7a848426.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null},
//   {"PreLamId":"f02388c1-e9b4-4f3c-88dd-9d0f033beeae", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "Stage":"RFID Reading & writing", "CheckPoint":"{\"Avaibillity of WI\":\"bh\",\"Fixing position\":{\"Observation 1\":\"bv\",\"Observation 2\":\"bb\",\"Observation 3\":\"bh\",\"Observation 4\":\"bb\",\"Observation 5\":\"bh\"},\"Tag read & write\":\"hh\",\"Certification Date Verification\":\"bb\",\"Cell Make & Manufacturing Month Verification\":\"bbb\",\"Module Manufacturing Month Verification\":\"bh\"}", "Frequency":"{\"Avaibillity of WI\":\"Once a Shift\",\"Fixing position\":\"5 Piece per Shift\",\"Tag read & write\":\"Continuous\",\"Certification Date Verification\":\"Once a Shift\",\"Cell Make & Manufacturing Month Verification\":\"Once a Shift\",\"Module Manufacturing Month Verification\":\"Once a Shift\"}", "AcceptanceCriteria":"{\"Avaibillity of WI\":\"Must be Present\",\"Fixing position\":\"As per process Card\",\"Tag read & write\":\"A Tag should be read & write Content should comply MNRE guidline\",\"Certification Date Verification\":\"As per IEC\/UL REPORT(As applicable)\",\"Cell Make & Manufacturing Month Verification\":\"As per BOM\",\"Module Manufacturing Month Verification\":\"As per process Card\"}", "Remark":"", "PreLamDetailId":"b6fbb530-3ddb-4046-92ce-078c7a848426", "DocNo":"GSPL\/IPQC\/IPC\/003", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-06-01", "Shift":"vv", "Line":"hh", "PONo":"bb", "CheckedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "UpdatedBy":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "CreatedOn":"01-06-2024 11:28:40", "UpdatedOn":"01-06-2024 11:29:11", "Status":"Approved", "Type":"PostLam", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/b6fbb530-3ddb-4046-92ce-078c7a848426.pdf", "Location":null, "PersonID":"d5bcf3f9-1ccb-11ef-bf59-52549f6cc694", "EmployeeID":"Kul", "Name":"Kulbhushan Singh", "LoginID":"Kul", "Password":"Kulbhushan@2016", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"849b50dd-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/d5bcf3f9-1ccb-11ef-bf59-52549f6cc694Kulbhushan Singh1716884729897799.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":null, "CreatedOn":"28-05-2024 08:25:26", "UpdatedOn":null, "CreadtedBy":null}]
  



  


//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet('PostLam');
//   let Style = ({size, bold, horizontal = 'center', vertical = 'middle'})=>{

//    let style =  {
//       alignment: { horizontal: horizontal, vertical: vertical, wrapText: true },
//       font: {
//         size: size, bold: bold
//       }
//     }
//     return style;
//   }

//   let Style2 = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 22, bold: false
//     }
//   }

//   let MatrixData = [{
//     'Date': Data[0]['Date'],
//     'Shift': Data[0]['Shift'],
//     'Acceptance Crieteria': ">-4N"
//   },
//   {
//     'Line': Data[0]['Line'],
//     'Buusing Stage': Data[0]['BussingStage'],
//     'Operator Name': Data[0]['OperatorName'],
//   },
//   {
//     'Ribbon Width': Data[0]['Line'],
//     'Busbar Width': Data[0]['BussingStage'],
//     'Result': "NA",
//   }]
//   let Border = {
//     top: { style: 'thin' },
//     bottom: { style: 'thin' },
//     left: { style: 'thin' },
//     right: { style: 'thin' }
//   }




//   /**Merging Cells */
//   worksheet.mergeCells('A1:I2')
//   worksheet.mergeCells('J1:L1')
//   worksheet.mergeCells('A3:I3')
//   worksheet.mergeCells('J2:L2')
//   worksheet.mergeCells('J3:L3')




//   /**putting value in cell */
//   worksheet.getCell('J1').value = 'Page No.1';
//   worksheet.getCell('A1').value = 'Gautam Solar Pvt. Ltd';
//   worksheet.getCell('A3').value = `IPQC Check Sheet`;
//   worksheet.getCell('J2').value = `Doc No. ${Data[0]['DocNo']}`;
//   worksheet.getCell('J3').value = `Rev No. ${Data[0]['RevNo']}`;
 


//   /**Giving Style to Cell */
//   worksheet.getCell('J1').style = {
//     alignment: { horizontal: 'center', vertical: 'middle' },
//     font: {
//       size: 11, bold: true, italic: false
//     }
//   }

//   worksheet.getCell('A3').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 15, bold: true
//     }
//   }

//   worksheet.getCell('A1').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 22, bold: true
//     }
//   }

//   worksheet.getCell('J2').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 11, bold: true
//     }
//   }
//   worksheet.getCell('J3').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 11, bold: true
//     }
//   }
  
// /**Border */
// worksheet.getCell('A1').border = Border;
// worksheet.getCell('I2').border = Border;
// worksheet.getCell('J1').border = Border;
// worksheet.getCell('L1').border = Border;
// worksheet.getCell('J2').border = Border;
// worksheet.getCell('L2').border = Border;
// worksheet.getCell('J3').border = Border;
// worksheet.getCell('L3').border = Border;
// worksheet.getCell('A3').border = Border;
// worksheet.getCell('I3').border = Border;
//   /**Height */
//   worksheet.getRow(1).height = 15;
//   worksheet.getRow(2).height = 27;
//   worksheet.getRow(3).height = 33;
//   worksheet.getRow(4).height = 25;
//   worksheet.getRow(5).height = 20;

//   worksheet.mergeCells('A4:B4')
//   worksheet.mergeCells('C4:D4')
//   worksheet.mergeCells('E4:F4')
//   worksheet.mergeCells('G4:L4')

//   worksheet.getCell('A4').value = `Date: ${Data[0]['Date']}`;
//   worksheet.getCell('C4').value = `Shift: ${Data[0]['Shift']}`;
//   worksheet.getCell('E4').value = `Line: ${Data[0]['Line']}`;
//   worksheet.getCell('G4').value = `PO No: ${Data[0]['PONo']}`;


//   worksheet.getCell('A4').style = Style({size:'12',bold:true});
//   worksheet.getCell('C4').style = Style({size:'12',bold:true})
//   worksheet.getCell('E4').style = Style({size:'12',bold:true})
//   worksheet.getCell('G4').style = Style({size:'12',bold:true})


//   worksheet.getCell('A4').border = Border;
//   worksheet.getCell('C4').border = Border;
//   worksheet.getCell('E4').border = Border;
//   worksheet.getCell('G4').border = Border;
//   worksheet.getCell('B4').border = Border;
//   worksheet.getCell('D4').border = Border;
//   worksheet.getCell('F4').border = Border;
//   worksheet.getCell('L4').border = Border;

//   worksheet.getColumn('G').width = 16;
//   worksheet.getColumn('H').width = 16;
//   worksheet.getColumn('I').width = 16;
//   worksheet.getColumn('E').width = 20;
//   worksheet.getColumn('F').width = 20;
//   worksheet.getColumn('C').width = 20;
//   worksheet.getColumn('D').width = 20;

//   worksheet.mergeCells('A5:B5')
//   worksheet.mergeCells('C5:D5')
//   worksheet.mergeCells('G5:L5')

//   worksheet.getCell('A5').value = `Stage`;
//   worksheet.getCell('C5').value = `Check Point`;
//   worksheet.getCell('E5').value = `Frequency`;
//   worksheet.getCell('F5').value = `Acceptance Criteria`;
//   worksheet.getCell('G5').value = `Observation`;


//   worksheet.getCell('A5').style = Style({size:'12',bold:true});
//   worksheet.getCell('C5').style = Style({size:'12',bold:true});
//   worksheet.getCell('E5').style = Style({size:'12',bold:true});
//   worksheet.getCell('F5').style = Style({size:'12',bold:true});
//   worksheet.getCell('G5').style = Style({size:'12',bold:true});


//   worksheet.getCell('A5').border = Border;
//   worksheet.getCell('C5').border = Border;
//   worksheet.getCell('E5').border = Border;
//   worksheet.getCell('F5').border = Border;
//   worksheet.getCell('J5').border = Border;
//   worksheet.getCell('G5').border = Border;
//   worksheet.getCell('B5').border = Border;
//   worksheet.getCell('D5').border = Border;
//   worksheet.getCell('L5').border = Border;
  
//   let Row = 6;

//   Data.forEach((data, i)=>{
//     data['CheckPoint'] = JSON.parse(data['CheckPoint'])
//     data['AcceptanceCriteria'] = JSON.parse(data['AcceptanceCriteria'])
//     data['Frequency'] = JSON.parse(data['Frequency'])
//     console.log(i,data['Stage'])
//     console.log('Checkpoint',i,data['CheckPoint'])
//     console.log('Acceptance',i,data['AcceptanceCriteria'])
//     console.log('Frequency',i,data['Frequency'])
  
//     function FindValue(temp){
//       let string = ''
    
//       let i = 0
//         for(key in temp){
//            string+=`Obs${i+1}: ${temp[key]} | `;
//            i++;
//         } 
        
       

//        return string;

//     }
   
//     function Sun(temp){
//         let string = '';
   
//         for(key in temp){
      
//           for(skey in temp[key]){

//             string+=`${skey} of ${key} : ${temp[key][skey]} | `
           
//           }
          
//         }
//         return string
//     }
   
//       let intialRow = Row
      
//        for(let key in data['CheckPoint']){
//            worksheet.getRow(Row).height = 120
//            worksheet.mergeCells(`C${Row}:D${Row}`)
//            worksheet.getCell(`C${Row}`).value = key;
//            worksheet.getCell(`C${Row}`).style = Style({size:13, bold:true});
//            worksheet.getCell(`C${Row}`).border = Border;
//            worksheet.getCell(`D${Row}`).border = Border;

//            /**Observeration */
//            worksheet.mergeCells(`G${Row}:L${Row}`)
//            worksheet.getCell(`G${Row}`).value = data['CheckPoint']!== 'Sun Simulator Calibration' && key!= 'Each sun simulator validated after every four hours using valid silver reference PV module'?typeof data['CheckPoint'][key] == 'object'?FindValue(data['CheckPoint'][key]):data['CheckPoint'][key]:typeof data['CheckPoint'][key] == 'object'?Sun(data['CheckPoint'][key]):data['CheckPoint'][key];
//            worksheet.getCell(`G${Row}`).style = Style({size:12, bold:false});
//            worksheet.getCell(`G${Row}`).border = Border;
//            worksheet.getCell(`L${Row}`).border = Border;

//            /**Frequency */
//            worksheet.getCell(`E${Row}`).value = data['Frequency'][key];
//            worksheet.getCell(`E${Row}`).style = Style({size:10, bold:true});
//            worksheet.getCell(`E${Row}`).border = Border;
          
//            /**Acceptance */
//            worksheet.getCell(`F${Row}`).value = data['AcceptanceCriteria'][key];
//            worksheet.getCell(`F${Row}`).style = Style({size:10, bold:true});
//            worksheet.getCell(`F${Row}`).border = Border;
//            Row++;
//        }
     
//       worksheet.mergeCells(`A${intialRow}:B${Row-1}`)
//       worksheet.getCell(`A${intialRow}`).value = data['Stage']
//       worksheet.getCell(`A${intialRow}`).style = Style({size:12, bold:true});
//       worksheet.getCell(`A${intialRow}`).border = Border;
//       worksheet.getCell(`B${Row-1}`).border = Border;

//       // worksheet.mergeCells(`J${intialRow}:L${Row-1}`)
//       // worksheet.getCell(`J${intialRow}`).value = data['Remark'];
//       // worksheet.getCell(`J${intialRow}`).style = Style({size:12, bold:true});
//       // worksheet.getCell(`J${intialRow}`).border = Border;
//       // worksheet.getCell(`L${Row-1}`).border = Border;


//   })

//   worksheet.getRow(Row).height = 48;

//   worksheet.mergeCells(`A${Row}:E${Row}`)
//   worksheet.getCell(`A${Row}`).value = `Audited By: ${Data[0]['Name']}`;
//   worksheet.getCell(`A${Row}`).style = Style({size:12, bold:true, horizontal:'left'});
//   worksheet.getCell(`A${Row}`).border = Border;
//   worksheet.getCell(`E${Row}`).border = Border;


//   worksheet.mergeCells(`F${Row}:L${Row}`)
//   worksheet.getCell(`F${Row}`).value = `Reviewed By: ${Data[0]['ReviewedBy'] || 'Unknown'}`;
//   worksheet.getCell(`F${Row}`).style = Style({size:12, bold:true, horizontal:'left'});
//   worksheet.getCell(`F${Row}`).border = Border;
//   worksheet.getCell(`L${Row}`).border = Border;

//   //Save the workbook to a file
//   const excelBuffer = await workbook.xlsx.writeBuffer()
//     .then(buffer => {
//       console.log('Excel file generated successfully!');

//       return buffer; // Return the buffer
//     })
//     .catch(error => {
//       console.error('Error generating Excel file:', error);
//     });


//   fs.writeFileSync('output.xlsx', excelBuffer)

// }



//PostLamExcel();
//ExcelGenerate();

// const StingerExcel = async() =>{
//   let Data = [{"StringerMachineId":"38c11b72-b20b-4b9d-ae91-8889e7cd9733", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "Parameter":"Set Temperature1 ", "UOM":"\u00B0C", "Specification":"230\u00B130", "TrackA":"12", "TrackB":"wq", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "DocNo":"GSPL\/IPQC\/ST\/004", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-02", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"02-05-2024 06:45:50", "UpdatedOn":"02-05-2024 07:19:59", "Status":"Approved", "Type":"Stringer1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/28d59c78-3d5f-4f48-9f11-bdead9fcad23.pdf", "Location":null, "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"StringerMachineId":"23405552-e53b-4037-9458-1eee27b87734", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "Parameter":"Welding Time3", "UOM":"sec", "Specification":"1.7-2.5", "TrackA":"54", "TrackB":"76", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "DocNo":"GSPL\/IPQC\/ST\/004", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-02", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"02-05-2024 06:45:50", "UpdatedOn":"02-05-2024 07:19:59", "Status":"Approved", "Type":"Stringer1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/28d59c78-3d5f-4f48-9f11-bdead9fcad23.pdf", "Location":null, "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"StringerMachineId":"84a713fe-b8af-45f7-98e7-9e8c1c1bff9a", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "Parameter":"Welding Time5", "UOM":"sec", "Specification":"1.7-2.5", "TrackA":"87", "TrackB":"9", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "DocNo":"GSPL\/IPQC\/ST\/004", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-02", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"02-05-2024 06:45:50", "UpdatedOn":"02-05-2024 07:19:59", "Status":"Approved", "Type":"Stringer1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/28d59c78-3d5f-4f48-9f11-bdead9fcad23.pdf", "Location":null, "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"StringerMachineId":"51ee55fe-677c-4f67-bd2d-bd3852eec87b", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "Parameter":"Set Temperature2", "UOM":"\u00B0C", "Specification":"230\u00B130", "TrackA":"2", "TrackB":"re", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "DocNo":"GSPL\/IPQC\/ST\/004", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-02", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"02-05-2024 06:45:50", "UpdatedOn":"02-05-2024 07:19:59", "Status":"Approved", "Type":"Stringer1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/28d59c78-3d5f-4f48-9f11-bdead9fcad23.pdf", "Location":null, "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"StringerMachineId":"08ec26ec-54f9-424d-8aff-664068e397c6", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "Parameter":"Welding Time6", "UOM":"sec", "Specification":"1.7-2.5", "TrackA":"54", "TrackB":"09-", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "DocNo":"GSPL\/IPQC\/ST\/004", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-02", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"02-05-2024 06:45:50", "UpdatedOn":"02-05-2024 07:19:59", "Status":"Approved", "Type":"Stringer1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/28d59c78-3d5f-4f48-9f11-bdead9fcad23.pdf", "Location":null, "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"StringerMachineId":"a6afb4f6-c20d-4c7d-a422-09c144ae13ce", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "Parameter":"Heating platform 2", "UOM":"\u00B0C", "Specification":"90+-30", "TrackA":"343", "TrackB":"-0", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "DocNo":"GSPL\/IPQC\/ST\/004", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-02", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"02-05-2024 06:45:50", "UpdatedOn":"02-05-2024 07:19:59", "Status":"Approved", "Type":"Stringer1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/28d59c78-3d5f-4f48-9f11-bdead9fcad23.pdf", "Location":null, "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"StringerMachineId":"06a6f49d-8163-4c99-9d1b-1859fbff051f", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "Parameter":"Welding Time2", "UOM":"sec", "Specification":"1.7-2.5", "TrackA":"43", "TrackB":"54", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "DocNo":"GSPL\/IPQC\/ST\/004", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-02", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"02-05-2024 06:45:50", "UpdatedOn":"02-05-2024 07:19:59", "Status":"Approved", "Type":"Stringer1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/28d59c78-3d5f-4f48-9f11-bdead9fcad23.pdf", "Location":null, "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"StringerMachineId":"b42594b2-0b9d-4a18-b1f3-68fcabe05b0c", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "Parameter":"Heating platform 1", "UOM":"\u00B0C", "Specification":"80+-30", "TrackA":"54", "TrackB":"0", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "DocNo":"GSPL\/IPQC\/ST\/004", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-02", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"02-05-2024 06:45:50", "UpdatedOn":"02-05-2024 07:19:59", "Status":"Approved", "Type":"Stringer1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/28d59c78-3d5f-4f48-9f11-bdead9fcad23.pdf", "Location":null, "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"StringerMachineId":"33691cca-f91f-4fb5-bf94-278889116203", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "Parameter":"Welding Time4", "UOM":"sec", "Specification":"1.7-2.5", "TrackA":"76", "TrackB":"87", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "DocNo":"GSPL\/IPQC\/ST\/004", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-02", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"02-05-2024 06:45:50", "UpdatedOn":"02-05-2024 07:19:59", "Status":"Approved", "Type":"Stringer1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/28d59c78-3d5f-4f48-9f11-bdead9fcad23.pdf", "Location":null, "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"StringerMachineId":"15851729-6e19-4f86-afde-d7368e491d16", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "Parameter":"Heating platform 3", "UOM":"\u00B0C", "Specification":"110+-30", "TrackA":"43", "TrackB":"98", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "DocNo":"GSPL\/IPQC\/ST\/004", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-02", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"02-05-2024 06:45:50", "UpdatedOn":"02-05-2024 07:19:59", "Status":"Approved", "Type":"Stringer1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/28d59c78-3d5f-4f48-9f11-bdead9fcad23.pdf", "Location":null, "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"StringerMachineId":"617978bf-8d7d-4897-84f1-fd771e111fc7", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "Parameter":"Welding Time1", "UOM":"sec", "Specification":"1.7-2.5", "TrackA":"32", "TrackB":"43", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "DocNo":"GSPL\/IPQC\/ST\/004", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-02", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"02-05-2024 06:45:50", "UpdatedOn":"02-05-2024 07:19:59", "Status":"Approved", "Type":"Stringer1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/28d59c78-3d5f-4f48-9f11-bdead9fcad23.pdf", "Location":null, "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"StringerMachineId":"97ec6a89-4189-45f7-baf0-2a25e5af69fe", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "Parameter":"Heating platform 4", "UOM":"\u00B0C", "Specification":"100+-30", "TrackA":"32", "TrackB":"79", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "DocNo":"GSPL\/IPQC\/ST\/004", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-02", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"02-05-2024 06:45:50", "UpdatedOn":"02-05-2024 07:19:59", "Status":"Approved", "Type":"Stringer1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/28d59c78-3d5f-4f48-9f11-bdead9fcad23.pdf", "Location":null, "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"StringerMachineId":"f0418172-dede-4999-889a-387472ccd0c7", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "Parameter":"Heating platform 5", "UOM":"\u00B0C", "Specification":"90+-30", "TrackA":"54", "TrackB":"79", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "DocNo":"GSPL\/IPQC\/ST\/004", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-02", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"02-05-2024 06:45:50", "UpdatedOn":"02-05-2024 07:19:59", "Status":"Approved", "Type":"Stringer1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/28d59c78-3d5f-4f48-9f11-bdead9fcad23.pdf", "Location":null, "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"StringerMachineId":"4efb66a6-de39-4ced-bdf5-a942b1591de3", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "Parameter":"Heating platform 6", "UOM":"\u00B0C", "Specification":"80+-30", "TrackA":"76", "TrackB":"3", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "DocNo":"GSPL\/IPQC\/ST\/004", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-02", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"02-05-2024 06:45:50", "UpdatedOn":"02-05-2024 07:19:59", "Status":"Approved", "Type":"Stringer1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/28d59c78-3d5f-4f48-9f11-bdead9fcad23.pdf", "Location":null, "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"StringerMachineId":"a2bd83e1-c6ef-442a-b7e6-653af6effd81", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "Parameter":"Lowest Temp.setting", "UOM":"\u00B0C", "Specification":"30", "TrackA":"87", "TrackB":"43", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "DocNo":"GSPL\/IPQC\/ST\/004", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-02", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"02-05-2024 06:45:50", "UpdatedOn":"02-05-2024 07:19:59", "Status":"Approved", "Type":"Stringer1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/28d59c78-3d5f-4f48-9f11-bdead9fcad23.pdf", "Location":null, "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"StringerMachineId":"540558e1-58d1-4054-8966-eff42f2cbc3c", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "Parameter":"Highest Temp. setting", "UOM":"\u00B0C", "Specification":"50", "TrackA":"i77", "TrackB":"43", "PreLamDetailId":"28d59c78-3d5f-4f48-9f11-bdead9fcad23", "DocNo":"GSPL\/IPQC\/ST\/004", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-02", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"02-05-2024 06:45:50", "UpdatedOn":"02-05-2024 07:19:59", "Status":"Approved", "Type":"Stringer1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/28d59c78-3d5f-4f48-9f11-bdead9fcad23.pdf", "Location":null, "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null}]
  
  
  

//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet('PostLam');
//   let Style = ({size, bold, horizontal = 'center', vertical = 'middle'})=>{

//    let style =  {
//       alignment: { horizontal: horizontal, vertical: vertical, wrapText: true },
//       font: {
//         size: size, bold: bold
//       }
//     }
//     return style;
//   }

//   let Style2 = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 22, bold: false
//     }
//   }

//   let MatrixData = [{
//     'Date': Data[0]['Date'],
//     'Shift': Data[0]['Shift'],
//     'Acceptance Crieteria': ">-4N"
//   },
//   {
//     'Line': Data[0]['Line'],
//     'Buusing Stage': Data[0]['BussingStage'],
//     'Operator Name': Data[0]['OperatorName'],
//   },
//   {
//     'Ribbon Width': Data[0]['Line'],
//     'Busbar Width': Data[0]['BussingStage'],
//     'Result': "NA",
//   }]
//   let Border = {
//     top: { style: 'thin' },
//     bottom: { style: 'thin' },
//     left: { style: 'thin' },
//     right: { style: 'thin' }
//   }




//   /**Merging Cells */
//   worksheet.mergeCells('A1:I2')
//   worksheet.mergeCells('J1:L1')
//   worksheet.mergeCells('A3:I3')
//   worksheet.mergeCells('J2:L2')
//   worksheet.mergeCells('J3:L3')
//   worksheet.mergeCells('E4:L4')



//   /**putting value in cell */
//   worksheet.getCell('J1').value = 'Page No.1';
//   worksheet.getCell('A1').value = 'Gautam Solar Pvt. Ltd';
//   worksheet.getCell('A3').value = `IPQC Check Sheet`;
//   worksheet.getCell('J2').value = `Doc No. ${Data[0]['DocNo']}`;
//   worksheet.getCell('J3').value = `Rev No. ${Data[0]['RevNo']}`;
//   worksheet.getCell('E4').value = `Stringer`;


//   /**Giving Style to Cell */
//   worksheet.getCell('J1').style = {
//     alignment: { horizontal: 'center', vertical: 'middle' },
//     font: {
//       size: 11, bold: true, italic: false
//     }
//   }

//   worksheet.getCell('A3').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 15, bold: true
//     }
//   }

//   worksheet.getCell('A1').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 22, bold: true
//     }
//   }

//   worksheet.getCell('J2').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 11, bold: true
//     }
//   }
//   worksheet.getCell('J3').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 11, bold: true
//     }
//   }

//   worksheet.getCell('E4').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 10, bold: true
//     }
//   }
  
// /**Border */
// worksheet.getCell('A1').border = Border;
// worksheet.getCell('I2').border = Border;
// worksheet.getCell('J1').border = Border;
// worksheet.getCell('L1').border = Border;
// worksheet.getCell('J2').border = Border;
// worksheet.getCell('L2').border = Border;
// worksheet.getCell('J3').border = Border;
// worksheet.getCell('L3').border = Border;
// worksheet.getCell('A3').border = Border;
// worksheet.getCell('I3').border = Border;
// worksheet.getCell('E4').border = Border;
// worksheet.getCell('L4').border = Border;
//   /**Height */
//   worksheet.getRow(1).height = 15;
//   worksheet.getRow(2).height = 27;
//   worksheet.getRow(3).height = 24;
//   worksheet.getRow(4).height = 25;
//   worksheet.getRow(5).height = 20;

//   worksheet.mergeCells('A4:B4')
//   worksheet.mergeCells('C4:D4')


//   worksheet.getCell('A4').value = `Date: ${Data[0]['Date']}`;
//   worksheet.getCell('C4').value = `Shift: ${Data[0]['Shift']}`;



//   worksheet.getCell('A4').style = Style({size:'10',bold:true});
//   worksheet.getCell('C4').style = Style({size:'10',bold:true})



//   worksheet.getCell('A4').border = Border;
//   worksheet.getCell('C4').border = Border;
//   worksheet.getCell('B4').border = Border;
//   worksheet.getCell('D4').border = Border;


 

//   worksheet.getColumn('C').width = 20;
//   worksheet.getColumn('D').width = 20;
//   worksheet.getColumn('D').width = 20;

//  worksheet.mergeCells('A5:B6')
//  worksheet.getCell('A5').value = 'Parameter';
//  worksheet.getCell('A5').style = Style({bold:true,size:10})
//  worksheet.getCell('A5').border = Border;
//  worksheet.getCell('B6').border = Border;

//  worksheet.mergeCells('C5:C6')
//  worksheet.getCell('C5').value = 'UOM';
//  worksheet.getCell('C5').style = Style({bold:true,size:10})
//  worksheet.getCell('C5').border = Border;
//  worksheet.getCell('C6').border = Border;

//  worksheet.mergeCells('D5:D6')
//  worksheet.getCell('D5').value = 'Specification of MBB';
//  worksheet.getCell('D5').style = Style({bold:true,size:10})
//  worksheet.getCell('D5').border = Border;
//  worksheet.getCell('D6').border = Border;

//  worksheet.mergeCells('E5:L5')
//  worksheet.getCell('E5').value = 'TS O1';
//  worksheet.getCell('E5').style = Style({bold:true,size:11})
//  worksheet.getCell('E5').border = Border;
//  worksheet.getCell('L5').border = Border;

//  worksheet.mergeCells('E6:H6')
//  worksheet.getCell('E6').value = 'Track A';
//  worksheet.getCell('E6').style = Style({bold:true,size:11})
//  worksheet.getCell('E6').border = Border;
//  worksheet.getCell('H6').border = Border;

//  worksheet.mergeCells('I6:L6')
//  worksheet.getCell('I6').value = 'Track B';
//  worksheet.getCell('I6').style = Style({bold:true,size:11})
//  worksheet.getCell('I6').border = Border;
//  worksheet.getCell('L6').border = Border;


//  let Row = 7;

//  Data.forEach((data)=>{
//    worksheet.getRow(Row).height = 29

//   worksheet.mergeCells(`A${Row}:B${Row}`)
//   worksheet.getCell(`A${Row}`).value = data['Parameter'];
//   worksheet.getCell(`A${Row}`).style = Style({bold:true,size:11})
//   worksheet.getCell(`A${Row}`).border = Border;
//   worksheet.getCell(`B${Row}`).border = Border;

//   worksheet.mergeCells(`C${Row}:C${Row}`)
//   worksheet.getCell(`C${Row}`).value = data['UOM'];
//   worksheet.getCell(`C${Row}`).style = Style({bold:true,size:11})
//   worksheet.getCell(`C${Row}`).border = Border;
//   worksheet.getCell(`C${Row}`).border = Border;

//   worksheet.mergeCells(`D${Row}:D${Row}`)
//   worksheet.getCell(`D${Row}`).value = data['Specification'];
//   worksheet.getCell(`D${Row}`).style = Style({bold:true,size:11})
//   worksheet.getCell(`D${Row}`).border = Border;
//   worksheet.getCell(`D${Row}`).border = Border;

//   worksheet.mergeCells(`E${Row}:H${Row}`)
//   worksheet.getCell(`E${Row}`).value = data['TrackA'];
//   worksheet.getCell(`E${Row}`).style = Style({bold:false,size:11})
//   worksheet.getCell(`E${Row}`).border = Border;
//   worksheet.getCell(`H${Row}`).border = Border;

//   worksheet.mergeCells(`I${Row}:L${Row}`)
//   worksheet.getCell(`I${Row}`).value = data['TrackB'];
//   worksheet.getCell(`I${Row}`).style = Style({bold:false,size:11})
//   worksheet.getCell(`I${Row}`).border = Border;
//   worksheet.getCell(`L${Row}`).border = Border;
// Row++
//  })

//     //Save the workbook to a file
//     const excelBuffer = await workbook.xlsx.writeBuffer()
//     .then(buffer => {
//       console.log('Excel file generated successfully!');

//       return buffer; // Return the buffer
//     })
//     .catch(error => {
//       console.error('Error generating Excel file:', error);
//     });


//   fs.writeFileSync('output.xlsx', excelBuffer)
// }

//StingerExcel()



// const LaminatorExcel = async() =>{
//   let Data = [{"PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "LaminatorId":"987d820f-3207-4bec-b735-9e3f2b017341", "Parameter":"Laminator-2(sec)", "Specification":"Specification (0-10)| Tolerance None", "ObservedValueA":"nj", "ObservedValueB":"nn", "PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "DocNo":"GSPL\/IPQC\/LM\/008", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-10", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"10-05-2024 09:09:18", "UpdatedOn":"10-05-2024 09:09:33", "Status":"Approved", "Type":"Laminator1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/2151326b-4412-4727-bf08-472e0779a3e3.pdf", "Location":"[{\"Locationfield\":\"bbn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"}]", "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "LaminatorId":"5a6cab7b-24fd-453d-8915-ed356d0370b4", "Parameter":"EVA Make", "Specification":"Specification | Tolerance | None", "ObservedValueA":"vv", "ObservedValueB":"hh", "PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "DocNo":"GSPL\/IPQC\/LM\/008", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-10", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"10-05-2024 09:09:18", "UpdatedOn":"10-05-2024 09:09:33", "Status":"Approved", "Type":"Laminator1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/2151326b-4412-4727-bf08-472e0779a3e3.pdf", "Location":"[{\"Locationfield\":\"bbn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"}]", "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "LaminatorId":"88d7c63a-e36a-4238-b9c4-c6e7d030c1c4", "Parameter":"Upper Vent-3(kpa)", "Specification":"Specification(-20 to 0)|Tolerance None", "ObservedValueA":"nn", "ObservedValueB":"nn", "PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "DocNo":"GSPL\/IPQC\/LM\/008", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-10", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"10-05-2024 09:09:18", "UpdatedOn":"10-05-2024 09:09:33", "Status":"Approved", "Type":"Laminator1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/2151326b-4412-4727-bf08-472e0779a3e3.pdf", "Location":"[{\"Locationfield\":\"bbn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"}]", "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "LaminatorId":"f7756ec0-2472-462d-9572-fe8ebcbb3d4b", "Parameter":"Total Vaccum", "Specification":"Specification 300 | Tolerance (+40,-20)", "ObservedValueA":"nn", "ObservedValueB":"nn", "PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "DocNo":"GSPL\/IPQC\/LM\/008", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-10", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"10-05-2024 09:09:18", "UpdatedOn":"10-05-2024 09:09:33", "Status":"Approved", "Type":"Laminator1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/2151326b-4412-4727-bf08-472e0779a3e3.pdf", "Location":"[{\"Locationfield\":\"bbn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"}]", "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "LaminatorId":"93b0c037-ffb7-4579-9129-81d9ca3c103e", "Parameter":"EVA Model", "Specification":"Specification | Tolerance | None", "ObservedValueA":"hh", "ObservedValueB":"jj", "PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "DocNo":"GSPL\/IPQC\/LM\/008", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-10", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"10-05-2024 09:09:18", "UpdatedOn":"10-05-2024 09:09:33", "Status":"Approved", "Type":"Laminator1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/2151326b-4412-4727-bf08-472e0779a3e3.pdf", "Location":"[{\"Locationfield\":\"bbn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"}]", "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "LaminatorId":"79dada94-1d29-4786-9529-30b31e07bf27", "Parameter":"Laminator-3(sec)", "Specification":"Specification 100| Tolerance +50,0", "ObservedValueA":"nn", "ObservedValueB":"nn", "PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "DocNo":"GSPL\/IPQC\/LM\/008", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-10", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"10-05-2024 09:09:18", "UpdatedOn":"10-05-2024 09:09:33", "Status":"Approved", "Type":"Laminator1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/2151326b-4412-4727-bf08-472e0779a3e3.pdf", "Location":"[{\"Locationfield\":\"bbn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"}]", "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "LaminatorId":"442d5673-df78-4cc7-a1b5-9893074c1de5", "Parameter":"Laminator-1(sec)", "Specification":"Specification (0-10)| Tolerance None", "ObservedValueA":"nn", "ObservedValueB":"nn", "PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "DocNo":"GSPL\/IPQC\/LM\/008", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-10", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"10-05-2024 09:09:18", "UpdatedOn":"10-05-2024 09:09:33", "Status":"Approved", "Type":"Laminator1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/2151326b-4412-4727-bf08-472e0779a3e3.pdf", "Location":"[{\"Locationfield\":\"bbn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"}]", "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "LaminatorId":"1d4e81cd-b647-47b9-bd5f-2fbe42a7e785", "Parameter":"Upper Vaccum Delay(sec)", "Specification":"Specification  0-10| Tolerance -None", "ObservedValueA":"jj", "ObservedValueB":"jj", "PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "DocNo":"GSPL\/IPQC\/LM\/008", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-10", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"10-05-2024 09:09:18", "UpdatedOn":"10-05-2024 09:09:33", "Status":"Approved", "Type":"Laminator1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/2151326b-4412-4727-bf08-472e0779a3e3.pdf", "Location":"[{\"Locationfield\":\"bbn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"}]", "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "LaminatorId":"f8a75728-5dcb-41af-a77b-3e2ac80383c8", "Parameter":"Upper Vent-2(kpa)", "Specification":"Specification(-40 to 0)|Tolerance None", "ObservedValueA":"nn", "ObservedValueB":"bn", "PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "DocNo":"GSPL\/IPQC\/LM\/008", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-10", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"10-05-2024 09:09:18", "UpdatedOn":"10-05-2024 09:09:33", "Status":"Approved", "Type":"Laminator1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/2151326b-4412-4727-bf08-472e0779a3e3.pdf", "Location":"[{\"Locationfield\":\"bbn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"}]", "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "LaminatorId":"dc85174b-1894-4e7b-b6de-0f323d8cacf2", "Parameter":"Upper Vent-1(kpa)", "Specification":"Specification(-60 to 0)|Tolerance -None", "ObservedValueA":"nn", "ObservedValueB":"nn", "PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "DocNo":"GSPL\/IPQC\/LM\/008", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-10", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"10-05-2024 09:09:18", "UpdatedOn":"10-05-2024 09:09:33", "Status":"Approved", "Type":"Laminator1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/2151326b-4412-4727-bf08-472e0779a3e3.pdf", "Location":"[{\"Locationfield\":\"bbn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"}]", "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "LaminatorId":"74569f1d-0d72-4693-b22b-d1f9c4c7118a", "Parameter":"Default Low Vaccum Time(sec)", "Specification":"Specification 9999| Tolerance 0", "ObservedValueA":"nn", "ObservedValueB":"nn", "PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "DocNo":"GSPL\/IPQC\/LM\/008", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-10", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"10-05-2024 09:09:18", "UpdatedOn":"10-05-2024 09:09:33", "Status":"Approved", "Type":"Laminator1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/2151326b-4412-4727-bf08-472e0779a3e3.pdf", "Location":"[{\"Locationfield\":\"bbn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"}]", "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "LaminatorId":"0f95f09a-7cf3-4f54-96ba-f0b84bd20035", "Parameter":"Temp Setting(0c)", "Specification":"Specification 150| Tolerance None", "ObservedValueA":"nn", "ObservedValueB":"nn", "PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "DocNo":"GSPL\/IPQC\/LM\/008", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-10", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"10-05-2024 09:09:18", "UpdatedOn":"10-05-2024 09:09:33", "Status":"Approved", "Type":"Laminator1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/2151326b-4412-4727-bf08-472e0779a3e3.pdf", "Location":"[{\"Locationfield\":\"bbn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"}]", "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "LaminatorId":"fc8948aa-0885-4551-869e-5bd07a9330e3", "Parameter":"vent Time(sec)", "Specification":"Specification 20| Tolerance 0+-5", "ObservedValueA":"nn", "ObservedValueB":"nn", "PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "DocNo":"GSPL\/IPQC\/LM\/008", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-10", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"10-05-2024 09:09:18", "UpdatedOn":"10-05-2024 09:09:33", "Status":"Approved", "Type":"Laminator1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/2151326b-4412-4727-bf08-472e0779a3e3.pdf", "Location":"[{\"Locationfield\":\"bbn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"}]", "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "LaminatorId":"08f188cf-be1a-4f16-8791-b8bd810743d1", "Parameter":"Temp Lower limit (0c)", "Specification":"Specification 140| Tolerance None", "ObservedValueA":"nn", "ObservedValueB":"nn", "PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "DocNo":"GSPL\/IPQC\/LM\/008", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-10", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"10-05-2024 09:09:18", "UpdatedOn":"10-05-2024 09:09:33", "Status":"Approved", "Type":"Laminator1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/2151326b-4412-4727-bf08-472e0779a3e3.pdf", "Location":"[{\"Locationfield\":\"bbn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"}]", "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "LaminatorId":"67b73838-0c8d-49e2-872b-328fc3dfbd32", "Parameter":"Lam Count(Membrane cycle)", "Specification":"Specification (max 15000-20000)| Tolerance None", "ObservedValueA":"nn", "ObservedValueB":"nn", "PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "DocNo":"GSPL\/IPQC\/LM\/008", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-10", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"10-05-2024 09:09:18", "UpdatedOn":"10-05-2024 09:09:33", "Status":"Approved", "Type":"Laminator1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/2151326b-4412-4727-bf08-472e0779a3e3.pdf", "Location":"[{\"Locationfield\":\"bbn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"}]", "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null},
//   {"PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "LaminatorId":"4d4691f7-4e71-444c-acc7-2acab7def897", "Parameter":"Temp Upper limit(0c)", "Specification":"Specification 160| Tolerance None", "ObservedValueA":"nn", "ObservedValueB":"nn", "PreLamDetailId":"2151326b-4412-4727-bf08-472e0779a3e3", "DocNo":"GSPL\/IPQC\/LM\/008", "RevNo":"1.0 dated 12.08.2023", "Date":"2024-05-10", "Shift":"Day Shift", "Line":null, "PONo":null, "CheckedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":"10-05-2024 09:09:18", "UpdatedOn":"10-05-2024 09:09:33", "Status":"Approved", "Type":"Laminator1", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/2151326b-4412-4727-bf08-472e0779a3e3.pdf", "Location":"[{\"Locationfield\":\"bbn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"},{\"Locationfield\":\"nn\"}]", "PersonID":"08326670-ed04-11ee-b439-0ac93defbbf1", "EmployeeID":"Emp003", "Name":"Bhanu", "LoginID":"QCM", "Password":"Bhanu@3813", "WorkLocation":"fc9c8db9-e817-11ee-b439-0ac93defbbf1", "Email":"krishukumar7827@gmail.com", "Department":"84949eb1-e816-11ee-b439-0ac93defbbf1", "ProfileImg":"http:\/\/srv515471.hstgr.cloud:8080\/Employee\/Profile\/08326670-ed04-11ee-b439-0ac93defbbf1Bhanu1716280504105294.jpg", "Desgination":"d66db440-e2ab-11ee-974e-12d6db81f661", "Status":"Active", "CreatedBy":null, "UpdatedBy":"08326670-ed04-11ee-b439-0ac93defbbf1", "CreatedOn":null, "UpdatedOn":"21-05-2024 08:35:04", "CreadtedBy":null}]
  
  
  

//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet('Laminator');
//   let Style = ({size, bold, horizontal = 'center', vertical = 'middle'})=>{

//    let style =  {
//       alignment: { horizontal: horizontal, vertical: vertical, wrapText: true },
//       font: {
//         size: size, bold: bold
//       }
//     }
//     return style;
//   }

//   let Style2 = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 22, bold: false
//     }
//   }

//   let MatrixData = [{
//     'Date': Data[0]['Date'],
//     'Shift': Data[0]['Shift'],
//     'Acceptance Crieteria': ">-4N"
//   },
//   {
//     'Line': Data[0]['Line'],
//     'Buusing Stage': Data[0]['BussingStage'],
//     'Operator Name': Data[0]['OperatorName'],
//   },
//   {
//     'Ribbon Width': Data[0]['Line'],
//     'Busbar Width': Data[0]['BussingStage'],
//     'Result': "NA",
//   }]
//   let Border = {
//     top: { style: 'thin' },
//     bottom: { style: 'thin' },
//     left: { style: 'thin' },
//     right: { style: 'thin' }
//   }




//   /**Merging Cells */
//   worksheet.mergeCells('A1:I2')
//   worksheet.mergeCells('J1:L1')
//   worksheet.mergeCells('A3:I3')
//   worksheet.mergeCells('J2:L2')
//   worksheet.mergeCells('J3:L3')
//   worksheet.mergeCells('E4:L4')



//   /**putting value in cell */
//   worksheet.getCell('J1').value = 'Page No.1';
//   worksheet.getCell('A1').value = 'Gautam Solar Pvt. Ltd';
//   worksheet.getCell('A3').value = `${Data[0]['Type']}`;
//   worksheet.getCell('J2').value = `Doc No. ${Data[0]['DocNo']}`;
//   worksheet.getCell('J3').value = `Rev No. ${Data[0]['RevNo']}`;
//   worksheet.getCell('E4').value = `Laminator`;


//   /**Giving Style to Cell */
//   worksheet.getCell('J1').style = {
//     alignment: { horizontal: 'center', vertical: 'middle' },
//     font: {
//       size: 11, bold: true, italic: false
//     }
//   }

//   worksheet.getCell('A3').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 15, bold: true
//     }
//   }

//   worksheet.getCell('A1').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 22, bold: true
//     }
//   }

//   worksheet.getCell('J2').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 11, bold: true
//     }
//   }
//   worksheet.getCell('J3').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 11, bold: true
//     }
//   }

//   worksheet.getCell('E4').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 10, bold: true
//     }
//   }
  
// /**Border */
// worksheet.getCell('A1').border = Border;
// worksheet.getCell('I2').border = Border;
// worksheet.getCell('J1').border = Border;
// worksheet.getCell('L1').border = Border;
// worksheet.getCell('J2').border = Border;
// worksheet.getCell('L2').border = Border;
// worksheet.getCell('J3').border = Border;
// worksheet.getCell('L3').border = Border;
// worksheet.getCell('A3').border = Border;
// worksheet.getCell('I3').border = Border;
// worksheet.getCell('E4').border = Border;
// worksheet.getCell('L4').border = Border;
//   /**Height */
//   worksheet.getRow(1).height = 15;
//   worksheet.getRow(2).height = 27;
//   worksheet.getRow(3).height = 24;
//   worksheet.getRow(4).height = 25;
//   worksheet.getRow(5).height = 20;

//   worksheet.mergeCells('A4:B4')
//   worksheet.mergeCells('C4:D4')


//   worksheet.getCell('A4').value = `Date: ${Data[0]['Date']}`;
//   worksheet.getCell('C4').value = `Shift: ${Data[0]['Shift']}`;



//   worksheet.getCell('A4').style = Style({size:'10',bold:true});
//   worksheet.getCell('C4').style = Style({size:'10',bold:true})



//   worksheet.getCell('A4').border = Border;
//   worksheet.getCell('C4').border = Border;
//   worksheet.getCell('B4').border = Border;
//   worksheet.getCell('D4').border = Border;


 

//   worksheet.getColumn('C').width = 20;
//   worksheet.getColumn('D').width = 20;
//   worksheet.getColumn('D').width = 20;

//  worksheet.mergeCells('A5:B6')
//  worksheet.getCell('A5').value = 'Parameter';
//  worksheet.getCell('A5').style = Style({bold:true,size:10})
//  worksheet.getCell('A5').border = Border;
//  worksheet.getCell('B6').border = Border;

//  worksheet.mergeCells('C5:C6')
//  worksheet.getCell('C5').value = 'Specification';
//  worksheet.getCell('C5').style = Style({bold:true,size:10})
//  worksheet.getCell('C5').border = Border;
//  worksheet.getCell('C6').border = Border;

//  worksheet.mergeCells('D5:D6')
//  worksheet.getCell('D5').value = 'Tolerance';
//  worksheet.getCell('D5').style = Style({bold:true,size:10})
//  worksheet.getCell('D5').border = Border;
//  worksheet.getCell('D6').border = Border;

//  worksheet.mergeCells('E5:L5')
//  worksheet.getCell('E5').value = 'Observed Value';
//  worksheet.getCell('E5').style = Style({bold:true,size:11})
//  worksheet.getCell('E5').border = Border;
//  worksheet.getCell('L5').border = Border;

//  worksheet.mergeCells('E6:H6')
//  worksheet.getCell('E6').value = 'A';
//  worksheet.getCell('E6').style = Style({bold:true,size:11})
//  worksheet.getCell('E6').border = Border;
//  worksheet.getCell('H6').border = Border;

//  worksheet.mergeCells('I6:L6')
//  worksheet.getCell('I6').value = 'B';
//  worksheet.getCell('I6').style = Style({bold:true,size:11})
//  worksheet.getCell('I6').border = Border;
//  worksheet.getCell('L6').border = Border;
 


//  let Row = 7;

//  Data.forEach((data)=>{
//    worksheet.getRow(Row).height = 29

//   worksheet.mergeCells(`A${Row}:B${Row}`)
//   worksheet.getCell(`A${Row}`).value = data['Parameter'];
//   worksheet.getCell(`A${Row}`).style = Style({bold:true,size:11})
//   worksheet.getCell(`A${Row}`).border = Border;
//   worksheet.getCell(`B${Row}`).border = Border;

//   worksheet.mergeCells(`C${Row}:C${Row}`)
//   worksheet.getCell(`C${Row}`).value = data['Specification'].split('|')[0];
//   worksheet.getCell(`C${Row}`).style = Style({bold:true,size:11})
//   worksheet.getCell(`C${Row}`).border = Border;
//   worksheet.getCell(`C${Row}`).border = Border;

//   worksheet.mergeCells(`D${Row}:D${Row}`)
//   worksheet.getCell(`D${Row}`).value = data['Specification'].split('|')[1];
//   worksheet.getCell(`D${Row}`).style = Style({bold:true,size:11})
//   worksheet.getCell(`D${Row}`).border = Border;
//   worksheet.getCell(`D${Row}`).border = Border;

//   worksheet.mergeCells(`E${Row}:H${Row}`)
//   worksheet.getCell(`E${Row}`).value = data['ObservedValueA'];
//   worksheet.getCell(`E${Row}`).style = Style({bold:false,size:11})
//   worksheet.getCell(`E${Row}`).border = Border;
//   worksheet.getCell(`H${Row}`).border = Border;

//   worksheet.mergeCells(`I${Row}:L${Row}`)
//   worksheet.getCell(`I${Row}`).value = data['ObservedValueB'];
//   worksheet.getCell(`I${Row}`).style = Style({bold:false,size:11})
//   worksheet.getCell(`I${Row}`).border = Border;
//   worksheet.getCell(`L${Row}`).border = Border;
// Row++
//  })

//  worksheet.getRow(Row).height = 22;
//  worksheet.mergeCells(`A${Row}:L${Row}`)
//  worksheet.getCell(`A${Row}`).style = Style({size:12, bold:true});
//  worksheet.getCell(`A${Row}`).value = "Laminator Thermocouple Reading";
//  worksheet.getCell(`A${Row}`).border = Border;
//  worksheet.getCell(`L${Row}`).border = Border;

//  Row++;
//  worksheet.getRow(Row).height = 24;

//  worksheet.mergeCells(`A${Row}:D${Row}`)
//  worksheet.getCell(`A${Row}`).style = Style({size:12, bold:true});
//  worksheet.getCell(`A${Row}`).value = "Location";
//  worksheet.getCell(`A${Row}`).border = Border;
//  worksheet.getCell(`D${Row}`).border = Border;
 
//  worksheet.mergeCells(`E${Row}:L${Row}`)
//  worksheet.getCell(`E${Row}`).style = Style({size:12, bold:true});
//  worksheet.getCell(`E${Row}`).value = "Location Name";
//  worksheet.getCell(`E${Row}`).border = Border;
//  worksheet.getCell(`L${Row}`).border = Border;
// //  worksheet.getCell('A${Row}').value = "Laminator Thermocouple Reading"; 

// Row++;
// Data[0]['Location'] = JSON.parse(Data[0]['Location']);

// let LocationNumber = 1;
//  Data[0]['Location'].forEach((data)=>{
//   worksheet.getRow(Row).height = 22;

//   worksheet.mergeCells(`A${Row}:D${Row}`)
//   worksheet.getCell(`A${Row}`).style = Style({size:12, bold:true});
//   worksheet.getCell(`A${Row}`).value = `Location${LocationNumber}`;
//   worksheet.getCell(`A${Row}`).border = Border;
//   worksheet.getCell(`D${Row}`).border = Border;

//   worksheet.mergeCells(`E${Row}:L${Row}`)
//  worksheet.getCell(`E${Row}`).style = Style({size:12, bold:false});
//  worksheet.getCell(`E${Row}`).value = data['Locationfield'];
//  worksheet.getCell(`E${Row}`).border = Border;
//  worksheet.getCell(`L${Row}`).border = Border;

//  LocationNumber++;
//  Row++;
//  })
//  worksheet.getRow(Row).height = 24;

//  worksheet.mergeCells(`A${Row}:D${Row}`)
//  worksheet.getCell(`A${Row}`).style = Style({size:12, bold:true});
//  worksheet.getCell(`A${Row}`).value = `Checked By: ${Data[0]['Name']}`;
//  worksheet.getCell(`A${Row}`).border = Border;
//  worksheet.getCell(`D${Row}`).border = Border;


//  worksheet.mergeCells(`E${Row}:L${Row}`)
//  worksheet.getCell(`E${Row}`).style = Style({size:12, bold:true});
//  worksheet.getCell(`E${Row}`).value = `Reviewed  By: ${Data[0]['ReviewedBy'] || 'Unknown'}`;
//  worksheet.getCell(`E${Row}`).border = Border;
//  worksheet.getCell(`L${Row}`).border = Border;
//     //Save the workbook to a file
//     const excelBuffer = await workbook.xlsx.writeBuffer()
//     .then(buffer => {
//       console.log('Excel file generated successfully!');

//       return buffer; // Return the buffer
//     })
//     .catch(error => {
//       console.error('Error generating Excel file:', error);
//     });


//   fs.writeFileSync('output.xlsx', excelBuffer)
// }

// 
//LaminatorExcel()
  

// const FramingExcel = async() =>{
//   let Data = [{"FramingId":"d8445c68-46d0-4aff-aad8-37c65796abd3", "PreLamDetailId":"2fa5d654-b7ef-4153-8209-b96573fc6fdc", "Sample":"123", "FramingObservation":"43", "FramingDimension":"{\"x1\":\"54\",\"x2\":\"54\",\"y1\":\"54\",\"y2\":\"54\",\"l1\":\"\",\"l2\":\"54\",\"w1\":\"54\",\"w2\":\"54\"}", "Stage":"1", "PreLamDetailId":"2fa5d654-b7ef-4153-8209-b96573fc6fdc", "DocNo":"GSPL\/IPQC\/AF\/011", "RevNo":"1.0\/12.08.2023", "Date":"2024-05-02", "Shift":"Day Shift", "Line":"", "PONo":null, "CheckedBy":"ad320aa6-f3f2-11ee-b439-0ac93defbbf1", "CreatedBy":"", "UpdatedBy":null, "CreatedOn":"02-05-2024 08:18:19", "UpdatedOn":null, "Status":"Pending", "Type":"Framing", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/2fa5d654-b7ef-4153-8209-b96573fc6fdc.pdf", "Location":null, "PersonID":"", "EmployeeID":null, "Name":null, "LoginID":null, "Password":null, "WorkLocation":null, "Email":null, "Department":null, "ProfileImg":null, "Desgination":null, "Status":null, "CreatedBy":null, "UpdatedBy":null, "CreatedOn":null, "UpdatedOn":null, "CreadtedBy":null},
//   {"FramingId":"018d0a36-e4c7-495b-9773-eef5ececc89f", "PreLamDetailId":"2fa5d654-b7ef-4153-8209-b96573fc6fdc", "Sample":"325", "FramingObservation":"47", "FramingDimension":"{\"x1\":\"6\",\"x2\":\"98\",\"y1\":\"oi\",\"y2\":\"y\",\"l1\":\"r\",\"l2\":\"54\",\"w1\":\"12\",\"w2\":\"43\"}", "Stage":"5", "PreLamDetailId":"2fa5d654-b7ef-4153-8209-b96573fc6fdc", "DocNo":"GSPL\/IPQC\/AF\/011", "RevNo":"1.0\/12.08.2023", "Date":"2024-05-02", "Shift":"Day Shift", "Line":"", "PONo":null, "CheckedBy":"ad320aa6-f3f2-11ee-b439-0ac93defbbf1", "CreatedBy":"", "UpdatedBy":null, "CreatedOn":"02-05-2024 08:18:19", "UpdatedOn":null, "Status":"Pending", "Type":"Framing", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/2fa5d654-b7ef-4153-8209-b96573fc6fdc.pdf", "Location":null, "PersonID":"", "EmployeeID":null, "Name":null, "LoginID":null, "Password":null, "WorkLocation":null, "Email":null, "Department":null, "ProfileImg":null, "Desgination":null, "Status":null, "CreatedBy":null, "UpdatedBy":null, "CreatedOn":null, "UpdatedOn":null, "CreadtedBy":null},
//   {"FramingId":"a268b527-7d93-489f-9726-201c36ff0b26", "PreLamDetailId":"2fa5d654-b7ef-4153-8209-b96573fc6fdc", "Sample":"12", "FramingObservation":"32", "FramingDimension":"{\"x1\":\"435\",\"x2\":\"65\",\"y1\":\"657\",\"y2\":\"6\",\"l1\":\"87\",\"l2\":\"87\",\"w1\":\"98\",\"w2\":\"98\"}", "Stage":"2", "PreLamDetailId":"2fa5d654-b7ef-4153-8209-b96573fc6fdc", "DocNo":"GSPL\/IPQC\/AF\/011", "RevNo":"1.0\/12.08.2023", "Date":"2024-05-02", "Shift":"Day Shift", "Line":"", "PONo":null, "CheckedBy":"ad320aa6-f3f2-11ee-b439-0ac93defbbf1", "CreatedBy":"", "UpdatedBy":null, "CreatedOn":"02-05-2024 08:18:19", "UpdatedOn":null, "Status":"Pending", "Type":"Framing", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/2fa5d654-b7ef-4153-8209-b96573fc6fdc.pdf", "Location":null, "PersonID":"", "EmployeeID":null, "Name":null, "LoginID":null, "Password":null, "WorkLocation":null, "Email":null, "Department":null, "ProfileImg":null, "Desgination":null, "Status":null, "CreatedBy":null, "UpdatedBy":null, "CreatedOn":null, "UpdatedOn":null, "CreadtedBy":null},
//   {"FramingId":"b46e01ea-dec0-4dea-9b5e-137c2a5be540", "PreLamDetailId":"2fa5d654-b7ef-4153-8209-b96573fc6fdc", "Sample":"435", "FramingObservation":"4", "FramingDimension":"{\"x1\":\"87\",\"x2\":\"98\",\"y1\":\"12\",\"y2\":\"5\",\"l1\":\"769\",\"l2\":\"8\",\"w1\":\"09\",\"w2\":\"65\"}", "Stage":"4", "PreLamDetailId":"2fa5d654-b7ef-4153-8209-b96573fc6fdc", "DocNo":"GSPL\/IPQC\/AF\/011", "RevNo":"1.0\/12.08.2023", "Date":"2024-05-02", "Shift":"Day Shift", "Line":"", "PONo":null, "CheckedBy":"ad320aa6-f3f2-11ee-b439-0ac93defbbf1", "CreatedBy":"", "UpdatedBy":null, "CreatedOn":"02-05-2024 08:18:19", "UpdatedOn":null, "Status":"Pending", "Type":"Framing", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/2fa5d654-b7ef-4153-8209-b96573fc6fdc.pdf", "Location":null, "PersonID":"", "EmployeeID":null, "Name":null, "LoginID":null, "Password":null, "WorkLocation":null, "Email":null, "Department":null, "ProfileImg":null, "Desgination":null, "Status":null, "CreatedBy":null, "UpdatedBy":null, "CreatedOn":null, "UpdatedOn":null, "CreadtedBy":null},
//   {"FramingId":"ec0579a3-66eb-41f1-9da6-43a451f55a63", "PreLamDetailId":"2fa5d654-b7ef-4153-8209-b96573fc6fdc", "Sample":"76", "FramingObservation":"65", "FramingDimension":"{\"x1\":\"65\",\"x2\":\"76\",\"y1\":\"76\",\"y2\":\"6\",\"l1\":\"767\",\"l2\":\"6\",\"w1\":\"87\",\"w2\":\"34\"}", "Stage":"3", "PreLamDetailId":"2fa5d654-b7ef-4153-8209-b96573fc6fdc", "DocNo":"GSPL\/IPQC\/AF\/011", "RevNo":"1.0\/12.08.2023", "Date":"2024-05-02", "Shift":"Day Shift", "Line":"", "PONo":null, "CheckedBy":"ad320aa6-f3f2-11ee-b439-0ac93defbbf1", "CreatedBy":"", "UpdatedBy":null, "CreatedOn":"02-05-2024 08:18:19", "UpdatedOn":null, "Status":"Pending", "Type":"Framing", "PreLamPdf":"http:\/\/srv515471.hstgr.cloud:8080\/IPQC\/Pdf\/2fa5d654-b7ef-4153-8209-b96573fc6fdc.pdf", "Location":null, "PersonID":"", "EmployeeID":null, "Name":null, "LoginID":null, "Password":null, "WorkLocation":null, "Email":null, "Department":null, "ProfileImg":null, "Desgination":null, "Status":null, "CreatedBy":null, "UpdatedBy":null, "CreatedOn":null, "UpdatedOn":null, "CreadtedBy":null}]





//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet('Framing');
//   let Style = ({size, bold, horizontal = 'center', vertical = 'middle'})=>{

//    let style =  {
//       alignment: { horizontal: horizontal, vertical: vertical, wrapText: true },
//       font: {
//         size: size, bold: bold
//       }
//     }
//     return style;
//   }

//   let Style2 = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 22, bold: false
//     }
//   }

//   let MatrixData = [{
//     'Date': Data[0]['Date'],
//     'Shift': Data[0]['Shift'],
//     'Acceptance Crieteria': ">-4N"
//   },
//   {
//     'Line': Data[0]['Line'],
//     'Buusing Stage': Data[0]['BussingStage'],
//     'Operator Name': Data[0]['OperatorName'],
//   },
//   {
//     'Ribbon Width': Data[0]['Line'],
//     'Busbar Width': Data[0]['BussingStage'],
//     'Result': "NA",
//   }]
//   let Border = {
//     top: { style: 'thin' },
//     bottom: { style: 'thin' },
//     left: { style: 'thin' },
//     right: { style: 'thin' }
//   }




//   /**Merging Cells */
//   worksheet.mergeCells('A1:I2')
//   worksheet.mergeCells('J1:L1')
//   worksheet.mergeCells('A3:I3')
//   worksheet.mergeCells('J2:L2')
//   worksheet.mergeCells('J3:L3')
//   worksheet.mergeCells('E4:L4')



//   /**putting value in cell */
//   worksheet.getCell('J1').value = 'Page No.1';
//   worksheet.getCell('A1').value = 'Gautam Solar Pvt. Ltd';
//   worksheet.getCell('A3').value = `Framing Measurement CheckSheet`;
//   worksheet.getCell('J2').value = `Doc No. ${Data[0]['DocNo']}`;
//   worksheet.getCell('J3').value = `Rev No. ${Data[0]['RevNo']}`;
//   worksheet.getCell('E4').value = `Line No: ${Data[0]['Line']}`;


//   /**Giving Style to Cell */
//   worksheet.getCell('J1').style = {
//     alignment: { horizontal: 'center', vertical: 'middle' },
//     font: {
//       size: 12, bold: true, italic: false
//     }
//   }

//   worksheet.getCell('A3').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 15, bold: true
//     }
//   }

//   worksheet.getCell('A1').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 22, bold: true
//     }
//   }

//   worksheet.getCell('J2').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 12, bold: true
//     }
//   }
//   worksheet.getCell('J3').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 12, bold: true
//     }
//   }

//   worksheet.getCell('E4').style = {
//     alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
//     font: {
//       size: 12, bold: true
//     }
//   }

// /**Border */
// worksheet.getCell('A1').border = Border;
// worksheet.getCell('I2').border = Border;
// worksheet.getCell('J1').border = Border;
// worksheet.getCell('L1').border = Border;
// worksheet.getCell('J2').border = Border;
// worksheet.getCell('L2').border = Border;
// worksheet.getCell('J3').border = Border;
// worksheet.getCell('L3').border = Border;
// worksheet.getCell('A3').border = Border;
// worksheet.getCell('I3').border = Border;
// worksheet.getCell('E4').border = Border;
// worksheet.getCell('L4').border = Border;
//   /**Height */
//   worksheet.getRow(1).height = 15;
//   worksheet.getRow(2).height = 27;
//   worksheet.getRow(3).height = 24;
//   worksheet.getRow(4).height = 25;
//   worksheet.getRow(5).height = 20;

//   worksheet.mergeCells('A4:B4')
//   worksheet.mergeCells('C4:D4')


//   worksheet.getCell('A4').value = `Date: ${Data[0]['Date']}`;
//   worksheet.getCell('C4').value = `Shift: ${Data[0]['Shift']}`;



//   worksheet.getCell('A4').style = Style({size:12,bold:true});
//   worksheet.getCell('C4').style = Style({size:12,bold:true})



//   worksheet.getCell('A4').border = Border;
//   worksheet.getCell('C4').border = Border;
//   worksheet.getCell('B4').border = Border;
//   worksheet.getCell('D4').border = Border;




//   worksheet.getColumn('C').width = 10;
//   worksheet.getColumn('D').width = 10;

//   worksheet.getRow(5).height = 31

//   worksheet.mergeCells('A5:G5')
//   worksheet.getCell('A5').value = `Sample Check Qty`
//   worksheet.getCell('A5').style = Style(({size:14,bold:true}));
//   worksheet.getCell('A5').border = Border;
//   worksheet.getCell('F5').border = Border;

//   worksheet.getRow(6).height = 31

//   worksheet.mergeCells('A6:G6')
//   worksheet.getCell('A6').value = `Module ID`
//   worksheet.getCell('A6').style = Style(({size:14,bold:true}));
//   worksheet.getCell('A6').border = Border;
//   worksheet.getCell('F6').border = Border;

//   worksheet.getColumn('A').width = 21

//   worksheet.getRow(7).height = 36.23
//   worksheet.getRow(8).height = 36.23

//   worksheet.mergeCells('A7:A8')
//   worksheet.getCell('A7').value = `Framing Observation(v)/(x)`
//   worksheet.getCell('A7').style = Style(({size:12,bold:true}));
//   worksheet.getCell('A7').border = Border;
//   worksheet.getCell('A8').border = Border;

//   worksheet.mergeCells('B7:G8')
//   worksheet.getCell('B7').value = `Glue uniformity & countinuity in frame groove`
//   worksheet.getCell('B7').style = Style(({size:13,bold:true}));
//   worksheet.getCell('B7').border = Border;
//   worksheet.getCell('C8').border = Border;

//   let FramingDimensionValue = ['Mounting Hole x1 pitch','Mounting Hole x2 pitch','Mounting Hole y1 pitch','Mounting Hole y2 pitch','Length L1','Length L2','Width w1','Width w2']

//   let Row = 9
//   let IntialRow = Row;

//   FramingDimensionValue.forEach((value)=>{
//     worksheet.getRow(Row).height = 32.23


//   worksheet.mergeCells(`B${Row}:G${Row}`)
//   worksheet.getCell(`B${Row}`).value = value;
//   worksheet.getCell(`B${Row}`).style = Style(({size:13,bold:true}));
//   worksheet.getCell(`B${Row}`).border = Border;
//   worksheet.getCell(`G${Row}`).border = Border;

//   Row++;

//   })

//   worksheet.mergeCells(`A${IntialRow}:A${Row-1}`)
//   worksheet.getCell(`A${IntialRow}`).value = `Framing Dimension(mm)`
//   worksheet.getCell(`A${IntialRow}`).style = Style(({size:12,bold:true}));
//   worksheet.getCell(`A${IntialRow}`).border = Border;
//   worksheet.getCell(`A${Row-1}`).border = Border;

//   let startCharCode = 'H'.charCodeAt(0); // 1
//   let endCharCode = 'L'.charCodeAt(0); //3
//  let number = 1;
//   for(let i = startCharCode; i<=endCharCode; i++){
//   worksheet.getColumn(`${String.fromCharCode(i)}`).width = 25

//     worksheet.getCell(`${String.fromCharCode(i)}5`).value = `${number}`
//   worksheet.getCell(`${String.fromCharCode(i)}5`).style = Style(({size:12,bold:true}));
//   worksheet.getCell(`${String.fromCharCode(i)}5`).border = Border;

//   number++;
//   }

// Data.forEach((data)=>{
//   data['Stage'] = Number(data['Stage'])
//   data['FramingDimension'] = JSON.parse(data['FramingDimension'])
// })

// Data.sort((a,b)=> a.Stage - b.Stage);

//  startCharCode = 'H'.charCodeAt(0);
// Data.forEach((data)=>{

//   worksheet.getCell(`${String.fromCharCode(startCharCode)}6`).value = data['Sample'];
//   worksheet.getCell(`${String.fromCharCode(startCharCode)}6`).style = Style(({size:12,bold:false}));
//   worksheet.getCell(`${String.fromCharCode(startCharCode)}6`).border = Border;

//   worksheet.mergeCells(`${String.fromCharCode(startCharCode)}7:${String.fromCharCode(startCharCode)}8`)
//   worksheet.getCell(`${String.fromCharCode(startCharCode)}7`).value = data['FramingObservation'];
//   worksheet.getCell(`${String.fromCharCode(startCharCode)}7`).style = Style(({size:12,bold:false}));
//   worksheet.getCell(`${String.fromCharCode(startCharCode)}7`).border = Border;
//   worksheet.getCell(`${String.fromCharCode(startCharCode)}8`).border = Border;

//   let innerRow = 9;
//  for(let key in data['FramingDimension']){

//   worksheet.getCell(`${String.fromCharCode(startCharCode)}${innerRow}`).value = data['FramingDimension'][key];
//   worksheet.getCell(`${String.fromCharCode(startCharCode)}${innerRow}`).style = Style(({size:12,bold:false}));
//   worksheet.getCell(`${String.fromCharCode(startCharCode)}${innerRow}`).border = Border;
//   innerRow++;
//  }
//   startCharCode++;
// })

// worksheet.getRow(17).height = 30;

// worksheet.mergeCells(`A17:H17`)
// worksheet.getCell('A17').value = `Done By: ${Data[0]['Name']}`
// worksheet.getCell('A17').style = Style(({size:13,bold:true, horizontal:'left'}));
// worksheet.getCell('A17').border = Border;
// worksheet.getCell('H17').border = Border;


// worksheet.mergeCells(`I17:L17`)
// worksheet.getCell('I17').value = `Reviewed By: ${Data[0]['ReviewedBy'] || 'Unknown'}`
// worksheet.getCell('I17').style = Style(({size:13,bold:true, horizontal:'left'}));
// worksheet.getCell('I17').border = Border;
// worksheet.getCell('L17').border = Border;

//     //Save the workbook to a file
//     const excelBuffer = await workbook.xlsx.writeBuffer()
//     .then(buffer => {
//       console.log('Excel file generated successfully!');

//       return buffer; // Return the buffer
//     })
//     .catch(error => {
//       console.error('Error generating Excel file:', error);
//     });


//   fs.writeFileSync('output.xlsx', excelBuffer)
// }

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

const QualityExcelShedule = async(Status)=>{
  const currentDate = new Date();
  const previousDate = new Date(currentDate);
  previousDate.setDate(currentDate.getDate() - 1);

  const formattedCurrentDate = formatDate(currentDate);
  const formattedPreviousDate = formatDate(previousDate);

  const UUID = v4()
  try {
    let query = `SELECT Q.CreatedOn, Q.QualityId, Q.Shift, Q.ShiftInChargeName, Q.ShiftInChargePreLime, Q.ShiftInChargePostLim, Q.ProductBarCode, P.Name AS CreatedBy, Q.Wattage, Q.Stage, Q.ResposiblePerson, Q.ReasonOfIssue, Q.IssueComeFrom, Q.ActionTaken, Q.OtherIssueType, Q.ModulePicture,Q.Status, Q.OtherModelNumber,Q.IssueType,Q.ModelNumber, Q.CreatedTime
    FROM Quality Q
    JOIN Person P ON P.PersonID = Q.CreatedBy
    WHERE Q.Status = '${Status}' AND STR_TO_DATE(Q.CreatedOn, '%d-%m-%Y %H:%i:%s') BETWEEN STR_TO_DATE('${formattedPreviousDate} 00:00:00', '%d-%m-%Y %H:%i:%s') AND STR_TO_DATE('${formattedCurrentDate} 23:59:59', '%d-%m-%Y %H:%i:%s')
    ORDER BY STR_TO_DATE(Q.CreatedOn, '%d-%m-%Y %H:%i:%s') DESC;`;

  //  let query = `SELECT Q.CreatedOn, Q.QualityId, Q.Shift, Q.ShiftInChargeName, Q.ShiftInChargePreLime, Q.ShiftInChargePostLim, Q.ProductBarCode, P.Name AS CreatedBy, Q.Wattage, Q.Stage, Q.ResposiblePerson, Q.ReasonOfIssue, Q.IssueComeFrom, Q.ActionTaken, Q.OtherIssueType, Q.ModulePicture, Q.OtherModelNumber, I.Issue, M.ModelName
  //  FROM Quality Q
  //  JOIN IssuesType I ON I.IssueId = Q.IssueType
  //  JOIN Person P ON P.PersonID = Q.CreatedBy
  //  JOIN ModelTypes M ON M.ModelId = Q.ModelNumber
  //  WHERE Q.Status = '${Status}' AND STR_TO_DATE(Q.CreatedOn, '%d-%m-%Y %H:%i:%s') BETWEEN STR_TO_DATE('${FromDate} 00:00:00', '%d-%m-%Y %H:%i:%s') AND STR_TO_DATE('${ToDate} 23:59:59', '%d-%m-%Y %H:%i:%s')
  //  ORDER BY STR_TO_DATE(Q.CreatedOn, '%d-%m-%Y %H:%i:%s') DESC;`

    const Quality = await queryAsync(query);
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

    let QualityExcelBytes = await QualityExcelGenerate(Quality, formattedPreviousDate, formattedCurrentDate, Status);

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
                                    VALUES('${UUID}','${formattedPreviousDate}','${formattedCurrentDate}','http://srv515471.hstgr.cloud:${PORT}/Quality/File/${fileName}','','${getCurrentDateTime()}');`
    await queryAsync(query);
    return `Sent it Email Succesfully of ${Status} Quality Report🚀`
  } catch (err) {
    console.log(err)
    return err
  }
}



app.get("/getFile", (req, res) => {
  const pathfile = Path.join(__dirname, 'check.png');
  res.download(pathfile);
});


cron.schedule('0 10 * * *', async () => {
  try {
   
    let result =  await QualityExcelShedule('Inprogress');
   console.log((await chalk).default.blueBright(result));

  } catch (error) {
    console.error((await chalk).default.red('Error in cron job:', error));
    //console.error('Error in cron job:', error);
  }
}, {
  timezone: 'Asia/Kolkata' 
});



cron.schedule('4 10 * * *', async () => {
  try {
   
    let result=  await QualityExcelShedule('Completed');
   console.log((await chalk).default.green(result));

  } catch (error) {
    console.error((await chalk).default.red('Error in cron job:', error));
    //console.error('Error in cron job:', error);
  }
}, {
  timezone: 'Asia/Kolkata' 
});


app.listen(PORT, async () => {
  try {
    console.log((await chalk).default.green('server is running'));
    console.log((await chalk).default.yellow('Database is connecting....'))
  
    dbConn
  } catch (err) {
    console.log(err)
  }
})
