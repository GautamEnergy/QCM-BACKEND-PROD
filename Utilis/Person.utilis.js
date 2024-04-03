const AWS = require('aws-sdk');
const nodemailer = require('nodemailer')
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
require('dotenv').config()

/** Generating Password */
function generatePassword() {
    /** Generate a random password */
    const password = Math.floor(1000 + Math.random() * 9000);
    return password;
  }


/** AWS Config */
// Set AWS region
AWS.config.update({ region: 'ap-south-1' });

// Set AWS credentials
AWS.config.credentials = new AWS.Credentials({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
});

// Create S3 instance
const s3 = new AWS.S3();

/** Nodemailer Configuration */
var transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'bhanu.galo@gmail.com',
      pass: 'twod iufn mddq shsr'
    }
  });

module.exports = {generatePassword,s3,AWS,transport}