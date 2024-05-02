const { v4: uuidv4, v4 } = require('uuid');
const { getCurrentDateTime, s3 } = require('../Utilis/PreLamUtilis');
const fs = require('fs');
const Path = require('path')

const util = require('util');
const { dbConn } = require('../db.config/db.config');


/** Making Sync To Query */
const queryAsync = util.promisify(dbConn.query).bind(dbConn);

// const data = {
//      'PreLamDetailId':'',
//     'CurrentUser':'',
//     'Status':'Inprogress',
//     'DocNo':'GSPL/IPQC/AF/011',
//     'RevNo':'1.0/12.08.2023',
//     'Date': dateController.text,
//     'Shift': shiftController.text,
//     'samples': [
//       {
//         'Sample': Sample1Controller.text,
//         'FramingObservation': Sample1GlueController.text,
//         'FramingDimension': {
//           'x1': Sample1x1Controller.text,
//           'x2': Sample1x2Controller.text,
//           'y1': Sample1y1Controller.text,
//           'y2': Sample1y2Controller.text,
//           'l1': Sample1L1Controller.text,
//           'l2': Sample1L2Controller.text,
//           'w1': Sample1W1Controller.text,
//           'w2': Sample1W2Controller.text
//         }
//       },
//       {
//         'Sample': Sample2Controller.text,
//         'FramingObservation': Sample2GlueController.text,
//         'FramingDimension': {
//           'x1': Sample2x1Controller.text,
//           'x2': Sample2x2Controller.text,
//           'y1': Sample2y1Controller.text,
//           'y2': Sample2y2Controller.text,
//           'l1': Sample2L1Controller.text,
//           'l2': Sample2L2Controller.text,
//           'w1': Sample2W1Controller.text,
//           'w2': Sample2W2Controller.text
//         }
//       },
//       {
//         'Sample': Sample3Controller.text,
//         'FramingObservation': Sample3GlueController.text,
//         'FramingDimension': {
//           'x1': Sample3x1Controller.text,
//           'x2': Sample3x2Controller.text,
//           'y1': Sample3y1Controller.text,
//           'y2': Sample3y2Controller.text,
//           'l1': Sample3L1Controller.text,
//           'l2': Sample3L2Controller.text,
//           'w1': Sample3W1Controller.text,
//           'w2': Sample3W2Controller.text
//         }
//       },
//       {
//         'Sample': Sample4Controller.text,
//         'FramingObservation': Sample4GlueController.text,
//         'FramingDimension': {
//           'x1': Sample4x1Controller.text,
//           'x2': Sample4x2Controller.text,
//           'y1': Sample4y1Controller.text,
//           'y2': Sample4y2Controller.text,
//           'l1': Sample4L1Controller.text,
//           'l2': Sample4L2Controller.text,
//           'w1': Sample4W1Controller.text,
//           'w2': Sample4W2Controller.text
//         }
//       },
//       {
//         'Sample': Sample5Controller.text,
//         'FramingObservation': Sample5GlueController.text,
//         'FramingDimension': {
//           'x1': Sample5x1Controller.text,
//           'x2': Sample5x2Controller.text,
//           'y1': Sample5y1Controller.text,
//           'y2': Sample5y2Controller.text,
//           'l1': Sample5L1Controller.text,
//           'l2': Sample5L2Controller.text,
//           'w1': Sample5W1Controller.text,
//           'w2': Sample5W2Controller.text
//         }
//       },
//     ],
//   }


