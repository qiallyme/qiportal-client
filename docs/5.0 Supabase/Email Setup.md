# Supabase Email Setup Guide

## 🎯 Overview

This guide covers the configuration of email services in Supabase for authentication, notifications, and transactional emails in the QiAlly Portal.

## 📧 Email Configuration

### 1. Default Email Provider

Supabase uses **Resend** as the default email provider, which offers:
- **Free Tier**: 3,000 emails/month
- **High Deliverability**: 99.9% delivery rate
- **Simple Setup**: No configuration required
- **Analytics**: Email tracking and analytics

### 2. Custom SMTP Configuration

For production use or custom domains, configure SMTP:

#### SMTP Settings
Go to **Authentication > Settings > SMTP Settings**:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SENDER_NAME=QiAlly Portal
SMTP_SENDER_EMAIL=noreply@qially.me
```

#### Popular SMTP Providers

##### Gmail SMTP
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

##### Outlook/Hotmail SMTP
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

##### Custom Domain (Gmail)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=admin@yourdomain.com
SMTP_PASS=your-app-password
```

##### SendGrid SMTP
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

## 📝 Email Templates

### 1. Template Configuration

Go to **Authentication > Email Templates** to customize:

#### Confirm Signup Template
```html
<h2>Welcome to QiAlly Portal!</h2>
<p>Hi {{ .Email }},</p>
<p>Thank you for signing up for QiAlly Portal. Please confirm your email address by clicking the button below:</p>
<a href="{{ .ConfirmationURL }}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
  Confirm Email Address
</a>
<p>If you didn't create this account, you can safely ignore this email.</p>
<p>Best regards,<br>The QiAlly Team</p>
```

#### Reset Password Template
```html
<h2>Reset Your Password</h2>
<p>Hi {{ .Email }},</p>
<p>We received a request to reset your password for QiAlly Portal. Click the button below to create a new password:</p>
<a href="{{ .ConfirmationURL }}" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
  Reset Password
</a>
<p>This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
<p>Best regards,<br>The QiAlly Team</p>
```

#### Magic Link Template
```html
<h2>Sign In to QiAlly Portal</h2>
<p>Hi {{ .Email }},</p>
<p>Click the button below to sign in to your QiAlly Portal account:</p>
<a href="{{ .ConfirmationURL }}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
  Sign In
</a>
<p>This link will expire in 1 hour. If you didn't request this sign-in link, you can safely ignore this email.</p>
<p>Best regards,<br>The QiAlly Team</p>
```

#### Email Change Template
```html
<h2>Confirm Email Change</h2>
<p>Hi {{ .Email }},</p>
<p>We received a request to change your email address to {{ .NewEmail }}. Click the button below to confirm this change:</p>
<a href="{{ .ConfirmationURL }}" style="background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
  Confirm Email Change
</a>
<p>If you didn't request this change, you can safely ignore this email.</p>
<p>Best regards,<br>The QiAlly Team</p>
```

### 2. Template Variables

Available variables for customization:
- `{{ .Email }}` - User's email address
- `{{ .ConfirmationURL }}` - Confirmation/reset link
- `{{ .NewEmail }}` - New email address (for email change)
- `{{ .Token }}` - Security token
- `{{ .TokenHash }}` - Hashed token

## 🔧 Email Settings

### 1. Authentication Settings

Go to **Authentication > Settings > Auth Settings**:

#### Email Settings
- **Enable Email Signup**: ✅
- **Enable Email Confirmations**: ✅
- **Enable Secure Email Change**: ✅
- **Enable Double Confirm Changes**: ✅ (recommended)

#### Security Settings
- **JWT Expiry**: 3600 seconds (1 hour)
- **Refresh Token Rotation**: ✅
- **Refresh Token Reuse Interval**: 10 seconds

### 2. Rate Limiting

Configure rate limits to prevent abuse:

#### Email Rate Limits
- **Signup Rate Limit**: 5 per hour per IP
- **Password Reset Rate Limit**: 3 per hour per email
- **Magic Link Rate Limit**: 5 per hour per email

#### Implementation
```javascript
// Rate limiting configuration
const rateLimitConfig = {
  signup: { max: 5, window: '1h' },
  passwordReset: { max: 3, window: '1h' },
  magicLink: { max: 5, window: '1h' }
};
```

## 📊 Email Analytics

### 1. Delivery Tracking

Monitor email delivery and engagement:

