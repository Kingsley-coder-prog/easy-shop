# Quick Reference: Image Setup

## Problem Statement
Product images from Google Sheets weren't showing on the frontend.

## Solution Implemented
Complete frontend setup with:
- ✅ Google Sheets image display
- ✅ S3 image upload capability  
- ✅ Professional UI components
- ✅ Full error handling

## What Works Now

### 1. Product Display
```
Products page → Shows all products from Google Sheets
Each product displays:
- Product image (from Google Sheets or S3)
- Product name
- Description
- Category badge
- Price in Nigerian Naira (₦)
- Add to Cart button
```

### 2. Image Upload (Admin)
```
Admin Panel → Create/Edit Product → Upload Image
- Drag & drop or click to select
- Automatic validation (type & size)
- Real-time preview
- Direct S3 upload
- Progress indicator
- Error messages
```

## 3-Step Installation

### Step 1: Backend
```bash
cd backend
npm install @aws-sdk/s3-request-presigner
```

### Step 2: Environment Variables
Backend `.env` needs:
```
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_REGION=us-east-2
AWS_BUCKET_NAME=shopeasy-s3-buckect
```

### Step 3: Start Services
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend/easy-shop-frontend
npm run dev
```

## Files Changed

### New Files
| File | Purpose |
|------|---------|
| `backend/services/s3.js` | AWS S3 integration |
| `frontend/.../api/s3.api.js` | S3 upload utilities |
| `frontend/.../components/products/ProductCard.vue` | Product card component |
| `frontend/.../components/products/ProductList.vue` | Products grid component |

### Updated Files
| File | Changes |
|------|---------|
| `backend/controllers/productController.js` | Added S3 upload URL endpoint |
| `backend/routes/productRoutes.js` | Added `/upload-url` route |
| `frontend/.../pages/products/Products.vue` | Uses ProductList component |
| `frontend/.../components/admin/ProductFormModal.vue` | Added image upload UI |

## API Endpoints

### Get Products
```
GET /api/v1/products
Response: { products: [...] }
```

### Upload Image (Get Presigned URL)
```
POST /api/v1/products/upload-url
Body: { fileName: "photo.jpg", mimeType: "image/jpeg" }
Response: { url: "...", publicUrl: "https://..." }
```

## Component Usage

### Display Products
```vue
<template>
  <ProductList />
</template>

<script setup>
import ProductList from "@/components/products/ProductList.vue";
</script>
```

### Use ProductCard
```vue
<ProductCard 
  :product="{ name: 'Laptop', price_naira: 500000, image: 'url' }"
  @add-to-cart="addToCart"
/>
```

## Image Flow Diagram

```
GOOGLE SHEETS IMAGES:
┌─────────────┐      ┌──────────┐      ┌─────────┐      ┌─────────┐
│Google Sheet │──→   │ Backend  │──→   │Frontend │──→   │ Browser │
│(image URLs) │      │(API)     │      │(Vue)    │      │(Display)│
└─────────────┘      └──────────┘      └─────────┘      └─────────┘

S3 UPLOAD:
┌──────────┐      ┌──────────┐      ┌────┐      ┌─────┐      ┌──────────┐
│   User   │──→   │ Frontend │──→   │ S3 │  +   │ URL │──→   │ Database │
│(uploads) │      │(upload)  │      │    │      │save │      │(Google)  │
└──────────┘      └──────────┘      └────┘      └─────┘      └──────────┘
```

## Common Commands

### Test Backend
```bash
# Get products
curl http://localhost:5000/api/v1/products

# Get presigned URL
curl -X POST http://localhost:5000/api/v1/products/upload-url \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test.jpg","mimeType":"image/jpeg"}'
```

### Clear Node Modules & Reinstall
```bash
# If issues occur
cd backend
rm -rf node_modules
npm install
npm install @aws-sdk/s3-request-presigner
```

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Images don't show | Check Google Sheets image URLs are valid |
| S3 upload fails | Verify AWS credentials in backend `.env` |
| 401/403 errors | Check backend is running and accessible |
| Presigned URL error | Make sure AWS_REGION and AWS_BUCKET_NAME are correct |
| File upload blocked | Check file size < 5MB and format is JPEG/PNG/GIF/WebP |

## Key Features Implemented

✅ **Product Display**
- Responsive grid layout
- Loading states
- Error handling
- Empty states

✅ **Image Management**
- Google Sheets integration
- S3 upload support
- Fallback images
- Error handling

✅ **UI/UX**
- Beautiful cards
- Drag-and-drop upload
- Progress indicators
- Mobile responsive
- Smooth animations

✅ **Validation**
- File type checking
- File size limit (5MB)
- Image format support
- Error messages

## For Long-term S3 Improvement

```javascript
// Future Enhancements
1. Image compression before upload
2. Automatic image resizing
3. CloudFront CDN integration
4. Image optimization pipeline
5. Batch upload support
6. Image gallery management
```

## Documentation References

- Full setup guide: `FRONTEND_SETUP_GUIDE.md`
- Setup checklist: `SETUP_CHECKLIST.md`
- Implementation summary: `FRONTEND_IMPLEMENTATION_SUMMARY.md`

---

**Status**: ✅ READY TO USE
Frontend is fully implemented. Products from Google Sheets will display immediately. S3 image uploads ready for admin panel.

Start the backend and frontend services and test the Products page!
