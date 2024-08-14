const { v4: uuidv4, v4 } = require('uuid');
const {getCurrentDateTime} = require('../Utilis/MaintenanceUtilis')
const util = require('util');
const fs = require('fs');
const Path = require('path');
const { dbConn } = require('../db.config/db.config');
require('dotenv').config();
const PORT = process.env.PORT || 9090;


/** Making Sync To Query */
const queryAsync = util.promisify(dbConn.query).bind(dbConn);


/**Add Machine Data  */
const AddSpareParts = async (req, res) => {
  const {
    SparePartId,
    SparePartName,
    SpareNumber,
    Specification,
    BrandName,
    MachineName,
    Quantity,
    Status,
    MasterSparePartName,
    NumberOfPcs,
    CycleTime,
    Equivalent,
    HSNCode,
    CurrentUser: CreatedBy } = req.body;


  console.log(req.body)


  const MachineNameArray = MachineName
  let UUID = SparePartId || v4();
  try {
    //let getSpareModelNumberQuery = `SELECT SpareNumber FROM SparePartName WHERE SpareNumber = '${SpareNumber}';`

    let getSpareModelNumberQuery = SparePartId
      ? `SELECT SpareNumber FROM SparePartName WHERE SpareNumber = '${SpareNumber}' AND SparPartId <> '${SparePartId}';`
      : `SELECT SpareNumber FROM SparePartName WHERE SpareNumber = '${SpareNumber}';`;

    let getSpareModelNumbers = await queryAsync(getSpareModelNumberQuery);

    if (getSpareModelNumbers.length) {

      return res.status(409).send({ msg: 'Duplicate Spare Model Number' })
    }

    if (SparePartId) {
      /** Updated Query SparePartId  */
      const updateQuery = `UPDATE SparePartName 
      SET SparPartId = '${SparePartId}', SparePartName = '${SparePartName}',SpareNumber = '${SpareNumber}',Specification = '${Specification}',BrandName = '${BrandName}',HSNCode = '${HSNCode}',MasterSparePartName = '${MasterSparePartName}',
      NumberOfPcs = '${NumberOfPcs}',CycleTime = '${CycleTime}',MinimumQuantityRequired='${Quantity}',Equivalent = '${JSON.stringify(Equivalent)}',Status = '${Status}',UpdatedBy = '${CreatedBy}',
      UpdatedOn = '${getCurrentDateTime()}'
      WHERE SparPartId = '${SparePartId}';`

      await queryAsync(updateQuery)


      /**   Update Related SparePartMachine Entries  */
      await queryAsync(`DELETE FROM SparePartMachine WHERE SparePartId = '${SparePartId}';`);
      await Promise.all(MachineNameArray.map(async (MachineName) => {
        let SpareMachineId = v4();
        let updateMachineQuery = `INSERT INTO SparePartMachine(SparePartMachineId,SparePartId,MachineId,Status,UpdatedBy,UpdatedOn) VALUES
                         ('${SpareMachineId}','${SparePartId}','${MachineName}','${Status}','${CreatedBy}','${getCurrentDateTime()}');`;
        await queryAsync(updateMachineQuery);
      }));

      return res.send({ msg: 'Updated Successfully!', SparePartId: `${SparePartId}` });

    } else {
      /** Inserted Query SparePartId */
      const query = `INSERT INTO SparePartName(SparPartId ,SparePartName,SpareNumber,Specification,BrandName,HSNCode,Status,CreatedBy,MasterSparePartName,CreatedOn,NumberOfPcs,CycleTime,MinimumQuantityRequired, Equivalent) VALUES
            ('${UUID}','${SparePartName}','${SpareNumber}','${Specification}','${BrandName}','${HSNCode}','${Status}','${CreatedBy}','${MasterSparePartName}','${getCurrentDateTime()}','${NumberOfPcs}','${CycleTime}','${Quantity}','${JSON.stringify(Equivalent)}');`

      await queryAsync(query)

      MachineNameArray.forEach(async (MachineName) => {
        let SpareMachineId = v4();
        let query = `INSERT INTO SparePartMachine(SparePartMachineId,SparePartId,MachineId,Status,CreatedBy,CreatedOn) VALUES
                    ('${SpareMachineId}','${UUID}','${MachineName}','${Status}','${CreatedBy}','${getCurrentDateTime()}');`

        await queryAsync(query)
      });
    }

    return res.send({ msg: 'Inserted Succesfully!', SparePartId: UUID });

  } catch (err) {

    console.log(err)
    return res.status(400).send({ err })

  }



}



