# Supabase Email Configuration Fix

## Issue: Email confirmation not being sent during signup

### Steps to Fix in Supabase Dashboard:

1. **Go to Authentication Settings**
   - Navigate to your Supabase project dashboard
   - Go to **Authentication** → **Settings**

2. **Configure Email Provider**
   - In the **Email Templates** section, ensure email templates are set up
   - Go to **Email Templates** tab
   - Configure the following templates:
     - **Confirm signup**
     - **Reset password**
     - **Magic link**

3. **Set up SMTP with Cloudflare Email**
   - Go to **Authentication** → **Settings** → **SMTP Settings**
   - Enable SMTP and configure with Cloudflare:
     - **Host**: smtp.cloudflare.com
     - **Port**: 587 (or 465 for SSL)
     - **Username**: your-email@yourdomain.com (the email you set up in Cloudflare)
     - **Password**: Your Cloudflare email password or app-specific password
     - **Sender name**: QiAlly Support
     - **Sender email**: support@qially.me (or your verified domain email)

4. **Alternative: Use Supabase's built-in email service**
   - If you don't want to set up SMTP, ensure the built-in email service is enabled
   - Go to **Authentication** → **Settings** → **Email Auth**
   - Make sure **Enable email confirmations** is checked
   - Set **Secure email change** to enabled

5. **Test the Configuration**
   - Go to **Authentication** → **Users**
   - Try creating a test user
   - Check if confirmation email is sent

### Environment Variables to Check:
Make sure these are set in your `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Cloudflare Email Setup Steps:
1. **Set up Cloudflare Email Routing**:
   - Go to Cloudflare Dashboard → Email → Email Routing
   - Add your domain and verify ownership
   - Create email addresses (e.g., support@qially.me, noreply@qially.me)

2. **Configure DNS Records**:
   - Cloudflare will automatically add the necessary MX, SPF, and DKIM records
   - Ensure these records are active in your DNS

3. **Test Email Delivery**:
   - Send a test email from Cloudflare dashboard
   - Check spam/junk folders initially

### Common Issues:
- **Domain verification**: Ensure your domain is verified in both Cloudflare and Supabase
- **DNS propagation**: Allow 24-48 hours for DNS changes to propagate
- **Rate limiting**: Cloudflare has generous limits but monitor usage
- **Spam filters**: Check spam/junk folders, especially during initial setup
- **Authentication**: Ensure SMTP credentials are correct

### Cloudflare Email Routing Configuration:

1. **Enable Email Routing**:
   - In Cloudflare Dashboard, go to Email → Email Routing
   - Click "Get started" and follow the setup wizard
   - Verify your domain ownership

2. **Create Email Addresses**:
   - Create `support@qially.me` for general support
   - Create `noreply@qially.me` for automated emails
   - Create `admin@qially.me` for administrative emails

3. **Configure Catch-all (Optional)**:
   - Set up a catch-all address to handle any unconfigured emails
   - This helps prevent email bounces

4. **Set up Email Rules**:
   - Forward support emails to your main email
   - Set up auto-replies if needed
   - Configure spam filtering

### Quick Test:
You can test the email functionality by:
1. Going to **Authentication** → **Users** in Supabase dashboard
2. Manually creating a user
3. Checking if the confirmation email is sent
4. Verify the email comes from your Cloudflare email address
