# AWS S3 Configuration Guide

## S3 Bucket CORS Setup (If Needed)

If you encounter CORS errors when uploading images from the browser, configure your S3 bucket CORS.

### Steps to Configure CORS

1. **Go to AWS Console**
   - Open https://console.aws.amazon.com/
   - Navigate to S3 → Your Bucket → Permissions

2. **Find CORS Configuration**
   - Scroll to "Cross-origin resource sharing (CORS)"
   - Click "Edit"

3. **Paste This Configuration**

```json
[
  {
    "AllowedHeaders": [
      "*"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "HEAD",
      "DELETE"
    ],
    "AllowedOrigins": [
      "*"
    ],
    "ExposeHeaders": [
      "x-amz-meta-*",
      "x-amz-request-id"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

4. **Save Configuration**
   - Click "Save changes"
   - Wait for it to apply (usually instant)

### For Production (Restricted Origins)

If you want to restrict CORS to only your frontend domain:

```json
[
  {
    "AllowedHeaders": [
      "*"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST"
    ],
    "AllowedOrigins": [
      "https://your-domain.com",
      "https://www.your-domain.com",
      "http://localhost:5173"
    ],
    "ExposeHeaders": [
      "x-amz-meta-*"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

## S3 Bucket Permissions (Bucket Policy)

Your S3 bucket needs a bucket policy that allows:
1. Public read access (for users to view images)
2. Your app to put/delete objects

### Recommended Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::shopeasy-s3-buckect/*"
    },
    {
      "Sid": "AllowPutObject",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:user/YOUR_IAM_USER"
      },
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::shopeasy-s3-buckect/*"
    }
  ]
}
```

### Find Your AWS Account ID and IAM User ARN

1. Open AWS Console
2. Top-right → My Account (or My Security Credentials)
3. Account ID is visible on the page (12 digits)
4. For IAM User ARN: IAM Dashboard → Users → Select User → Copy ARN

## IAM User Permissions

Your IAM user needs these S3 permissions:

### Minimal Permissions
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::shopeasy-s3-buckect",
        "arn:aws:s3:::shopeasy-s3-buckect/*"
      ]
    }
  ]
}
```

### Steps to Add Policy

1. **Go to IAM Console**
   - https://console.aws.amazon.com/iam/

2. **Select Your User**
   - Users → Your User

3. **Add Inline Policy**
   - Add inline policy → JSON
   - Paste the policy above
   - Review and Save

## Verify Setup

### Test 1: Check Bucket Access
```bash
# List objects in bucket
aws s3 ls s3://shopeasy-s3-buckect/ --region us-east-2
```

### Test 2: Test Presigned URL
```bash
# Get a presigned URL for upload
aws s3 presign s3://shopeasy-s3-buckect/test.jpg \
  --expires-in 600 \
  --region us-east-2
```

### Test 3: Upload a Test File
```bash
# Upload test file
aws s3 cp test.jpg s3://shopeasy-s3-buckect/ --region us-east-2

# Verify it's public
curl https://shopeasy-s3-buckect.s3.us-east-2.amazonaws.com/test.jpg
```

## Environment Variables Required

```bash
# backend/.env
AWS_REGION=us-east-2
AWS_BUCKET_NAME=shopeasy-s3-buckect
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=wJal...
```

### Where to Find Your Credentials

1. **AWS Console** → IAM → Users
2. Select your user
3. Security credentials tab
4. Access keys section
5. Click "Create access key"
6. Copy Access Key ID and Secret Access Key

⚠️ **IMPORTANT**: 
- Never commit credentials to Git
- Use `.env` file (add to `.gitignore`)
- Rotate keys regularly
- Delete unused keys

## Troubleshooting

### CORS Error in Browser
```
Access to XMLHttpRequest at 'https://s3...' denied by CORS policy
```

**Solution**: 
- Check S3 CORS configuration
- Make sure you saved it
- Restart backend/frontend
- Clear browser cache

### 403 Forbidden
```
Forbidden: User: arn:aws:iam::... is not authorized
```

**Solution**:
- Check IAM user permissions
- Verify bucket policy
- Check Access Key ID and Secret are correct
- Regenerate credentials if needed

### 404 Not Found
```
The specified bucket does not exist
```

**Solution**:
- Check bucket name in `.env`
- Verify bucket exists in AWS Console
- Check region matches (`us-east-2`)

### Presigned URL Fails
```
SignatureDoesNotMatch: The request signature we calculated does not match
```

**Solution**:
- Verify AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
- Check credentials haven't been rotated
- Verify region is correct
- Restart backend

## AWS S3 Cost Optimization

### Pricing Breakdown
- **Storage**: $0.023 per GB/month
- **Requests**: $0.0004 per 1,000 PUT requests
- **Transfer**: First 1GB free per month, then $0.09/GB out

### Cost Reduction Tips
1. **Use CloudFront CDN**: Reduces data transfer costs
2. **Enable Versioning Off**: Saves storage
3. **Set Lifecycle Policies**: Delete old versions
4. **Compress Images**: Before upload (Sharp.js)
5. **Monitor Usage**: CloudWatch alerts

### Example Lifecycle Policy
```json
{
  "Rules": [
    {
      "Id": "DeleteOldVersions",
      "Status": "Enabled",
      "NoncurrentVersionExpiration": {
        "NoncurrentDays": 30
      }
    }
  ]
}
```

## Secure Access Best Practices

✅ **DO**
- Use IAM users (not root account)
- Rotate access keys regularly
- Store credentials in environment variables
- Use HTTPS/TLS only
- Enable MFA on AWS account
- Monitor CloudTrail logs

❌ **DON'T**
- Hardcode credentials in code
- Commit credentials to Git
- Use root account credentials
- Share credentials
- Use permanent credentials in frontend
- Make bucket fully public if not needed

## Testing Checklist

- [ ] AWS credentials working (`aws s3 ls` works)
- [ ] Bucket exists and is accessible
- [ ] CORS configured (if uploading from browser)
- [ ] Bucket policy allows your IAM user
- [ ] Presigned URLs generate correctly
- [ ] Upload test file succeeds
- [ ] Can read uploaded file via public URL
- [ ] Delete test file works
- [ ] Backend can generate presigned URLs
- [ ] Frontend can upload via presigned URL

## Support Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [S3 CORS Configuration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html)
- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [Presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)

---

**Need Help?** Check the console logs for specific error messages. AWS errors are usually descriptive about what's wrong.