const UploadImage = async (req, res) => {

    const { SparePartId } = req.body;

  /** Uploading PDF in Employee-Profile-Folder */
  try {
    /** Get the file buffer and the file format */
    if (req.files['SparePartImage'] && req.files['DrawingImage']) {

      const DrawingImageBuffer = req.files['DrawingImage'][0].buffer;
      let DrawingImage = req.files['DrawingImage'][0].originalname.split('.');
      let DrawingFileFormat = DrawingImage[DrawingImage.length - 1];


      /** Define the folder path */
      const folderPath = Path.join('SpartPartImage');

      /** Create the folder if it doesn't exist */
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      /** Define the file path, including the desired file name and format */
      const COCFileName = `${SparePartId}_Drawing.${DrawingFileFormat}`;

      const COCFilePath = Path.join(folderPath, COCFileName);

      /** Save the file buffer to the specified file path */
      fs.writeFileSync(COCFilePath, DrawingImageBuffer);

      let SparePartImages = req.files['SparePartImage']

      let ImagesURL = SparePartImages.map((image) => {
        const UUID = v4()
        const SparePartImageBuffer = image.buffer;
        let SparePartImage = image.originalname.split('.');
        let SparePartFileFormat = SparePartImage[SparePartImage.length - 1];

        /** Define the file path, including the desired file name and format */
        const InvoiceFileName = `${UUID}_SparePart.${SparePartFileFormat}`;
        const InvoceFilePath = Path.join(folderPath, InvoiceFileName);

        /** Save the file buffer to the specified file path */
        fs.writeFileSync(InvoceFilePath, SparePartImageBuffer);

        return `http://srv515471.hstgr.cloud:${PORT}/Maintenance/File/${InvoiceFileName}`;
      })
      
      
      /** Checking, is there already present Image URL in database */
      let getPreviousImagesQ = `SELECT SparePartImageURL FROM SparePartName WHERE SparPartId = '${SparePartId}';`
      let previousImageUR = await queryAsync(getPreviousImagesQ);
      let previousImageURL = previousImageUR[0]['SparePartImageURL']


     
      /** If Present, then Push the new URL into previous to Update */
      if(typeof previousImageURL == 'string'){
        previousImageURL = JSON.parse(previousImageURL)
        
          ImagesURL.forEach((image)=>{
            previousImageURL.push(image);
          })
        }

      const query = `UPDATE SparePartName id
        set id.SparePartDrawingImageURL = 'http://srv515471.hstgr.cloud:${PORT}/Maintenance/File/${COCFileName}',
         id.SparePartImageURL = '${JSON.stringify(previousImageURL?previousImageURL:ImagesURL)}'
       WHERE id.SparPartId = '${SparePartId}';`;

       let data = await new Promise((resolve, rejects) => {
        dbConn.query(query, (err, result) => {
          if (err) {
            rejects(err)
          } else {
            resolve(result)
          }
        })
      })
    return res.send({ msg: 'Data Inserted SuccesFully !' })

    }else if(req.files['SparePartImage']){

      /** Define the folder path */
      const folderPath = Path.join('SpartPartImage');

      /** Create the folder if it doesn't exist */
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      let SparePartImages = req.files['SparePartImage']

      let ImagesURL = SparePartImages.map((image) => {
        const UUID = v4()
        const SparePartImageBuffer = image.buffer;
        let SparePartImage = image.originalname.split('.');
        let SparePartFileFormat = SparePartImage[SparePartImage.length - 1];

        /** Define the file path, including the desired file name and format */
        const InvoiceFileName = `${UUID}_SparePart.${SparePartFileFormat}`;
        const InvoceFilePath = Path.join(folderPath, InvoiceFileName);

        /** Save the file buffer to the specified file path */
        fs.writeFileSync(InvoceFilePath, SparePartImageBuffer);

        return `http://srv515471.hstgr.cloud:${PORT}/Maintenance/File/${InvoiceFileName}`;
      })
      
      let getPreviousImagesQ = `SELECT SparePartImageURL FROM SparePartName WHERE SparPartId = '${SparePartId}';`
      let previousImageUR = await queryAsync(getPreviousImagesQ);
      let previousImageURL = previousImageUR[0]['SparePartImageURL']
        
      
      if(typeof previousImageURL == 'string'){

        previousImageURL = JSON.parse(previousImageURL)
      
        ImagesURL.forEach((image)=>{
          previousImageURL.push(image);
        })
      }

      const query = `UPDATE SparePartName id
        set id.SparePartImageURL = '${JSON.stringify(previousImageURL?previousImageURL:ImagesURL)}'
       WHERE id.SparPartId = '${SparePartId}';`;

      await queryAsync(query);
      return res.send({ msg: 'Data Inserted SuccesFully !' })

    }else if (req.files['DrawingImage']) {

      const DrawingImageBuffer = req.files['DrawingImage'][0].buffer;
      let DrawingImage = req.files['DrawingImage'][0].originalname.split('.');
      let DrawingFileFormat = DrawingImage[DrawingImage.length - 1];


      /** Define the folder path */
      const folderPath = Path.join('SpartPartImage');

      /** Create the folder if it doesn't exist */
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      /** Define the file path, including the desired file name and format */
      const COCFileName = `${SparePartId}_Drawing.${DrawingFileFormat}`;

      const COCFilePath = Path.join(folderPath, COCFileName);

      /** Save the file buffer to the specified file path */
      fs.writeFileSync(COCFilePath, DrawingImageBuffer);

      const query = `UPDATE SparePartName id
     set id.SparePartDrawingImageURL = 'http://srv515471.hstgr.cloud:${PORT}/Maintenance/File/${COCFileName}'
    WHERE id.SparPartId = '${SparePartId}';`;

      await queryAsync(query);
      return res.send({ msg: 'Data Inserted SuccesFully !' });

    }else if(req.files['InvoicePdf']){
     
      const DrawingImageBuffer = req.files['InvoicePdf'][0].buffer;
      let DrawingImage = req.files['InvoicePdf'][0].originalname.split('.');
      let DrawingFileFormat = DrawingImage[DrawingImage.length - 1];


      /** Define the folder path */
      const folderPath = Path.join('SpartPartImage');

      /** Create the folder if it doesn't exist */
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      /** Define the file path, including the desired file name and format */
      const COCFileName = `${SparePartId}_Invoice.${DrawingFileFormat}`;

      const COCFilePath = Path.join(folderPath, COCFileName);

      /** Save the file buffer to the specified file path */
      fs.writeFileSync(COCFilePath, DrawingImageBuffer);

      const query = `UPDATE Spare_Part_In id
     set id.Invoice_Pdf_URL = 'http://srv515471.hstgr.cloud:${PORT}/Maintenance/File/${COCFileName}'
    WHERE id.Spare_Part_In_Id = '${SparePartId}';`;

      await queryAsync(query);
      return res.send({ msg: 'Data Inserted SuccesFully !' });

    }else if(req.files['MachineMaintenancePdf']){
     
      const DrawingImageBuffer = req.files['MachineMaintenancePdf'][0].buffer;
      let DrawingImage = req.files['MachineMaintenancePdf'][0].originalname.split('.');
      let DrawingFileFormat = DrawingImage[DrawingImage.length - 1];


      /** Define the folder path */
      const folderPath = Path.join('SpartPartImage');

      /** Create the folder if it doesn't exist */
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      /** Define the file path, including the desired file name and format */
      const COCFileName = `${SparePartId}_Machine_Maintenance.${DrawingFileFormat}`;

      const COCFilePath = Path.join(folderPath, COCFileName);

      /** Save the file buffer to the specified file path */
      fs.writeFileSync(COCFilePath, DrawingImageBuffer);

      const query = `UPDATE Machine_Maintenance id
     set id.Image_URL = 'http://srv515471.hstgr.cloud:${PORT}/Maintenance/File/${COCFileName}'
    WHERE id.Machine_Maintenance_Id = '${SparePartId}';`;

      await queryAsync(query);
      return res.send({ msg: 'Data Inserted SuccesFully !' });

    }else {

      return res.send({ msg: 'Data Inserted SuccesFully !' });
    }

  } catch (err) {
    console.log(err);
    res.status(401).send(err);
  }

}


