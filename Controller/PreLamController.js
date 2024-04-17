const { v4: uuidv4, v4 } = require('uuid');
const { getCurrentDateTime, s3 } = require('../Utilis/PreLamUtilis.js');
const util = require('util');
const { dbConn } = require('../db.config/db.config');


/** Making Sync To Query */
const queryAsync = util.promisify(dbConn.query).bind(dbConn);

// let data = [{
//   "PreLamDetaildId": "024eb029-af7d-4947-b16f-801473771068",
//   "CurrentUser": "5a114928-e8f3-11ee-b439-0ac93defbbf1",
//   "DocNo": "GSPL/IPQC/IPC/003",
//   "RevNo": "1.0 dated 12.08.2023",
//   "Date": "DayController.text",
//   "Shift": "shiftController.text",
//   "Line": "lineController.text",
//   "PONo": "PoController.text"
// }, [
//   {
//     "Stage": "Glass Loader",
//     "CheckPoint": {
//       "Glass dimension(LengthxWidthxThickness)": "GlassLoaderGlassDimensionController.text",
//       "Avaibility of WI": "GlassLoaderAvaibilityController.text",
//     },
//     "AcceptanceCriteria": {
//       "Glass dimension(LengthxWidthxThickness)": "GlassLoaderCriteria1Controller.text",
//       "Avaibility of WI": "GlassLoaderCriteria2Controller.text"
//     },
//     "Frequency": {
//       "Glass dimension(LengthxWidthxThickness)": "GlassLoaderFreqquency1Controller.text",
//       "Avaibility of WI": "GlassLoaderFrequency2Controller.text"
//     },
//     "Remark": "GlassLoaderRemarkController.text"
//   },
//   {
//     "Stage": "Glass side EVA cutting machine",
//     "CheckPoint": {
//       "EVA dimension{LengthxWidthxThickness}": "GlassEVADimensionController.text",
//       "Cutting edge of EVA": "GlasCuttingEdgeController.text",
//       "Position of front EVA": ""
//     },
//     "AcceptanceCriteria": {
//       "Glass dimension(LengthxWidthxThickness)": "GlassLoaderCriteria1Controller.text",
//       "Avaibility of WI": "GlassLoaderCriteria2Controller.text"
//     },
//     "Frequency": {
//       "Glass dimension(LengthxWidthxThickness)": "GlassLoaderFreqquency1Controller.text",
//       "Avaibility of WI": "GlassLoaderFrequency2Controller.text"
//     },
//     "Remark": "GlassLoaderRemarkController.text"
//   },
//   {
//     "Stage": "Cell Loading",
//     "CheckPoint": {
//       "Glass dimension(LengthxWidthxThickness)": "GlassLoaderGlassDimensionController.text",
//       "string length & cell to cell Gap": ["kdfksd", "ksdfksdfk"]
//     },
//     "AcceptanceCriteria": {
//       "Glass dimension(LengthxWidthxThickness)": "GlassLoaderCriteria1Controller.text",
//       "Avaibility of WI": "GlassLoaderCriteria2Controller.text"
//     },
//     "Frequency": {
//       "Glass dimension(LengthxWidthxThickness)": "GlassLoaderFreqquency1Controller.text",
//       "string length & cell to cell Gap": "5 String"
//     },
//     "Remark": "GlassLoaderRemarkController.text"
//   }

// ]];

