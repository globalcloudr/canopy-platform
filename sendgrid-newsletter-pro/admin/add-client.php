<?php
if (!defined('ABSPATH')) {
    exit;
}

$api = new SGNP_SendGrid_API();
$is_configured = $api->is_configured();
?>

<div class="wrap sgnp-plugin-page">
    <h1>Add New Client</h1>
    
    <?php settings_errors('sgnp_messages'); ?>
    
    <?php if (!$is_configured): ?>
        <div class="notice notice-warning inline">
            <p>
                <strong>SendGrid API not configured!</strong> 
                Please <a href="<?php echo admin_url('admin.php?page=sgnp-settings'); ?>">configure your SendGrid API key</a> 
                before adding clients with subusers.
            </p>
        </div>
    <?php endif; ?>
    
    <form method="post" action="">
        <?php wp_nonce_field('sgnp_add_client'); ?>
        
        <table class="form-table">
            <tr>
                <th scope="row">
                    <label for="client_name">Client Name *</label>
                </th>
                <td>
                    <input type="text" 
                           id="client_name" 
                           name="client_name" 
                           class="regular-text" 
                           required
                           placeholder="e.g., Acme Corporation">
                    <p class="description">The name of your client or their organization.</p>
                </td>
            </tr>
            
            <tr>
                <th scope="row">
                    <label for="client_email">Client Email *</label>
                </th>
                <td>
                    <input type="email" 
                           id="client_email" 
                           name="client_email" 
                           class="regular-text" 
                           required
                           placeholder="client@example.com">
                    <p class="description">The primary contact email for this client.</p>
                </td>
            </tr>
            
            <tr>
                <th scope="row">
                    <label for="create_subuser">SendGrid Subuser</label>
                </th>
                <td>
                    <label>
                        <input type="checkbox" 
                               id="create_subuser" 
                               name="create_subuser" 
                               value="1"
                               <?php echo !$is_configured ? 'disabled' : ''; ?>>
                        Create SendGrid subuser for this client
                    </label>
                    <p class="description">
                        <?php if ($is_configured): ?>
                            <strong>Recommended for agencies:</strong> This will automatically create a SendGrid subuser 
                            with isolated sending reputation and dedicated API key. 
                            <strong>Requires a paid SendGrid account (Pro plan or higher).</strong>
                        <?php else: ?>
                            Configure SendGrid API key first to enable subuser creation.
                        <?php endif; ?>
                    </p>
                </td>
            </tr>
        </table>
        
        <p class="submit">
            <input type="submit" 
                   name="sgnp_add_client" 
                   class="button button-primary" 
                   value="Add Client">
            <a href="<?php echo admin_url('admin.php?page=sgnp-clients'); ?>" 
               class="button">Cancel</a>
        </p>
    </form>
    
    <div class="notice notice-info inline">
        <h3>What is a SendGrid Subuser?</h3>
        <p>
            Subusers allow you to segment your email sending for different clients. Each subuser gets:
        </p>
        <ul style="list-style: disc; margin-left: 20px;">
            <li><strong>Isolated sending reputation</strong> - One client's bounces don't affect others</li>
            <li><strong>Separate API key</strong> - Enhanced security and access control</li>
            <li><strong>Individual analytics</strong> - Track each client's performance separately</li>
            <li><strong>Dedicated webhooks</strong> - Route events to the right client</li>
        </ul>
        <p>
            <strong>Requirements:</strong> SendGrid Pro plan or higher (starting at $89.95/month).
        </p>
    </div>
</div>
