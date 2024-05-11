const { transport } = require('../Utilis/Person.utilis')
const ExcelJS = require('exceljs');
const Path = require('path');
const fs = require('fs')
require('dotenv').config();



async function QualityExcelGenerate(Quality, FromDate, ToDate) {

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Quality Report');
  
    let Border = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' }
    }
  
    let WrapTextAlignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  
    /**Merge Cells */
    worksheet.mergeCells('A1:N2');
  
  
    /**Put Value in Cell */
    worksheet.getCell('A1').value = `Quality Report ${FromDate} - ${ToDate}`;
  
    /** Apply header styling */
    worksheet.getCell('A1').style = {
      alignment: { horizontal: 'center', vertical: 'middle' }, font: { size: 16, bold: true }, fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF6DC' } // Yellow background color
      }
    }
  
    /**Apply Borders */
    worksheet.getCell('A1').border = Border;
    worksheet.getCell('N2').border = Border;
  
    /** Set The Column Names in Excel */
    var startCharCode = 'A'.charCodeAt(0);
    var endCharCode = 'N'.charCodeAt(0);
    let row = 3;
    worksheet.getRow(row).height = 40;
  
    let index = 0;
    let ColumnNames = ['Date','Shift', 'In Charge Name', 'Shift In Charge Name PreLime', 'Shift In Charge Name PostLime', 'Product Barcode', 'Wattage', 'Model Number', 'Issue type',  'Stage', 'Taken Action', 'Reason Of Issue', 'Issue Come From', 'Found By']; 
  
    for (let i = startCharCode; i <= endCharCode; i++) {
      worksheet.getColumn(`${String.fromCharCode(i)}`).width = 20;
      worksheet.getCell(`${String.fromCharCode(i)}${row}`).value = `${ColumnNames[index]}`;
      worksheet.getCell(`${String.fromCharCode(i)}${row}`).style = {
        alignment: { horizontal: 'center', vertical: 'middle', wrapText:true}, font: { size: 10, bold: true }
      }
      worksheet.getCell(`${String.fromCharCode(i)}${row}`).border = Border;
      index++;
    }
  
    
  //  let Quality = [
  //         {
  //             "QualityId": "ef877c5c-df03-45a9-bd94-c456c7f14930",
  //             "Shift": "shift",
  //             "ShiftInChargeName": "Rahul",
  //             "ShiftInChargePreLime": "Viney",
  //             "ShiftInChargePostLim": "Akash",
  //             "ProductBarCode": "productBarcode",
  //             "CreatedOn": "07-05-2024",
  //             "CreatedBy": "Bhanu",
  //             "Wattage": "wattage",
  //             "Stage": "stage",
  //             "ResposiblePerson": "Nagar",
  //             "ReasonOfIssue": "reasonofissue",
  //             "IssueComeFrom": "issuecomefrom",
  //             "ActionTaken": "actiontaken",
  //             "ModulePicture": null,
  //             "Issue": "otherissuetyp",
  //             "ModelName": "G2×Bifacial 1715-HAD"
  //         },
  //         {
  //             "QualityId": "7ec71bb8-dc2f-476c-add9-a46c0c690866",
  //             "Shift": "Day",
  //             "ShiftInChargeName": "",
  //             "ShiftInChargePreLime": "",
  //             "ShiftInChargePostLim": "",
  //             "ProductBarCode": "",
  //             "CreatedOn": "07-05-2024",
  //             "CreatedBy": "Bhanu",
  //             "Wattage": "bh",
  //             "Stage": "bb",
  //             "ResposiblePerson": "hh",
  //             "ReasonOfIssue": "nj",
  //             "IssueComeFrom": "hj",
  //             "ActionTaken": "hhhh",
  //             "ModulePicture": "http://srv515471.hstgr.cloud:8080/Quality/File/7ec71bb8-dc2f-476c-add9-a46c0c6908661715082135413133.jpg",
  //             "Issue": "Flux Spot",
  //             "ModelName": "bb"
  //         },
  //         {
  //             "QualityId": "18e98723-0715-461e-9c3e-88955c367184",
  //             "Shift": "shift",
  //             "ShiftInChargeName": "Rahul",
  //             "ShiftInChargePreLime": "Viney",
  //             "ShiftInChargePostLim": "Akash",
  //             "ProductBarCode": "productBarcode",
  //             "CreatedOn": "07-05-2024",
  //             "CreatedBy": "Bhanu",
  //             "Wattage": "wattage",
  //             "Stage": "stage",
  //             "ResposiblePerson": "Nagar",
  //             "ReasonOfIssue": "reasonofissue",
  //             "IssueComeFrom": "issuecomefrom",
  //             "ActionTaken": "actiontaken",
  //             "ModulePicture": null,
  //             "Issue": "Flux Spot",
  //             "ModelName": "othermodelnumber"
  //         }
         
  //     ];
  row = row+1;
  
  Quality.forEach((data)=>{
    worksheet.getRow(row).height = 40
    const style = { alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }, font: { size: 9}, }
    /**Put the value in cell */
    worksheet.getCell(`A${row}`).value = data['CreatedOn'];
    worksheet.getCell(`B${row}`).value = data['Shift'];
    worksheet.getCell(`C${row}`).value = data['ShiftInChargeName'];
    worksheet.getCell(`D${row}`).value = data['ShiftInChargePreLime'];
    worksheet.getCell(`E${row}`).value = data['ShiftInChargePostLim'];
    worksheet.getCell(`F${row}`).value = data['ProductBarCode'];
    worksheet.getCell(`G${row}`).value = data['Wattage'];
    worksheet.getCell(`H${row}`).value = data['ModelName'];
    worksheet.getCell(`I${row}`).value = data['Issue'];
    worksheet.getCell(`J${row}`).value = data['Stage']; 
    worksheet.getCell(`K${row}`).value = data['ActionTaken'];//ActionTaken
    worksheet.getCell(`L${row}`).value = data['ReasonOfIssue'];
    worksheet.getCell(`M${row}`).value = data['IssueComeFrom'];
    worksheet.getCell(`N${row}`).value = data['CreatedBy'];
  
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
  


module.exports = {QualityExcelGenerate}
