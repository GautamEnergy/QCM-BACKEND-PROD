const { v4: uuidv4, v4 } = require('uuid');
const { dbConn } = require('../db.config/db.config')
const util = require('util');
const fs = require('fs');
const Path = require('path');
const { getCurrentDateTime, s3, ExcelGenerate } = require('../Utilis/IQCSolarCellUtilis');
require('dotenv').config()
const PORT = process.env.PORT || 8080


/** Making Sync To Query to Loop */
const queryAsync = util.promisify(dbConn.query).bind(dbConn);

// const s = [
//   '{"name":"krish","email":true}',
//   '{"name":"kkk","email":true}'
// ];

// let data = {
//   "CurrentUser": "jfidj923923923423k",
//   "SolarCellDetails": {
//     "LotNo": '',
//     "SupplierName": "supplierNameController.text",
//     "InvoiceNo": "invoiceNoController.text",
//     "InvoiceDate": "invoiceDate",
//     "RawMaterialSpecs": "rawMaterialSpecsController.text",
//     "DateOfQualityCheck": "dateOfQualityCheck",
//     "SupplierRMBatchNo": "rMBatchNoController.text",
//     "RecieptDate": "receiptDate",
//     "DocumentNo": "GSPL/SC(I QC)/001",
//     "RevNo": "Ver2.0/13-03-2024"
//   },
//   "SolarCell": {
//     "Packaging": {
//       "Characterstics": "packagingCharactersticsController.text",
//       "MeasuringMethod": "packagingMeasuringMethodController.text",
//       "Sampling": "packagingSamplingController.text",
//       "SmapleSize": "packagingSampleSizeController.text",
//       "Reference": "packagingReferenceDocController.text",
//       "AcceptanceCriteria": "packagingAcceptanceCriteriaController.text",
//       "Samples": s
//     },
//     "Visual": {
//       "Characterstics": "visualCharactersticsController.text",
//       "MeasuringMethod": "visualMeasuringMethodController.text",
//       "Sampling": "visualSamplingController.text",
//       "Reference": "visualReferenceDocController.text",
//       "AcceptanceCriteria": "visualAcceptanceCriteriaController.text",
//       "Samples": s
//     },
//     "Physical": {
//       "Characterstics": "physicalCharactersticsController.text",
//       "MeasuringMethod": "physicalMeasuringMethodController.text",
//       "Sampling": "physicalSamplingController.text",
//       "Reference": "physicalReferenceDocController.text",
//       "AcceptanceCriteria": "physicalAcceptanceCriteriaController.text",
//       "Samples": s
//     },
//     "FrontBus": {
//       "Characterstics": "frontbusCharactersticsController.text",
//       "MeasuringMethod": "frontbusMeasuringMethodController.text",
//       "Sampling": "frontbusSamplingController.text",
//       "Reference": "frontbusReferenceDocController.text",
//       "AcceptanceCriteria": "frontbusAcceptanceCriteriaController.text",
//       "Samples": s
//     },
//     "Verification": {
//       "Characterstics": "verificationCharactersticsController.text",
//       "MeasuringMethod": "verificationMeasuringMethodController.text",
//       "Sampling": "verificationSamplingController.text",
//       "Reference": "verificationReferenceDocController.text",
//       "AcceptanceCriteria": "verificationAcceptanceCriteriaController.text",
//       "Samples": s
//     },
//     "Electrical": {
//       "Characterstics": "electricalCharactersticsController.text",
//       "MeasuringMethod": "electricalMeasuringMethodController.text",
//       "Sampling": "electricalSamplingController.text",
//       "Reference": "electricalReferenceDocController.text",
//       "AcceptanceCriteria": "electricalAcceptanceCriteriaController.text",
//       "Samples": s
//     },
//     "Performance": {
//       "Characterstics": "performanceCharactersticsController.text",
//       "MeasuringMethod": "performanceMeasuringMethodController.text",
//       "Sampling": "performanceSamplingController.text",
//       "Reference": "performanceReferenceDocController.text",
//       "AcceptanceCriteria": "performanceAcceptanceCriteriaController.text",
//       "Samples":s
//     }
//   },
//   "Rejected": {
//     "Result": "result",
//     "CheckTypes": [
//       { "Packaging": "packagingRejection" },
//       { "Visual": "visualRejection" },
//       { "Physical": "physicalRejection" },
//       { "FrontBus": "frontbusRejection" },
//       { "Verification": "verificationRejection" },
//       { "Electrical": "electricalRejection" },
//       { "Performance": "performanceRejection" },
//     ],
//     "Reason": "rejectionReasonController.text"
//   }
// };