const AddPreLam = async (req, res) => {
  const PreLamDetail = req.body[0];
  const PreLam = req.body[1];
  const PreLamDetailId = PreLamDetail['PreLamDetailId']
  const UUID = v4();
  if (!PreLamDetailId) {
    try {
      const PreLamDetailQuery = `INSERT INTO PreLamDetail(PreLamDetailId,Type,DocNo,RevNo,Date,Shift,Line,PONo,CheckedBy,CreatedBy,CreatedOn,Status)
                                          VALUES('${UUID}','PreLam','${PreLamDetail['DocNo']}','${PreLamDetail['RevNo']}','${PreLamDetail['Date']}','${PreLamDetail['Shift']}','${PreLamDetail['Line']}','${PreLamDetail['PONo']}','${PreLamDetail['CurrentUser']}','${PreLamDetail['CurrentUser']}','${getCurrentDateTime()}','${PreLamDetail['Status']}')`

      await queryAsync(PreLamDetailQuery);

      PreLam.forEach(async (Lam) => {

        const PreLamQuery = `INSERT INTO PreLam(PreLamId,PreLamDetailId,Stage,CheckPoint,Frequency,AcceptanceCriteria,Remark)
                                          VALUES('${v4()}','${UUID}','${Lam['Stage']}','${JSON.stringify(Lam['CheckPoint'])}','${JSON.stringify(Lam['Frequency'])}','${JSON.stringify(Lam['AcceptanceCriteria'])}','${Lam['Remark']}');`
        await queryAsync(PreLamQuery);

      })
      res.send({ msg: 'Data Inserted Succesfully !', UUID });
    } catch (err) {
      console.log(err)
      res.status(400).send(err);
    }
  } else {

    try {
      const PreLamDetailQuery = `UPDATE PreLamDetail
   SET
     DocNo = '${PreLamDetail['DocNo']}',
     RevNo = '${PreLamDetail['RevNo']}',
     Date = '${PreLamDetail['Date']}',
     Shift = '${PreLamDetail['Shift']}',
     Line = '${PreLamDetail['Line']}',
     PONo = '${PreLamDetail['PONo']}',
     CheckedBy = '${PreLamDetail['CurrentUser']}',
     CreatedBy = '${PreLamDetail['CurrentUser']}',
     Status = '${PreLamDetail['Status']}'
   WHERE PreLamDetailId = '${PreLamDetailId}';
     `
      await queryAsync(PreLamDetailQuery);

      PreLam.forEach(async (Lam) => {
        // const PreLamQuery = `INSERT INTO PreLam(PreLamId,PreLamDetailId,Stage,CheckPoint,Frequency,AcceptanceCriteria,Remark)
        // VALUES('${v4()}','${UUID}','${Lam['Stage']}','${JSON.stringify(Lam['CheckPoint'])}','${JSON.stringify(Lam['Frequency'])}','${JSON.stringify(Lam['AcceptanceCriteria'])}','${Lam['Remark']}');`

        const PreLamQuery = `UPDATE PreLam
     SET
       CheckPoint = '${JSON.stringify(Lam['CheckPoint'])}',
       Frequency = '${JSON.stringify(Lam['Frequency'])}',
       AcceptanceCriteria = '${JSON.stringify(Lam['AcceptanceCriteria'])}',
       Remark = '${Lam['Remark']}'
     WHERE PreLamDetailId = '${PreLamDetailId}' AND Stage = '${Lam['Stage']}';
       `
        await queryAsync(PreLamQuery);
      })
      res.send({ msg: 'Data Inserted Succesfully !',UUID:PreLamDetailId });
    } catch (err) {
      
      console.log(err)
      res.status(400).send({err})
    }
  }

}


const PreLamUploadPdf = async (req, res) => {

  const { JobCardDetailId } = req.body;
  console.log(req.file)
  /** Uploading PDF in S3 Bucket */
  if(req.file.size){
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



    const query = `UPDATE PreLamDetail
    set PreLamPdf = '${ReferencePdf.Location}'
   WHERE PreLamDetailId = '${JobCardDetailId}';`;

    const update = await queryAsync(query);
    res.send({ msg: 'Data Inserted SuccesFully !', URL: ReferencePdf.Location });
  } catch (err) {
    console.log(err);
    res.status(401).send(err);
  }
}else{
  res.status(400).send({msg:'Cannot take Empty File'})
}
}


const GetSpecificPreLam = async(req,res)=>{
const {JobCardDetailId} = req.body
try{
  const query = `SELECT *FROM PreLamDetail PD
  JOIN PreLam PL ON PD.PreLamDetailId = PL.PreLamDetailId
  WHERE PD.PreLamDetailId = '${JobCardDetailId}';`

    const PreLam = await queryAsync(query)
   
    let response = {}

    PreLam.forEach((Lam,i)=>{
         if(i == 0){
             response['PreLamDetailId'] = Lam['PreLamDetailId'];
             response['DocNo'] = Lam['DocNo'];
             response['RevNo'] = Lam['RevNo'];
             response['Date'] = Lam['Date'];
             response['Shift'] = Lam['Shift'];
             response['Line'] = Lam['Line'];
             response['PONo'] = Lam['PONo'];
             response['PreLamPdf'] = Lam['PreLamPdf'];
             response['CheckedBy'] = Lam['CheckedBy'];
             response['Status'] = Lam['Status'];
         }
         const Stage = Lam['Stage'].split(' ').join('');
        response[`${Stage}CheckPoint`] = JSON.parse(Lam['CheckPoint']);
        response[`${Stage}Frequency`] = JSON.parse(Lam['Frequency']);
        response[`${Stage}AcceptanceCriteria`] = JSON.parse(Lam['AcceptanceCriteria']);
        response[`${Stage}Remark`] = Lam['Remark'];
       
    })
    res.send({response})
}catch(err){
  console.log(err)
  res.status(400).send({err})
}
}



const UpdatePreLamStatus = async(req,res)=>{
  const {JobCardDetailId,Status,CurrentUser} = req.body;

  try{
     const UpdateStatusQuery = `UPDATE PreLamDetail
                                SET
                                  Status = '${Status}',
                                  UpdatedBy = '${CurrentUser}',
                                  UpdatedOn = '${getCurrentDateTime()}'
                                WHERE PreLamDetailId = '${JobCardDetailId}';`;

    let UpdateStatus =  await queryAsync(UpdateStatusQuery);

    res.send({status:true,data:UpdateStatus});
  }catch(err){
    console.log(err)
    res.status(400).send({status:false,err})
  }
}


module.exports = { AddPreLam,PreLamUploadPdf,GetSpecificPreLam,UpdatePreLamStatus } 
