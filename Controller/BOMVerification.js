const { v4: uuidv4, v4 } = require('uuid');
const { getCurrentDateTime, s3 } = require('../Utilis/BOMVerificationUtilis')
const util = require('util')
const { dbConn } = require('../db.config/db.config')


/** Making Sync To Query */
const queryAsync = util.promisify(dbConn.query).bind(dbConn);



// let Bom = [
//     {
//         "CurrenUser": "",
//            "Status":"",
//         "DocNo": "GSPL/IPQC/BM/002",
//         "RevNo": "1.0 & 12.08.2023",
//         "PONo": "poController.text",
//         "Date": "dateController.text",
//         "Shift": "shiftController.text",
//         "Line": "LineController.text",
//     },
//     [
//         {
//             "BOMitem": "SolarCell",
//             "Supplier": "solarCellSupplierController.text",
//             "ModelNo": "solarCellSpecificationController.text",
//             "BatchNo": "solarCellLotBatchController.text",
//             "Remarks": "solarCellremarkController.text"
//         },
//         {
//             "BOMitem": "SolarCell",
//             "Supplier": "solarCellSupplierController.text",
//             "ModelNo": "solarCellSpecificationController.text",
//             "BatchNo": "solarCellLotBatchController.text",
//             "Remarks": "solarCellremarkController.text"
//         },
//         {
//             "BOMitem": "SolarCell",
//             "Supplier": "solarCellSupplierController.text",
//             "ModelNo": "solarCellSpecificationController.text",
//             "BatchNo": "solarCellLotBatchController.text",
//             "Remarks": "solarCellremarkController.text"
//         },
//         {
//             "BOMitem": "SolarCell",
//             "Supplier": "solarCellSupplierController.text",
//             "ModelNo": "solarCellSpecificationController.text",
//             "BatchNo": "solarCellLotBatchController.text",
//             "Remarks": "solarCellremarkController.text"
//         },
//         {
//             "BOMitem": "SolarCell",
//             "Supplier": "solarCellSupplierController.text",
//             "ModelNo": "solarCellSpecificationController.text",
//             "BatchNo": "solarCellLotBatchController.text",
//             "Remarks": "solarCellremarkController.text"
//         },
//         {
//             "BOMitem": "SolarCell",
//             "Supplier": "solarCellSupplierController.text",
//             "ModelNo": "solarCellSpecificationController.text",
//             "BatchNo": "solarCellLotBatchController.text",
//             "Remarks": "solarCellremarkController.text"
//         },
//         {
//             "BOMitem": "SolarCell",
//             "Supplier": "solarCellSupplierController.text",
//             "ModelNo": "solarCellSpecificationController.text",
//             "BatchNo": "solarCellLotBatchController.text",
//             "Remarks": "solarCellremarkController.text"
//         },
//         {
//             "BOMitem": "SolarCell",
//             "Supplier": "solarCellSupplierController.text",
//             "ModelNo": "solarCellSpecificationController.text",
//             "BatchNo": "solarCellLotBatchController.text",
//             "Remarks": "solarCellremarkController.text"
//         },
//         {
//             "BOMitem": "SolarCell",
//             "Supplier": "solarCellSupplierController.text",
//             "ModelNo": "solarCellSpecificationController.text",
//             "BatchNo": "solarCellLotBatchController.text",
//             "Remarks": "solarCellremarkController.text"
//         },
//         {
//             "BOMitem": "SolarCell",
//             "Supplier": "solarCellSupplierController.text",
//             "ModelNo": "solarCellSpecificationController.text",
//             "BatchNo": "solarCellLotBatchController.text",
//             "Remarks": "solarCellremarkController.text"
//         },
//         {
//             "BOMitem": "SolarCell",
//             "Supplier": "solarCellSupplierController.text",
//             "ModelNo": "solarCellSpecificationController.text",
//             "BatchNo": "solarCellLotBatchController.text",
//             "Remarks": "solarCellremarkController.text"
//         },
//         {
//             "BOMitem": "SolarCell",
//             "Supplier": "solarCellSupplierController.text",
//             "ModelNo": "solarCellSpecificationController.text",
//             "BatchNo": "solarCellLotBatchController.text",
//             "Remarks": "solarCellremarkController.text"
//         },
//         {
//             "BOMitem": "SolarCell",
//             "Supplier": "solarCellSupplierController.text",
//             "ModelNo": "solarCellSpecificationController.text",
//             "BatchNo": "solarCellLotBatchController.text",
//             "Remarks": "solarCellremarkController.text"
//         },
//         {
//             "BOMitem": "SolarCell",
//             "Supplier": "solarCellSupplierController.text",
//             "ModelNo": "solarCellSpecificationController.text",
//             "BatchNo": "solarCellLotBatchController.text",
//             "Remarks": "solarCellremarkController.text"
//         }
//     ]
// ];


/** Controller To Add BOM Verification */

