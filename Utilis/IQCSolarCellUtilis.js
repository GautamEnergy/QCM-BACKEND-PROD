const AWS = require('aws-sdk');
const {transport} = require('../Utilis/Person.utilis')
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const ExcelJS = require('exceljs');
const Path = require('path');
const fs = require('fs')
require('dotenv').config();

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
  }
  

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


async function ExcelGenerate(IQC, ApproveData) {

  // function GetCheckType(CheckType) {
  //   let MaterialName = IQC[0]['MaterialName'];

  //   if (MaterialName == 'Solar Glass') {
  //     CheckType = CheckType == 'FrontBus' ? 'Mechanical' : 'FrontBus';
  //     CheckType = CheckType == 'Electrical' ? 'Visual' : 'Electrical';

  //   } else if (MaterialName = 'Backsheet') {
  //     CheckType = CheckType == 'Packaging' ? 'Visual' : 'Packaging';
  //     CheckType = CheckType == 'Visual' ? 'Physical' : 'Visual';
  //     CheckType = CheckType == 'Physical' ? 'Performance' : 'Physical';
  //     CheckType = CheckType == 'FrontBus' ? 'Verification' : 'FrontBus';

  //   } else if (MaterialName == 'EVA(Encapsulant)') {
  //     CheckType = CheckType == 'Packaging' ? 'Visual' : 'Packaging';
  //     CheckType = CheckType == 'Visual' ? 'Physical' : 'Visual';
  //     CheckType = CheckType == 'Physical' ? 'Performance' : 'Physical';
  //     CheckType = CheckType == 'FrontBus' ? 'Performance' : 'FrontBus';
      
  //   }else if(MaterialName == 'Anodize Aluminium Frame'){
  //     CheckType = CheckType == 'Packaging' ? 'Visual' : 'Packaging';
  //     CheckType = CheckType == 'Physical' ? 'Measurement' : 'Physical';
  //     CheckType = CheckType == 'FrontBus' ? 'Measurement' : 'FrontBus';
  //     CheckType = CheckType == 'Verification' ? 'Measurement' : 'Verification';
  //     CheckType = CheckType == 'Electrical' ? 'Verification' : 'Electrical';

  //   }else if(MaterialName == 'Junction Box'){
  //     CheckType = CheckType == 'Packaging' ? 'Visual' : 'Packaging';
  //     CheckType = CheckType == 'FrontBus' ? 'Electrical' : 'FrontBus';
  //     CheckType = CheckType == 'Performance' ? 'Verification' : 'Performance';

  //   }else if(MaterialName == 'PV Ribbon'){
  //     CheckType = CheckType == 'Packaging' ? 'Visual' : 'Packaging';
  //     CheckType = CheckType == 'Visual' ? 'Physical' : 'Visual';
  //     CheckType = CheckType == 'Physical' ? 'Verification' : 'Physical';
  //     CheckType = CheckType == 'FrontBus' ? 'Performance' : 'FrontBus';
  //     CheckType = CheckType == 'Electrical' ? 'Verification' : 'Electrical';
  //     CheckType = CheckType == 'Performance' ? 'Verification' : 'Performance';

  //   }else if(MaterialName == ''){

  //   }
  // }

   let MaterialName = IQC[0]['MaterialName']
/** re-assignening check types of Material (array) */
  let SolarGlassCheckTypes = ['Packaging','Visual','Physical','Mechanical','Verification','Visual'];
  let BacksheetCheckTypes = ['Visual','Physical','Performance','Verification','Verification'];
  let EVCheckTypes = ['Visual','Physical','Performance','Performance','Verification'];
  let AluminiumCheckTypes = ['Visual','Visual','Measurement','Measurement','Measurement','Verification'];
  let PVRibbonCheckTypes = ['Visual','Physical','Verification','Performance','Verification','Verification','Verification','Verification'];
  let SealentCheckTypes = ['Visual','Performance','Performance','Performance','Visual','Verification','Verification','Verification'];
  let FluxCheckTypes = ['Visual/Verification','Visual','Verification','Verification','Verification'];
  let JunctionBox = ['Visual','Physical','Electrical','Measurement','Verification','Verification']

 if(MaterialName == 'Solar Glass'){
  IQC.forEach((Material,i)=>{
    Material['CheckType'] = SolarGlassCheckTypes[i];
   })

 }else if(MaterialName == 'Backsheet'){
  IQC.forEach((Material,i)=>{
    Material['CheckType'] = BacksheetCheckTypes[i];
   })

 }else if(MaterialName == 'Flux'){
  IQC.forEach((Material,i)=>{
    Material['CheckType'] = FluxCheckTypes[i];
   })

 }else if(MaterialName == 'EVA(Encapsulant)'){
  IQC.forEach((Material,i)=>{
    Material['CheckType'] = EVCheckTypes[i];
   })

 }else if(MaterialName == 'PV Ribbon'){
  IQC.forEach((Material,i)=>{
    Material['CheckType'] = PVRibbonCheckTypes[i];
   })

 }else if(MaterialName == 'Aluminium Frame'){
  IQC.forEach((Material,i)=>{
    Material['CheckType'] = AluminiumCheckTypes[i];
   })

 }else if(MaterialName == 'Sealant/Poating'){
  IQC.forEach((Material,i)=>{
    Material['CheckType'] = SealentCheckTypes[i];
   })

 }else if(MaterialName == 'Junction Box'){
  IQC.forEach((Material,i)=>{
    Material['CheckType'] = JunctionBox[i];
   })

 }

 

  let exceldata = [{ "column": "Lot Size", "value": IQC[0]['LotSize'] },
  { "column": "Material Name", "value": IQC[0]['MaterialName'] },
  { "column": "Supplier Name:", "value": IQC[0]['SupplierName'] },
  { "column": "Invoice Date:", "value": IQC[0]['InvoiceDate'] },
  { "column": "Raw Material Specs", "value": IQC[0]['RawMaterialSpecs'] }
  ]
  
  let rightexceldata = [{"column":"No. of Samples to be checked","value":''},
  {"column":"Sample to be checked","value":"AS PER SIL S1 AQL 4.0"},
  {"column":"Suppliers'RM Batch No.:","value":IQC[0]['SupplierRMBatchNo']},
  {"column":"Invoice No.:","value":IQC[0]['InvoiceNo']},
  {"column":"Receipt Date:","value":IQC[0]['ReceiptDate']}
  ]
  
  
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Junction Box');
  
  
  let Border = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left:{style:'thin'},
    right:{style:'thin'}
  }
  
  
  
  let ColumnNameA = 'A'
  let ColumnValueB = 'B'
  // worksheet.getColumn(ColumnNameA).width = 22;
  // worksheet.getColumn(ColumnValueB).width = 22;
  
  let CellNo = 7
  
   exceldata.forEach((data,ind)=>{
    
  
  worksheet.mergeCells(`A${CellNo}:C${CellNo}`)
  worksheet.mergeCells(`D${CellNo}:F${CellNo}`)
  worksheet.getCell(`A${CellNo}`).value = data['column'];
  worksheet.getCell(`D${CellNo}`).value = data['value'];
  worksheet.getCell(`A${CellNo}`).style = {alignment:{horizontal:'center',vertical:'middle'},font:{size:10,bold:true}};
  worksheet.getCell(`D${CellNo}`).style = {alignment:{horizontal:'center',vertical:'middle'},font:{size:10,bold:true}};
  worksheet.getCell(`A${CellNo}`).border = Border
  worksheet.getCell(`C${CellNo}`).border = Border
  worksheet.getCell(`D${CellNo}`).border = Border
  worksheet.getCell(`F${CellNo}`).border = Border
  
  worksheet.mergeCells(`G${CellNo}:J${CellNo}`)
  worksheet.mergeCells(`K${CellNo}:N${CellNo}`)
  worksheet.getCell(`G${CellNo}`).value = rightexceldata[ind]['column'];
  worksheet.getCell(`K${CellNo}`).value = rightexceldata[ind]['value'];
  worksheet.getCell(`G${CellNo}`).style = {alignment:{horizontal:'center',vertical:'middle'},font:{size:10,bold:true}};
  worksheet.getCell(`K${CellNo}`).style = {alignment:{horizontal:'center',vertical:'middle'},font:{size:10,bold:true}};
  worksheet.getCell(`G${CellNo}`).border = Border
  worksheet.getCell(`K${CellNo}`).border = Border
  worksheet.getCell(`J${CellNo}`).border = Border
  worksheet.getCell(`N${CellNo}`).border = Border
    
    // worksheet.getCell(`${ColumnNameA}${CellNo}`).value = data['column'];
    // worksheet.getCell(`${ColumnValueB}${CellNo}`).value = data['value']
    // worksheet.getCell(`${ColumnNameA}${CellNo}`).style = {alignment:{horizontal:'center',vertical:'middle'},font:{size:8,bold:true}};
    // worksheet.getCell(`${ColumnValueB}${CellNo}`).style = {alignment:{horizontal:'center',vertical:'middle'},font:{size:8,bold:true}};
    // worksheet.getCell(`${ColumnNameA}${CellNo}`).border = Border
    // worksheet.getCell(`${ColumnValueB}${CellNo}`).border = Border
    CellNo++;
  })
  // Merge cells for the header and set text
  worksheet.mergeCells('A1:N2');
   worksheet.mergeCells('A3:G6');
   worksheet.mergeCells('H3:K4');
   worksheet.mergeCells('H5:K6');
   worksheet.mergeCells('L3:N4')
  worksheet.mergeCells('L5:N6');  /** Day Lot No. */
  
  // Set text for merged cells
  worksheet.getCell('A3').value = 'Gautam Solar Pvt Ltd.';
  worksheet.getCell('A1').value = `Incoming Quality Control Plan (${IQC[0]['MaterialName']})`;
  worksheet.getCell('H3').value = 'Document No';
  worksheet.getCell('H5').value = 'Rev. No./Rev. Date';
  worksheet.getCell('L5').value = IQC[0]['RevisionNo'];
  worksheet.getCell('L3').value = IQC[0]['DocumentNo'];
  
  // Apply header styling
  worksheet.getCell('A1').style = {
    alignment: { horizontal: 'center', vertical: 'middle' }, font: { size: 16, bold: true }, fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF6DC' } // Yellow background color
    }
  }

  worksheet.getCell('A3').style = { alignment: { horizontal: 'center', vertical: 'middle' }, font: { size: 15, bold: true } };
  worksheet.getCell('H3').style = { alignment: { horizontal: 'center', vertical: 'middle' }, font: { size: 12, bold: true } };
  worksheet.getCell('L3').style = { alignment: { horizontal: 'center', vertical: 'middle' }, font: { size: 12, bold: true } };
  worksheet.getCell('H5').style = { alignment: { horizontal: 'center', vertical: 'middle' }, font: { size: 12, bold: true } };
  worksheet.getCell('L5').style = { alignment: { horizontal: 'center', vertical: 'middle' }, font: { size: 12, bold: true } };
  worksheet.getCell('L3').style = { alignment: { horizontal: 'center', vertical: 'middle' }, font: { size: 12, bold: true } };

  // Apply borders
  worksheet.getCell('A1').border = Border;
  worksheet.getCell('N2').border = Border;
  worksheet.getCell('A3').border = Border;
  worksheet.getCell('H3').border = Border;
  worksheet.getCell('L3').border = Border;
  worksheet.getCell('H5').border = Border;
  worksheet.getCell('L5').border = Border;
  worksheet.getCell('K4').border = Border;
  worksheet.getCell('K6').border = Border;
  worksheet.getCell('N6').border = Border;
  worksheet.getCell('N4').border = Border;
  worksheet.getCell('G6').border = Border;
  
  /** Column  */
  
  /**Merge Cells */
  worksheet.mergeCells('A12:A13')
  worksheet.getColumn('A').width = 15;
  worksheet.getCell('A12').value = 'Check Type'
  worksheet.getCell('A12').style = {alignment:{horizontal:'center',vertical:'middle',wrapText:true},font:{size:10,bold:true},wrapText:true};
  worksheet.getCell('A12').border = Border;
  worksheet.getCell('A13').border = Border;
  
  
  worksheet.mergeCells('B12:B13')
  worksheet.getColumn('B').width = 15;
  worksheet.getCell('B12').value = 'Characterstics';
  worksheet.getCell('B12').style ={alignment:{horizontal:'center',vertical:'middle',wrapText:true},font:{size:10,bold:true},wrapText:true};
  worksheet.getCell('B12').border = Border;
  worksheet.getCell('B13').border = Border;
  
  
  worksheet.mergeCells('C12:C13')
  worksheet.getColumn('C').width = 15;
  worksheet.getCell('C12').value = 'Measuring Method';
  worksheet.getCell('C12').style = {alignment:{horizontal:'center',vertical:'middle',wrapText:true},font:{size:10,bold:true},wrapText:true};
  worksheet.getCell('C12').border = Border;
  worksheet.getCell('C13').border = Border;
  
  
  worksheet.mergeCells('D12:D13')
  worksheet.getColumn('D').width = 15;
  worksheet.getCell('D12').value = 'Sampling';
  worksheet.getCell('D12').style = {alignment:{horizontal:'center',vertical:'middle',wrapText:true},font:{size:10,bold:true},wrapText:true};
  worksheet.getCell('D12').border = Border;
  worksheet.getCell('D13').border = Border;
  
  
  worksheet.mergeCells('E12:E13')
  worksheet.getColumn('E').width = 15;
  worksheet.getCell('E12').value = 'Reference';
  worksheet.getCell('E12').style = {alignment:{horizontal:'center',vertical:'middle',wrapText:true},font:{size:10,bold:true},wrapText:true};
  worksheet.getCell('E12').border = Border;
  worksheet.getCell('E13').border = Border;
  
  
  worksheet.mergeCells('F12:F13')
  worksheet.getColumn('F').width = 15;
  worksheet.getCell('F12').value = 'Acceptance Criteria';
  worksheet.getCell('F12').style = {alignment:{horizontal:'center',vertical:'middle',wrapText:true},font:{size:10,bold:true},wrapText:true};
  worksheet.getCell('F12').border = Border;
  worksheet.getCell('F13').border = Border;
  
  
  worksheet.mergeCells('G12:N12')
  worksheet.getCell('G12').value = 'Samples';
  worksheet.getCell('G12').style = {alignment:{horizontal:'center',vertical:'middle',wrapText:true},font:{size:12,bold:true},wrapText:true};
  worksheet.getCell('G12').border = Border;
  worksheet.getCell('N12').border = Border;
  
  let SamplesArray =[{Cell:'G',S:'S1'},{Cell:'H',S:'S2'},{Cell:'I',S:'S3'},{Cell:'J',S:'S4'},{Cell:'K',S:'S5'},{Cell:'L',S:'S6'},{Cell:'M',S:'S7'},{Cell:'N',S:'S8'}];
  
  let SampleCellNo = 13;
  SamplesArray.forEach((Sample)=>{
    worksheet.getCell(`${Sample['Cell']}${SampleCellNo}`).value = `${Sample['S']}`;
    worksheet.getCell(`${Sample['Cell']}${SampleCellNo}`).style = {alignment:{horizontal:'center',vertical:'middle',wrapText:true},font:{size:10,bold:true},wrapText:true};
    worksheet.getCell(`${Sample['Cell']}${SampleCellNo}`).border = Border;
    
  })
  
  let Row  = 14;
  IQC.forEach((Material)=>{
    /**Check Type */
    worksheet.getRow(Row).height = 48;

    worksheet.getCell(`A${Row}`).value = Material['CheckType'];
    worksheet.getCell(`A${Row}`).style = {alignment:{horizontal:'center',vertical:'middle',wrapText:true},font:{size:10,}};
    worksheet.getCell(`A${Row}`).border = Border;
    
  
    worksheet.getCell(`B${Row}`).value = Material['Characterstics'];
    worksheet.getCell(`B${Row}`).style = {alignment:{horizontal:'center',vertical:'middle',wrapText:true},font:{size:10,}};
    worksheet.getCell(`B${Row}`).border = Border;
    
    worksheet.getCell(`C${Row}`).value = Material['MeasuringMethod'];
    worksheet.getCell(`C${Row}`).style = {alignment:{horizontal:'center',vertical:'middle',wrapText:true},font:{size:10,}};
    worksheet.getCell(`C${Row}`).border = Border;
  
    worksheet.getCell(`D${Row}`).value = Material['Sampling'];
    worksheet.getCell(`D${Row}`).style = {alignment:{horizontal:'center',vertical:'middle',wrapText:true},font:{size:10,}};
    worksheet.getCell(`D${Row}`).border = Border;
  
    worksheet.getCell(`E${Row}`).value = Material['Reference'];
    worksheet.getCell(`E${Row}`).style = {alignment:{horizontal:'center',vertical:'middle',wrapText:true},font:{size:10,}};
    worksheet.getCell(`E${Row}`).border = Border;
  
    worksheet.getCell(`F${Row}`).value = Material['AcceptanceCriteria'];
    worksheet.getCell(`F${Row}`).style = {alignment:{horizontal:'center',vertical:'middle',wrapText:true},font:{size:10,}};
    worksheet.getCell(`F${Row}`).border = Border;
  
    var startCharCode = 'G'.charCodeAt(0);
    var endCharCode = 'N'.charCodeAt(0);
    let index = 0;
    for (var i = startCharCode; i <= endCharCode; i++) {
      console.log(Material['Samples'][index]);
      // console.log(JSON.parse(Material['Samples']));
      worksheet.getCell(`${String.fromCharCode(i)}${Row}`).value = Material['Samples'][index] ? Material['Samples'][index]['SampleTest'] ? 'Pass' : 'Fail' : '';
      worksheet.getCell(`${String.fromCharCode(i)}${Row}`).style = { alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }, font: { size: 12, } }
      worksheet.getCell(`${String.fromCharCode(i)}${Row}`).border = Border;
      index++;
  }
  
    Row++;
  })
  
  let Column = 'A';
  worksheet.getRow(Row).height = 58;
  worksheet.mergeCells(`${Column}${Row}:${'B'}${Row}`);
  worksheet.getCell(`${Column}${Row}`).value = 'DEVIATION/REJECTION REASON:';
  worksheet.getCell(`${Column}${Row}`).style = { alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }, font: { size: 10 } };
  worksheet.getCell(`${Column}${Row}`).border = Border;
  worksheet.getCell(`${'B'}${Row}`).border = Border;
  
  
  Column = 'C'
  worksheet.mergeCells(`${Column}${Row}:${'N'}${Row}`);
  worksheet.getCell(`${Column}${Row}`).value = IQC[0]['Status'] == 'Rejected'?IQC[0]['ApproveReason']:"";
  worksheet.getCell(`${Column}${Row}`).style = { alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }, font: { size: 10 } };
  worksheet.getCell(`${Column}${Row}`).border = Border;
  worksheet.getCell(`${'N'}${Row}`).border = Border;
  
  Row++;
  
  Column = 'A'
  worksheet.mergeCells(`${Column}${Row}:${Column}${Row+1}`);
  worksheet.getCell(`${Column}${Row}`).value = 'Checked By';
  worksheet.getCell(`${Column}${Row}`).style = { alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }, font: { size: 10,bold:true } };
  worksheet.getCell(`${Column}${Row}`).border = Border;
  worksheet.getCell(`${Column}${Row+1}`).border = Border;
  
  Column = 'B'
  worksheet.mergeCells(`${Column}${Row}:${'E'}${Row+1}`);
  worksheet.getCell(`${Column}${Row}`).value = IQC[0]['Name'];
  worksheet.getCell(`${Column}${Row}`).style = { alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }, font: { size: 10 } };
  worksheet.getCell(`${Column}${Row}`).border = Border;
  worksheet.getCell(`${'E'}${Row+1}`).border = Border;
  
  Column = 'F'
  worksheet.mergeCells(`${Column}${Row}:${Column}${Row+1}`);
  worksheet.getCell(`${Column}${Row}`).value = `${IQC[0]['Status']} By`;
  worksheet.getCell(`${Column}${Row}`).style = { alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }, font: { size: 10, bold:true } };
  worksheet.getCell(`${Column}${Row}`).border = Border;
  worksheet.getCell(`${Column}${Row+1}`).border = Border;
  
  Column = 'G'
  worksheet.mergeCells(`${Column}${Row}:${'N'}${Row+1}`);
  worksheet.getCell(`${Column}${Row}`).value = ApproveData[0]['Name'];
  worksheet.getCell(`${Column}${Row}`).style = { alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }, font: { size: 10, } };
  worksheet.getCell(`${Column}${Row}`).border = Border;
  worksheet.getCell(`${'N'}${Row+1}`).border = Border;
  
  Row++;
  Row++;
  worksheet.mergeCells(`A${Row}:A${Row+1}`)
  worksheet.getCell(`A${Row}`).value = 'Check Type';
  worksheet.getCell(`A${Row}`).style = { alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }, font: { size: 10,bold:true },  };
  worksheet.getCell(`A${Row}`).border = Border;
  worksheet.getCell(`A${Row+1}`).border = Border;
  
  worksheet.mergeCells(`B${Row}:N${Row}`)
  worksheet.getCell(`B${Row}`).value = 'Sample Remarks';
  worksheet.getCell(`B${Row}`).style = {
    alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }, font: { size: 13, bold: true }, fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF6DC' } // Yellow background color
    }
  };
  worksheet.getCell(`B${Row}`).border = Border;
  worksheet.getCell(`N${Row}`).border = Border;
  
  
  var startCharCode = 'B'.charCodeAt(0);
  var endCharCode = 'N'.charCodeAt(0);
  let index = 1;
  for (var i = startCharCode; i <= endCharCode; i++) {
   
   worksheet.getCell(`${String.fromCharCode(i)}${Row+1}`).value = `S${index}`;
   worksheet.getCell(`${String.fromCharCode(i)}${Row+1}`).style  = { alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }, font: { size: 10, bold:true } };
   worksheet.getCell(`${String.fromCharCode(i)}${Row+1}`).border = Border;
   if(index>=6){
    worksheet.getColumn(`${String.fromCharCode(i)}`).width = 15;
   }
      index++;
  }
  
  Row++;
  Row++;
  IQC.forEach((Material)=>{
    worksheet.getRow(Row).height = 38
  
    worksheet.getCell(`A${Row}`).value = Material['CheckType'];
    worksheet.getCell(`A${Row}`).style = {alignment:{horizontal:'center',vertical:'middle',wrapText:true},font:{size:10,}};
    worksheet.getCell(`A${Row}`).border = Border;
  
  var startCharCode = 'B'.charCodeAt(0);
  var endCharCode = 'N'.charCodeAt(0);
  let index = 0;
  for (var i = startCharCode; i <= endCharCode; i++) {
  console.log(Material['Samples'][index])
  //Material['Samples'] = JSON.parse(Material['Samples']);
    worksheet.getCell(`${String.fromCharCode(i)}${Row}`).value = Material['Samples'][index]?Material['Samples'][index]['SampleRemarks']?Material['Samples'][index]['SampleRemarks']:'':'';
    worksheet.getCell(`${String.fromCharCode(i)}${Row}`).style = {alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },font: { size: 12, }}
    worksheet.getCell(`${String.fromCharCode(i)}${Row}`).border = Border;
      index++;
  }
    Row++;
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


  await transport.sendMail({
    from: 'iqc.gautamsolar@gmail.com',
    cc: 'bhanu.galo@gmail.com',
    to: 'nidhi@gautamsolar.com, production@gautamsolar.com, panel@gautamsolar.com, it@gautamsolar.com',
    subject: `IQC Report: Invoice No. ${IQC[0]['InvoiceNo']} - ${IQC[0]['MaterialName']}`,
    attachments: [{
      filename: `quality_control_plan_${IQC[0]['MaterialName']}_${IQC[0]['InvoiceNo']}.xlsx`,
      content: excelBuffer,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }],
    html: `<div style="position: relative; padding: 5px;">
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('https://galo.co.in/wp-content/uploads/2024/01/Galo-Energy-Logo-06.png'); background-size: cover; background-position: center; background-repeat: no-repeat; opacity: 0.3; z-index: -1;"></div>
        <div style="background-color: rgba(255, 255, 255, 0.8); padding: 20px; border-radius: 10px;">
            <p style="font-size: 16px;">Dear Super Admin,</p>
            <p style="font-size: 16px; margin-bottom: 0;">Invoice No: ${IQC[0]['InvoiceNo']} of ${IQC[0]['MaterialName']} has been ${IQC[0]['Status']} by ${ApproveData[0]['Name']}.</p>
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
        const Excel = `${IQC[0]['SolarDetailID']}.xlsx`;
        
        const ExcelFilePath = Path.join(folderPath, Excel);
     

      /** Save the file buffer to the specified file path */
      fs.writeFileSync(ExcelFilePath, excelBuffer);
     
  }catch(err){
    
   throw err;
  }
  return `${IQC[0]['SolarDetailID']}.xlsx`;
}

module.exports = { getCurrentDateTime, s3, ExcelGenerate }
