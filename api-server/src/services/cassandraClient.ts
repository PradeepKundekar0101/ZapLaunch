import dotenv from 'dotenv'

dotenv.config();

import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import cassandra from 'cassandra-driver';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,  
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,              
});

const scbLocalPath = path.join(__dirname, 'scb.zip');

const scbS3Bucket = process.env.AWS_BUCKET_NAME!; 
const scbS3Key = "secure-connect-zaplaunch.zip";    

export const downloadScbFromS3 = async () => {
  const params = {
    Bucket: scbS3Bucket,
    Key: scbS3Key,
  };

  try {
    console.log(`Downloading scb.zip from S3: ${scbS3Bucket}/${scbS3Key}`);
    const { Body } = await s3.getObject(params).promise();
    fs.writeFileSync(scbLocalPath, Body as Buffer);
    console.log('scb.zip successfully downloaded.');
  } catch (error) {
    console.error('Error downloading scb.zip from S3:', error);
    throw new Error('Failed to download scb.zip from S3.');
  }
};

const cloud = { secureConnectBundle: path.join(__dirname,"scb.zip") };
const authProvider = new cassandra.auth.PlainTextAuthProvider('token', process.env['ASTRA_DB_APPLICATION_TOKEN']!);
export const cassandraClient = new cassandra.Client({ cloud, authProvider });
