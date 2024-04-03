
const JWT = require('jsonwebtoken');

require('dotenv').config()




/** Middleware To Check Role  */
const RoleAuthentication = async(req,res,next)=>{
    const {token} = req.body;
     
    /** Verifying Token */
    try{
      const DecodeData = JWT.verify(token,process.env.SecretKey);
      /** Passing Decoded Data in Response Body */
      req.body.PersonID = DecodeData['PersonID']
      req.body.Designation = DecodeData['Designation']
      req.body.Department = DecodeData['Department']
      next()
    }catch(err){
      res.status(401).send({err})
    }
    
  
    
    
  }


  /** Middleware to Get File By Multer  */
const multer = require('multer')


/** Multer Middleware to get Img in buffer form */
const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, '')
    }
  })


  // below variable is define to check the type of file which is uploaded

const filefilter = (req, file, cb) => {

      cb(null, true)
    
    }

const upload = multer({ storage: storage, fileFilter: filefilter })


module.exports = {RoleAuthentication,upload}