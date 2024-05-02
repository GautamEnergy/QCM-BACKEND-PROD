const { v4: uuidv4, v4 } = require('uuid');
const { getCurrentDateTime, s3 } = require('../Utilis/IPQCJobCardUtilis')
const util = require('util')
const fs = require('fs');
const Path = require('path')
const { dbConn } = require('../db.config/db.config');
require('dotenv').config()
const PORT = process.env.PORT || 9090


/** Making Sync To Query */
const queryAsync = util.promisify(dbConn.query).bind(dbConn);

// var d = [
//   {
//     "JobCardDetails": {
//       "date": dateController.text,
//       "moduleType": moduleTypeController.text,
//       "matrixSize": matrixSizeController.text,
//       "moduleNo": moduleNoController.text
//     }
//   },
//   {
//     "JobCard": [{
//       "Process": 'Glass Washing',
//       "EmployeeID": '',
//       "Description": {
//         "Lot_No": lotNoController.text,
//         "size": lotSizeController.text
//       },
//       "Comment": glassCommentController.text
//     },
//     {
//       "Process": 'Foil cutterr',
//       "EmployeeID": '',
//       "Description": {
//         "EVA_Lot_No": evaLotNoController.text,
//         "EVA_Size": evaSizeController.text,
//         "Backsheet_Lot": backsheetLotController.text,
//         "Backsheet_size": backsheetSizeController.text
//       },
//       "Comment": foilCommentController.text
//     },
//     {
//       "Process": 'Tabbing & Stringing',
//       "EmployeeID": '',
//       "Description": {
//         "Cell_Lot_No": cellLotNoController.text,
//         "Cell_Type": cellTypeController.text,
//         "Cell_Size": cellSyzeController.text,
//         "Cell_Eff": cellEffController.text,
//         "Interconnect_Ribbon_Size": interconnectRibbonSizeController.text,
//         "Busbar_Size": busbarSizeController.text,
//         "Flux": fluxController.text
//       },
//       "Comment": tabbingCommentController.text
//     },
//     {
//       "Process": 'Bussing/InterConnection',
//       "EmployeeID": '',
//       "Description": {
//         "Cell_To_Cell_Gap": cellToCellGapController.text,
//         "String_To_String_Gap": stringToStringGapController.text,
//         "Soldering_Temp": solderingTempController.text
//       },
//       "Comment": bussingCommentController.text
//     },
//     {
//       "Process": 'Visual Inspection & Laminator',
//       "EmployeeID": '',
//       "Description": {
//         "Temperature": tempreatureController.text,
//         "Cycle_Time": cycleTimeController.text,
//         "Laminate_Quality": isCycleTimeTrue
//       },
//       "Comment": visualCommentController.text
//     },
//     {
//       "Process": 'Edge Triming',
//       "EmployeeID": '',
//       "Description": { "BackSheet_Cutting": isBacksheetCuttingTrue },
//       "Comment": edgeCommentController.text
//     },
//     {
//       "Process": 'Framing',
//       "EmployeeID": '',
//       "Description": {
//         "Frame_Type": frameTypeController.text,
//         "Frame_Size": frameSizeController.text,
//         "Silicon_Glue_Lot_No": sliconGlueLotController.text
//       },
//       "Comment": framingCommentController.text
//     },
//     {
//       "Process": 'J/B Assembly',
//       "EmployeeID": '',
//       "Description": {
//         "JB_Lot_No": jBLotNoController.text,
//         "JB_Type": jBTypeController.text,
//         "Silicon_Glue_Lot_No": siliconGlueLotNoController.text
//       },
//       "Comment": jbCommentController.text
//     },
//     {
//       "Process": 'Sun Simulator',
//       "EmployeeID": '',
//       "Description": { "Pmax": pmaxController.text },
//       "Comment": sunCommentController.text
//     }
//     ]
//   }
// ];