/**to Add Solar Cell In IQC */
const AddIQCSolarCell = async (req, res) => {
  const data = req.body;
  const {SolarDetailId,Status,MaterialName} = data;
  const UUID = v4();
  const SolarCellDetail = data['SolarCellDetails']
  const SolarCel = data['SolarCell']
  const Rejected = data['Rejected']



  if(!SolarDetailId){

  try {

    /*************** Inserting Data in IQCSolarDetails Table **************/
    const SolarDetailQuery = `INSERT INTO IQCSolarDetails(SolarDetailID,LotSize,MaterialName,SupplierName,QuantityRecd,InvoiceDate,SupplierRMBatchNo,RawMaterialSpecs,QualityCheckDate,SampleQuantityCheck,InvoiceNo,ReceiptDate,DocumentNo,RevisionNo,CheckedBy,UpdatedBy,Status,CreatedDate,UpdatedDate) 
    VALUES ('${UUID}','${SolarCellDetail['LotNo']}','${MaterialName}','${SolarCellDetail['SupplierName']}','','${SolarCellDetail['InvoiceDate']}','${SolarCellDetail['SupplierRMBatchNo']}','${SolarCellDetail['RawMaterialSpecs']}','${SolarCellDetail['DateOfQualityCheck']}','','${SolarCellDetail['InvoiceNo']}','${SolarCellDetail['RecieptDate']}','${SolarCellDetail['DocumentNo']}','${SolarCellDetail['RevNo']}','${data['CurrentUser']}','','${Status}','${getCurrentDateTime()}','');`

    const result = await new Promise((resolve, reject) => {
      dbConn.query(SolarDetailQuery, (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(result);
        }
      });
    });



    /************ Inserting Data in IQC Solar Table ******************/
    for (let key in SolarCel) {
      const Samples = SolarCel[key]['Samples'];
      for (let i = 0; i < Samples.length; i++) {
        Samples[i] = JSON.stringify(Samples[i]);
      }

      const SolarCellQuery = `INSERT INTO IQCSolar(IQCSolarID,SolarDetailID,CheckType,Characterstics,MeasuringMethod,Sampling,Reference,AcceptanceCriteria,SampleSize,Samples,CreatedDate,UpdatedDate)
     VALUES ('${uuidv4()}','${UUID}','${key}','${SolarCel[key]['Characterstics']}','${SolarCel[key]['MeasuringMethod']}','${SolarCel[key]['Sampling']}','${SolarCel[key]['Reference']}','${SolarCel[key]['AcceptanceCriteria']}','${SolarCel[key]['SampleSize']}','[${Samples}]','${getCurrentDateTime()}','');`;

      const Solar = await queryAsync(SolarCellQuery);
      temp = Solar;
    }


    /************** Inserting Data in Rejected Table *******************/
    let checkTypes = []
    for (let i = 0; i < Rejected['CheckTypes'].length; i++) {
      checkTypes.push(JSON.stringify(Rejected['CheckTypes'][i]))
    }

    const RejectedQuery = `INSERT INTO Rejected(RejectedID,SolarDetailID,CheckTypes,Reason,Result,CreatedDate,UpdatedDate)
 VALUES ('${v4()}','${UUID}','[${checkTypes}]','${Rejected['Reason']}','${Rejected['Result']}','${getCurrentDateTime()}','');`
    const Reject = await queryAsync(RejectedQuery);

    res.send({ msg: 'Data Inserted SuccesFully !', 'SolarDetailID': UUID })
  } catch (err) {

    console.log(err)
    res.status(401).send(err)
  }
}else{
  console.log(SolarCel['Packaging'])
try{
    /*************** Update Data in IQCSolarDetails Table **************/
    let SolarDetailQuery = `UPDATE IQCSolarDetails id
    set id.LotSize = '${SolarCellDetail['LotNo']}',
        id.MaterialName = '${MaterialName}',
        id.SupplierName ='${SolarCellDetail['SupplierName']}',
        id.QuantityRecd = '',
        id.InvoiceDate = '${SolarCellDetail['InvoiceDate']}',
        id.SupplierRMBatchNo = '${SolarCellDetail['SupplierRMBatchNo']}',
        id.RawMaterialSpecs = '${SolarCellDetail['RawMaterialSpecs']}',
        id.QualityCheckDate = '${SolarCellDetail['DateOfQualityCheck']}',
        id.SampleQuantityCheck = '',
        id.InvoiceNo = '${SolarCellDetail['InvoiceNo']}',
        id.ReceiptDate = '${SolarCellDetail['RecieptDate']}',
        id.DocumentNo = '${SolarCellDetail['DocumentNo']}',
        id.RevisionNo = '${SolarCellDetail['RevNo']}',
        id.CheckedBy = '${data['CurrentUser']}',
        id.UpdatedBy = '',
        id.Status = '${Status}',
        id.CreatedDate = '${getCurrentDateTime()}',
        id.UpdatedDate = ''
    WHERE id.SolarDetailID = '${SolarDetailId}';`

    const result = await new Promise((resolve, reject) => {
      dbConn.query(SolarDetailQuery, (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(result);
        }
      });
    });


     /************ Inserting Data in IQC Solar Table ******************/
     for (let key in SolarCel) {
     // console.log(key)
      const Samples = SolarCel[key]['Samples'];
     console.log(Samples)
      for (let i = 0; i < Samples.length; i++) {
        Samples[i] = JSON.stringify(Samples[i]);
      }

     const SolarCellQuery = `UPDATE IQCSolar i
     set i.Characterstics = '${SolarCel[key]['Characterstics']}',
         i.MeasuringMethod ='${SolarCel[key]['MeasuringMethod']}',
         i.Sampling = '${SolarCel[key]['Sampling']}',
         i.Reference = '${SolarCel[key]['Reference']}',
         i.AcceptanceCriteria = '${SolarCel[key]['AcceptanceCriteria']}',
         i.SampleSize = '${SolarCel[key]['SampleSize']}',
         i.Samples = '[${Samples}]',
         i.CreatedDate = '${getCurrentDateTime()}',
         i.UpdatedDate = ''
     WHERE i.SolarDetailID = '${SolarDetailId}' AND i.CheckType = '${key}';`;
      const Solar = await queryAsync(SolarCellQuery);
      temp = Solar;
    }


     /************** Inserting Data in Rejected Table *******************/
     let checkTypes = []
     for (let i = 0; i < Rejected['CheckTypes'].length; i++) {
       checkTypes.push(JSON.stringify(Rejected['CheckTypes'][i]))
     }

   let RejectedQuery = `UPDATE Rejected r
   set r.CheckTypes = '[${checkTypes}]',
       r.Reason = '${Rejected['Reason']}',
       r.Result = '${Rejected['Result']}',
       r.CreatedDate = '${getCurrentDateTime()}',
       r.UpdatedDate = ''
   WHERE r.SolarDetailID = '${SolarDetailId}';`
   
     const Reject = await queryAsync(RejectedQuery);
     res.send({ msg: 'Data Inserted SuccesFully !', 'SolarDetailID': SolarDetailId,'Status':Status });

}catch(err){

    console.log(err)
    res.status(401).send(err)
}
}

}

