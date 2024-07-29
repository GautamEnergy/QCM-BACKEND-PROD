const { v4: uuidv4, v4 } = require("uuid");
const { getCurrentDateTime,PurchaseOrderPdf } = require("../Utilis/MaintenanceUtilis");
const util = require("util");
const fs = require("fs");
const Path = require("path");
const { dbConn } = require("../db.config/db.config");
require("dotenv").config();
const PORT = process.env.PORT || 8080;

/** Making Sync To Query to Loop */
const queryAsync = util.promisify(dbConn.query).bind(dbConn);

// let data = {
//   PurchaseData: {
//     series: "GST-2024-2025",
//     vochNo: "GST-2024-2025-01",
//     purcType: "L/GST-12%",
//     PartyName: "0213fe0c-cae1-4a07-858b-aeeefdaabe0d",
//     company: "fd86454f-4365-11ef-b658-1a2cd4d9c0d1",
//     narration: "jjjjjjsdkfksd",
//     currentDate: "Sat Jul 20 2024",
//     currentUser:'66494d8a-0786-11ef-8005-52549f6cc694'
//   },
//   BilingData: [
//     {
//       Bill_Sundry: "Discount",
//       Narration: "",
//       Percentage: "",
//       Amount: "0.00",
//       Total_Amount: "1080.80",
//     },
//     {
//       Bill_Sundry: "Freight",
//       Narration: "",
//       Percentage: "3",
//       Amount: "",
//       Total_Amount: "1080.80",
//     },
//     {
//       Bill_Sundry: "IGST",
//       Narration: "",
//       Percentage: "",
//       Amount: "",
//       Total_Amount: "1080.80",
//     },
//     {
//       Bill_Sundry: "SGST",
//       Narration: "",
//       Percentage: 6,
//       Amount: "57.90",
//       Total_Amount: "1080.80",
//     },
//     {
//       Bill_Sundry: "CGST",
//       Narration: "",
//       Percentage: 6,
//       Amount: "57.90",
//       Total_Amount: "1080.80",
//     },
//   ],
//   tableData: {
//     items: [
//       {
//         id: 1,
//         spareName: "fhgfgh",
//         modelNumber: "fghfgh",
//         qty: "4",
//         unit: "gfd",
//         price: "100",
//         gst: "10",
//         amount:200,
//         SparePartId: "10db5181-bed5-4a5d-b148-c0ce5a3f8822",
//       },
//       {
//         id: 1721468333869,
//         spareName: "fhgfgh",
//         modelNumber: "fghfgh",
//         qty: "5",
//         unit: "fgd",
//         price: "100",
//         gst: "5",
//         amount:200,
//         SparePartId: "10db5181-bed5-4a5d-b148-c0ce5a3f8822",
//       },
//     ],
//     totalAmount: '965',
//   },
//   optionalData: {
//     paymentTerm: "fsd",
//     deleveryTerm: "dgfs",
//     contactPer: "fdgs",
//     cellNo: "dfgs",
//     warranty: "",
//   },
// };

