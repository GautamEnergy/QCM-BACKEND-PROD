const { v4: uuidv4, v4 } = require('uuid');
const { getCurrentDateTime, s3 } = require('../Utilis/BOMVerificationUtilis')
const util = require('util');
const fs = require('fs');
const Path = require('path');
const { dbConn } = require('../db.config/db.config')
require('dotenv').config()
const PORT = process.env.PORT || 9090
/** Making Sync To Query */
const queryAsync = util.promisify(dbConn.query).bind(dbConn);

const data = {
    "Type": "",
    "JobCardDetailId": "",
    "Status": "",
    "CreatedBy": "",
    "DocNo": "",
    "RevNo": "",
    "Date": "",
    "Shift": "",
    "Stages": [
        {
            "Stage": "",
            "WithoutSealant": "",
            "WithSealant": "",
            "DifferenceWeight": "",
            "BaseWeight": "",
            "CatalystWeight": "",
            "Ratio": ""

        },
        {
            "Stage": "",
            "WithoutSealant": "",
            "WithSealant": "",
            "DifferenceWeight": "",
            "BaseWeight": "",
            "CatalystWeight": "",
            "Ratio": ""

        },
        {
            "Stage": "",
            "WithoutSealant": "",
            "WithSealant": "",
            "DifferenceWeight": "",
            "BaseWeight": "",
            "CatalystWeight": "",
            "Ratio": ""

        },

    ]
};


const AddSealentWeight = async (req, res) => {
    const { Type, JobCardDetailId, Shift, Status, Date, CreatedBy, DocNo, RevNo } = req.body
    const Stages = req.body['Stages'];
    const UUID = v4()
    if (!JobCardDetailId) {
        try {
            const PreLamDetailQuery = `INSERT INTO PreLamDetail(PreLamDetailId,Type,DocNo,RevNo,Date,Shift,CheckedBy,CreatedBy,CreatedOn,Status)
    VALUES('${UUID}','${Type}','${DocNo}','${RevNo}','${Date}','${Shift}','${CreatedBy}','${CreatedBy}','${getCurrentDateTime()}','${Status}');`

            await queryAsync(PreLamDetailQuery);

            Stages.forEach(async (stage) => {
                const SealentWeightQuery = `INSERT INTO SealentWeight(PreLamDetailId,SealentWeightId,Stage,WithoutSealant,WithSealant,DiffWeight,BaseWeight,CatalystWeight,Ratio)
                               VALUES('${UUID}','${v4()}','${stage['Stage']}','${stage['WithoutSealant']}','${stage['WithSealant']}','${stage['DifferenceWeight']}','${stage['BaseWeight']}','${stage['CatalystWeight']}','${stage['Ratio']}');`
                await queryAsync(SealentWeightQuery);
            });

            res.send({ msg: 'Data Inserted Succesfully !', UUID });
        } catch (err) {
            console.log(err)
            res.status(400).send(err);
        }

    } else {
        try {
            const PreLamDetailQuery = `UPDATE PreLamDetail
   SET
       Type = '${Type}',
       DocNo = '${DocNo}',
       RevNo = '${RevNo}',
       Date = '${Date}',
       Shift = '${Shift}',
       CheckedBy = '${CreatedBy}',
       CreatedBy = '${CreatedBy}',
       CreatedOn = '${getCurrentDateTime()}',
       Status = '${Status}'
   WHERE
       PreLamDetailId = '${JobCardDetailId}';
   `
            await queryAsync(PreLamDetailQuery);

            Stages.forEach(async (stage) => {
                const SealentWeightQuery = `UPDATE SealentWeight
    SET
        WithoutSealant = '${stage['WithoutSealant']}',
        WithSealant = '${stage['WithSealant']}',
        DiffWeight = '${stage['DifferenceWeight']}',
        BaseWeight = '${stage['BaseWeight']}',
        CatalystWeight = '${stage['CatalystWeight']}',
        Ratio = '${stage['Ratio']}'
    WHERE
        PreLamDetailId = '${JobCardDetailId}' AND Stage = '${stage['Stage']}';
    `
                await queryAsync(SealentWeightQuery);

            });
            res.send({ msg: 'Data Inserted Succesfully !', UUID: JobCardDetailId });
        } catch (err) {
            console.log(err)
            res.status(400).send({ err })
        }

    }
}


const UploadSealentWeightPdf = async(req,res)=>{

    const { JobCardDetailId } = req.body;

    if(req.file.size){
      /** making file in IPQC-Pdf-Folder*/
      try {
         // Get the file buffer and the file format
         const fileBuffer = req.file.buffer;
         
         // Define the folder path
         const folderPath = Path.join('IPQC-Pdf-Folder');
    
         // Create the folder if it doesn't exist
         if (!fs.existsSync(folderPath)) {
    
             fs.mkdirSync(folderPath, { recursive: true });
         }
         
         // Define the file path, including the desired file name and format
         const fileName = `${JobCardDetailId}.pdf`;
         const filePath = Path.join(folderPath, fileName);
    
         // Save the file buffer to the specified file path
      fs.writeFileSync(filePath, fileBuffer);
         const query = `UPDATE PreLamDetail
         SET PreLamPdf = 'http://srv515471.hstgr.cloud:${PORT}/IPQC/Pdf/${JobCardDetailId}.pdf'
         WHERE PreLamDetailId = '${JobCardDetailId}';`;
    const update = await queryAsync(query);
    
    // Send success response with the file URL
    res.send({ msg: 'Data inserted successfully!', URL: `http://srv515471.hstgr.cloud:${PORT}/IPQC/Pdf/${JobCardDetailId}.pdf` });
      } catch (err) {
        console.log(err);
        res.status(401).send(err);
      }
    }else{
      res.status(401).send({status:false,'err':'file is empty'});
    }
}


const GetSpecificSealentWeight = async(req,res)=>{
    const {JobCardDetailId} = req.body

    try{
        const query = `SELECT *FROM PreLamDetail PD
        JOIN SealentWeight SW ON PD.PreLamDetailId = SW.PreLamDetailId
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
                   response['PreLamPdf'] = Lam['PreLamPdf'];
                   response['CheckedBy'] = Lam['CheckedBy'];
                   response['BaseWeight'] = Lam['BaseWeight'];
                   response['CatalystWeight'] = Lam['CatalystWeight'];
                   response['Ratio'] = Lam['Ratio']
                   response['Status'] = Lam['Status'];
               }
              const Stage = Lam['Stage'].split(' ').join('');
            response[`${Stage}_WithoutSealant`] = Lam['WithoutSealant'];
            response[`${Stage}_WithSealant`] = Lam['WithSealant'];
            response[`${Stage}_DiffWeight`] = Lam['DiffWeight'];
             
          })
          res.send({response})
      }catch(err){
        console.log(err)
        res.status(400).send({err})
      }
}

const UpdateSealentStatus = async(req,res)=>{
    const {JobCardDetailId,ApprovalStatus,CurrentUser} = req.body;
  
    try{
       const UpdateStatusQuery = `UPDATE PreLamDetail
                                  SET
                                    Status = '${ApprovalStatus}',
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


module.exports = {AddSealentWeight,UploadSealentWeightPdf,GetSpecificSealentWeight,UpdateSealentStatus}