/** To all test of IQC Solar Cell by employee */

const GetIQCSolarCellTests = async (req, res) => {
  const { PersonID, Designation, Department, Status } = req.body
 
  let query;

  /** Query */
  try {
    if (Designation == 'Admin' || Designation == 'Super Admin') {
      query = `SELECT p.EmployeeID,  p.Name, p.ProfileImg, wl.Location,id.SupplierName,id.QualityCheckDate,id.COCPdf,id.InvoicePdf,id.CreatedDate,id.SolarDetailID,id.MaterialName,id.InvoiceNo FROM Person p
  JOIN WorkLocation wl ON wl.LocationID = p.WorkLocation
  JOIN IQCSolarDetails id ON p.PersonID = id.CheckedBy
  WHERE id.Status = '${Status}'
  ORDER BY STR_TO_DATE(id.CreatedDate, '%d-%m-%Y %H:%i:%s') DESC;`
    } else {
      query = `SELECT p.PersonID,id.CheckedBy, p.EmployeeID,  p.Name, p.ProfileImg, wl.Location,id.SupplierName,id.QualityCheckDate,id.COCPdf,id.InvoicePdf,id.CreatedDate,id.SolarDetailID,id.MaterialName,id.InvoiceNo FROM Person p
  JOIN WorkLocation wl ON wl.LocationID = p.WorkLocation
  JOIN IQCSolarDetails id ON p.PersonID = id.CheckedBy
   WHERE p.PersonID = '${PersonID}' AND id.Status = '${Status}' 
   ORDER BY STR_TO_DATE(id.CreatedDate, '%d-%m-%Y %H:%i:%s') DESC;`
    }

    let data = await new Promise((resolve, rejects) => {
      dbConn.query(query, (err, result) => {
        if (err) {
          rejects(err)
        } else {
          resolve(result)
        }
      })
    })
    res.send({ status: true, data })
  } catch (err) {
    console.log(err)
    res.status(400).send({ status: false, err })
  }

}

