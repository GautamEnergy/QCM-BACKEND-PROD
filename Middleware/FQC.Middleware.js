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
  
  const FQCUpload = multer({ storage: storage, fileFilter: filefilter })


  module.exports = {FQCUpload}