const AddIPQCJobCard = async (req, res) => {
  const IPQCJobCard = req.body;
  const JobCardDetails = IPQCJobCard[0]['JobCardDetails'];
  const JobCard = IPQCJobCard[1]['JobCard'];
  const { JobCardDetailId } = JobCardDetails;
  const UUID = v4();


  try {
    if (!JobCardDetailId) {
      const QueryToJobCardDetails = `INSERT INTO JobCardDetails(JobCardDetailID,Type,DocNo,RevisionNo,RevisonDate,ModuleType,ModuleNo,Date,MatrixSize,Status,CreatedBy,UpdatedBy,CreatedOn,UpdatedOn)
  VALUE ('${UUID}','Job Card','${JobCardDetails['DocNo']}','${JobCardDetails['RevisionNo']}','${JobCardDetails['RevisionDate']}','${JobCardDetails['moduleType']}','${JobCardDetails['moduleNo']}','${JobCardDetails['date']}','${JobCardDetails['matrixSize']}','${JobCardDetails['Status']}','${JobCardDetails['CreatedBy']}','','${getCurrentDateTime()}','');`

      /** Inserting Data in Job Card Details Table  */
      const JobCardDetailsQuery = await queryAsync(QueryToJobCardDetails)

      /** Inserting Data in Job Card Table */

      JobCard.forEach(async (Card) => {
        let description = JSON.stringify(Card['Description']);
        const QuerytToJobCard = `INSERT INTO JobCard(JobCardID,JobCardDetailID,Process,EmployeeId,Description,Comments,CreatedOn,UpdatedOn)
    VALUE ('${v4()}','${UUID}','${Card['Process']}','${Card['EmployeeID']}','${description}','${Card['Comment']}','${getCurrentDateTime()}','');`

        const JobCardQuery = await queryAsync(QuerytToJobCard)

      });

      res.send({ msg: 'Data Inserted Succesfully !', UUID })
    } else {

      /** Updating Data in Job Card Details Table  */
      const QueryToJobCardDetails = `UPDATE JobCardDetails jcd
    set jcd.DocNo = '${JobCardDetails['DocNo']}',
        jcd.RevisionNo = '${JobCardDetails['RevisionNo']}',
        jcd.RevisonDate = '${JobCardDetails['RevisionDate']}',
        jcd.ModuleType = '${JobCardDetails['moduleType']}',
        jcd.ModuleNo = '${JobCardDetails['moduleNo']}',
        jcd.Date = '${JobCardDetails['date']}',
        jcd.MatrixSize = '${JobCardDetails['matrixSize']}',
        jcd.Status = '${JobCardDetails['Status']}',
        jcd.CreatedBy = '${JobCardDetails['CreatedBy']}',
        jcd.CreatedOn = '${getCurrentDateTime()}'
    WHERE jcd.JobCardDetailID = '${JobCardDetailId}';`

      await queryAsync(QueryToJobCardDetails)


      /** Updating Data in Job Card Table */

      JobCard.forEach(async (Card) => {
        let description = JSON.stringify(Card['Description']);
        /** Query */
        const QuerytToJobCard = `UPDATE JobCard JC 
        set JC.EmployeeId = '${Card['EmployeeID']}',
            JC.Description = '${description}',
            JC.Comments = '${Card['Comment']}'
        WHERE JC.JobCardDetailID = '${JobCardDetailId}' AND JC.Process='${Card['Process']}'`

        await queryAsync(QuerytToJobCard)
      });
      res.send({ msg: 'Data Inserted Succesfully !', 'UUID': JobCardDetailId })
    }
  } catch (err) {
    console.log(err)

    res.status(400).send({ err })
  }



}


