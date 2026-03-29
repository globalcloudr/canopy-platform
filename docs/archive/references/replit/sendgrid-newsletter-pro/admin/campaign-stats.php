<?php
if (!defined('ABSPATH')) {
    exit;
}

$campaign_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if (!$campaign_id) {
    wp_die('Invalid campaign ID');
}

$stats = SGNP_Statistics::get_campaign_stats($campaign_id);

if (!$stats) {
    wp_die('Campaign not found');
}

// Get detailed event breakdown
global $wpdb;
$events_table = $wpdb->prefix . 'sgnp_email_events';

$recent_events = $wpdb->get_results($wpdb->prepare(
    "SELECT e.*, s.email, s.first_name, s.last_name 
     FROM $events_table e
     LEFT JOIN {$wpdb->prefix}sgnp_subscribers s ON e.subscriber_id = s.id
     WHERE e.campaign_id = %d
     ORDER BY e.event_date DESC
     LIMIT 50",
    $campaign_id
));
?>

<div class="wrap sgnp-plugin-page">
    <h1><?php echo esc_html($stats['campaign_name']); ?> - Statistics</h1>
    <a href="<?php echo admin_url('admin.php?page=sgnp-campaigns'); ?>" class="button">&larr; Back to Campaigns</a>
    
    <div class="sgnp-stats-grid" style="margin-top: 20px;">
        <div class="sgnp-card">
            <h3>📧 Sent</h3>
            <div class="sgnp-stat-number"><?php echo number_format($stats['total_sent']); ?></div>
            <small>Total emails sent</small>
        </div>
        
        <div class="sgnp-card">
            <h3>✅ Delivered</h3>
            <div class="sgnp-stat-number"><?php echo number_format($stats['total_delivered']); ?></div>
            <small><?php echo $stats['total_sent'] > 0 ? round(($stats['total_delivered'] / $stats['total_sent']) * 100, 1) : 0; ?>% delivery rate</small>
        </div>
        
        <div class="sgnp-card">
            <h3>👁️ Opens</h3>
            <div class="sgnp-stat-number"><?php echo number_format($stats['total_opens']); ?></div>
            <small><?php echo $stats['open_rate']; ?>% open rate</small>
        </div>
        
        <div class="sgnp-card">
            <h3>🖱️ Clicks</h3>
            <div class="sgnp-stat-number"><?php echo number_format($stats['total_clicks']); ?></div>
            <small><?php echo $stats['click_rate']; ?>% click rate</small>
        </div>
        
        <div class="sgnp-card">
            <h3>⚠️ Bounces</h3>
            <div class="sgnp-stat-number"><?php echo number_format($stats['total_bounces']); ?></div>
            <small><?php echo $stats['bounce_rate']; ?>% bounce rate</small>
        </div>
        
        <div class="sgnp-card">
            <h3>❌ Unsubscribes</h3>
            <div class="sgnp-stat-number"><?php echo number_format($stats['total_unsubscribes']); ?></div>
            <small><?php echo $stats['total_sent'] > 0 ? round(($stats['total_unsubscribes'] / $stats['total_sent']) * 100, 1) : 0; ?>% unsub rate</small>
        </div>
    </div>
    
    <div style="margin-top: 30px;">
        <h2>Recent Activity</h2>
        
        <?php if (empty($recent_events)): ?>
            <div class="sgnp-card" style="text-align: center; padding: 40px;">
                <p>No activity recorded yet.</p>
                <small>Activity tracking requires SendGrid webhook setup. Events like opens, clicks, bounces, and unsubscribes will appear here once webhooks are configured.</small>
            </div>
        <?php else: ?>
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>Subscriber</th>
                        <th>Event Type</th>
                        <th>Date</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($recent_events as $event): ?>
                        <tr>
                            <td>
                                <?php 
                                if ($event->first_name || $event->last_name) {
                                    echo esc_html(trim($event->first_name . ' ' . $event->last_name));
                                    echo '<br><small>' . esc_html($event->email) . '</small>';
                                } else {
                                    echo esc_html($event->email ?: 'Unknown');
                                }
                                ?>
                            </td>
                            <td>
                                <span class="sgnp-badge sgnp-badge-<?php echo esc_attr($event->event_type); ?>">
                                    <?php 
                                    $event_labels = [
                                        'open' => '👁️ Open',
                                        'click' => '🖱️ Click',
                                        'bounce' => '⚠️ Bounce',
                                        'unsubscribe' => '❌ Unsubscribe',
                                        'delivered' => '✅ Delivered',
                                        'spam' => '🚫 Spam',
                                        'dropped' => '🗑️ Dropped'
                                    ];
                                    echo isset($event_labels[$event->event_type]) ? $event_labels[$event->event_type] : ucfirst($event->event_type);
                                    ?>
                                </span>
                            </td>
                            <td><?php echo date('M j, Y g:i A', strtotime($event->event_date)); ?></td>
                            <td>
                                <?php 
                                if ($event->url) {
                                    echo '<small>URL: ' . esc_html($event->url) . '</small>';
                                } elseif ($event->metadata) {
                                    $meta = json_decode($event->metadata, true);
                                    if (isset($meta['reason'])) {
                                        echo '<small>' . esc_html($meta['reason']) . '</small>';
                                    }
                                }
                                ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>
    
    <?php if ($stats['sent_date']): ?>
        <div style="margin-top: 20px;">
            <p><strong>Sent:</strong> <?php echo date('F j, Y g:i A', strtotime($stats['sent_date'])); ?></p>
        </div>
    <?php endif; ?>
</div>

<style>
.sgnp-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.sgnp-stat-number {
    font-size: 36px;
    font-weight: bold;
    color: #5b7c99;
    margin: 10px 0;
}

.sgnp-stats-grid .sgnp-card {
    text-align: center;
    padding: 25px;
}

.sgnp-stats-grid .sgnp-card h3 {
    margin: 0 0 10px 0;
    font-size: 14px;
    text-transform: uppercase;
    color: #7a8a99;
}

.sgnp-stats-grid .sgnp-card small {
    color: #7a8a99;
    font-size: 12px;
}

.sgnp-badge-open { background-color: #d4edda; color: #155724; }
.sgnp-badge-click { background-color: #d1ecf1; color: #0c5460; }
.sgnp-badge-bounce { background-color: #f8d7da; color: #721c24; }
.sgnp-badge-unsubscribe { background-color: #f8d7da; color: #721c24; }
.sgnp-badge-delivered { background-color: #d4edda; color: #155724; }
.sgnp-badge-spam { background-color: #fff3cd; color: #856404; }
.sgnp-badge-dropped { background-color: #e2e3e5; color: #383d41; }
</style>
