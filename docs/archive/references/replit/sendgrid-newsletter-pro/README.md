# SendGrid Newsletter Pro - WordPress Plugin

A comprehensive email newsletter management plugin for WordPress with Twilio SendGrid integration. Designed specifically for adult education organizations and offered as part of a professional service package.

---

## 🚀 **DOWNLOAD PLUGIN FOR WORDPRESS**

**To download the complete, ready-to-install plugin package:**

1. **Click the Webview tab** at the top of this Replit window
2. **Click "Download Plugin"** button on the page
3. **Save the ZIP file** (approximately 14MB, includes all required dependencies)

The downloaded ZIP file is ready to upload directly to WordPress - no additional configuration needed!

## 🚀 Features

### Campaign Management
- **SendGrid Dynamic Templates**: Use your professionally-designed SendGrid templates directly in WordPress
- **Template Gallery**: Browse and select from your existing SendGrid Dynamic Templates  
- **Preview & Testing**: Send test emails with dynamic data before launching
- **Scheduling**: Save campaigns as drafts and send when ready
- **Performance Tracking**: Monitor opens, clicks, bounces, and unsubscribes

### Subscriber Management
- **Manual Entry**: Add subscribers individually with contact information
- **CSV Import**: Bulk import subscribers from CSV files
- **List Organization**: Organize subscribers into targeted lists
- **Status Tracking**: Track subscribed, unsubscribed, and bounced contacts
- **List Segmentation**: Target specific groups for campaigns

### Analytics & Reporting
- **Real-time Statistics**: Track campaign performance in real-time
- **Comprehensive Dashboard**: View key metrics at a glance
- **Open & Click Rates**: Monitor subscriber engagement
- **Historical Data**: Review past campaign performance
- **Subscriber Growth**: Track subscriber list growth over time

### SendGrid Integration
- **Reliable Delivery**: Powered by Twilio SendGrid's infrastructure
- **Dynamic Templates**: Full integration with SendGrid's drag-and-drop template builder
- **Automatic Tracking**: Opens and clicks tracked automatically
- **Bounce Management**: Automatic bounce detection and handling
- **Unsubscribe Links**: Automatic unsubscribe management
- **API Configuration**: Simple API key setup through Twilio account

### Multi-Client Management (Agency Feature)
- **Client Management**: Create and manage multiple clients from one WordPress installation
- **SendGrid Subusers**: Automatic subuser creation for client isolation
- **Isolated Sending Reputation**: Each client gets separate sending reputation
- **Dedicated API Keys**: Per-client API keys for security and analytics
- **Client Assignment**: Assign campaigns to specific clients
- **Separate Analytics**: Track each client's performance independently

## 📦 Installation

### Requirements
- **PHP**: 7.4 or higher
- **WordPress**: 5.8 or higher
- **Composer**: For managing dependencies
- **Twilio SendGrid Account**: Free tier available (100 emails/day)
- **For Multi-Client Support**: SendGrid Pro plan or higher (starting at $89.95/month)

### Method 1: Upload to WordPress (Recommended)

1. Download the plugin ZIP file (includes all dependencies)
2. Log into your WordPress admin dashboard
3. Navigate to **Plugins → Add New → Upload Plugin**
4. Click "Choose File" and select the downloaded ZIP file
5. Click "Install Now"
6. After installation completes, click "Activate Plugin"

**Note**: The downloaded ZIP includes all Composer dependencies (SendGrid PHP library), so no additional installation steps are needed.

### Method 2: Manual Installation via FTP

1. Download/clone this repository
2. Run `composer install` in the plugin directory to install dependencies
3. Upload the entire `sendgrid-newsletter-pro` folder to `/wp-content/plugins/` via FTP
4. Log into WordPress admin
5. Navigate to **Plugins**
6. Find "SendGrid Newsletter Pro" and click "Activate"

### Method 3: Development Installation

For development and testing on Replit:

```bash
# Install dependencies
composer install

# Start the PHP server to view plugin documentation
php -S 0.0.0.0:5000
```

This will start a local documentation server showing plugin features and installation instructions.

## ⚙️ Configuration

### Step 1: Get SendGrid API Key

