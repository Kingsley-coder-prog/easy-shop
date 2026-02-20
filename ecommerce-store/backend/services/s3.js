const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { randomUUID } = require("crypto");

// Configure AWS S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload image to S3
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - The original filename
 * @param {string} mimeType - The MIME type (e.g., 'image/jpeg')
 * @returns {Promise<string>} - The S3 object URL
 */
async function uploadImageToS3(fileBuffer, fileName, mimeType) {
  try {
    // Generate a unique key for the file
    const fileExtension = fileName.split(".").pop();
    const uniqueFileName = `products/${randomUUID()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uniqueFileName,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: "public-read", // Make the file publicly accessible
    });

    await s3Client.send(command);
    const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;
    console.log("✅ Image uploaded to S3:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("❌ S3 Upload Error:", error);
    throw new Error(`Failed to upload image to S3: ${error.message}`);
  }
}

/**
 * Delete image from S3
 * @param {string} imageUrl - The S3 URL of the image
 * @returns {Promise<void>}
 */
async function deleteImageFromS3(imageUrl) {
  try {
    // Extract the key from the URL
    const url = new URL(imageUrl);
    const key = url.pathname.substring(1); // Remove leading slash

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    console.log("✅ Image deleted from S3:", key);
  } catch (error) {
    console.error("❌ S3 Delete Error:", error);
    // Don't throw - deletion failures shouldn't break the flow
  }
}

/**
 * Get a presigned URL for direct browser uploads
 * @param {string} fileName - The filename
 * @param {string} mimeType - The MIME type
 * @returns {Promise<{url: string, key: string, publicUrl: string}>} - Presigned URL and object key
 */
async function getPresignedUploadUrl(fileName, mimeType) {
  try {
    const fileExtension = fileName.split(".").pop();
    const uniqueFileName = `products/${randomUUID()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uniqueFileName,
      ContentType: mimeType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 600, // 10 minutes
    });

    const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;

    return {
      url: presignedUrl,
      key: uniqueFileName,
      publicUrl,
    };
  } catch (error) {
    console.error("❌ Presigned URL Error:", error);
    throw new Error(`Failed to generate presigned URL: ${error.message}`);
  }
}

module.exports = {
  uploadImageToS3,
  deleteImageFromS3,
  getPresignedUploadUrl,
};
