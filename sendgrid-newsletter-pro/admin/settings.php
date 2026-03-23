<?php
if (!defined('ABSPATH')) {
    exit;
}

$api_key = get_option('sgnp_sendgrid_api_key', '');
$from_email = get_option('sgnp_from_email', get_bloginfo('admin_email'));
$from_name = get_option('sgnp_from_name', get_bloginfo('name'));
$company_name = get_option('sgnp_company_name', get_bloginfo('name'));

$api = new SGNP_SendGrid_API();
$is_configured = $api->is_configured();
?>

<div class="wrap sgnp-plugin-page">
    <h1>Newsletter Pro Settings</h1>
    
    <?php settings_errors('sgnp_messages'); ?>
    
    <form method="post">
        <?php wp_nonce_field('sgnp_settings'); ?>
        
        <div class="sgnp-settings-grid">
            <div class="sgnp-panel">
                <h2>SendGrid API Configuration</h2>
                
                <?php if ($is_configured): ?>
                    <div class="notice notice-success inline">
                        <p><strong>API Key is configured!</strong> Your plugin is ready to send emails.</p>
                    </div>
                <?php else: ?>
                    <div class="notice notice-warning inline">
                        <p><strong>API Key not configured.</strong> You need to configure your SendGrid API key to send campaigns.</p>
                    </div>
                <?php endif; ?>
                
                <table class="form-table">
                    <tr>
                        <th><label for="sendgrid_api_key">SendGrid API Key</label></th>
                        <td>
                            <input type="password" name="sendgrid_api_key" id="sendgrid_api_key" 
                                   class="regular-text" value="<?php echo esc_attr($api_key); ?>" autocomplete="off">
                            <p class="description">
                                Get your API key from <a href="https://app.sendgrid.com/settings/api_keys" target="_blank">SendGrid Dashboard</a>. 
                                You can access this through your Twilio account.
                            </p>
                        </td>
                    </tr>
                </table>
                
                <h3>How to get your SendGrid API Key:</h3>
                <ol>
                    <li>Log into your <a href="https://www.twilio.com/" target="_blank">Twilio account</a></li>
                    <li>Navigate to SendGrid from your Twilio console</li>
                    <li>Go to Settings → API Keys</li>
                    <li>Click "Create API Key"</li>
                    <li>Give it a name (e.g., "WordPress Newsletter")</li>
                    <li>Select "Full Access" or at minimum "Mail Send" permissions</li>
                    <li>Copy the API key and paste it above</li>
                </ol>
                
                <h3>Configure SendGrid Event Webhooks for Analytics:</h3>
                <p>To track opens, clicks, and bounces, configure a webhook in SendGrid:</p>
                
                <p><strong>Basic Setup (No Security):</strong></p>
                <ol>
                    <li>Go to <a href="https://app.sendgrid.com/settings/mail_settings" target="_blank">SendGrid Mail Settings</a></li>
                    <li>Click on "Event Webhook"</li>
                    <li>Set the HTTP POST URL to: <code><?php echo esc_html(SGNP_Webhook::get_webhook_url()); ?></code></li>
                    <li>Select these event types: Delivered, Opened, Clicked, Bounced, Dropped, Unsubscribed</li>
                    <li>Click "Enable" and "Save"</li>
                </ol>
                
                <p><strong>OR with Secret-Based Security:</strong></p>
                <ol>
                    <li>Use this URL instead: <code><?php echo esc_html(SGNP_Webhook::get_webhook_url(true)); ?></code></li>
                    <li>This includes your webhook secret for basic verification</li>
                </ol>
                
                <p class="description">The basic setup works immediately. For enhanced security, enable Signed Event Webhook below or use the secret-based URL.</p>
                
                <h3>Webhook Security (Optional):</h3>
                <table class="form-table">
                    <tr>
                        <th><label for="webhook_secret">Webhook Secret (Optional)</label></th>
                        <td>
                            <input type="text" name="webhook_secret" id="webhook_secret" 
                                   class="regular-text" value="<?php echo esc_attr(get_option('sgnp_sendgrid_webhook_secret', '')); ?>" placeholder="Leave empty or enter a random string">
                            <p class="description">
                                Optional: Enter a random secret and use the secret-based webhook URL above.<br>
                                If empty, webhook accepts all requests (less secure but easier to set up).
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th><label for="webhook_public_key">SendGrid Public Key (Recommended)</label></th>
                        <td>
                            <textarea name="webhook_public_key" id="webhook_public_key" class="large-text" rows="4" placeholder="Paste your SendGrid Event Webhook public key here"><?php echo esc_textarea(get_option('sgnp_sendgrid_webhook_public_key', '')); ?></textarea>
                            <p class="description">
                                <strong>Recommended:</strong> Enable "Signed Event Webhook" in SendGrid for best security:<br>
                                1. Go to SendGrid → Settings → Mail Settings → Event Webhook<br>
                                2. Click "Security features" → Enable "Signed Event Webhook"<br>
                                3. Copy the public key and paste it here<br>
                                This provides cryptographic verification that webhooks come from SendGrid.
                            </p>
                        </td>
                    </tr>
                </table>
            </div>
            
            <div class="sgnp-panel">
            <h2>Email Settings</h2>
                
                <table class="form-table">
                    <tr>
                        <th><label for="from_name">Default From Name</label></th>
                        <td>
                            <input type="text" name="from_name" id="from_name" 
                                   class="regular-text" value="<?php echo esc_attr($from_name); ?>">
                            <p class="description">The name that appears in the "From" field</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <th><label for="from_email">Default From Email</label></th>
                        <td>
                            <input type="email" name="from_email" id="from_email" 
                                   class="regular-text" value="<?php echo esc_attr($from_email); ?>">
                            <p class="description">
                                The email address that appears in the "From" field. 
                                <strong>Important:</strong> This email must be verified in your SendGrid account.
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <th><label for="company_name">Company Name</label></th>
                        <td>
                            <input type="text" name="company_name" id="company_name" 
                                   class="regular-text" value="<?php echo esc_attr($company_name); ?>">
                            <p class="description">Used in email templates and footer</p>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        
        <p class="submit">
            <button type="submit" name="sgnp_save_settings" class="button button-primary button-large">Save Settings</button>
        </p>
    </form>
    
    <?php if ($is_configured): ?>
    <div class="sgnp-panel">
        <h2>Test Your Configuration</h2>
        <p>Send a test email to verify that your SendGrid API is working correctly.</p>
        
        <div id="sgnp-test-config">
            <input type="email" id="test-config-email" placeholder="your@email.com" class="regular-text">
            <button type="button" class="button" id="sgnp-test-config-btn">Send Test Email</button>
        </div>
        
        <div id="sgnp-test-result" style="margin-top: 15px;"></div>
    </div>
    <?php endif; ?>
    
    <div class="sgnp-panel">
        <h2>Plugin Information</h2>
        <table class="widefat">
            <tr>
                <th>Plugin Version:</th>
                <td><?php echo SGNP_VERSION; ?></td>
            </tr>
            <tr>
                <th>PHP Version:</th>
                <td><?php echo PHP_VERSION; ?></td>
            </tr>
            <tr>
                <th>WordPress Version:</th>
                <td><?php echo get_bloginfo('version'); ?></td>
            </tr>
            <tr>
                <th>Total Subscribers:</th>
                <td><?php echo number_format(SGNP_Database::count_subscribers('all')); ?></td>
            </tr>
            <tr>
                <th>Total Campaigns:</th>
                <td><?php echo number_format(SGNP_Database::count_campaigns('all')); ?></td>
            </tr>
        </table>
    </div>
</div>
