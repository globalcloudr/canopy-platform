<?php
/**
 * Statistics Management Class
 */

if (!defined('ABSPATH')) {
    exit;
}

class SGNP_Statistics {
    
    public static function record_event($campaign_id, $subscriber_id, $event_type, $metadata = []) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_email_events';
        
        $wpdb->insert($table, [
            'campaign_id' => $campaign_id,
            'subscriber_id' => $subscriber_id,
            'event_type' => $event_type,
            'event_date' => current_time('mysql'),
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? '',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
            'url' => isset($metadata['url']) ? $metadata['url'] : '',
            'metadata' => json_encode($metadata)
        ]);
        
        self::update_campaign_stats($campaign_id);
    }
    
    public static function update_campaign_stats($campaign_id) {
        global $wpdb;
        $events_table = $wpdb->prefix . 'sgnp_email_events';
        $campaigns_table = $wpdb->prefix . 'sgnp_campaigns';
        
        $stats = [
            'total_opens' => $wpdb->get_var($wpdb->prepare(
                "SELECT COUNT(DISTINCT subscriber_id) FROM $events_table WHERE campaign_id = %d AND event_type = 'open'",
                $campaign_id
            )),
            'total_clicks' => $wpdb->get_var($wpdb->prepare(
                "SELECT COUNT(DISTINCT subscriber_id) FROM $events_table WHERE campaign_id = %d AND event_type = 'click'",
                $campaign_id
            )),
            'total_bounces' => $wpdb->get_var($wpdb->prepare(
                "SELECT COUNT(DISTINCT subscriber_id) FROM $events_table WHERE campaign_id = %d AND event_type = 'bounce'",
                $campaign_id
            )),
            'total_unsubscribes' => $wpdb->get_var($wpdb->prepare(
                "SELECT COUNT(DISTINCT subscriber_id) FROM $events_table WHERE campaign_id = %d AND event_type = 'unsubscribe'",
                $campaign_id
            ))
        ];
        
        $wpdb->update($campaigns_table, $stats, ['id' => $campaign_id]);
    }
    
    public static function get_campaign_stats($campaign_id) {
        $campaign = SGNP_Campaign::get($campaign_id);
        
        if (!$campaign) {
            return null;
        }
        
        $open_rate = $campaign->total_sent > 0 ? round(($campaign->total_opens / $campaign->total_sent) * 100, 2) : 0;
        $click_rate = $campaign->total_sent > 0 ? round(($campaign->total_clicks / $campaign->total_sent) * 100, 2) : 0;
        $bounce_rate = $campaign->total_sent > 0 ? round(($campaign->total_bounces / $campaign->total_sent) * 100, 2) : 0;
        
        return [
            'campaign_id' => $campaign->id,
            'campaign_name' => $campaign->name,
            'total_sent' => $campaign->total_sent,
            'total_delivered' => $campaign->total_delivered,
            'total_opens' => $campaign->total_opens,
            'total_clicks' => $campaign->total_clicks,
            'total_bounces' => $campaign->total_bounces,
            'total_unsubscribes' => $campaign->total_unsubscribes,
            'open_rate' => $open_rate,
            'click_rate' => $click_rate,
            'bounce_rate' => $bounce_rate,
            'sent_date' => $campaign->sent_date
        ];
    }
    
    public static function get_overview_stats() {
        global $wpdb;
        $campaigns_table = $wpdb->prefix . 'sgnp_campaigns';
        $subscribers_table = $wpdb->prefix . 'sgnp_subscribers';
        
        $total_campaigns = $wpdb->get_var("SELECT COUNT(*) FROM $campaigns_table");
        $sent_campaigns = $wpdb->get_var("SELECT COUNT(*) FROM $campaigns_table WHERE status = 'sent'");
        $draft_campaigns = $wpdb->get_var("SELECT COUNT(*) FROM $campaigns_table WHERE status = 'draft'");
        
        $total_subscribers = $wpdb->get_var("SELECT COUNT(*) FROM $subscribers_table WHERE status = 'subscribed'");
        $unsubscribed = $wpdb->get_var("SELECT COUNT(*) FROM $subscribers_table WHERE status = 'unsubscribed'");
        
        $total_sent = $wpdb->get_var("SELECT SUM(total_sent) FROM $campaigns_table WHERE status = 'sent'");
        $total_opens = $wpdb->get_var("SELECT SUM(total_opens) FROM $campaigns_table WHERE status = 'sent'");
        $total_clicks = $wpdb->get_var("SELECT SUM(total_clicks) FROM $campaigns_table WHERE status = 'sent'");
        
        $avg_open_rate = $total_sent > 0 ? round(($total_opens / $total_sent) * 100, 2) : 0;
        $avg_click_rate = $total_sent > 0 ? round(($total_clicks / $total_sent) * 100, 2) : 0;
        
        return [
            'total_campaigns' => $total_campaigns,
            'sent_campaigns' => $sent_campaigns,
            'draft_campaigns' => $draft_campaigns,
            'total_subscribers' => $total_subscribers,
            'unsubscribed' => $unsubscribed,
            'total_sent' => $total_sent,
            'total_opens' => $total_opens,
            'total_clicks' => $total_clicks,
            'avg_open_rate' => $avg_open_rate,
            'avg_click_rate' => $avg_click_rate
        ];
    }
}
