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
        SparePartName,
        SpareNumber,
        Specification,
        BrandName,
        MachineName,
        Status,
        MasterSparePartName,
        CurrentUser: CreatedBy } = req.body;


    console.log(req.body)
    console.log('typeeeeeeeeeeeeeeeee',typeof MachineName)
    const MachineNameArray = MachineName
    let UUID = v4();
    try {
      let getSpareModelNumberQuery = `SELECT SpareNumber FROM SparePartName WHERE SpareNumber = '${SpareNumber}';`
      let getSpareModelNumbers = await queryAsync(getSpareModelNumberQuery);

      if(getSpareModelNumbers.length){

        return res.status(409).send({msg:'Duplicate Spare Model Number'})
      }

      const query = `INSERT INTO SparePartName(SparPartId ,SparePartName,SpareNumber,Specification,BrandName,Status,CreatedBy,MasterSparePartName,CreatedOn) VALUES
            ('${UUID}','${SparePartName}','${SpareNumber}','${Specification}','${BrandName}','${Status}','${CreatedBy}','${MasterSparePartName}','${getCurrentDateTime()}');`

      await queryAsync(query)
        MachineNameArray.forEach(async(MachineName)=>{
          let SpareMachineId = v4();
         let query = `INSERT INTO SparePartMachine(SparePartMachineId,SparePartId,MachineId,Status,CreatedBy,CreatedOn) VALUES
                    ('${SpareMachineId}','${UUID}','${MachineName}','${Status}','${CreatedBy}','${getCurrentDateTime()}');`
        
                    await queryAsync(query)
        });
          
 
      return  res.send({ msg: 'Inserted Succesfully!', SparePartId: UUID });

    } catch (err) {

        console.log(err)
     return   res.status(400).send({ err })

    }



}



const UploadImage = async (req, res) => {

    const { SparePartId } = req.body;

    /** Uploading PDF in Employee-Profile-Folder */
      try {
        /** Get the file buffer and the file format */
        if(req.files['SparePartImage'] && req.files['DrawingImage']){
        const SparePartImageBuffer = req.files['SparePartImage'][0].buffer;
        const DrawingImageBuffer = req.files['DrawingImage'][0].buffer;
         let SparePartImage = req.files['SparePartImage'][0].originalname.split('.')
         let DrawingImage =  req.files['DrawingImage'][0].originalname.split('.')
         let SparePartFileFormat = SparePartImage[SparePartImage.length-1];
         let DrawingFileFormat = DrawingImage[DrawingImage.length-1];


        /** Define the folder path */
        const folderPath = Path.join('SpartPartImage');
  
        /** Create the folder if it doesn't exist */
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }
  
        /** Define the file path, including the desired file name and format */
        const InvoiceFileName = `${SparePartId}_Spart.${SparePartFileFormat}`;
        const COCFileName = `${SparePartId}_Drawing.${DrawingFileFormat}`;

        const InvoceFilePath = Path.join(folderPath, InvoiceFileName);
        const COCFilePath = Path.join(folderPath,COCFileName);
  
        /** Save the file buffer to the specified file path */
        fs.writeFileSync(InvoceFilePath, SparePartImageBuffer);
        fs.writeFileSync(COCFilePath, DrawingImageBuffer);
        
        const query = `UPDATE SparePartName id
        set id.SparePartDrawingImageURL = 'http://srv515471.hstgr.cloud:${PORT}/Maintenance/File/${COCFileName}',
         id.SparePartImageURL = 'http://srv515471.hstgr.cloud:${PORT}/Maintenance/File/${InvoiceFileName}'
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

      const SparePartImageBuffer = req.files['SparePartImage'][0].buffer;
      let SparePartImage = req.files['SparePartImage'][0].originalname.split('.');
      let SparePartFileFormat = SparePartImage[SparePartImage.length-1];

       /** Define the folder path */
       const folderPath = Path.join('SpartPartImage');
  
       /** Create the folder if it doesn't exist */
       if (!fs.existsSync(folderPath)) {
         fs.mkdirSync(folderPath, { recursive: true });
       }
 
       /** Define the file path, including the desired file name and format */
       const InvoiceFileName = `${SparePartId}_Spart.${SparePartFileFormat}`;

       const InvoceFilePath = Path.join(folderPath, InvoiceFileName);
        
        /** Save the file buffer to the specified file path */
        fs.writeFileSync(InvoceFilePath, SparePartImageBuffer);
        
        const query = `UPDATE SparePartName id
        set id.SparePartImageURL = 'http://srv515471.hstgr.cloud:${PORT}/Maintenance/File/${InvoiceFileName}'
       WHERE id.SparPartId = '${SparePartId}';`;

       await queryAsync(query);
       return res.send({ msg: 'Data Inserted SuccesFully !' })

    }else if(req.files['DrawingImage']){

      const DrawingImageBuffer = req.files['DrawingImage'][0].buffer;
      let DrawingImage =  req.files['DrawingImage'][0].originalname.split('.');
      let DrawingFileFormat = DrawingImage[DrawingImage.length-1];


     /** Define the folder path */
     const folderPath = Path.join('SpartPartImage');

     /** Create the folder if it doesn't exist */
     if (!fs.existsSync(folderPath)) {
       fs.mkdirSync(folderPath, { recursive: true });
     }

     /** Define the file path, including the desired file name and format */
     const COCFileName = `${SparePartId}_Drawing.${DrawingFileFormat}`;

     const COCFilePath = Path.join(folderPath,COCFileName);

     /** Save the file buffer to the specified file path */
     fs.writeFileSync(COCFilePath, DrawingImageBuffer);
     
     const query = `UPDATE SparePartName id
     set id.SparePartDrawingImageURL = 'http://srv515471.hstgr.cloud:${PORT}/Maintenance/File/${COCFileName}'
    WHERE id.SparPartId = '${SparePartId}';`;

    await queryAsync(query);
    return res.send({ msg: 'Data Inserted SuccesFully !' });

    }else{

      return res.send({ msg: 'Data Inserted SuccesFully !' });
    }
  
      } catch (err) {
        console.log(err);
        res.status(401).send(err);
      }
   
  }


  const GetImage = async(req,res)=>{
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

module.exports = {AddSpareParts, UploadImage, AddSpareParts, GetImage};
