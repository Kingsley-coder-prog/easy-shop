# Quick Setup Checklist

## Backend Setup

- [ ] Verify AWS credentials in `backend/.env`:
  ```
  AWS_ACCESS_KEY_ID=your_key
  AWS_SECRET_ACCESS_KEY=your_secret
  AWS_REGION=us-east-2
  AWS_BUCKET_NAME=shopeasy-s3-buckect
  ```

- [ ] Install S3 presigner package:
  ```bash
  cd backend
  npm install @aws-sdk/s3-request-presigner
  ```

- [ ] Restart backend server:
  ```bash
  npm run dev
  ```

- [ ] Test S3 endpoint:
  ```bash
  curl -X POST http://localhost:5000/api/v1/products/upload-url \
    -H "Content-Type: application/json" \
    -d '{"fileName":"test.jpg","mimeType":"image/jpeg"}'
  ```

## Frontend Setup

- [ ] Verify base URL in `frontend/easy-shop-frontend/.env`:
  ```
  VITE_EASYSHOP_BASE_URL=https://easy-shop-yvwm.onrender.com/api/v1
  ```

- [ ] For local development, update to:
  ```
  VITE_EASYSHOP_BASE_URL=http://localhost:5000/api/v1
  ```

- [ ] Start frontend:
  ```bash
  cd frontend/easy-shop-frontend
  npm run dev
  ```

## Testing

### Test 1: Display Products from Google Sheets
- [ ] Navigate to Products page
- [ ] Verify products load from Google Sheets
- [ ] Check that product images display
- [ ] If images don't show, verify image URLs in Google Sheets are valid

### Test 2: Upload Image to S3
- [ ] Go to Admin > Products
- [ ] Click "Create Product"
- [ ] Fill in product details
- [ ] Upload an image using drag-and-drop or file picker
- [ ] Verify upload succeeds
- [ ] Save the product
- [ ] Go back to Products page
- [ ] Verify new product appears with S3 image

### Test 3: Image Fallback
- [ ] Create a product without uploading an image
- [ ] Verify placeholder image displays
- [ ] Try with invalid image URLs
- [ ] Confirm fallback handling works

## Troubleshooting Common Issues

### Products Not Loading
```
Check 1: Is the backend running?
$ curl http://localhost:5000/api/v1/products

Check 2: Are Google Sheets credentials valid?
$ Check backend logs for errors

Check 3: Is CORS enabled?
$ Check if frontend can reach backend
```

### Images Not Showing
```
Check 1: Valid URLs in Google Sheets?
Open each URL in browser independently

Check 2: CORS blocked?
Open browser console (F12) → Network tab
Look for red requests to image URLs

Check 3: Image field name?
Backend returns: { products: [{..., image: "url", ...}] }
Frontend uses: product.image
```

### S3 Upload Failing
```
Check 1: AWS credentials valid?
$ npm logs show AWS errors?

Check 2: S3 bucket exists and accessible?
$ AWS Console → S3 → bucket-name

Check 3: CORS configured on S3?
S3 → bucket → Permissions → CORS Configuration

Check 4: Presigned URL generation working?
Test POST /products/upload-url endpoint directly
```

## Files Modified/Created

### New Files
- `backend/services/s3.js` - AWS S3 integration
- `frontend/.../api/s3.api.js` - S3 upload API
- `FRONTEND_SETUP_GUIDE.md` - This documentation

### Updated Files
- `backend/controllers/productController.js` - Added getUploadUrl
- `backend/routes/productRoutes.js` - Added /upload-url route
- `frontend/.../components/products/ProductCard.vue` - NEW implementation
- `frontend/.../components/products/ProductList.vue` - NEW implementation
- `frontend/.../pages/products/Products.vue` - Updated to use ProductList
- `frontend/.../components/admin/ProductFormModal.vue` - Added S3 upload support

## Next: Advanced Setup (Optional)

### Enable Automated Image Optimization
- Consider using AWS Lambda to resize images on upload
- Or integrate Sharp.js for local image optimization

### Setup CloudFront CDN
- Create CloudFront distribution for S3 bucket
- Use CDN URL instead of direct S3 URL
- Better performance and caching

### Implement Image Compression
- Add image compression before S3 upload
- Reduce storage costs and improve load time

### Setup Monitoring
- CloudWatch for S3 operations
- Error tracking and logging
- Cost monitoring

---

For detailed information, see `FRONTEND_SETUP_GUIDE.md`
