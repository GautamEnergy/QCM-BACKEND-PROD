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
    let BomVerificationDetails = Bom[0];
    let BOM = Bom[1];
    const UUID = v4();
    try {
        /** Insert Bom Data in BomVerficationDetail Table */
        const BomVerificationDetailsQuery = `INSERT INTO BOMVerificationDetails(BOMDetailId,Type,RevNo,Date,Shift,Line,PONo,Status,CheckedBy,CreatedBy,CreatedOn)
    VALUES ('${UUID}','BOM Verification','${BomVerificationDetails['RevNo']}','${BomVerificationDetails['Date']}','${BomVerificationDetails['Shift']}','${BomVerificationDetails['Line']}','${BomVerificationDetails['PONo']}','${BomVerificationDetails['Status']}','${BomVerificationDetails['CurrentUser']}','${BomVerificationDetails['CurrentUser']}','${getCurrentDateTime()}');`

        await queryAsync(BomVerificationDetailsQuery)

        BOM.forEach(async (item) => {
            const BOMQuery = `INSERT INTO BOM(BOMId,BOMDetailId,BOMItem,Supplier,ModelNo,BatchNo,Remarks,CreatedBy,CreatedOn)
                         VALUES('${v4()}','${UUID}','${item['BOMitem']}','${item['Supplier']}','${item['ModelNo']}','${item['BatchNo']}','${item['Remarks']}','${BomVerificationDetails['CurrenUser']}','${getCurrentDateTime()}');`
            await queryAsync(BOMQuery)
        })
        res.send({ msg: 'Data Inserted Succesfully !', UUID});
    } catch (err) {
       console.log(err);
       res.status(400).send({err});
    }

}


module.exports = {AddBomVerification}