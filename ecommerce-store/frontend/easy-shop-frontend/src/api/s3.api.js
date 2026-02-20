import api from "./axios";

/**
 * Get a presigned URL from the backend for direct S3 upload
 * @param {string} fileName - The filename
 * @param {string} mimeType - The MIME type (e.g., 'image/jpeg')
 * @returns {Promise<{url: string, publicUrl: string}>}
 */
export async function getPresignedUploadUrl(fileName, mimeType) {
  try {
    const response = await api.post("/products/upload-url", {
      fileName,
      mimeType,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting presigned URL:", error);
    // Surface backend message when available
    const msg =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Failed to obtain upload URL";
    throw new Error(msg);
  }
}

/**
 * Upload an image directly to S3 using a presigned URL
 * @param {string} presignedUrl - The presigned URL from backend
 * @param {File} file - The file to upload
 * @returns {Promise<void>}
 */
export async function uploadToS3(presignedUrl, file) {
  try {
    await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error(error.message || "Failed to upload to S3");
  }
}

/**
 * Upload image file and get the public URL
 * @param {File} file - The image file
 * @returns {Promise<string>} - The public S3 URL
 */
export async function uploadImageFile(file) {
  try {
    // Step 1: Get presigned URL from backend
    const { url: presignedUrl, publicUrl } = await getPresignedUploadUrl(
      file.name,
      file.type,
    );

    // Step 2: Upload to S3 directly
    await uploadToS3(presignedUrl, file);

    // Step 3: Return the public URL
    return publicUrl;
  } catch (error) {
    console.error("Error in uploadImageFile:", error);
    // Re-throw with a clear message
    throw new Error(error.message || "Image upload failed");
  }
}