const AddPurchaseOrder = async (req, res) => {
  const { PurchaseData : P, BilingData : B, tableData:t, optionalData:o } = req.body;
  const UUID = v4();

  try{
    /**
     * ! Inserting Data into Purchase Table
     */
    const PurchaseDataQuery = `INSERT INTO 
    PurchaseOrder(Purchase_Order_Id, Voucher_Number, Series, Purchase_Type, Party_Name, Company_Name, Narration, 
    Purchase_Date, Status, Created_On, Created_By )
    VALUES('${UUID}', '${P.vochNo}', '${P.series}','${P.purcType}',
  '${P.PartyName}','${P.company}', '${P.narration}', '${P.currentDate}', 'Active', '${getCurrentDateTime()}','${P.currentUser}');`;

     await queryAsync(PurchaseDataQuery);

     /**
      * ? Inserting Data into Order Items Table
      */
     t.items.forEach(async(data)=>{
      const uuid = v4();
      const query = `INSERT INTO
    Purchase_Order_Items(Purchase_Order_Item_Id, Purchase_Order_Id, Spare_Part_Id, Quantity, Unit, Price_Rs,
    GST, Amount, Total_Amount)
    VALUES('${uuid}', '${UUID}', '${data.SparePartId}', '${data.qty}', '${data.unit}', '${data.price}', '${data.gst}', '${data.amount}','${t.totalAmount}');`;


      await queryAsync(query);
     })


    /**
   * ! INSERTING Data into Order Billing Table
   */
  B.forEach(async(data)=>{
    const uuid = v4()
      const query = `INSERT INTO 
      Purchase_Order_Billing(Purchase_Order_Billing_Id, Purchase_Order_Id, Bill_Sundry, 
      Narration, Percentage, Amount, Total_Amount)
      VALUES('${uuid}','${UUID}', '${data.Bill_Sundry}', '${data.Narration}', '${data.Percentage}',
            '${data.Amount}','${data.Total_Amount}');`;
    await queryAsync(query)

   })

   /**
    * ! Inserting Data into OPTIONAL Table
    */
   
   const optionQuery = `INSERT INTO Purchase_Order_Optional_Field(Optional_Field_Id,Purchase_Order_Id,Payment_Terms,
   Delivery_Terms, Contact_Person, Cell_Number, Warranty)
   VALUES('${v4()}','${UUID}', '${o.paymentTerm}', '${o.deleveryTerm}','${o.contactPer}','${o.cellNo}','${o.warranty}');`

   await queryAsync(optionQuery)
  
   let Top_Data_Query = `SELECT PO.Purchase_Order_Id,PO.Voucher_Number AS Order_Number,PO.Voucher_Number,PO.Purchase_Date, P.PartyName,P.Address,P.GSTNumber,C.CompanyName,C.GSTNumber AS Company_GSTNumber,
C.Address AS Company_Address, C.State,C.Pin,C.Email,POF.Payment_Terms,POF.Delivery_Terms,POF.Contact_Person,POF.Cell_Number,POF.Warranty
FROM PurchaseOrder PO
JOIN Company C ON C.CompanyID = PO.Company_Name
JOIN PartyName P ON P.PartyNameId = PO.Party_Name
JOIN Purchase_Order_Optional_Field POF ON POF.Purchase_Order_Id = PO.Purchase_Order_Id
WHERE PO.Purchase_Order_Id = '${UUID}';`;

const Top_Data = await queryAsync(Top_Data_Query);

let ItemsTableQuery = `SELECT SP.MasterSparePartName,SP.SparePartName,SP.HSNCode,SP.SpareNumber,POI.Quantity,POI.Unit,POI.Price_Rs,POI.GST,POI.Amount,POI.Total_Amount
FROM 
    PurchaseOrder PO
JOIN 
    Purchase_Order_Items POI ON POI.Purchase_Order_Id = PO.Purchase_Order_Id
JOIN 
    SparePartName SP ON POI.Spare_Part_Id = SP.SparPartId
WHERE 
    PO.Purchase_Order_Id = '${UUID}';`;

const ItemsTable = await queryAsync(ItemsTableQuery);

let BilingDataQuery = `SELECT POB.Bill_Sundry,POB.Narration,POB.Percentage,POB.Amount,POB.Total_Amount FROM PurchaseOrder PO
JOIN Purchase_Order_Billing POB ON POB.Purchase_Order_Id = PO.Purchase_Order_Id
WHERE PO.Purchase_Order_Id = '${UUID}'`;
 
const BilingData = await queryAsync(BilingDataQuery);

let pdf = await PurchaseOrderPdf(Top_Data,ItemsTable,BilingData, UUID);

let updateProfile = `UPDATE PurchaseOrder PO
SET 
  PO.PdfURL = 'http://srv515471.hstgr.cloud:${PORT}/Maintenance/getFile/${UUID}.pdf'
 WHERE PO.Purchase_Order_Id = '${UUID}';`

 await queryAsync(updateProfile);

   res.send({msg:'data Inserted Succesfully'})
  }catch(err){
    console.log(err)
    res.status(400).send(err)
  }

};



/**
 * ! Get Voucher Number Controller
 */
const getVoucherNumber = async(req,res)=>{
    try{
    const query = `SELECT COUNT(Purchase_Order_Id)AS Voucher_Number FROM PurchaseOrder WHERE Status = 'Active';`
    const data = await queryAsync(query);
    const VoucherNumber = data[0]['Voucher_Number']+1;
    res.send({VoucherNumber:VoucherNumber})
    }catch(err){
    console.log(err)
    res.status(400).send(err)
    }
}

/**
 * get Purchase Order to List
 */

