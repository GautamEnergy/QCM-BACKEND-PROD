const { v4: uuidv4, v4 } = require('uuid');
const { getCurrentDateTime, s3 } = require('../Utilis/PreLamUtilis');
const util = require('util');
const fs = require('fs');
const Path = require('path')
const { dbConn } = require('../db.config/db.config');


/** Making Sync To Query */
const queryAsync = util.promisify(dbConn.query).bind(dbConn);

  let data ={
    "JobCardDetailId": "024eb029-af7d-4947-b16f-801473771068",
      "CurrentUser": "",
      "DocNo": "GSPL/IPQC/IPC/003",
      "RevNo": "1.0 dated 12.08.2023",
      "Date": "DayController.text",
      "Shift": "shiftController.text",
      "Location":[{"Locationfield":"dfd"}],
      "Status":"",
      "Type":"",
      "Stage":[
        {
            "Parameter":"EVA Make",
            "Specification":"kdfk32",
            "ObservedValueA":"",
            "ObservedValueB":""
        },
        {
            "Parameter":"EVA Make",
            "Specification":"kdfk32",
            "ObservedValueA":"",
            "ObservedValueB":""
        },
        {
            "Parameter":"EVA Make",
            "Specification":"kdfk32",
            "ObservedValueA":"",
            "ObservedValueB":""
        },
        {
            "Parameter":"EVA Make",
            "Specification":"kdfk32",
            "ObservedValueA":"",
            "ObservedValueB":""
        }
      ]
  }
const AddLaminator = async(req,res)=>{
     const {CurrentUser,Stage,Status,DocNo,RevNo,Shift,Location,Type,JobCardDetailId,Date} = req.body;
     const UUID = v4();
     if (!JobCardDetailId) {
        try {
          const PreLamDetailQuery = `INSERT INTO PreLamDetail(PreLamDetailId,Type,DocNo,RevNo,Date,Shift,CheckedBy,CreatedBy,CreatedOn,Status,Location)
                                              VALUES('${UUID}','${Type}','${DocNo}','${RevNo}','${Date}','${Shift}','${CurrentUser}','${CurrentUser}','${getCurrentDateTime()}','${Status}','${JSON.stringify(Location)}');`
    
          await queryAsync(PreLamDetailQuery);
    
        Stage.forEach(async(data)=>{
            console.log(data)
            const LaminatorQuery = `INSERT INTO Laminator(PreLamDetailId,LaminatorId,Parameter,Specification,ObservedValueA,ObservedValueB)
                                          VALUES('${UUID}','${v4()}','${data['Parameter']}','${data['Specification']}','${data['ObservedValueA']}','${data['ObservedValueB']}');`
        await queryAsync(LaminatorQuery);
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
       Type = '${Type}',
         DocNo = '${DocNo}',
         RevNo = '${RevNo}',
         Date = '${Date}',
         Shift = '${Shift}',
         CheckedBy = '${CurrentUser}',
         CreatedBy = '${CurrentUser}',
         Status = '${Status}',
         Location = '${JSON.stringify(Location)}',
         CreatedOn ='${getCurrentDateTime()}'
       WHERE PreLamDetailId = '${JobCardDetailId}';
         `
          await queryAsync(PreLamDetailQuery);
    
          Stage.forEach(async(data)=>{
            console.log(data)
            const LaminatorQuery = `UPDATE Laminator
            SET
                Specification = '${data['Specification']}',
                ObservedValueA = '${data['ObservedValueA']}',
                ObservedValueB = '${data['ObservedValueB']}'
            WHERE
               PreLamDetailId = '${JobCardDetailId}' AND Parameter = '${data['Parameter']}';
            `
        await queryAsync(LaminatorQuery);
        })
          res.send({ msg: 'Data Inserted Succesfully !',UUID:JobCardDetailId });
        } catch (err) {
          
          console.log(err)
          res.status(400).send({err})
        }
      }
}

const GetSpecificLaminator = async(req,res)=>{
    const { JobCardDetailId } = req.body;
    try {
        const query = `SELECT *FROM PreLamDetail PD
        JOIN Laminator L ON PD.PreLamDetailId = L.PreLamDetailId
        WHERE PD.PreLamDetailId = '${JobCardDetailId}';`

        const Tests = await queryAsync(query);
        let response = {}
        Tests.forEach((data, i) => {
            if (i === 0) {
                response['PreLamDetailId'] = data['PreLamDetailId'];
                response['DocNo'] = data['DocNo'];
                response['RevNo'] = data['RevNo'];
                response['Location'] = JSON.parse(data['Location']);
                response['Date'] = data['Date'];
                response['Shift'] = data['Shift'];
                response['Status'] = data['Status'];
                response['Type'] = data['Type'];
                response['PreLamPdf'] = data['PreLamPdf'];
            }
           response[`${data['Parameter'].split(' ').join('')}_Parameter`] = data['Parameter'];
           response[`${data['Parameter'].split(' ').join('')}_Specification`] = data['Specification'];
           response[`${data['Parameter'].split(' ').join('')}_ObservedValueA`] = data['ObservedValueA'];
           response[`${data['Parameter'].split(' ').join('')}_ObserverdValueB`] = data['ObservedValueB'];
        });
        res.send({response})
    } catch (err) {
        console.log(err)
        res.status(400).send({err})
    }
    
}


module.exports = {AddLaminator,GetSpecificLaminator};
