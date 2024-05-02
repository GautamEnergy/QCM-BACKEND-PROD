const { v4: uuidv4, v4 } = require('uuid');
const { getCurrentDateTime, s3 } = require('../Utilis/PreLamUtilis');
const util = require('util');
const fs = require('fs');
const Path = require('path')
const { dbConn } = require('../db.config/db.config');


/** Making Sync To Query */
const queryAsync = util.promisify(dbConn.query).bind(dbConn);



let data = {
    "JobCardDetailId": "024eb029-af7d-4947-b16f-801473771068",
    "CurrentUser": "",
    "DocNo": "GSPL/IPQC/IPC/003",
    "RevNo": "1.0 dated 12.08.2023",
    "Date": "DayController.text",
    "Shift": "shiftController.text",
    "Status": "",
    "Type": "",
    "Track": [
        {
            "Parameter": "EVA Make",
            "Specification": "kdfk32",
            "UOM": "",
            "TrackA": "",
            "TrackB": ""
        },
        {
            "Parameter": "EVA Make",
            "Specification": "kdfk32",
            "UOM": "",
            "TrackA": "",
            "TrackB": ""
        },
        {
            "Parameter": "EVA Make",
            "Specification": "kdfk32",
            "UOM": "",
            "TrackA": "",
            "TrackB": ""
        },
        {
            "Parameter": "EVA Make",
            "Specification": "kdfk32",
            "UOM": "",
            "TrackA": "",
            "TrackB": ""
        }
    ]
}

const AddStringerMachine = async (req, res) => {
    const { CurrentUser, Track, Status, DocNo, RevNo, Shift, Type, JobCardDetailId, Date } = req.body;
    const UUID = v4();
    if (!JobCardDetailId) {
        try {
            const PreLamDetailQuery = `INSERT INTO PreLamDetail(PreLamDetailId,Type,DocNo,RevNo,Date,Shift,CheckedBy,CreatedBy,CreatedOn,Status)
                                             VALUES('${UUID}','${Type}','${DocNo}','${RevNo}','${Date}','${Shift}','${CurrentUser}','${CurrentUser}','${getCurrentDateTime()}','${Status}');`

            await queryAsync(PreLamDetailQuery);

            Track.forEach(async (data) => {
                const LaminatorQuery = `INSERT INTO StringerMachine(PreLamDetailId,StringerMachineId,Parameter,Specification,UOM,TrackA,TrackB)
                                          VALUES('${UUID}','${v4()}','${data['Parameter']}','${data['Specification']}','${data['UOM']}','${data['TrackA']}', '${data['TrackB']}');`
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
        CreatedOn ='${getCurrentDateTime()}'
      WHERE PreLamDetailId = '${JobCardDetailId}';
        `
            await queryAsync(PreLamDetailQuery);

            Track.forEach(async(data)=>{
                const LaminatorQuery = `UPDATE StringerMachine
                SET
                    Specification = '${data['Specification']}',
                    UOM = '${data['UOM']}',
                    TrackA = '${data['TrackA']}',
                    TrackB = '${data['TrackB']}'
                WHERE
                   PreLamDetailId = '${JobCardDetailId}' AND Parameter = '${data['Parameter']}';
                `
            await queryAsync(LaminatorQuery);
            })
            res.send({ msg: 'Data Inserted Succesfully !', UUID: JobCardDetailId });
        } catch (err) {

            console.log(err)
            res.status(400).send({ err })
        }
    }
}


const GetSpecificStringerMachine = async(req,res)=>{
    const { JobCardDetailId } = req.body;
    try {
        const query = `SELECT *FROM PreLamDetail PD
        JOIN StringerMachine SM ON PD.PreLamDetailId = SM.PreLamDetailId
        WHERE PD.PreLamDetailId = '${JobCardDetailId}';`

        const Tests = await queryAsync(query);
        let response = {}
        Tests.forEach((data, i) => {
            if (i === 0) {
                response['PreLamDetailId'] = data['PreLamDetailId'];
                response['DocNo'] = data['DocNo'];
                response['RevNo'] = data['RevNo'];
                response['Date'] = data['Date'];
                response['Shift'] = data['Shift'];
                response['Type'] = data['Type'];
                response['Status'] = data['Status']
                response['PreLamPdf'] = data['PreLamPdf'];
            }
           response[`${data['Parameter'].split(' ').join('')}_Parameter`] = data['Parameter'];
           response[`${data['Parameter'].split(' ').join('')}_Specification`] = data['Specification'];
           response[`${data['Parameter'].split(' ').join('')}_UOM`] = data['UOM']|| "";
           response[`${data['Parameter'].split(' ').join('')}_TrackA`] = data['TrackA'] ;
           response[`${data['Parameter'].split(' ').join('')}_TrackB`] = data['TrackB'] ;
        });
        res.send({response})
    } catch (err) {
        console.log(err)
        res.status(400).send({err})
    }
    
}

module.exports = {AddStringerMachine, GetSpecificStringerMachine};
