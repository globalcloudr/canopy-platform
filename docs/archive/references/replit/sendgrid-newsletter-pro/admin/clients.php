<?php
if (!defined('ABSPATH')) {
    exit;
}

$clients = SGNP_Client::get_all();
$client_count = SGNP_Client::count();
?>

<div class="wrap sgnp-plugin-page">
    <h1 class="wp-heading-inline">Clients</h1>
    <a href="<?php echo admin_url('admin.php?page=sgnp-add-client'); ?>" class="page-title-action">Add New</a>
    
    <?php settings_errors('sgnp_messages'); ?>
    
    <p class="description">
        Manage your clients and their SendGrid subusers. Each client can have their own isolated sending reputation and analytics.
    </p>
    
    <div class="sgnp-stats-grid" style="margin: 20px 0;">
        <div class="sgnp-stat-card">
            <h3>Total Clients</h3>
            <p class="sgnp-stat-number"><?php echo $client_count; ?></p>
        </div>
        <div class="sgnp-stat-card">
            <h3>With Subusers</h3>
            <p class="sgnp-stat-number">
                <?php 
                $with_subusers = 0;
                foreach ($clients as $client) {
                    if (!empty($client->subuser_username)) $with_subusers++;
                }
                echo $with_subusers;
                ?>
            </p>
        </div>
    </div>
    
    <?php if (empty($clients)): ?>
        <div class="notice notice-info inline">
            <p>
                <strong>No clients yet!</strong> 
                <a href="<?php echo admin_url('admin.php?page=sgnp-add-client'); ?>">Add your first client</a> to get started with multi-client management.
            </p>
        </div>
    <?php else: ?>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Client Name</th>
                    <th>Email</th>
                    <th>Subuser</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($clients as $client): ?>
                    <tr>
                        <td><strong><?php echo esc_html($client->name); ?></strong></td>
                        <td><?php echo esc_html($client->email); ?></td>
                        <td>
                            <?php if (!empty($client->subuser_username)): ?>
                                <span class="dashicons dashicons-yes-alt" style="color: #46b450;"></span>
                                <?php echo esc_html($client->subuser_username); ?>
                            <?php else: ?>
                                <span style="color: #999;">No subuser</span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <?php if ($client->status === 'active'): ?>
                                <span class="sgnp-status-active">Active</span>
                            <?php else: ?>
                                <span class="sgnp-status-inactive">Inactive</span>
                            <?php endif; ?>
                        </td>
                        <td><?php echo date('M j, Y', strtotime($client->created_date)); ?></td>
                        <td>
                            <a href="<?php echo admin_url('admin.php?page=sgnp-campaigns&client_id=' . $client->id); ?>" 
                               class="button button-small">
                                View Campaigns
                            </a>
                            <button class="button button-small button-link-delete sgnp-delete-client" 
                                    data-client-id="<?php echo $client->id; ?>"
                                    data-client-name="<?php echo esc_attr($client->name); ?>">
                                Delete
                            </button>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>
</div>

<script>
jQuery(document).ready(function($) {
    $('.sgnp-delete-client').on('click', function() {
        var clientId = $(this).data('client-id');
        var clientName = $(this).data('client-name');
        
        if (!confirm('Are you sure you want to delete client "' + clientName + '"? This cannot be undone.')) {
            return;
        }
        
        $.ajax({
            url: sgnpAdmin.ajaxUrl,
            type: 'POST',
            data: {
                action: 'sgnp_delete_client',
                nonce: sgnpAdmin.nonce,
                client_id: clientId
            },
            success: function(response) {
                if (response.success) {
                    location.reload();
                } else {
                    alert('Error: ' + (response.data.message || 'Failed to delete client'));
                }
            },
            error: function() {
                alert('An error occurred while deleting the client');
            }
        });
    });
});
</script>