const GetImage = async (req, res) => {
  const filename = req.params.filename;
  /** Define the absolute path to the IPQC-Pdf-Folder directory */
  const pdfFolderPath = Path.resolve('SpartPartImage');

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


const getEquivalent = async (req, res) => {
  const { SparePartName, MachineName } = req.body;
  let responseData = [];
  try {
    const promises = MachineName.map(async (machine) => {
      let query = `SELECT SP.SparePartName, SP.SpareNumber,SP.SparPartId AS SparePartId FROM SparePartName SP
                   JOIN SparePartMachine SPM ON SPM.SparePartId = SP.SparPartId
                   WHERE SP.SparePartName = '${SparePartName}' AND SPM.MachineId = '${machine}';`;
      
      let data = await queryAsync(query);
      return data;
    });

    const results = await Promise.all(promises);
    results.forEach(data => {
      data.forEach(eq => {
        eq['Value'] = `${eq['SparePartName']} (${eq['SpareNumber']})`
        responseData.push(eq);
      });
    });

    res.send(responseData);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

/**Spare Part List*/

const SparePartList = async (req, res) => {
  const { MachineId, SparePartId, required } = req.body;
  let query = required == 'Spare Part Name By Machine' ?
    /**Condition 1 */
    `SELECT SP.SparePartName, SP.SparPartId AS SparePartId FROM SparePartMachine S
JOIN SparePartName SP ON SP.SparPartId = S.SparePartId
WHERE S.MachineId = '${MachineId}';` :
    /**Condition 2 */
    required == 'Spare Part Brand Name' ?
      `SELECT BrandName, SparPartId AS SparePartId FROM SparePartName
WHERE SparPartId = '${SparePartId}';` :
      /**Condition 3 */
      required == 'Spare Part Model No' ?
        `SELECT SparPartId AS SparePartId, SpareNumber AS SparePartModelNumber, SparePartName FROM SparePartName;` :
        required == 'Spare Part Name' ?
          `SELECT SparPartId AS SparePartId, SparePartName FROM SparePartName
WHERE SparPartId = '${SparePartId}';` :
          required == 'Company Name' ?
            `SELECT CompanyID, CompanyName FROM Company;` : `SELECT SparPartId, MasterSparePartName, SparePartName, 
SpareNumber, Specification, BrandName, SparePartImageURL, SparePartDrawingImageURL FROM SparePartName`;

  try {
    let data = await queryAsync(query);
    !required ?
      data.forEach((list) => {
        if (typeof list.SparePartImageURL === 'string') {
          try {
            list.SparePartImageURL = JSON.parse(list.SparePartImageURL);
          } catch (error) {

          }
        }

      }) : '';

    res.send({ data });

  } catch (err) {
    console.log(err)
    res.status(400).send({ err })

 }

}


/**
 * ! Get Spare Part By Id
 */
getSpecificSparePart = async (req, res) => {
  const { SparePartId } = req.body;

  try {

    const query = `SELECT * FROM SparePartName WHERE SparPartId = '${SparePartId}';`;
    let data = await queryAsync(query);

    const query1 = `SELECT MachineId FROM SparePartMachine WHERE SparePartId = '${SparePartId}';`
    let data1 = await queryAsync(query1);
    try {
      if (typeof data[0].SparePartImageURL === 'string') {
        data[0].SparePartImageURL = JSON.parse(data[0].SparePartImageURL);

      }

      if (typeof data[0].Equivalent === 'string') {
        data[0].Equivalent = JSON.parse(data[0].Equivalent);


      }

    } catch (err) {
      console.log(err)
    }

    data[0]['MachineId'] = data1;


    res.send({ data })
  } catch (err) {
    console.log(err);
    res.send(err)
  }
}



const SparePartIn = async(req,res)=>{
  const {
    PartyId, SparePartId, SparePartName, PurchaseOrderId, MachineNames,
    SparePartBrandName, SparePartSpecification, QuantityPurchaseOrder,
    QuantityRecieved, Unit, Currency, Price, TotalCost, InvoiceNumber, Status,
    CreatedBy
  } = req.body;
  
  
  try{
    let data = await queryAsync(
      `CALL SparePartIn(
        '${PartyId}', 
        '${SparePartId}', 
        '${SparePartName}', 
        '${PurchaseOrderId}', 
        '${JSON.stringify(MachineNames)}', 
        '${SparePartBrandName}', 
        '${SparePartSpecification}', 
        '${QuantityPurchaseOrder}', 
        '${QuantityRecieved}', 
        '${Unit}', 
        '${Currency}', 
        '${Price}', 
        '${TotalCost}', 
        '${InvoiceNumber}', 
        '${Status}', 
        '${CreatedBy}'
      )`
    );
    
    res.send(data[0])
  }catch(err){
     console.log(err);
     res.status(400).send(err)
  }
}

const getStockList = async(req,res)=>{
 
  try{
    let query = `SELECT P.PartyName, SPN.SparePartName, SPN.SpareNumber AS SparePartModelNumber, 
PO.Voucher_Number, SPI.Machine_Names,
SPI.Spare_Part_Brand_Name, SPI.Spare_Part_Specification,
SPI.Quantity_Purchase_Order, SPI.Quantity_Recieved,
SPI.Unit, SPI.Currency,
SPI.Price, SPI.Total_Cost,
SPI.Invoice_Number, SPI.Invoice_Pdf_URL,
SPI.Available_Stock, Pn.Name,
SPI.Created_On
FROM Spare_Part_In SPI
JOIN PartyName P ON P.PartyNameId = SPI.Party_Id
JOIN SparePartName SPN ON SPN.SparPartId = SPI.Spare_Part_Id
JOIN PurchaseOrder PO ON PO.Purchase_Order_Id = SPI.Purchase_Order_Id
JOIN Person Pn ON Pn.PersonID = SPI.Created_By
ORDER BY SPI.Created_On DESC;`;

    let data = await queryAsync(query);

    data.forEach((d)=>{
      d['Machine_Names']?d['Machine_Names'] = JSON.parse(d['Machine_Names']):''

      const date = new Date(d['Created_On']);
        const formattedDate = date.toLocaleDateString('en-GB');
        d['Date'] = formattedDate
        d['Time'] = d['Created_On'].split(' ')[1]
    })
    res.send({data})
  }catch(err){
  console.log(err);
  res.status(400).send(err);


  }
}

const getSparePartNamesByMachineName = async(req,res)=>{
      const { MachineName } = req.body;

      try{
        const getStock = await queryAsync(`
  SELECT SPS.Spare_Part_Id, SPN.SpareNumber, SPN.SparePartName, SPS.Machine_Names, SPS.Available_Stock FROM Spare_Part_Stock SPS
JOIN SparePartName SPN ON SPN.SparPartId = SPS.Spare_Part_Id;`)
        
        let SparePartArr = []
        getStock.forEach((d)=>{
          d['Machine_Names'] = JSON.parse(d['Machine_Names']);

          d['Machine_Names'].indexOf(MachineName)!=-1?
          SparePartArr.push(d):''
         
        })

        SparePartArr.forEach((el)=>{
          delete el['Machine_Names'];
        })
       console.log(SparePartArr)
      
        res.send(SparePartArr)
      }catch(err){
     console.log(err)
     res.send(err)
      }
}


const SparePartOut = async(req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.ip;
  const userAgent = req.headers['user-agent'];
  console.log('Sparepartout...............................')
  console.log(`Request from IP: ${clientIp}`);
  console.log(`Client User-Agent: ${userAgent}`);
  console.log(`Request Headers: `, req.headers); // Optional: log all headers

  const {
    MachineMaintenanceId,
    CreatedBy,
    MachineName,
    Line,
    Chamber,
    Issue,
    BreakDownStartTime,
    BreakDownEndTime,
    BreakDownTotalTime,
    SparePartModelNumber,
    Quantity,
    SolutionProcess,
    Remarks,
    Status
  } = req.body;

console.log(req.body)

  try {
    let data = await queryAsync(`
      CALL Machine_Maintenance_Sp(
         '${MachineMaintenanceId}',
        '${MachineName}',
        '${Issue}',
        '${BreakDownStartTime}',
        '${BreakDownEndTime}',
        '${BreakDownTotalTime}',
        '${SparePartModelNumber}',
        '${Quantity}',
        '${SolutionProcess}',
        '${Line}',
        '${JSON.stringify(Chamber)}',
        '${CreatedBy}',
        '${Remarks}',
        '${Status}'
      );
    `);

    res.send({ data: data[0] });
  } catch (err) {
    console.log(err);
    res.status(400).send({ err });
  }
};


const SparePartStockList = async(req,res)=>{
  
  try{
   let data = await queryAsync(`
    SELECT SPS.Spare_Part_Stock_Id, SPN.SparePartName, SPN.SpareNumber AS Spare_Model_Number, SPS.Machine_Names, SPS.Available_Stock FROM Spare_Part_Stock SPS
JOIN SparePartName SPN ON SPN.SparPartId = SPS.Spare_Part_Id;`);

data.forEach((d)=>{
  d['Machine_Names'] = JSON.parse(d['Machine_Names']);

})
res.send({data});

  }catch(err){

  console.log(err);
  res.status(400).send(err);
  }
}


const getMachineMaintenanceList = async(req,res)=>{
  // const clientIp = req.headers['x-forwarded-for'] || req.ip;
  // const userAgent = req.headers['user-agent'];
  
  // console.log(`Request from IP: ${clientIp}`);
  // console.log(`Client User-Agent: ${userAgent}`);
  // console.log(`Request Headers: `, req.headers); // Optional: log all headers

  try{
     let data = await queryAsync(`SELECT 
    MM.Machine_Maintenance_Id,  
    SPN.SparePartName AS 'Spare Part Name', 
    SPN.SpareNumber AS 'Spare Part Model Number', 
    M.MachineName AS 'Machine Name',
    M.MachineModelNumber AS 'Machine Model Number', 
    MM.Issue,
    MM.BreakDown_Start_Time AS 'BreakDown Start Time',
    MM.BreakDown_End_Time AS 'BreakDown End Time',
    MM.BreakDown_Total_Time AS 'BreakDown Total Time',
    MM.Quantity AS 'Quantity',
    MM.Solution_Process AS 'Solution Process',
    MM.Line,
    MM.Chamber,
    MM.Remark,
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
ORDER BY 
    MM.Created_On DESC;
`);

const groupedData = data.reduce((acc, item) => {
  const id = item.Machine_Maintenance_Id;
  
  if (!acc.has(id)) {
    // Clone the item and initialize the Maintenanced by array
    acc.set(id, { ...item, 'Maintenanced by': [item['Maintenanced by']],'Chamber': JSON.parse(item['Chamber']) });
  } else {
    // Push the unique Maintenanced by value into the array
    acc.get(id)['Maintenanced by'].push(item['Maintenanced by']);
  }
  
  return acc;
}, new Map());


// Convert the Map back to an array of objects
const uniqueData = Array.from(groupedData.values());

//console.log(uniqueData);

res.send({data:uniqueData});

  }catch(err){
    console.log(err)
    res.status(400).send({err})

  }

}

module.exports = { AddSpareParts, UploadImage, GetImage, getEquivalent, getStockList, SparePartList, getSpecificSparePart, SparePartIn, getSparePartNamesByMachineName,
  SparePartOut,
  SparePartStockList,
  getMachineMaintenanceList
 };