const getPurchaseOrderList = async(req,res)=>{

  try{
    const query = `SELECT PO.Purchase_Order_Id, PO.Voucher_Number, PN.PartyName, C.CompanyName, PO.Purchase_Date, PO.PdfURL, PO.Created_On,P.Name AS Created_By FROM PurchaseOrder PO 
JOIN PartyName PN ON PN.PartyNameId = PO.Party_Name 
JOIN Company C ON C.CompanyID = PO.Company_Name JOIN Person P ON P.PersonID = PO.Created_By 
WHERE PO.Status = 'Active'
ORDER BY PO.Created_On DESC;`;

  const data = await queryAsync(query);
  res.send({data});

  }catch(err){
      console.log(err);
      res.status(400).send({err});
  }
}


/** Controller to Get PO Data by PO Id */

const getPurchaseOrderById = async (req, res) => {
  const { PurchaseOrderID } = req.body;
  try {
    const query = `
    SELECT po.Purchase_Order_Id, po.Voucher_Number, po.Purchase_Type, po.Party_Name, po.Company_Name, po.Narration, po.Purchase_Date,
           po.Status, pob.Purchase_Order_Billing_Id, pob.Bill_Sundry, pob.Narration AS Billing_Narration, pob.Percentage, pob.Amount, pob.Total_Amount, 
           poi.Purchase_Order_Item_Id, poi.Spare_Part_Id, poi.Quantity, poi.Unit, poi.Price_Rs, poi.GST, poi.Amount AS ItemAmount, poi.Total_Amount AS ItemTotalAmount, 
           poof.Optional_Field_Id, poof.Payment_Terms, poof.Delivery_Terms, poof.Contact_Person, poof.Cell_Number, poof.Warranty 
    FROM PurchaseOrder po
    JOIN Purchase_Order_Billing pob ON po.Purchase_Order_Id = pob.Purchase_Order_Id
    JOIN Purchase_Order_Items poi ON po.Purchase_Order_Id = poi.Purchase_Order_Id
    JOIN Purchase_Order_Optional_Field poof ON po.Purchase_Order_Id = poof.Purchase_Order_Id
    WHERE po.Purchase_Order_Id = '${PurchaseOrderID}' AND po.Status = 'Active';`;

    let data = await new Promise((resolve, reject) => {
      dbConn.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    let uniqueData = {};
    let uniqueItems = {};
    let uniqueBilling = {};

    data.forEach(row => {
      if (!uniqueData[row.Purchase_Order_Id]) {
        uniqueData[row.Purchase_Order_Id] = {
          Purchase_Order_Id: row.Purchase_Order_Id,
          Voucher_Number: row.Voucher_Number,
          Purchase_Type: row.Purchase_Type,
          Party_Name: row.Party_Name,
          Company_Name: row.Company_Name,
          Narration: row.Narration,
          Purchase_Date: row.Purchase_Date,
          Status: row.Status,
          Billing: [],         
          Payment_Terms: row.Payment_Terms,
          Delivery_Terms: row.Delivery_Terms,
          Contact_Person: row.Contact_Person,
          Cell_Number: row.Cell_Number,
          Warranty: row.Warranty,
          Items: []
        };
      }

    
      if (!uniqueBilling[row.Bill_Sundry]) {
        uniqueBilling[row.Bill_Sundry] = {
          Bill_Sundry: row.Bill_Sundry,
          Narration: row.Billing_Narration,
          Percentage: row.Percentage,
          Amount: row.Amount,
          Total_Amount: row.Total_Amount
        };
        uniqueData[row.Purchase_Order_Id].Billing.push(uniqueBilling[row.Bill_Sundry]);
      }

     
      if (!uniqueItems[row.Purchase_Order_Item_Id]) {
        uniqueItems[row.Purchase_Order_Item_Id] = {
          Spare_Part_Id: row.Spare_Part_Id,
          Quantity: row.Quantity,
          Unit: row.Unit,
          Price_Rs: row.Price_Rs,
          GST: row.GST,
          Item_Amount: row.ItemAmount,
          Item_Total_Amount: row.ItemTotalAmount
        };
        uniqueData[row.Purchase_Order_Id].Items.push(uniqueItems[row.Purchase_Order_Item_Id]);
      } 
     
    });

    let responseData = Object.values(uniqueData);
    res.send(responseData);
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
};

/**Controller to Get Pdf, file etc. */
const getFile = async (req,res)=>{

  const filename = req.params.filename;
  /** Define the absolute path to the IPQC-Pdf-Folder directory */
  const pdfFolderPath = Path.resolve('PurchaseOrder');

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





module.exports = {getVoucherNumber, AddPurchaseOrder, getPurchaseOrderList, getPurchaseOrderById, getFile}