/** Controller to listing Job Card Data */
const JobCardList = async (req, res) => {
  const { PersonID, Status, Designation } = req.body
  let query;
  let BomQuery;
  let PreLamQuery;
  let SolderingPeelTestQuery;
  try {

    if (Designation == 'Admin' || Designation == 'Super Admin') {
      query = `SELECT p.EmployeeID,  p.Name, p.ProfileImg, wl.Location,jcd.JobCardDetailID,jcd.ModuleNo,jcd.Type,jcd.ReferencePdf,jcd.CreatedOn,jcd.UpdatedOn FROM Person p
JOIN WorkLocation wl ON wl.LocationID = p.WorkLocation
JOIN JobCardDetails jcd ON p.PersonID = jcd.CreatedBy
WHERE jcd.Status = '${Status}'
ORDER BY STR_TO_DATE(jcd.CreatedOn, '%d-%m-%Y %H:%i:%s') DESC;`;

      BomQuery = `SELECT p.EmployeeID,  p.Name, p.ProfileImg, wl.Location,bd.BOMDetailId,bd.PONo,bd.Type,bd.ReferencePdf, bd.CreatedOn,bd.UpdatedOn FROM Person p
JOIN WorkLocation wl ON wl.LocationID = p.WorkLocation
JOIN BOMVerificationDetails bd ON p.PersonID = bd.CheckedBy
WHERE bd.Status = '${Status}'
ORDER BY STR_TO_DATE(bd.CreatedOn, '%d-%m-%Y %H:%i:%s') DESC;`;

      PreLamQuery = `SELECT p.EmployeeID,  p.Name, p.ProfileImg, wl.Location,PD.PreLamDetailId,PD.PONo,PD.Line,PD.Shift,PD.Type,PD.PreLamPdf, PD.CreatedOn, PD.UpdatedOn FROM Person p
JOIN WorkLocation wl ON wl.LocationID = p.WorkLocation
JOIN PreLamDetail PD ON p.PersonID = PD.CheckedBy
WHERE PD.Status = '${Status}'
ORDER BY STR_TO_DATE(PD.CreatedOn, '%d-%m-%Y %H:%i:%s') DESC;`;

      SolderingPeelTestQuery = `  SELECT p.EmployeeID,  p.Name, p.ProfileImg, wl.Location,SPT.TestDetailId,SPT.Line,SPT.Shift,SPT.Type,SPT.Pdf, SPT.CreatedOn, SPT.UpdatedOn FROM Person p
JOIN WorkLocation wl ON wl.LocationID = p.WorkLocation
JOIN SolderingPeelTestDetail SPT ON p.PersonID = SPT.CreatedBy
WHERE SPT.Status = '${Status}'
ORDER BY STR_TO_DATE(SPT.CreatedOn, '%d-%m-%Y %H:%i:%s') DESC;`;

    } else {
      query = `SELECT p.EmployeeID,  p.Name, p.ProfileImg, wl.Location,jcd.JobCardDetailID,jcd.ModuleNo,jcd.Type,jcd.ReferencePdf,jcd.CreatedOn,jcd.UpdatedOn  FROM Person p
    JOIN WorkLocation wl ON wl.LocationID = p.WorkLocation
    JOIN JobCardDetails jcd ON p.PersonID = jcd.CreatedBy
    WHERE jcd.Status = '${Status}' AND p.PersonID = '${PersonID}'
    ORDER BY STR_TO_DATE(jcd.CreatedOn, '%d-%m-%Y %H:%i:%s') DESC;`;

      BomQuery = `SELECT p.EmployeeID,  p.Name, p.ProfileImg, wl.Location,bd.BOMDetailId,bd.PONo,bd.Type,bd.ReferencePdf, bd.CreatedOn, bd.UpdatedOn FROM Person p
JOIN WorkLocation wl ON wl.LocationID = p.WorkLocation
JOIN BOMVerificationDetails bd ON p.PersonID = bd.CheckedBy
WHERE bd.Status = '${Status}' AND p.PersonID = '${PersonID}'
ORDER BY STR_TO_DATE(bd.CreatedOn, '%d-%m-%Y %H:%i:%s') DESC;`;

      PreLamQuery = `SELECT p.EmployeeID,  p.Name, p.ProfileImg, wl.Location,PD.PreLamDetailId,PD.PONo,PD.Line,PD.Shift,PD.Type,PD.PreLamPdf, PD.CreatedOn,PD.UpdatedOn FROM Person p
JOIN WorkLocation wl ON wl.LocationID = p.WorkLocation
JOIN PreLamDetail PD ON p.PersonID = PD.CheckedBy
WHERE PD.Status = '${Status}' AND p.PersonID = '${PersonID}'
ORDER BY STR_TO_DATE(PD.CreatedOn, '%d-%m-%Y %H:%i:%s') DESC;`;

      SolderingPeelTestQuery = `  SELECT p.EmployeeID,  p.Name, p.ProfileImg, wl.Location,SPT.TestDetailId,SPT.Line,SPT.Shift,SPT.Type,SPT.Pdf, SPT.CreatedOn, SPT.UpdatedOn FROM Person p
JOIN WorkLocation wl ON wl.LocationID = p.WorkLocation
JOIN SolderingPeelTestDetail SPT ON p.PersonID = SPT.CreatedBy
WHERE SPT.Status = '${Status}' AND p.PersonID = '${PersonID}'
ORDER BY STR_TO_DATE(SPT.CreatedOn, '%d-%m-%Y %H:%i:%s') DESC;`;

    }

    const JobCardList = await queryAsync(query);
    const BomList = await queryAsync(BomQuery);
    const PreLamList = await queryAsync(PreLamQuery);
    const SolderingPeelTestList = await queryAsync(SolderingPeelTestQuery)
    /** Function to parse the date string into a Date object for comparison **/
    const parseDate = dateString => {
      const [date, time] = dateString.split(' ');
      const [day, month, year] = date.split('-');
      const [hours, minutes, seconds] = time.split(':');
      return new Date(year, month - 1, day, hours, minutes, seconds);
    };
    if (Status == 'Inprogress') {

      BomList.forEach((BOM) => {
        for (let key in BOM) {
          if (key == 'BOMDetailId') {
            BOM['JobCardDetailID'] = BOM[key]
            delete BOM[key]
          } else if (key == 'PONo') {
            BOM['ModuleNo'] = BOM[key]
            delete BOM[key]
          }
        }
        JobCardList.push(BOM)
      })

    PreLamList.forEach((BOM) => {
      for (let key in BOM) {
        
//PreLam PostLam
        if(BOM['Type'] == 'PreLam' || BOM['Type'] == 'PostLam'){
        if (key == 'PreLamDetailId') {
          BOM['JobCardDetailID'] = BOM[key]
          delete BOM[key]
        } else if (key == 'PONo') {
          BOM['ModuleNo'] = BOM[key]
          delete BOM[key]
        }else if(key == 'PreLamPdf'){
          BOM['ReferencePdf'] = BOM[key]
          delete BOM[key]
        }
        delete BOM['Line'];
      }else if(BOM['Type'] == 'Framing'){
        if (key == 'PreLamDetailId') {
          BOM['JobCardDetailID'] = BOM[key]
          delete BOM[key]
        } else if (key == 'Line') {
          BOM['ModuleNo'] = BOM[key]
          delete BOM[key]
        }else if(key == 'PreLamPdf'){
          BOM['ReferencePdf'] = BOM[key]
          delete BOM[key]
        }
          } else if (BOM['Type'] == 'Sealent') {
            if (key == 'PreLamDetailId') {
              BOM['JobCardDetailID'] = BOM[key]
              delete BOM[key]
            } else if (key == 'Shift') {
              BOM['ModuleNo'] = BOM[key]
              delete BOM[key]
            } else if (key == 'PreLamPdf') {
              BOM['ReferencePdf'] = BOM[key]
              delete BOM[key]
            }
          } else if (BOM['Type'] == 'Laminator1' || BOM['Type'] == 'Laminator2' || BOM['Type'] == 'Stringer1' || BOM['Type'] == 'Stringer2' || BOM['Type'] == 'Stringer3') {
            if (key == 'PreLamDetailId') {
              BOM['JobCardDetailID'] = BOM[key]
              delete BOM[key]
            } else if (key == 'Shift') {
              BOM['ModuleNo'] = BOM[key]
              delete BOM[key]
            } else if (key == 'PreLamPdf') {
              BOM['ReferencePdf'] = BOM[key]
              delete BOM[key]
            }
          }
        }
        delete BOM['Line'];
        delete BOM['PONo']
        JobCardList.push(BOM);
      })

      /** Deconstructing of Soldering Peel Test List */
      SolderingPeelTestList.forEach((Test) => {
        for (let key in Test) {
          if (key == 'TestDetailId') {
            Test['JobCardDetailID'] = Test[key]
            delete Test[key]
          } else if (key == 'Line') {
            Test['ModuleNo'] = Test[key]
            delete Test[key]
          } else if (key = 'Pdf') {
            Test['ReferencePdf'] = Test[key]
            delete Test[key]
          }
        }
        JobCardList.push(Test);
      })

      /** Sort the array by the "CreatedOn" property in descending order */
      JobCardList.sort((a, b) => {
        const dateA = parseDate(a.CreatedOn);
        const dateB = parseDate(b.CreatedOn);
        return dateB - dateA; /** Compare dates in descending order */
      });

      res.send({ status: true, data: JobCardList })
    } else if (Status == 'Approved') {

      BomList.forEach((BOM) => {
        for (let key in BOM) {
          if (key == 'BOMDetailId') {
            BOM['JobCardDetailID'] = BOM[key]
            delete BOM[key]
          } else if (key == 'PONo') {
            BOM['ModuleNo'] = BOM[key]
            delete BOM[key]
          }
        }
        JobCardList.push(BOM)
      })

      PreLamList.forEach((BOM) => {
        for (let key in BOM) {

          if (BOM['Type'] == 'PreLam' || BOM['Type'] == 'PostLam') {
            if (key == 'PreLamDetailId') {
              BOM['JobCardDetailID'] = BOM[key]
              delete BOM[key]
            } else if (key == 'PONo') {
              BOM['ModuleNo'] = BOM[key]
              delete BOM[key]
            } else if (key == 'PreLamPdf') {
              BOM['ReferencePdf'] = BOM[key]
              delete BOM[key]
            }
            delete BOM['Line'];
          } else if (BOM['Type'] == 'Framing') {
            if (key == 'PreLamDetailId') {
              BOM['JobCardDetailID'] = BOM[key]
              delete BOM[key]
            } else if (key == 'Line') {
              BOM['ModuleNo'] = BOM[key]
              delete BOM[key]
            } else if (key == 'PreLamPdf') {
              BOM['ReferencePdf'] = BOM[key]
              delete BOM[key]
            }
          } else if (BOM['Type'] == 'Sealent') {
            if (key == 'PreLamDetailId') {
              BOM['JobCardDetailID'] = BOM[key]
              delete BOM[key]
            } else if (key == 'Shift') {
              BOM['ModuleNo'] = BOM[key]
              delete BOM[key]
            } else if (key == 'PreLamPdf') {
              BOM['ReferencePdf'] = BOM[key]
              delete BOM[key]
            }
          } else if (BOM['Type'] == 'Laminator1' || BOM['Type'] == 'Laminator2' || BOM['Type'] == 'Stringer1' || BOM['Type'] == 'Stringer2' || BOM['Type'] == 'Stringer3') {
            if (key == 'PreLamDetailId') {
              BOM['JobCardDetailID'] = BOM[key]
              delete BOM[key]
            } else if (key == 'Shift') {
              BOM['ModuleNo'] = BOM[key]
              delete BOM[key]
            } else if (key == 'PreLamPdf') {
              BOM['ReferencePdf'] = BOM[key]
              delete BOM[key]
            }
          }
        }
        delete BOM['Line'];
        delete BOM['PONo']
        JobCardList.push(BOM);
      });

      /** Deconstructing of Soldering Peel Test List */
      SolderingPeelTestList.forEach((Test) => {
        for (let key in Test) {
          if (key == 'TestDetailId') {
            Test['JobCardDetailID'] = Test[key]
            delete Test[key]
          } else if (key == 'Line') {
            Test['ModuleNo'] = Test[key]
            delete Test[key]
          } else if (key = 'Pdf') {
            Test['ReferencePdf'] = Test[key]
            delete Test[key]
          }
        }
        JobCardList.push(Test);
      })

      /** Sort the array by the "CreatedOn" property in descending order */
      JobCardList.sort((a, b) => {
        const dateA = parseDate(a.UpdatedOn);
        const dateB = parseDate(b.UpdatedOn);
        return dateB - dateA; /** Compare dates in descending order */
      });
      res.send({ status: true, data: JobCardList });

    }else{

      BomList.forEach((BOM) => {
        for (let key in BOM) {
          if (key == 'BOMDetailId') {
            BOM['JobCardDetailID'] = BOM[key]
            delete BOM[key]
          } else if (key == 'PONo') {
            BOM['ModuleNo'] = BOM[key]
            delete BOM[key]
          }
        }

        JobCardList.push(BOM)
      })

      PreLamList.forEach((BOM) => {
        for (let key in BOM) {


          if (BOM['Type'] == 'PreLam' || BOM['Type'] == 'PostLam') {
            if (key == 'PreLamDetailId') {
              BOM['JobCardDetailID'] = BOM[key]
              delete BOM[key]
            } else if (key == 'PONo') {
              BOM['ModuleNo'] = BOM[key]
              delete BOM[key]
            } else if (key == 'PreLamPdf') {
              BOM['ReferencePdf'] = BOM[key]
              delete BOM[key]
            }
            delete BOM['Line'];
          } else if (BOM['Type'] == 'Framing') {
            if (key == 'PreLamDetailId') {
              BOM['JobCardDetailID'] = BOM[key]
              delete BOM[key]
            } else if (key == 'Line') {
              BOM['ModuleNo'] = BOM[key]
              delete BOM[key]
            } else if (key == 'PreLamPdf') {
              BOM['ReferencePdf'] = BOM[key]
              delete BOM[key]
            }
          } else if (BOM['Type'] == 'Sealent') {
            if (key == 'PreLamDetailId') {
              BOM['JobCardDetailID'] = BOM[key]
              delete BOM[key]
            } else if (key == 'Shift') {
              BOM['ModuleNo'] = BOM[key]
              delete BOM[key]
            } else if (key == 'PreLamPdf') {
              BOM['ReferencePdf'] = BOM[key]
              delete BOM[key]
            }
           
          } else if (BOM['Type'] == 'Laminator1' || BOM['Type'] == 'Laminator2' || BOM['Type'] == 'Stringer1' || BOM['Type'] == 'Stringer2' || BOM['Type'] == 'Stringer3') {
            if (key == 'PreLamDetailId') {
              BOM['JobCardDetailID'] = BOM[key]
              delete BOM[key]
            } else if (key == 'Shift') {
              BOM['ModuleNo'] = BOM[key]
              delete BOM[key]
            } else if (key == 'PreLamPdf') {
              BOM['ReferencePdf'] = BOM[key]
              delete BOM[key]
            }
        
          }
        }
        delete BOM['Line'];
        delete BOM['PONo']
        JobCardList.push(BOM);
      })

      /** Deconstructing of Soldering Peel Test List */
      SolderingPeelTestList.forEach((Test) => {
        for (let key in Test) {
          if (key == 'TestDetailId') {
            Test['JobCardDetailID'] = Test[key]
            delete Test[key]
          } else if (key == 'Line') {
            Test['ModuleNo'] = Test[key]
            delete Test[key]
          } else if (key = 'Pdf') {
            Test['ReferencePdf'] = Test[key]
            delete Test[key]
          }
        }
        JobCardList.push(Test);
      })

      /** Sort the array by the "CreatedOn" property in descending order */
      JobCardList.sort((a, b) => {
        const dateA = parseDate(a.CreatedOn);
        const dateB = parseDate(b.CreatedOn);
        return dateB - dateA; /** Compare dates in descending order */
      });

      res.send({ status: true, data: JobCardList });
    }
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }



}

