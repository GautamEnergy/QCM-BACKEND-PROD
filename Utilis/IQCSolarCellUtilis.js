const AWS = require('aws-sdk');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
require('dotenv').config()
/** to Get current Date & Time */
function getCurrentDateTime() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }
  

  /** Config to Upload Pdf in S3 Bucket */

  /** AWS Config */

/* Set AWS region **/
AWS.config.update({ region: 'ap-south-1' });

/* Set AWS credentials **/
AWS.config.credentials = new AWS.Credentials({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
});

/* Create S3 instance **/
const s3 = new AWS.S3();


  module.exports = {getCurrentDateTime,s3}