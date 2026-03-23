<?php
if (!defined('ABSPATH')) {
    exit;
}

$stats = SGNP_Statistics::get_overview_stats();
$recent_campaigns = SGNP_Database::get_campaigns(['limit' => 5]);
?>

<div class="wrap sgnp-plugin-page sgnp-dashboard">
    <h1>Newsletter Pro Dashboard</h1>
    
    <?php settings_errors('sgnp_messages'); ?>
    
    <div class="sgnp-stats-grid">
        <div class="sgnp-stat-card">
            <div class="sgnp-stat-icon">
                <span class="dashicons dashicons-email-alt"></span>
            </div>
            <div class="sgnp-stat-content">
                <h3><?php echo number_format($stats['total_campaigns']); ?></h3>
                <p>Total Campaigns</p>
                <small><?php echo number_format($stats['sent_campaigns']); ?> sent, <?php echo number_format($stats['draft_campaigns']); ?> drafts</small>
            </div>
        </div>
        
        <div class="sgnp-stat-card">
            <div class="sgnp-stat-icon">
                <span class="dashicons dashicons-groups"></span>
            </div>
            <div class="sgnp-stat-content">
                <h3><?php echo number_format($stats['total_subscribers']); ?></h3>
                <p>Active Subscribers</p>
                <small><?php echo number_format($stats['unsubscribed']); ?> unsubscribed</small>
            </div>
        </div>
        
        <div class="sgnp-stat-card">
            <div class="sgnp-stat-icon">
                <span class="dashicons dashicons-visibility"></span>
            </div>
            <div class="sgnp-stat-content">
                <h3><?php echo $stats['avg_open_rate']; ?>%</h3>
                <p>Average Open Rate</p>
                <small><?php echo number_format($stats['total_opens']); ?> total opens</small>
            </div>
        </div>
        
        <div class="sgnp-stat-card">
            <div class="sgnp-stat-icon">
                <span class="dashicons dashicons-admin-links"></span>
            </div>
            <div class="sgnp-stat-content">
                <h3><?php echo $stats['avg_click_rate']; ?>%</h3>
                <p>Average Click Rate</p>
                <small><?php echo number_format($stats['total_clicks']); ?> total clicks</small>
            </div>
        </div>
    </div>
    
    <div class="sgnp-content-grid">
        <div class="sgnp-panel">
            <div class="sgnp-panel-header">
                <h2>Recent Campaigns</h2>
                <a href="<?php echo admin_url('admin.php?page=sgnp-campaigns'); ?>" class="button">View All</a>
            </div>
            <div class="sgnp-panel-body">
                <?php if (empty($recent_campaigns)): ?>
                    <p class="sgnp-empty-state">
                        No campaigns yet. <a href="<?php echo admin_url('admin.php?page=sgnp-create-campaign'); ?>">Create your first campaign</a>
                    </p>
                <?php else: ?>
                    <table class="widefat">
                        <thead>
                            <tr>
                                <th>Campaign Name</th>
                                <th>Status</th>
                                <th>Sent</th>
                                <th>Opens</th>
                                <th>Clicks</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($recent_campaigns as $campaign): ?>
                                <tr>
                                    <td>
                                        <strong>
                                            <a href="<?php echo admin_url('admin.php?page=sgnp-create-campaign&id=' . $campaign->id); ?>">
                                                <?php echo esc_html($campaign->name); ?>
                                            </a>
                                        </strong>
                                    </td>
                                    <td>
                                        <span class="sgnp-badge sgnp-badge-<?php echo esc_attr($campaign->status); ?>">
                                            <?php echo esc_html(ucfirst($campaign->status)); ?>
                                        </span>
                                    </td>
                                    <td><?php echo number_format($campaign->total_sent); ?></td>
                                    <td><?php echo number_format($campaign->total_opens); ?></td>
                                    <td><?php echo number_format($campaign->total_clicks); ?></td>
                                    <td><?php echo date('M j, Y', strtotime($campaign->created_date)); ?></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php endif; ?>
            </div>
        </div>
        
        <div class="sgnp-panel">
            <div class="sgnp-panel-header">
                <h2>Quick Actions</h2>
            </div>
            <div class="sgnp-panel-body">
                <div class="sgnp-quick-actions">
                    <a href="<?php echo admin_url('admin.php?page=sgnp-create-campaign'); ?>" class="sgnp-action-card">
                        <span class="dashicons dashicons-plus-alt"></span>
                        <h3>Create Campaign</h3>
                        <p>Start a new email campaign</p>
                    </a>
                    
                    <a href="<?php echo admin_url('admin.php?page=sgnp-subscribers'); ?>" class="sgnp-action-card">
                        <span class="dashicons dashicons-admin-users"></span>
                        <h3>Manage Subscribers</h3>
                        <p>View and edit subscribers</p>
                    </a>
                    
                    <a href="<?php echo admin_url('admin.php?page=sgnp-lists'); ?>" class="sgnp-action-card">
                        <span class="dashicons dashicons-list-view"></span>
                        <h3>Manage Lists</h3>
                        <p>Organize your subscribers</p>
                    </a>
                    
                    <a href="<?php echo admin_url('admin.php?page=sgnp-settings'); ?>" class="sgnp-action-card">
                        <span class="dashicons dashicons-admin-settings"></span>
                        <h3>Settings</h3>
                        <p>Configure SendGrid API</p>
                    </a>
                </div>
            </div>
        </div>
    </div>
    
    <?php
    $api = new SGNP_SendGrid_API();
    if (!$api->is_configured()):
    ?>
    <div class="notice notice-warning">
        <p>
            <strong>SendGrid API not configured!</strong> 
            Please <a href="<?php echo admin_url('admin.php?page=sgnp-settings'); ?>">configure your SendGrid API key</a> to start sending campaigns.
        </p>
    </div>
    <?php endif; ?>
</div>
