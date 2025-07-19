import AWS from 'aws-sdk';
// import { v4 as uuidv4 } from 'uuid';
import uuid from 'react-native-uuid';

const credentials = {
  keyPrefix: 'hubble/user/service/',
  bucket: 'chatservicee',
  region: 'ap-south-1',
  accessKey: 'AKIASE5KQ3AZ3EBMWEHW',
  secretKey: '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',
};

// Initialize S3 client
const s3 = new AWS.S3({
  region: credentials.region,
  accessKeyId: credentials.accessKey,
  secretAccessKey: credentials.secretKey,
});

// Main upload function - matches your backend approach
export const uploadFileToS3 = async (file) => {
  try {
    // Generate unique filename
    const fileExtension = file.name ? file.name.split('.').pop() : 'jpg';
    const key = `${credentials.keyPrefix}${uuid.v4()}.${fileExtension}`;
    
    // Prepare file buffer
    let fileBuffer;
    if (file.uri) {
      // If it's a file with URI (from react-native-image-picker, etc.)
      const response = await fetch(file.uri);
      const blob = await response.blob();
      fileBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(new Uint8Array(reader.result));
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
      });
    } else if (file.data) {
      // If it's base64 data
      fileBuffer = Buffer.from(file.data, 'base64');
    } else {
      throw new Error('Invalid file format');
    }
    
    // S3 upload parameters - same structure as your backend
    const params = {
      Bucket: credentials.bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: file.type || 'application/octet-stream',
    };
    
    // Upload file using AWS SDK - exactly like your backend
    const uploadResult = await s3.upload(params).promise();
    
    return {
      success: true,
      url: uploadResult.Location, // S3 URL
      key: uploadResult.Key,
      etag: uploadResult.ETag,
      message: 'File uploaded successfully'
    };
    
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error.message,
      message: 'File upload failed'
    };
  }
};