/** Controller to Get Specific Test by SolarDetailId */
const GetSpecificSolarCellTest = async (req, res) => {
  const { SolarDetailID } = req.body

  try {
    const query = `SELECT id.SolarDetailID,id.LotSize,id.SupplierName,id.InvoiceNo,id.InvoiceDate,id.SupplierRMBatchNo,id.RawMaterialSpecs,id.QualityCheckDate,id.ReceiptDate,id.Status,id.COCPdf,id.InvoicePdf,i.IQCSolarID,i.CheckType,i.SampleSize,i.Samples,r.RejectedID,r.CheckTypes,r.Reason,r.Result FROM IQCSolarDetails id
    JOIN IQCSolar i ON id.SolarDetailID = i.SolarDetailID
    JOIN Rejected r ON id.SolarDetailID = r.SolarDetailID
    WHERE id.SolarDetailID = '${SolarDetailID}';`
    let data = await new Promise((resolve, rejects) => {
      dbConn.query(query, (err, result) => {
        if (err) {
          rejects(err)
        } else {
          resolve(result)
        }
      })
    })
    let responseData = []
    let obj = {}
    data.forEach((data, i) => {
      if (i === 0) {
        let index = 0


        for (let key in data) {
          if (index == 13) {
            break;
          }
          obj[key] = data[key];
          index++;
        }
        index = 0;
        for (let key in data) {
          if (index == 20) {
            break;
          }
          if (index >= 16) {
            if (key == 'CheckTypes') {
              let temp = JSON.parse(data[key]);
              temp.forEach((type, i) => {
                for (let key in type) {
                  obj[`Reject${key}`] = type[key];
                }
              })
            } else {
              obj[key] = data[key];
            }
          }

          index++;
        }



      }

      for (let key in data) {
        if (key == 'CheckType') {
          let temp = JSON.parse(data['Samples'])
          obj[`SampleSize${data[key]}`] = Number(data['SampleSize'])
          obj[data[key]] = temp
        }
      }


    })
    responseData.push(obj);
    res.send(responseData)
  } catch (err) {
    console.log(err)
    res.status(404).send(err)
  }

}

/** to Update Status in Solar Cell Detail Table and Creating new Column for reason in ApprovalStatus Table */
const UpdateStatus = async (req, res) => {
  const { CurrentUser: PersonID, ApprovalStatus: Status, RejectionReasonStatus: Reason, TestId: SolarDetailID } = req.body
  const UUID = v4()
  const ApprovalQuery = `INSERT INTO ApprovalStatus(SolarDetailID,ApprovalStatusID,Status,Reason,CreatedBy,CreatedOn)
  VALUE ('${SolarDetailID}','${UUID}','${Status}','${Reason}','${PersonID}','${getCurrentDateTime()}');`;

  const UpdateQuery = `UPDATE IQCSolarDetails id
  set id.Status = '${Status}',
       id.UpdatedBy = '${PersonID}',
       id.UpdatedDate = '${getCurrentDateTime()}'
  WHERE SolarDetailID = '${SolarDetailID}';`;
  try {
    const ApprovalStatus = await new Promise((resolve, rejects) => {
      dbConn.query(ApprovalQuery, (err, result) => {
        if (err) {
          rejects(err)
        } else {
          resolve(result)
        }
      })
    })

    const SolarCellDetailTable = await new Promise((resolve, rejects) => {
      dbConn.query(UpdateQuery, (err, result) => {
        if (err) {
          rejects(err)
        } else {
          resolve(result)
        }
      })
    })

    const ExcelQuery = `SELECT id.SolarDetailID,id.MaterialName,id.DocumentNo,id.RevisionNo,id.LotSize,id.SupplierName,id.InvoiceNo,id.InvoiceDate,id.SupplierRMBatchNo,id.RawMaterialSpecs,id.QualityCheckDate,id.ReceiptDate,id.Status,id.COCPdf,id.InvoicePdf,i.IQCSolarID,i.CheckType,i.Characterstics,i.MeasuringMethod,i.Sampling,i.Reference,i.AcceptanceCriteria,i.SampleSize,i.Samples,r.RejectedID,r.CheckTypes,r.Reason,r.Result,id.CheckedBy,id.UpdatedBy, p.Name, a.Reason as ApproveReason  FROM IQCSolarDetails id
    JOIN IQCSolar i ON id.SolarDetailID = i.SolarDetailID
    JOIN Rejected r ON id.SolarDetailID = r.SolarDetailID
    JOIN Person p on p.PersonID =  id.CheckedBy
    JOIN ApprovalStatus a on a.SolarDetailID = r.SolarDetailID
    WHERE id.SolarDetailID = '${SolarDetailID}';`;

    const ApproveTableQuery = `select p.Name from IQCSolarDetails id
    join Person p on p.PersonID = id.UpdatedBy
    where id.SolarDetailID = '${SolarDetailID}';`;

    const ExcelData = await queryAsync(ExcelQuery);
    const ApproveData = await queryAsync(ApproveTableQuery);
    ExcelData.forEach((data) => {
      data['Samples'] = JSON.parse(data['Samples']);
    })

    console.log(ExcelData)
    ExcelGenerate(ExcelData, ApproveData);
    res.send({ ExcelData, ApproveData })
  } catch (err) {
    console.log(err)
    res.status(500).send({ err })
  }
}