const AddFraming = async(req,res)=>{
  const {DocNo,RevNo,Shift,Date,CurrentUser,Status,PreLamDetailId,Line} = req.body;
  const Samples = req.body['samples'];
  const UUID = v4();
  if(!PreLamDetailId){
  try{
    const PreLamDetailQuery = `INSERT INTO PreLamDetail(PreLamDetailId,Type,DocNo,RevNo,Date,Shift,Line,Status,CheckedBy,CreatedOn)
                                    VALUES('${UUID}','Framing','${DocNo}','${RevNo}','${Date}','${Shift}','${Line}','${Status}','${CurrentUser}','${getCurrentDateTime()}');`;
    await queryAsync(PreLamDetailQuery);

    Samples.forEach(async(sample)=>{
        const query = `INSERT INTO Framing(FramingId,PreLamDetailId,Stage,Sample,FramingObservation,FramingDimension)
                           VALUES('${v4()}','${UUID}','${sample['Stage']}','${sample['Sample']}','${sample['FramingObservation']}','${JSON.stringify(sample['FramingDimension'])}');`;
       await queryAsync(query);
    })
    res.send({ msg: 'Data Inserted Succesfully !', UUID });
  }catch(err){
  console.log(err);
  res.status(400).send({ err });
  }
}else{
 try{
    const PreLamDetailQuery = `UPDATE PreLamDetail
                               SET
                                 DocNo = '${DocNo}',
                                 RevNo = '${RevNo}',
                                 Date  = '${Date}',
                                 Shift = '${Shift}',
                                 Status = '${Status}',
                                 CheckedBy = '${CurrentUser}',
                                 CreatedOn = '${getCurrentDateTime()}'
                               WHERE PreLamDetailId = '${PreLamDetailId}';`;
    await queryAsync(PreLamDetailQuery);
   Samples.forEach(async(sample)=>{
    const query = `UPDATE Framing
                   SET
                     Sample = '${sample['Sample']}',
                     FramingObservation = '${sample['FramingObservation']}',
                     FramingDimension = '${JSON.stringify(sample['FramingDimension'])}'
                   WHERE PreLamDetailId = '${PreLamDetailId}' AND Stage = '${sample['Stage']}';
                     `;
    await queryAsync(query);

   })
   res.send({ msg: 'Data Inserted Succesfully !', UUID:PreLamDetailId });
 }catch(err){
    console.log(err);
    res.status(400).send({ err });
 };
};
};


const UploadFramingPdf = async (req, res) => {

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
     const query = `UPDATE PreLamDetail
     SET PreLamPdf = 'http://srv515471.hstgr.cloud:8080/IPQC/Pdf/${JobCardDetailId}.pdf'
     WHERE PreLamDetailId = '${JobCardDetailId}';`;
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

    
const GetPdf = async(req,res)=>{
  const filename = req.params.filename;
   // Define the absolute path to the IPQC-Pdf-Folder directory
   const pdfFolderPath = Path.resolve( 'IPQC-Pdf-Folder');

   // Construct the full file path to the requested file
   const filePath = Path.join(pdfFolderPath, filename);

   // Send the file to the client
   res.sendFile(filePath, (err) => {
       if (err) {
           console.error('Error sending file:', err);
           res.status(404).send({ error: 'File not found' });
       }
   });
}

const GetSpecificFraming = async(req,res)=>{
  const { JobCardDetailId } = req.body

  try{
    const query = `SELECT *FROM PreLamDetail PD
    JOIN Framing F ON PD.PreLamDetailId = F.PreLamDetailId
    WHERE PD.PreLamDetailId = '${JobCardDetailId}';`;
  const FramingData = await queryAsync(query);
   
  let response = {};

  FramingData.forEach((Framing,i)=>{
    if(i == 0){
      response['PreLamDetailId'] = Framing['PreLamDetailId'];
      response['DocNo'] = Framing['DocNo'];
      response['RevNo'] = Framing['RevNo'];
      response['Date'] = Framing['Date'];
      response['Shift'] = Framing['Shift'];
      response['ModuleId'] = Framing['Line'];
      response['PreLamPdf'] = Framing['PreLamPdf'];
      response['Status'] = Framing['Status']
    }
    response[`Sample${i+1}`] = Framing['Sample'];
    response[`${i+1}FramingObservation`] = Framing['FramingObservation'];
    response[`${i+1}FramingDimension`] = JSON.parse(Framing['FramingDimension']);
  })
  res.send({response});
  }catch(err){
   console.log(err);
   res.status(400).send({err});
  }
}


const UpdateFramingStatus = async(req,res)=>{
  const { CurrentUser, ApprovalStatus, JobCardDetailId } = req.body;

  try {
    let query = `UPDATE PreLamDetail PD
                    set PD.Status = '${ApprovalStatus}',
                        PD.UpdatedBy ='${CurrentUser}',
                        PD.UpdatedOn = '${getCurrentDateTime()}'
                    WHERE PD.PreLamDetailId = '${JobCardDetailId}'`
    let JobCardDetail = await queryAsync(query)
    res.send({ ApprovalStatus, JobCardDetail })
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
}

module.exports = {AddFraming,UploadFramingPdf,GetSpecificFraming,UpdateFramingStatus,GetPdf};