const UploadPdf = async (req, res) => {

  const { JobCardDetailId } = req.body;

  if (req.file.size) {
    /** making file in IPQC-Pdf-Folder*/
    try {
      // Get the file buffer and the file format
      const fileBuffer = req.file.buffer;

      // Define the folder path
      const folderPath = Path.join('IPQC-Pdf-Folder');

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

      const query = `UPDATE JobCardDetails jcd
set jcd.ReferencePdf = 'http://srv515471.hstgr.cloud:${PORT}/IPQC/Pdf/${JobCardDetailId}.pdf'
WHERE jcd.JobCardDetailID = '${JobCardDetailId}';`;
      const update = await queryAsync(query);

      // Send success response with the file URL
      res.send({ msg: 'Data inserted successfully!', URL: `http://srv502293.hstgr.cloud:${PORT}/IPQC/Pdf/${JobCardDetailId}.pdf` });
    } catch (err) {
      console.log(err);
      res.status(401).send(err);
    }
  } else {
    res.status(401).send({ status: false, 'err': 'file is empty' })
  }
}


const GetSpecificJobCard = async (req, res) => {
  const { JobCardDetailId } = req.body
  try {
    const query = `SELECT *FROM JobCardDetails jcd
  JOIN JobCard jc ON jcd.JobCardDetailID = jc.JobCardDetailID
  WHERE jcd.JobCardDetailID = '${JobCardDetailId}';`

    const JobCard = await queryAsync(query)
    let arr = [];
    let response = {}
    JobCard.forEach((Card, i) => {

      let index = 0;
      if (i == 0) {
        response['JobCardDetailID'] = Card['JobCardDetailID']
        for (let key in Card) {
          if (index >= 4) {
            response[key] = Card[key]
          }

          if (index == 11) {
            break;
          }
          index++;
        }
      }
      index = 0;

      for (let key in Card) {

        if (index >= 17) {
          response[`${Card['Process']} ${key}`] = key == 'Description' ? JSON.parse(Card[key]) : Card[key]
        }
        index++;
      }
    })

    res.send({ response })
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
}


const UpdateJobCardStatus = async (req, res) => {
  const { CurrentUser, ApprovalStatus, JobCardDetailId } = req.body

  try {
    let query = `UPDATE JobCardDetails jd
                    set jd.Status = '${ApprovalStatus}',
                        jd.UpdatedBy ='${CurrentUser}',
                        jd.UpdatedOn = '${getCurrentDateTime()}'
                    WHERE jd.JobCardDetailID = '${JobCardDetailId}'`
    let JobCardDetail = await queryAsync(query)
    res.send({ ApprovalStatus, JobCardDetail })
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
}

module.exports = { AddIPQCJobCard, JobCardList, UploadPdf, GetSpecificJobCard, UpdateJobCardStatus };