const AddBomVerification = async (req, res) => {
    const Bom = req.body;
    const BomVerificationDetails = Bom[0];
    const BOM = Bom[1];
    const UUID = v4();
    const {BOMDetailId} = BomVerificationDetails
    if(!BOMDetailId){
    try {
        /** Insert Bom Data in BomVerficationDetail Table */
        const BomVerificationDetailsQuery = `INSERT INTO BOMVerificationDetails(BOMDetailId,Type,RevNo,DocNo,Date,Shift,Line,PONo,Status,CheckedBy,CreatedBy,CreatedOn)
    VALUES ('${UUID}','BOM Verification','${BomVerificationDetails['RevNo']}','${BomVerificationDetails['DocNo']}','${BomVerificationDetails['Date']}','${BomVerificationDetails['Shift']}','${BomVerificationDetails['Line']}','${BomVerificationDetails['PONo']}','${BomVerificationDetails['Status']}','${BomVerificationDetails['CurrentUser']}','${BomVerificationDetails['CurrentUser']}','${getCurrentDateTime()}');`

        await queryAsync(BomVerificationDetailsQuery)

        BOM.forEach(async (item) => {
            const BOMQuery = `INSERT INTO BOM(BOMId,BOMDetailId,BOMItem,Supplier,ModelNo,BatchNo,Remarks,CreatedBy,CreatedOn)
                         VALUES('${v4()}','${UUID}','${item['BOMitem']}','${item['Supplier']}','${item['ModelNo']}','${item['BatchNo']}','${item['Remarks']}','${BomVerificationDetails['CurrentUser']}','${getCurrentDateTime()}');`
            await queryAsync(BOMQuery)
        })
        res.send({ msg: 'Data Inserted Succesfully !', UUID});
    } catch (err) {
       console.log(err);
       res.status(400).send({err});
    }
    }else{
        try{
        const BomVerificationDetailsQuery = `UPDATE BOMVerificationDetails
        SET 
            RevNo = '${BomVerificationDetails['RevNo']}',
            DocNo = '${BomVerificationDetails['DocNo']}',
            Date = '${BomVerificationDetails['Date']}',
            Shift = '${BomVerificationDetails['Shift']}',
            Line = '${BomVerificationDetails['Line']}',
            PONo = '${BomVerificationDetails['PONo']}',
            Status = '${BomVerificationDetails['Status']}'
        WHERE
            BOMDetailId = '${BOMDetailId}';`
        await queryAsync(BomVerificationDetailsQuery)

        BOM.forEach(async (item) => {
            const BOMQuery = `UPDATE BOM
             SET
                Supplier = '${item['Supplier']}',
                ModelNo = '${item['ModelNo']}',
                BatchNo = '${item['BatchNo']}',
                Remarks = '${item['Remarks']}'
            WHERE
               BOMDetailId = '${BOMDetailId}' AND BOMItem = '${item['BOMitem']}';`;
            await queryAsync(BOMQuery)
        })
  
        res.send({ msg: 'Data Inserted Succesfully !',UUID:BOMDetailId });
    }catch(err){
        console.log(err);
       res.status(400).send({err});
    }

    }
    
}


const BOMUploadPdf = async (req, res) => {

    const { JobCardDetailId } = req.body;
    if(req.file.size){
    /** Uploading PDF in S3 Bucket */
    try {
      const ReferencePdf = await new Promise((resolve, reject) => {
        s3.upload({
          Bucket: process.env.AWS_BUCKET_2,
          Key: `IPQC/${JobCardDetailId}_${req.file.originalname}`,
          Body: req.file.buffer,
          ACL: "public-read-write",
          ContentType: req.file.mimetype
        }, (err, result) => {
          if (err) {
            reject(err)
          } else {
  
            resolve(result)
          }
        })
      });
  
  
  
      const query = `UPDATE BOMVerificationDetails
      set ReferencePdf = '${ReferencePdf.Location}'
     WHERE BOMDetailId = '${JobCardDetailId}';`;
  
      const update = await queryAsync(query);
      res.send({ msg: 'Data Inserted SuccesFully !', URL: ReferencePdf.Location });
    } catch (err) {
      console.log(err);
      res.status(401).send(err);
    }
}else{
    res.status(401).send({status:false,'err':'file is empty'})
}
  }



const GetSpecificBOMVerification = async(req,res)=>{
 
    try{
        const {JobCardDetailId} = req.body;

        const query = `select *FROM BOM b
        JOIn BOMVerificationDetails BM on b.BOMDetailId = BM.BOMDetailId
        WHERE b.BOMDetailId = '${JobCardDetailId}';`
    
        const data = await queryAsync(query);
        
        let response = {}

        data.forEach((item,i)=>{
            const BOMItem = item['BOMItem'];
               if(i === 0){
                response['BOMDetailId'] = item['BOMDetailId'];
                response['RevNo'] = item['RevNo'];
                response['Date'] = item['Date'];
                response['Shift'] = item['Shift'];
                response['Line'] = item['Line'];
                response['PONo'] = item['PONo'];
                response['DocNo'] = item['DocNo'];
                response['ReferencePdf'] = item['ReferencePdf'];
                response['Status'] = item['Status']
               }
        response[`${BOMItem} Supplier`] = item['Supplier'];
        response[`${BOMItem} ModelNo`] = item['ModelNo'];
        response[`${BOMItem} BatchNo`] = item['BatchNo'];
        response[`${BOMItem} Remarks`] = item['Remarks'];
        })
        
        res.send({status:true,data:response});
    }catch(err){
        console.log(err)
        res.send({status:false,err});
    }
  

}


const UpdateStatusBOM = async(req,res)=>{
    const {JobCardDetailId,Status,CurrentUser} = req.body

    try{
    const query = `UPDATE BOMVerificationDetails
                   SET
                      Status = '${Status}',
                      UpdatedBy = '${CurrentUser}',
                      UpdatedOn = '${getCurrentDateTime()}'
                    WHERE BOMDetailId = '${JobCardDetailId}';`
        const Update = await queryAsync(query)

        res.send({status:true,data:{JobCardDetailId}})

    }catch(err){
     console.log(err)
       res.status(400).send({status:false,err})

    }
  
}
module.exports = {AddBomVerification,BOMUploadPdf,GetSpecificBOMVerification,UpdateStatusBOM}