1. Log into your [Twilio account](https://www.twilio.com/)
2. Navigate to SendGrid from your Twilio console
3. Go to **Settings → API Keys**
4. Click "Create API Key"
5. Name it (e.g., "WordPress Newsletter")
6. Select **Full Access** or at minimum **Mail Send** permissions
7. Click "Create & View"
8. **Copy the API key immediately** (you won't be able to see it again!)

### Step 2: Configure Plugin

1. In WordPress admin, go to **Newsletter Pro → Settings**
2. Paste your SendGrid API Key in the appropriate field
3. Configure default settings:
   - **From Name**: Your organization name (e.g., "Education Center")
   - **From Email**: Your verified sender email
   - **Company Name**: Used in email templates
4. Click "Save Settings"
5. Use the "Send Test Email" button to verify configuration

**Important**: The From Email must be verified in your SendGrid account. Go to SendGrid Settings → Sender Authentication to verify your domain or email address.

### Step 3: Configure SendGrid Event Webhook (Required for Analytics)

To enable real-time tracking of opens, clicks, and bounces:

1. Log into your SendGrid account at https://app.sendgrid.com/
2. Navigate to **Settings → Mail Settings**
3. Click on **Event Webhook**
4. Enable the webhook and configure:
   - **HTTP POST URL**: Copy the webhook URL shown in your WordPress plugin settings page
   - **Select Event Types**: Enable these events:
     - Delivered
     - Opened
     - Clicked  
     - Bounced
     - Dropped
     - Unsubscribed
5. Click **Save**

The webhook URL will be something like: `https://yoursite.com/sgnp-webhook`

**Note**: Without the webhook configured, your analytics dashboard will not show opens, clicks, or other engagement metrics. The webhook allows SendGrid to send real-time event data back to your WordPress site.

### Step 4: Create SendGrid Dynamic Templates

Design your email templates directly in SendGrid's template builder:

1. **Access SendGrid Template Builder**:
   - Log into your SendGrid account at https://app.sendgrid.com/
   - Navigate to **Email API → Dynamic Templates**
   - Click "Create a Dynamic Template"

2. **Design Your Template**:
   - Give your template a name (e.g., "Monthly Newsletter")
   - Click "Add Version" and choose "Design Editor" or "Code Editor"
   - Use the drag-and-drop editor to design your email
   - Add dynamic content using handlebars syntax: `{{first_name}}`, `{{company_name}}`, etc.

3. **Available Dynamic Variables**:
   The plugin automatically provides these variables to your templates:
   - `{{first_name}}` - Subscriber's first name
   - `{{last_name}}` - Subscriber's last name
   - `{{email}}` - Subscriber's email address
   - `{{company_name}}` - Your company name (from settings)
   - `{{year}}` - Current year
   - `{{unsubscribe_url}}` - Automatic unsubscribe link

4. **Use Templates in WordPress**:
   - Once created in SendGrid, your templates automatically appear in WordPress
   - Go to **Newsletter Pro → Create Campaign**
   - Browse your SendGrid template gallery
   - Select a template and create your campaign

**Benefits of SendGrid Dynamic Templates**:
- ✨ **Drag-and-drop builder** - Design emails visually in SendGrid
- 🔄 **Automatic sync** - Templates appear instantly in WordPress
- 📱 **Mobile responsive** - Built-in mobile optimization
- 🎨 **Professional designs** - Use SendGrid's template library
- 🔒 **Centralized management** - Manage all templates in one place

## 📖 Usage Guide

### Creating Your First Newsletter Campaign

#### 1. Add Subscribers

**Manual Entry:**
- Go to **Newsletter Pro → Subscribers**
- Click "Add New"
- Enter email address, first name, and last name
- Click "Add Subscriber"

**CSV Import:**
- Prepare a CSV file with columns: `email`, `first_name`, `last_name`
- Go to **Newsletter Pro → Subscribers**
- Click "Import CSV"
- Select your CSV file and upload
- Review the import results

#### 2. Create Lists

- Go to **Newsletter Pro → Lists**
- Click "Add New"
- Enter list name (e.g., "Fall 2025 Students")
- Add description (optional)
- Click "Create List"

#### 3. Assign Subscribers to Lists

- Go to **Newsletter Pro → Subscribers**
- Edit a subscriber
- Check the boxes for the lists they should belong to
- Save changes

#### 4. Create a Campaign

- Go to **Newsletter Pro → Create Campaign**
- Fill in campaign details:
  - **Campaign Name**: Internal name for tracking
  - **Email Subject**: What subscribers will see
  - **From Name**: Sender name
  - **From Email**: Sender email address
  - **Reply To**: Where replies go (optional)

- Select a SendGrid template:
  - Browse your SendGrid Dynamic Templates
  - Click on a template to select it
  - Templates are fetched directly from your SendGrid account

- Select target lists:
  - Check the boxes for lists you want to send to
  - View subscriber counts for each list

- Actions:
  - **Send Test Email**: Send a test to your email with sample data
  - **Save Draft**: Save campaign for later
  - **Send Campaign**: Launch the campaign to all selected lists

#### 5. View Statistics

- Go to **Newsletter Pro → Dashboard** to see overview stats
- Go to **Newsletter Pro → Campaigns** to see individual campaign performance
- Click "Stats" on any sent campaign to view detailed metrics

## 🎨 SendGrid Dynamic Templates

This plugin uses SendGrid's Dynamic Template system for maximum flexibility and professional design.

### Creating Templates in SendGrid

1. **Log into SendGrid** at https://app.sendgrid.com/
2. **Navigate to** Email API → Dynamic Templates
3. **Create a new template** using SendGrid's drag-and-drop editor
4. **Add dynamic content** using handlebars variables
5. **Templates automatically sync** to your WordPress site

### Dynamic Variables

The plugin automatically provides these variables to all your SendGrid templates:

- `{{first_name}}` - Subscriber's first name
- `{{last_name}}` - Subscriber's last name
- `{{email}}` - Subscriber's email address
- `{{company_name}}` - Your company name from WordPress settings
- `{{year}}` - Current year
- `{{unsubscribe_url}}` - Automatic unsubscribe link (required)

### Example Template Code

```handlebars
<h1>Hello {{first_name}}!</h1>
<p>Thank you for being part of {{company_name}}.</p>
<p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>
```

### Benefits

- ✨ **Professional designs** - Use SendGrid's template library or create custom
- 🔄 **Centralized management** - Update templates in SendGrid, changes reflect everywhere
- 📱 **Mobile responsive** - Built-in optimization for all devices
- 🎨 **Visual editor** - Drag-and-drop interface, no coding required
- 🔒 **Version control** - SendGrid manages template versions automatically

## 📊 Understanding Analytics

### Dashboard Metrics

- **Total Campaigns**: All campaigns created
- **Sent Campaigns**: Campaigns that have been sent
- **Draft Campaigns**: Campaigns saved but not sent
- **Active Subscribers**: Currently subscribed contacts
- **Average Open Rate**: Percentage of recipients who opened emails
- **Average Click Rate**: Percentage of recipients who clicked links

### Campaign-Specific Metrics

- **Total Sent**: Number of emails delivered
- **Opens**: Unique recipients who opened the email
- **Clicks**: Unique recipients who clicked links
- **Bounces**: Emails that couldn't be delivered
- **Unsubscribes**: Recipients who opted out
- **Open Rate**: (Opens / Sent) × 100
- **Click Rate**: (Clicks / Sent) × 100

### Best Practices

- **Open Rate Benchmarks**: 15-25% is average for education sector
- **Click Rate Benchmarks**: 2-5% is typical
- **Send Time**: Test different days/times for your audience
- **Subject Lines**: Keep under 50 characters for mobile
- **Content**: Include clear call-to-action buttons

## 👥 Multi-Client Management (For Agencies)

This plugin includes powerful multi-client features designed for digital marketing agencies managing email campaigns for multiple clients.

### What is Multi-Client Support?

Multi-client support allows you to:
- Manage all clients from a single WordPress installation
- Automatically create SendGrid subusers for each client
- Keep each client's sending reputation isolated
- Track analytics separately for each client
- Assign dedicated API keys to each client

### How SendGrid Subusers Work

**SendGrid Subusers** are separate accounts under your main SendGrid account that allow you to:

1. **Isolated Sending Reputation**: If one client's emails bounce frequently, it doesn't affect your other clients
2. **Separate API Keys**: Each client gets their own API key for security
3. **Individual Analytics**: Track performance metrics separately for each client
4. **Dedicated Webhooks**: Route events to the correct client automatically

### Requirements for Multi-Client Support

- **SendGrid Essentials Plan or Higher**: $19/month
- **Up to 15 Subusers Included**: No additional cost per subuser
- **Separate Sending Limits**: Each subuser can have custom sending limits

### Setting Up Multi-Client Management

#### 1. Add a Client

1. Go to **Newsletter Pro → Clients**
2. Click "Add New"
3. Enter client name and email
4. Check "Create SendGrid subuser for this client"
5. Click "Add Client"

The plugin will automatically:
- Create a SendGrid subuser with a unique username
- Generate an API key for the subuser
- Store the credentials securely in WordPress

#### 2. Assign Campaigns to Clients

When creating or editing a campaign:
1. Go to **Newsletter Pro → Create Campaign**
2. In the Campaign Details section, select a client from the dropdown
3. The campaign will automatically use that client's subuser API key when sending

#### 3. View Client-Specific Data

- **Campaigns Page**: Filter campaigns by client
- **Analytics**: View stats for specific clients
- **Client Management**: View all clients and their subuser status

### Benefits for Agency Workflow

**For Your Agency:**
- Central management of all clients
- One WordPress installation handles everything
- Easy onboarding of new clients
- Clear separation of client data
- Professional client management

**For Your Clients:**
- Isolated sending reputation
- Dedicated API credentials
- Independent analytics
- No cross-contamination with other clients

### Best Practices

1. **Always Create Subusers**: Use subusers for every client to maintain separation
2. **Name Clearly**: Use descriptive client names for easy identification
3. **Monitor Separately**: Check each client's analytics independently
4. **Regular Reviews**: Review client sending patterns to optimize deliverability

### Pricing Model for Agencies

With this multi-client system, you can:

- **Charge Per Client**: Monthly management fee per client
- **Include SendGrid Costs**: Roll SendGrid costs into your service fee
- **Tiered Pricing**: Different tiers based on email volume
- **White-Label**: Your branding, SendGrid infrastructure

**Example Pricing:**
- Your Cost: $19/month SendGrid Essentials (covers up to 15 clients)
- Your Service: $50-150/month per client for newsletter management
- Your Profit: $31-131/month per client after SendGrid costs

## 💼 Offering as a Service

This plugin is designed to be offered to adult education clients in three ways:

### 1. Standalone Plugin
- Sell the plugin as a one-time installation
- Charge for setup and configuration
- Provide initial training

### 2. Service Package
- Bundle with website maintenance
- Include monthly email campaign management
- Offer analytics reporting

### 3. Managed Service
- Handle all SendGrid account setup
- Create email templates for client
- Manage subscriber lists
- Design and send campaigns on client's behalf
- Provide monthly performance reports

### Pricing Considerations

**Client Costs:**
- SendGrid Free Tier: 100 emails/day (suitable for small organizations)
- SendGrid Essentials: Starting at $19.95/month for higher volumes
- Your service fee for setup, training, and management

**Value Proposition:**
- Professional email marketing without expensive platforms
- Full control and ownership of subscriber data
- Integration with existing WordPress website
- Expert support and campaign management

## 🔧 Technical Details

### Database Structure

The plugin creates the following database tables:

- `wp_sgnp_subscribers` - Subscriber information
- `wp_sgnp_lists` - List definitions
- `wp_sgnp_subscriber_lists` - List memberships
- `wp_sgnp_campaigns` - Campaign data
- `wp_sgnp_campaign_lists` - Campaign targeting
- `wp_sgnp_templates` - Email templates
- `wp_sgnp_email_events` - Event tracking

### File Structure

```
sendgrid-newsletter-pro/
├── admin/                    # Admin interface templates
│   ├── dashboard.php         # Main dashboard
│   ├── campaigns.php         # Campaign listing
│   ├── create-campaign.php   # Campaign builder
│   ├── subscribers.php       # Subscriber management
│   ├── lists.php             # List management
│   ├── templates.php         # Template library
│   └── settings.php          # Plugin settings
├── assets/
│   ├── css/
│   │   └── admin.css         # Admin styling
│   └── js/
│       └── admin.js          # Admin JavaScript
├── includes/                 # Core classes
│   ├── class-sgnp-activator.php      # Activation handler
│   ├── class-sgnp-deactivator.php    # Deactivation handler
│   ├── class-sgnp-admin.php          # Admin interface
│   ├── class-sgnp-database.php       # Database helpers
│   ├── class-sgnp-sendgrid-api.php   # SendGrid integration
│   ├── class-sgnp-subscriber.php     # Subscriber management
│   ├── class-sgnp-list.php           # List management
│   ├── class-sgnp-campaign.php       # Campaign management
│   ├── class-sgnp-template.php       # Template management
│   └── class-sgnp-statistics.php     # Analytics
├── scripts/
│   └── setup-wordpress.sh    # WordPress dev environment setup
├── vendor/                   # Composer dependencies
├── composer.json             # Dependency configuration
├── index.php                 # Documentation page
├── sendgrid-newsletter-pro.php  # Main plugin file
└── README.md                 # This file
```

### Security Features

- **Nonce Verification**: All forms protected with WordPress nonces
- **Capability Checks**: Admin-only access to plugin features
- **SQL Injection Protection**: Prepared statements for all database queries
- **XSS Prevention**: Output escaping on all user-generated content
- **API Key Security**: Keys stored in WordPress options (encrypted in production)

### Performance Considerations

- **Lazy Loading**: Subscribers loaded on demand
- **Batch Processing**: Campaigns sent in batches to avoid timeouts
- **Database Indexing**: Optimized indexes for quick lookups
- **Caching**: Statistics cached to reduce database queries

## 🤝 Support & Troubleshooting

### Common Issues

**Problem**: "SendGrid API key not configured"
- **Solution**: Go to Settings and add your SendGrid API key from Twilio account

**Problem**: Emails not being delivered
- **Solution**: Verify your sender email address in SendGrid Sender Authentication

**Problem**: Low open rates
- **Solution**: Check spam score, improve subject lines, verify subscriber engagement

**Problem**: CSV import not working
- **Solution**: Ensure CSV has headers: `email`, `first_name`, `last_name`

### Getting Help

1. Check SendGrid API documentation: https://docs.sendgrid.com/
2. Review WordPress plugin development best practices
3. Verify PHP error logs in WordPress debug mode
4. Check browser console for JavaScript errors

### SendGrid Resources

- **Dashboard**: https://app.sendgrid.com/
- **API Documentation**: https://docs.sendgrid.com/api-reference
- **Sender Authentication**: https://app.sendgrid.com/settings/sender_auth
- **Support**: Access through Twilio account

## 📄 License

GPL v2 or later - https://www.gnu.org/licenses/gpl-2.0.html

This plugin is free to use, modify, and distribute under the GPL license.

## 🎯 Roadmap

Potential future enhancements:

- **A/B Testing**: Test different subject lines and content
- **Automation**: Automated welcome emails and drip campaigns
- **Advanced Segmentation**: Filter subscribers by custom fields
- **Custom Templates**: Visual template builder
- **Integration APIs**: Connect with CRM systems
- **Scheduled Sending**: Schedule campaigns for future dates
- **SMS Integration**: Add Twilio SMS capabilities

## 👨‍💻 For Developers

### Development Setup

1. Clone this repository
2. Run `composer install`
3. (Optional) Run `./scripts/setup-wordpress.sh` to set up local WordPress environment
4. Activate plugin in WordPress admin

### Contributing

Contributions are welcome! Areas for improvement:

- Additional email templates
- Better mobile responsiveness
- Advanced analytics features
- Integration with popular form builders
- Multi-language support

### Hooks & Filters

The plugin provides hooks for customization:

```php
// Modify email content before sending
add_filter('sgnp_email_content', function($content, $campaign_id) {
    // Custom logic
    return $content;
}, 10, 2);

// Custom subscriber validation
add_filter('sgnp_validate_subscriber', function($is_valid, $email) {
    // Custom validation
    return $is_valid;
}, 10, 2);
```

## 🗺️ Development Roadmap

### Phase 1: Individual Plugin Deployment ✅ **COMPLETE**
**Current Status**: Production-ready WordPress plugin

**What's Included:**
- ✅ Full SendGrid API integration with webhooks
- ✅ SendGrid Dynamic Templates integration
- ✅ Campaign creation and management
- ✅ Subscriber and list management
- ✅ Real-time analytics dashboard
- ✅ Drag-and-drop email builder (via SendGrid)

**Deployment Model**: Install individually on each client's WordPress site

---

### Phase 2: Multi-Client Dashboard (Next 3-6 Months)
**Goal**: Centralized management for all clients (Campaign Monitor-style)

**Planned Features:**
- 🔄 REST API endpoints in plugin for remote access
- 🔄 Central web dashboard for agency management
- 🔄 Client switcher dropdown (manage multiple clients from one view)
- 🔄 Aggregate analytics across all client accounts
- 🔄 SendGrid subaccounts for per-client isolation
- 🔄 Unified campaign overview and reporting

**Target Architecture**: 
- Option A: WordPress Multisite network with network admin access
- Option B: Standalone web app consuming plugin APIs from all client sites

**SendGrid Strategy**: Subaccount per client for isolated sender reputation and separate analytics

---

### Phase 3: Full SaaS Platform (Future)
**Goal**: Scale beyond agency clients to public offering

**Potential Features:**
- 💡 Subscription billing system (Stripe integration)
- 💡 Public signup and self-service onboarding
- 💡 White-label branding options
- 💡 Tiered pricing plans
- 💡 Support for non-WordPress clients
- 💡 Advanced automation workflows

---

## 🙏 Acknowledgments

- Built with [SendGrid PHP Library](https://github.com/sendgrid/sendgrid-php)
- Powered by [Twilio SendGrid](https://sendgrid.com/)
- Uses SendGrid's Dynamic Template system for email design
- Created for adult education organizations

---

**Version**: 1.0.0  
**Author**: Your Name  
**Last Updated**: October 30, 2025

For questions or support, please contact your WordPress administrator or SendGrid support through your Twilio account.