/** Controller to Upload PDF Test */
const UploadPdf = async (req, res) => {

  const { SolarDetailId } = req.body;

  /** Uploading PDF in Employee-Profile-Folder */
  if (req.files['InvoicePdf'][0].size && req.files['COCPdf'][0].size) {
    try {
      /** Get the file buffer and the file format */
      const InvoiceFileBuffer = req.files['InvoicePdf'][0].buffer;
      const COCFileBuffer = req.files['COCPdf'][0].buffer;

      /** Define the folder path */
      const folderPath = Path.join('IQC-Pdf-Folder');

      /** Create the folder if it doesn't exist */
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      /** Define the file path, including the desired file name and format */
      const InvoiceFileName = `${SolarDetailId}_${req.files['InvoicePdf'][0].originalname}`;
      const COCFileName = `${SolarDetailId}_${req.files['COCPdf'][0].originalname}`;
      const InvoceFilePath = Path.join(folderPath, InvoiceFileName);
      const COCFilePath = Path.join(folderPath,COCFileName);

      /** Save the file buffer to the specified file path */
      fs.writeFileSync(InvoceFilePath, InvoiceFileBuffer);
      fs.writeFileSync(COCFilePath, COCFileBuffer);
      
      const query = `UPDATE IQCSolarDetails id
      set id.COCPdf = 'http://srv515471.hstgr.cloud:${PORT}/IQCSolarCell/Pdf/${COCFileName}',
       id.InvoicePdf = 'http://srv515471.hstgr.cloud:${PORT}/IQCSolarCell/Pdf/${InvoiceFileName}'

     WHERE id.SolarDetailID = '${SolarDetailId}';`;
     let data = await new Promise((resolve, rejects) => {
      dbConn.query(query, (err, result) => {
        if (err) {
          rejects(err)
        } else {
          resolve(result)
        }
      })
    })
    res.send({ msg: 'Data Inserted SuccesFully !' })

    } catch (err) {
      console.log(err);
      res.status(401).send(err);
    }
  }else{
    res.status(401).send({status:false,'err':'file is empty'});
  }
}

const GetPdf = async(req,res)=>{
  const filename = req.params.filename;
   /** Define the absolute path to the IPQC-Pdf-Folder directory */
   const pdfFolderPath = Path.resolve('IQC-Pdf-Folder');

   /** Construct the full file path to the requested file */
   const filePath = Path.join(pdfFolderPath, filename);

   /** Send the file to the client */
   res.sendFile(filePath, (err) => {
       if (err) {
           console.error('Error sending file:', err);
           res.status(404).send({ error: 'File not found' });
       }
   });
}


/** Export Controllers */
module.exports = { AddIQCSolarCell, GetIQCSolarCellTests, GetSpecificSolarCellTest, UpdateStatus, UploadPdf, GetPdf };
