<?php
if (!defined('ABSPATH')) {
    exit;
}

// Get current client filter
$current_client_id = SGNP_Admin::get_current_client_id();

// Get drafts and sent campaigns separately
$drafts = SGNP_Database::get_campaigns([
    'status' => 'draft',
    'client_id' => $current_client_id ?: null,
    'limit' => 5
]);

$sent = SGNP_Database::get_campaigns([
    'status' => 'sent',
    'client_id' => $current_client_id ?: null,
    'limit' => 5
]);

$total_drafts = SGNP_Database::count_campaigns('draft', $current_client_id ?: null);
$total_sent = SGNP_Database::count_campaigns('sent', $current_client_id ?: null);
?>

<div class="wrap sgnp-plugin-page">
    <div class="sgnp-campaigns-header">
        <div>
            <h1 class="wp-heading-inline">It's a great day to send</h1>
            <?php if ($total_drafts > 0): ?>
                <p class="description">You have <?php echo $total_drafts; ?> draft campaign<?php echo $total_drafts !== 1 ? 's' : ''; ?> in progress.</p>
            <?php endif; ?>
        </div>
        <div class="sgnp-header-actions">
            <?php 
            $admin = new SGNP_Admin();
            $admin->render_client_selector(); 
            ?>
            <a href="<?php echo admin_url('admin.php?page=sgnp-create-campaign'); ?>" class="button button-primary">Create</a>
        </div>
    </div>
    
    <?php settings_errors('sgnp_messages'); ?>
    
    <!-- Drafts Section -->
    <div class="sgnp-campaigns-section">
        <div class="sgnp-section-header">
            <h2>Drafts</h2>
            <?php if ($total_drafts > 5): ?>
                <a href="<?php echo admin_url('admin.php?page=sgnp-campaigns&status=draft'); ?>" class="sgnp-see-all">See all draft campaigns</a>
            <?php endif; ?>
        </div>
        
        <?php if (empty($drafts)): ?>
            <div class="sgnp-empty-state">
                <p>No draft campaigns. <a href="<?php echo admin_url('admin.php?page=sgnp-create-campaign'); ?>">Create your first campaign</a></p>
            </div>
        <?php else: ?>
            <div class="sgnp-campaign-cards">
                <?php foreach ($drafts as $campaign): ?>
                    <div class="sgnp-campaign-card">
                        <div class="sgnp-campaign-preview">
                            <span class="dashicons dashicons-email-alt"></span>
                        </div>
                        <div class="sgnp-campaign-info">
                            <h3>
                                <a href="<?php echo admin_url('admin.php?page=sgnp-create-campaign&id=' . $campaign->id); ?>">
                                    <?php echo esc_html($campaign->name); ?>
                                </a>
                            </h3>
                            <p class="sgnp-campaign-meta">Last edited <?php echo human_time_diff(strtotime($campaign->created_date), current_time('timestamp')); ?> ago</p>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
    
    <!-- Sent Section -->
    <div class="sgnp-campaigns-section">
        <div class="sgnp-section-header">
            <h2>Sent</h2>
            <?php if ($total_sent > 5): ?>
                <a href="<?php echo admin_url('admin.php?page=sgnp-campaigns&status=sent'); ?>" class="sgnp-see-all">See all sent campaigns</a>
            <?php endif; ?>
        </div>
        
        <?php if (empty($sent)): ?>
            <div class="sgnp-empty-state">
                <p>No campaigns sent yet.</p>
            </div>
        <?php else: ?>
            <div class="sgnp-campaign-cards">
                <?php foreach ($sent as $campaign): ?>
                    <?php
                    $open_rate = $campaign->total_sent > 0 ? round(($campaign->total_opens / $campaign->total_sent) * 100, 1) : 0;
                    $click_rate = $campaign->total_sent > 0 ? round(($campaign->total_clicks / $campaign->total_sent) * 100, 1) : 0;
                    ?>
                    <div class="sgnp-campaign-card sgnp-campaign-sent">
                        <div class="sgnp-campaign-preview">
                            <span class="dashicons dashicons-email-alt"></span>
                        </div>
                        <div class="sgnp-campaign-info">
                            <h3>
                                <a href="<?php echo admin_url('admin.php?page=sgnp-campaign-stats&id=' . $campaign->id); ?>">
                                    <?php echo esc_html($campaign->name); ?>
                                </a>
                            </h3>
                            <p class="sgnp-campaign-meta">
                                Sent <?php echo human_time_diff(strtotime($campaign->sent_date), current_time('timestamp')); ?> ago
                            </p>
                            <div class="sgnp-campaign-stats">
                                <div class="sgnp-stat-item">
                                    <span class="sgnp-stat-label">Recipients</span>
                                    <span class="sgnp-stat-value"><?php echo number_format($campaign->total_sent); ?></span>
                                </div>
                                <div class="sgnp-stat-item">
                                    <span class="sgnp-stat-label">Opened</span>
                                    <span class="sgnp-stat-value"><?php echo $open_rate; ?>%</span>
                                </div>
                                <div class="sgnp-stat-item">
                                    <span class="sgnp-stat-label">Clicked</span>
                                    <span class="sgnp-stat-value"><?php echo $click_rate; ?>%</span>
                                </div>
                            </div>
                        </div>
                        <div class="sgnp-campaign-actions">
                            <button class="button button-small sgnp-delete-campaign" data-id="<?php echo $campaign->id; ?>">Delete</button>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</div>
