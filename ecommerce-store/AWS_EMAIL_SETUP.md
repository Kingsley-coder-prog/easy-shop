# AWS SES Email Setup Guide

## Overview
Your application uses **AWS SES (Simple Email Service)** to send transactional emails to customers. This guide will help you set up AWS SES to enable email notifications.

## Email Notifications Currently Implemented

✅ **Order Received Email** - Sent automatically when customer completes payment
✅ **Order Ready Email** - Sent when admin marks order as "ready"

## Prerequisites
- AWS Account (create one at https://aws.amazon.com if you don't have one)
- Domain name (optional but recommended for production)
- Email address to verify

---

## Step 1: Set Up AWS SES

### 1.1 Access AWS SES Console
1. Log in to [AWS Console](https://console.aws.amazon.com)
2. Search for "SES" or navigate to **Simple Email Service**
3. Select your preferred region (e.g., **us-east-1**, **eu-west-1**, etc.)
   - **Important**: Note this region - you'll need it later

### 1.2 Verify Email Address (For Testing)

**For Development/Testing (Sandbox Mode):**

1. In SES console, go to **Verified identities** (left sidebar)
2. Click **Create identity**
3. Select **Email address**
4. Enter your sender email (e.g., `noreply@yourdomain.com` or your personal email)
5. Click **Create identity**
6. Check your email inbox for verification email from AWS
7. Click the verification link

**Important**: In sandbox mode, you can only send emails to verified addresses. Also verify any customer email addresses you want to test with.

### 1.3 Request Production Access (For Production)

To send emails to any customer (not just verified addresses):

1. In SES console, click **Get Set Up** in the banner or go to **Account dashboard**
2. Click **Request production access**
3. Fill out the form:
   - **Mail Type**: Transactional
   - **Website URL**: Your website URL
   - **Use case description**: 
     ```
     We operate an e-commerce platform and need to send transactional emails to customers:
     - Order confirmation emails when payment is received
     - Order ready notifications when orders are prepared
     - These are essential transactional emails, not marketing.
     ```
   - **Compliance**: Confirm you comply with AWS policies
4. Submit the request
5. Wait for approval (usually 24-48 hours)

### 1.4 Verify Domain (Optional - Recommended for Production)

Verifying a domain allows you to send from any email address at that domain:

1. Go to **Verified identities** → **Create identity**
2. Select **Domain**
3. Enter your domain name (e.g., `yourdomain.com`)
4. Choose verification method (DKIM recommended)
5. Add the provided DNS records to your domain registrar
6. Wait for verification (can take up to 72 hours)

---

## Step 2: Create IAM User for Application Access

### 2.1 Create IAM User
1. Go to **IAM Console** (search for IAM in AWS Console)
2. Click **Users** (left sidebar) → **Create user**
3. Set username: `ecommerce-ses-user` (or any name you prefer)
4. Click **Next**

### 2.2 Attach Permissions
1. Select **Attach policies directly**
2. Search for and select: **AmazonSESFullAccess**
   - Or for more restricted access, use: **AmazonSESFullAccess** or create custom policy
3. Click **Next** → **Create user**

### 2.3 Create Access Key
1. Click on the newly created user
2. Go to **Security credentials** tab
3. Scroll to **Access keys** section
4. Click **Create access key**
5. Select use case: **Application running outside AWS**
6. Click **Next** → **Create access key**
7. **IMPORTANT**: Copy both:
   - **Access key ID** (e.g., `AKIAIOSFODNN7EXAMPLE`)
   - **Secret access key** (e.g., `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`)
   - ⚠️ You won't be able to see the secret again!
8. Click **Done**

---

## Step 3: Configure Your Backend Application

### 3.1 Update `.env` File

Open your backend `.env` file and add/update these variables:

```env
# AWS SES Configuration
AWS_REGION=us-east-1                           # Replace with your SES region
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE         # Your IAM access key
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/...        # Your IAM secret key
EMAIL_FROM=noreply@yourdomain.com              # Your verified email
ADMIN_EMAIL=admin@yourdomain.com               # Admin email for notifications
```

### 3.2 Email Templates

Your application already has email templates configured:
- ✅ `backend/services/templates/order_received.hbs` - Order confirmation
- ✅ `backend/services/templates/order_ready.hbs` - Ready notification

You can customize these Handlebars templates as needed.

---

## Step 4: Testing Email Functionality

### 4.1 Test in Sandbox Mode

If you're in sandbox mode, first verify the customer email:
1. Go to SES → **Verified identities**
2. Add the customer email address you want to test with
3. Verify it via the email link

### 4.2 Test Order Received Email

1. Place an order on your application
2. Complete payment using Paystack test credentials
3. Check customer email inbox
4. You should receive an "Order Received" email

### 4.3 Test Order Ready Email

1. Log in as admin
2. Go to Orders page
3. Find an order and click "Mark as Ready" or update order status to "ready"
4. Customer should receive "Order Ready" email

### 4.4 Check Backend Logs

Monitor your backend console for email logs:
```
✅ SES email sent <MessageId>
❌ SES send failed <error>
```

---

## Step 5: Monitoring and Best Practices

### 5.1 Monitor SES Sending

1. Go to **SES Console** → **Account dashboard**
2. Monitor:
   - Sending statistics
   - Bounce rate (should be < 5%)
   - Complaint rate (should be < 0.1%)
   - Reputation dashboard

### 5.2 Handle Bounces and Complaints

Set up SNS notifications for bounces/complaints:
1. Go to **Configuration sets** in SES
2. Create a configuration set
3. Add event destinations for bounces and complaints
4. Subscribe to SNS topic to receive notifications

### 5.3 Security Best Practices

- ✅ Never commit AWS credentials to git
- ✅ Use `.env` files (already in `.gitignore`)
- ✅ Rotate access keys periodically
- ✅ Use IAM roles instead of access keys when possible (for EC2/Lambda)
- ✅ Monitor CloudWatch logs for suspicious activity

---

## Troubleshooting

### Email Not Sending

**Check 1**: Verify sender email
```bash
# In SES Console → Verified identities
# Status should be "Verified" ✅
```

**Check 2**: Check AWS credentials
```bash
# Backend console should show:
SES email sent <MessageId>
```

**Check 3**: Sandbox mode restrictions
- In sandbox, you can only send to verified emails
- Request production access to send to any email

**Check 4**: Check backend logs
```bash
cd backend
npm start

# Look for errors like:
❌ SES send failed <error>
```

### Common Errors

**Error: `Email address is not verified`**
- **Solution**: Verify the sender email in SES console

**Error: `MessageRejected: Email address not verified`**
- **Solution**: In sandbox mode, verify recipient email too

**Error: `InvalidParameterValue: Missing region`**
- **Solution**: Add `AWS_REGION` to `.env` file

**Error: `The security token included in the request is invalid`**
- **Solution**: Check AWS credentials are correct

---

## Cost Information

**SES Pricing** (as of 2024):
- First 62,000 emails per month: **FREE** (if sent from EC2)
- After that: **$0.10 per 1,000 emails**
- Very affordable for most e-commerce applications

**Example**:
- 1,000 orders/month = 2,000 emails (order received + order ready)
- Cost: **FREE** or **$0.20/month**

---

## Next Steps

1. ✅ Set up SES and verify email
2. ✅ Create IAM user and get access keys
3. ✅ Update `.env` file with credentials
4. ✅ Test email sending
5. ✅ Request production access
6. ✅ Monitor sending reputation

---

## Support

For AWS SES issues:
- [AWS SES Documentation](https://docs.aws.amazon.com/ses/)
- [AWS SES Limits](https://docs.aws.amazon.com/ses/latest/dg/quotas.html)
- [AWS Support](https://console.aws.amazon.com/support/)

For application issues:
- Check backend logs
- Verify environment variables
- Test with verified emails first
