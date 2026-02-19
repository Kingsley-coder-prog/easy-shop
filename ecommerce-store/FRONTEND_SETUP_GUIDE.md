# Frontend Setup Guide

## Overview
Your ecommerce frontend is now fully configured with:
1. ✅ Product display from Google Sheets
2. ✅ Image display with fallback/error handling
3. ✅ S3 integration for image uploads
4. ✅ Product management with image upload form

## What's Been Set Up

### 1. **Product Display Components**
- **ProductList.vue**: Main component for displaying products grid with loading/error states
- **ProductCard.vue**: Individual product card with image, name, description, price, and "Add to Cart" button

### 2. **Image Handling**
The frontend now supports images from multiple sources:
- **Google Sheets images**: The backend fetches product images from your Google Sheet's `image` column
- **S3 uploaded images**: New products can have images uploaded directly to AWS S3
- **Fallback images**: Placeholder image displayed if no image URL is provided

### 3. **S3 Image Upload System**
The ProductFormModal now includes:
- Drag-and-drop file upload
- File type validation (JPEG, PNG, GIF, WebP)
- File size validation (max 5MB)
- Progress indicators
- Error handling with user-friendly messages

## Required Configuration

### Backend Environment Variables
Make sure your `.env` file in `backend/` has these variables:

```
AWS_REGION=us-east-2
AWS_BUCKET_NAME=shopeasy-s3-buckect
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

### Frontend Environment Variables
Your `.env` file in `frontend/easy-shop-frontend/` already has:

```
VITE_EASYSHOP_BASE_URL=https://easy-shop-yvwm.onrender.com/api/v1
```

## Backend Dependencies
Ensure these packages are installed in your backend:

```json
{
  "@aws-sdk/client-s3": "^3.971.0",
  "@aws-sdk/s3-request-presigner": "^3.971.0"
}
```

Run this to install if not already installed:
```bash
cd backend
npm install @aws-sdk/s3-request-presigner
```

## How It Works

### Product Image Flow

#### 1. **Displaying Google Sheets Images**
```
Google Sheets (image column)
    ↓
Backend API (/api/v1/products)
    ↓
Frontend (ProductList → ProductCard)
    ↓
Browser displays image
```

#### 2. **Uploading New Images to S3**
```
User selects file in ProductFormModal
    ↓
Frontend requests presigned URL from backend (/api/v1/products/upload-url)
    ↓
Backend generates presigned S3 URL (valid for 10 minutes)
    ↓
Frontend uploads file directly to S3 using presigned URL
    ↓
Frontend receives public S3 image URL
    ↓
Product saved with S3 image URL to Google Sheets
```

## New API Endpoints

### GET /api/v1/products
Fetch all products from Google Sheets
```javascript
const response = await api.get("/products");
// Returns: { products: [...] }
```

### POST /api/v1/products/upload-url
Generate a presigned URL for S3 upload
```javascript
const response = await api.post("/products/upload-url", {
  fileName: "image.jpg",
  mimeType: "image/jpeg"
});
// Returns: { url: "presigned_url", publicUrl: "https://..." }
```

## Frontend Files Structure

```
src/
├── api/
│   ├── axios.js          (Axios instance with auth)
│   ├── s3.api.js         (NEW: S3 upload functions)
│   └── products.api.js   (Product API calls)
├── components/
│   ├── products/
│   │   ├── ProductCard.vue   (NEW: Product card component)
│   │   └── ProductList.vue   (NEW: Product list grid)
│   └── admin/
│       └── ProductFormModal.vue (UPDATED: Image upload support)
├── pages/
│   └── products/
│       └── Products.vue   (UPDATED: Uses ProductList)
└── stores/
    └── product.store.js  (Pinia store for products)
```

## Backend Files Structure

```
backend/
├── services/
│   ├── googleSheets.js   (Google Sheets API)
│   └── s3.js             (NEW: AWS S3 service)
├── controllers/
│   └── productController.js (UPDATED: Added getUploadUrl)
└── routes/
    └── productRoutes.js  (UPDATED: Added /upload-url route)
```

## Usage Examples

### Displaying Products
```vue
<template>
  <ProductList />
</template>

<script setup>
import ProductList from "@/components/products/ProductList.vue";
</script>
```

### Uploading an Image
```javascript
import { uploadImageFile } from "@/api/s3.api";

async function handleImageUpload(file) {
  try {
    const imageUrl = await uploadImageFile(file);
    console.log("Image URL:", imageUrl);
    // Use imageUrl in your product data
  } catch (error) {
    console.error("Upload failed:", error);
  }
}
```

## Troubleshooting

### Images Not Loading
1. **Check network tab**: Are images being fetched from Google Sheets or S3?
2. **CORS issues**: The image server might block cross-origin requests
3. **Invalid URL**: Make sure the image column in Google Sheets has valid URLs
4. **Check console**: Look for error messages in browser dev tools

### S3 Upload Failing
1. **AWS credentials**: Verify `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in backend `.env`
2. **Bucket name**: Ensure `AWS_BUCKET_NAME` is correct
3. **Region**: Check `AWS_REGION` matches your S3 bucket region
4. **Permissions**: S3 bucket must allow `PutObject` for your IAM user
5. **CORS**: Configure S3 bucket CORS if uploading from browser

### Example S3 Bucket CORS Configuration
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["x-amz-meta-*"],
    "MaxAgeSeconds": 3000
  }
]
```

## Next Steps

1. ✅ Test product display - products should show with images from Google Sheets
2. ✅ Test adding new products with S3 image upload in admin panel
3. ✅ Verify images are stored in S3 bucket
4. ✅ Monitor S3 costs and optimize as needed

## Migration from Google Sheets to S3

To migrate existing product images from Google Sheets to S3:

1. For each existing product with a Google Sheets image URL:
   - Keep the URL if it's already an S3 URL
   - Or manually upload the image to S3 and update the product

2. Update the product in the admin panel to use the new S3 URL

3. Verify the image displays correctly

## Important Notes

- **Presigned URLs expire**: URLs are valid for 10 minutes
- **Public access**: All images are set to `ACL: public-read` for direct access
- **File size limit**: Frontend enforces 5MB max, adjust as needed
- **Image formats**: JPEG, PNG, GIF, WebP supported
- **Storage path**: All images stored in `products/` prefix in S3 bucket

---

For issues or questions, check the console logs and ensure all environment variables are properly configured.
