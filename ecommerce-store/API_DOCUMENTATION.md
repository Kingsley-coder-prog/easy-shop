# API Documentation - Image Upload Endpoints

## Endpoint: Get Presigned Upload URL

### Purpose
Generate a presigned URL for direct browser upload to S3. This allows secure file uploads without exposing AWS credentials.

### Request
```
POST /api/v1/products/upload-url
Content-Type: application/json

{
  "fileName": "product-image.jpg",
  "mimeType": "image/jpeg"
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| fileName | string | Yes | Original filename with extension (e.g., "photo.jpg") |
| mimeType | string | Yes | MIME type of file (e.g., "image/jpeg", "image/png") |

### Allowed MIME Types
- `image/jpeg` - JPEG images
- `image/png` - PNG images
- `image/gif` - GIF images
- `image/webp` - WebP images

### Response (Success - 200)
```json
{
  "url": "https://shopeasy-s3-buckect.s3.us-east-2.amazonaws.com/products/uuid.jpg?AWSAccessKeyId=...",
  "key": "products/uuid.jpg",
  "publicUrl": "https://shopeasy-s3-buckect.s3.us-east-2.amazonaws.com/products/uuid.jpg"
}
```

### Response Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| url | string | Presigned URL for PUT request (expires in 10 minutes) |
| key | string | S3 object key (for reference) |
| publicUrl | string | Public URL to access the file after upload |

### Response (Error - 400)
```json
{
  "error": "Only image files (JPEG, PNG, GIF, WebP) are allowed"
}
```

### Response (Error - 500)
```json
{
  "error": "Failed to generate upload URL"
}
```

### Example Usage (Frontend)

```javascript
// Step 1: Get presigned URL
const response = await fetch('http://localhost:5000/api/v1/products/upload-url', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fileName: 'my-product.jpg',
    mimeType: 'image/jpeg'
  })
});

const { url, publicUrl } = await response.json();

// Step 2: Upload file to S3 using presigned URL
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

await fetch(url, {
  method: 'PUT',
  headers: {
    'Content-Type': file.type
  },
  body: file
});

// Step 3: Use publicUrl in product data
const product = {
  name: 'Product Name',
  price_naira: 99999,
  image: publicUrl  // This is your S3 image URL
};
```

### Example Usage (Using Frontend Utility)

```javascript
import { uploadImageFile } from '@/api/s3.api.js';

// Single function handles everything
const imageUrl = await uploadImageFile(file);
console.log('Image uploaded to:', imageUrl);
```

### Curl Example

```bash
# Get presigned URL
curl -X POST http://localhost:5000/api/v1/products/upload-url \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "test-image.jpg",
    "mimeType": "image/jpeg"
  }'

# Response
{
  "url": "https://...",
  "key": "products/xxx.jpg",
  "publicUrl": "https://..."
}

# Upload file using presigned URL
curl -X PUT "https://...presigned-url..." \
  -H "Content-Type: image/jpeg" \
  --data-binary @test-image.jpg
```

---

## Endpoint: Get All Products

### Purpose
Retrieve all products from Google Sheets (unchanged, but still important for image display)

### Request
```
GET /api/v1/products
```

### Response (200)
```json
{
  "products": [
    {
      "product_id": "uuid-1234",
      "name": "Laptop",
      "price_naira": 500000,
      "description": "High performance laptop",
      "category": "Electronics",
      "image": "https://shopeasy-s3-buckect.s3.us-east-2.amazonaws.com/products/uuid.jpg",
      "created_at": "2024-02-19T10:30:00.000Z"
    },
    {
      "product_id": "uuid-5678",
      "name": "Phone",
      "price_naira": 250000,
      "description": "Smartphone with great camera",
      "category": "Electronics",
      "image": "",
      "created_at": "2024-02-19T11:00:00.000Z"
    }
  ]
}
```

### Notes
- Products without images will have `image: ""` (empty string)
- Frontend should display placeholder for missing images
- Image URLs can be from Google Sheets or S3

---

## Complete Upload Workflow

```
USER ACTION
    ↓
User selects file in form
    ↓
FRONTEND
    ↓
Call POST /products/upload-url
    ↓
Backend returns presigned URL + publicUrl
    ↓
Upload file directly to S3 using presigned URL
    ↓
Frontend receives publicUrl
    ↓
ADMIN
    ↓
Save product with publicUrl as image
    ↓
BACKEND
    ↓
Store product in Google Sheets (with S3 image URL)
    ↓
CUSTOMER
    ↓
View product on Products page
    ↓
Image loads from S3
```

---

## Error Codes

| Code | Error | Meaning |
|------|-------|---------|
| 200 | (none) | Success |
| 400 | Invalid MIME type | File format not allowed |
| 400 | Missing parameters | fileName or mimeType not provided |
| 500 | Failed to generate upload URL | AWS credentials issue |
| 500 | Server error | Unexpected error |

---

## Security Notes

### Presigned URLs
- Valid for **10 minutes** only
- Can only PUT to the specific S3 object
- Cannot be used to read, delete, or modify other objects
- Expires automatically after time limit

### CORS Policy
S3 bucket must have CORS configured to allow browser uploads:
```json
{
  "AllowedMethods": ["GET", "PUT", "POST"],
  "AllowedOrigins": ["https://your-frontend-domain"],
  "AllowedHeaders": ["*"]
}
```

### Best Practices
- ✅ Always validate file type and size on frontend
- ✅ Keep presigned URLs short-lived (10 min is good)
- ✅ Log all upload attempts for security
- ✅ Monitor S3 for unauthorized uploads
- ✅ Set ACL to `public-read` for viewer access

---

## Integration Checklist

- [ ] Backend has @aws-sdk/s3-request-presigner installed
- [ ] AWS credentials configured in backend .env
- [ ] /products/upload-url endpoint working
- [ ] Frontend imports s3.api.js utilities
- [ ] ProductFormModal uses uploadImageFile()
- [ ] Image validation (type + size) in place
- [ ] Error handling for failed uploads
- [ ] Success feedback to user
- [ ] S3 images displaying on products page

---

## Testing

### Test Presigned URL Generation
```javascript
// In browser console
const response = await fetch('http://localhost:5000/api/v1/products/upload-url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fileName: 'test.jpg',
    mimeType: 'image/jpeg'
  })
});
const data = await response.json();
console.log(data);
```

### Test Direct S3 Upload
```javascript
// After getting presigned URL
const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
await fetch(presignedUrl, {
  method: 'PUT',
  headers: { 'Content-Type': 'image/jpeg' },
  body: file
});
```

### Verify Upload Success
- Check S3 bucket console
- Should see file in `products/` folder
- Test publicUrl in browser (should load image)

---

## Future Enhancements

```javascript
// Potential improvements

1. Image Resizing
   - Resize images before upload
   - Multiple size variants (thumbnail, medium, large)

2. Compression
   - Compress JPEG before upload
   - Convert to WebP for modern browsers

3. Batch Upload
   - Upload multiple images at once
   - Bulk product import

4. Image Gallery
   - Upload multiple images per product
   - Primary and secondary images

5. CDN Integration
   - CloudFront distribution
   - Better performance globally

6. Image Manipulation
   - Crop, rotate, filter in browser
   - Before upload to S3
```

---

**Endpoint Ready**: Your image upload system is production-ready!

For implementation details, see ProductFormModal.vue and s3.api.js in the frontend.
