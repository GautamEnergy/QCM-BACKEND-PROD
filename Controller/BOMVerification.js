const { v4: uuidv4, v4 } = require('uuid');
const { getCurrentDateTime, s3 } = require('../Utilis/BOMVerificationUtilis')
const util = require('util');
const fs = require('fs');
const Path = require('path');
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
    console.log(Bom);
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
        console.log(UUID)
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
            Status = '${BomVerificationDetails['Status']}',
            CreatedOn = '${getCurrentDateTime()}'
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
      console.log(BOMDetailId)
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
      /** making file in IPQC-Pdf-Folder*/
      try {
         // Get the file buffer and the file format
         const fileBuffer = req.file.buffer;
        
         // Define the folder path
         const folderPath = Path.join( 'IPQC-Pdf-Folder');
    
         // Create the folder if it doesn't exist
         if (!fs.existsSync(folderPath)) {
          console.log(folderPath)
             fs.mkdirSync(folderPath, { recursive: true });
         }
         
         // Define the file path, including the desired file name and format
         const fileName = `${JobCardDetailId}.pdf`;
         const filePath = Path.join(folderPath, fileName);
    
         // Save the file buffer to the specified file path
      fs.writeFileSync(filePath, fileBuffer);

      const query = `UPDATE BOMVerificationDetails
      set ReferencePdf = 'http://srv515471.hstgr.cloud:8080/IPQC/Pdf/${JobCardDetailId}.pdf'
     WHERE BOMDetailId = '${JobCardDetailId}';`;

    const update = await queryAsync(query);
    
    // Send success response with the file URL
    res.send({ msg: 'Data inserted successfully!', URL: `http://srv515471.hstgr.cloud:8080/IPQC/Pdf/${JobCardDetailId}.pdf` });
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
        console.log(data)
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
