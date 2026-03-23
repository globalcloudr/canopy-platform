# SendGrid Newsletter Pro - Installation Instructions

## ⚠️ IMPORTANT: Complete Package Required

This plugin requires the **vendor folder** (1.3MB of SendGrid library files) to work. Without it, you'll get a **500 Internal Server Error**.

## Installation Options

### Option 1: Download Complete Plugin (Recommended)

1. **In this Replit**, open your browser to:
   ```
   https://[your-replit-url]/download.php
   ```
   This will download `sendgrid-newsletter-pro.zip` with everything included.

2. **Upload to WordPress**:
   - Go to WordPress Admin → Plugins → Add New → Upload Plugin
   - Choose the downloaded ZIP file
   - Click "Install Now"
   - Activate the plugin

### Option 2: Manual Upload via FTP/File Manager

If you're uploading files manually, you **MUST** include these folders:

```
sendgrid-newsletter-pro/
├── admin/              ← Required
├── assets/             ← Required
├── includes/           ← Required
├── vendor/             ← CRITICAL! Must include this (1.3MB)
├── composer.json
├── composer.lock
└── sendgrid-newsletter-pro.php
```

**DO NOT** upload:
- `attached_assets/` (screenshots, not needed)
- `index.php` (test file)
- `download.php` (download script)
- `.git/` or `.replit` (development files)

### Option 3: Composer Install (Advanced)

If you have SSH access to your server:

1. Upload the plugin without the `vendor` folder
2. SSH into your server
3. Navigate to the plugin directory:
   ```bash
   cd /path/to/wordpress/wp-content/plugins/sendgrid-newsletter-pro
   ```
4. Run:
   ```bash
   composer install --no-dev
   ```

## Fixing "500 Internal Server Error"

If you're getting a 500 error, it means the `vendor` folder is missing:

1. **Check** if `wp-content/plugins/sendgrid-newsletter-pro/vendor/` exists
2. If it doesn't exist, **delete the plugin** and reinstall using Option 1 above
3. If it does exist, check your WordPress error log at `/wp-content/debug.log`

## After Installation

1. Go to **Newsletter Pro → Settings**
2. Enter your SendGrid API key
3. Configure your sender email and name
4. Test the connection by sending a test email

## Requirements

- WordPress 5.8 or higher
- PHP 7.4 or higher
- SendGrid account with API key
- PHP cURL extension enabled

## Support

If you still see errors after installation:
1. Enable WordPress debug mode in `wp-config.php`:
   ```php
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   ```
2. Check `/wp-content/debug.log` for the actual error
3. Contact support with the error message