#### Key Metrics
- **Delivery Rate**: Percentage of emails delivered
- **Open Rate**: Percentage of emails opened
- **Click Rate**: Percentage of links clicked
- **Bounce Rate**: Percentage of failed deliveries

#### Analytics Dashboard
```sql
-- Email analytics query
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_emails,
    COUNT(CASE WHEN delivered_at IS NOT NULL THEN 1 END) as delivered,
    COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END) as opened,
    COUNT(CASE WHEN clicked_at IS NOT NULL THEN 1 END) as clicked
FROM auth.email_logs
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### 2. Email Logs

Access email logs in Supabase Dashboard:

#### Log Fields
- `id` - Unique log identifier
- `user_id` - User who triggered the email
- `email` - Recipient email address
- `template` - Email template used
- `created_at` - When email was sent
- `delivered_at` - When email was delivered
- `opened_at` - When email was opened
- `clicked_at` - When link was clicked

## 🚀 Production Setup

### 1. Domain Configuration

For production, configure custom domain:

#### DNS Records
```
Type: CNAME
Name: mail
Value: your-smtp-provider.com

Type: TXT
Name: @
Value: v=spf1 include:your-smtp-provider.com ~all

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com
```

#### SPF Record
```
v=spf1 include:_spf.google.com include:_spf.sendgrid.net ~all
```

### 2. Email Verification

Verify your domain with email providers:

#### Gmail Verification
1. Go to Google Workspace Admin
2. Navigate to **Apps > Gmail > Settings**
3. Add your domain for sending
4. Verify domain ownership

#### SendGrid Verification
1. Go to SendGrid Dashboard
2. Navigate to **Settings > Sender Authentication**
3. Add your domain
4. Add DNS records as instructed

### 3. Monitoring Setup

Set up email monitoring and alerts:

#### Health Checks
```javascript
// Email health check function
async function checkEmailHealth() {
  const { data, error } = await supabase
    .from('auth.email_logs')
    .select('*')
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Email health check failed:', error);
    return false;
  }

  const deliveryRate = data.filter(log => log.delivered_at).length / data.length;
  return deliveryRate > 0.95; // 95% delivery rate threshold
}
```

## 🔍 Troubleshooting

### Common Email Issues

#### Emails Not Sending
1. **Check SMTP Configuration**: Verify host, port, credentials
2. **Check Rate Limits**: Ensure not exceeding limits
3. **Check Spam Filters**: Monitor spam folder
4. **Check DNS Records**: Verify SPF, DKIM, DMARC

#### Emails Going to Spam
1. **Configure SPF Record**: Add proper SPF record
2. **Set Up DKIM**: Enable DKIM signing
3. **Configure DMARC**: Set up DMARC policy
4. **Warm Up IP**: Gradually increase email volume

#### Template Issues
1. **Check HTML Syntax**: Validate HTML structure
2. **Test Variables**: Ensure variables are properly formatted
3. **Check Links**: Verify confirmation URLs work
4. **Test Rendering**: Check email client compatibility

### Debug Commands

#### Check Email Logs
```sql
-- Recent email logs
SELECT * FROM auth.email_logs 
WHERE created_at >= NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- Failed emails
SELECT * FROM auth.email_logs 
WHERE delivered_at IS NULL 
AND created_at >= NOW() - INTERVAL '24 hours';
```

#### Test Email Configuration
```javascript
// Test email sending
async function testEmail() {
  const { data, error } = await supabase.auth.resetPasswordForEmail(
    'test@example.com',
    {
      redirectTo: 'http://localhost:3000/reset-password'
    }
  );

  if (error) {
    console.error('Email test failed:', error);
  } else {
    console.log('Test email sent successfully');
  }
}
```

## 📋 Best Practices

### 1. Email Security
- **Use App Passwords**: Don't use regular passwords for SMTP
- **Enable 2FA**: Protect email accounts with 2FA
- **Monitor Logs**: Regularly check email logs for issues
- **Rate Limiting**: Implement appropriate rate limits

### 2. Email Deliverability
- **Warm Up IP**: Gradually increase email volume
- **Clean Lists**: Remove invalid email addresses
- **Engagement**: Monitor and improve engagement rates
- **Authentication**: Use SPF, DKIM, and DMARC

### 3. User Experience
- **Clear Subject Lines**: Use descriptive subject lines
- **Mobile Friendly**: Ensure emails work on mobile
- **Clear CTAs**: Make call-to-action buttons prominent
- **Unsubscribe**: Include unsubscribe links

---

**Last Updated**: 2024-01-XX
**Status**: Production Ready
**Next Review**: 2024-01-XX
