import { RNS3 } from 'react-native-aws3';

export const uploadToS3 = async (fileUri, fileName, mimeType) => {
  const file = {
    uri: fileUri,
    name: fileName,
    type: mimeType,
  };

  const options = {
    keyPrefix: process.env.EXPO_PUBLIC_AWS_KEYPREFIX, 
    bucket: process.env.EXPO_PUBLIC_AWS_BUCKET,
    region: 'ap-south-1',
    accessKey: process.env.EXPO_PUBLIC_AWS_ACCESSEY,
    secretKey: process.env.EXPO_PUBLIC_AWS_SECRETKEY,
    successActionStatus: 201,
  };

  try {
    const res = await RNS3.put(file, options);
    if (res.status === 201) {
      return {
        success: true,
        url: res.body.postResponse.location,
      };
    } else {
      console.error('S3 Upload Failed:', res);
      return { success: false, error: res };
    }
  } catch (err) {
    console.error('Upload Error:', err);
    return { success: false, error: err };
  }
};