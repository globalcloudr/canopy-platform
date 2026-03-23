<?php
/**
 * Campaign Management Class
 */

if (!defined('ABSPATH')) {
    exit;
}

class SGNP_Campaign {
    
    public static function get($id) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_campaigns';
        return $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE id = %d", $id));
    }
    
    public static function get_all($status = 'all') {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_campaigns';
        
        if ($status === 'all') {
            return $wpdb->get_results("SELECT * FROM $table ORDER BY created_date DESC");
        }
        
        return $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table WHERE status = %s ORDER BY created_date DESC",
            $status
        ));
    }
    
    public static function create($data) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_campaigns';
        
        $defaults = [
            'name' => '',
            'subject' => '',
            'from_name' => get_option('sgnp_from_name', get_bloginfo('name')),
            'from_email' => get_option('sgnp_from_email', get_bloginfo('admin_email')),
            'reply_to' => '',
            'template_id' => null,
            'heading' => '',
            'subheading' => '',
            'content' => '',
            'html_content' => '',
            'status' => 'draft',
            'created_date' => current_time('mysql')
        ];
        
        $data = wp_parse_args($data, $defaults);
        
        $wpdb->insert($table, $data);
        return $wpdb->insert_id;
    }
    
    public static function update($id, $data) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_campaigns';
        return $wpdb->update($table, $data, ['id' => $id]);
    }
    
    public static function delete($id) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_campaigns';
        
        $campaign_lists_table = $wpdb->prefix . 'sgnp_campaign_lists';
        $wpdb->delete($campaign_lists_table, ['campaign_id' => $id]);
        
        return $wpdb->delete($table, ['id' => $id]);
    }
    
    public static function get_selected_lists($campaign_id) {
        global $wpdb;
        $campaign_lists_table = $wpdb->prefix . 'sgnp_campaign_lists';
        
        return $wpdb->get_col($wpdb->prepare(
            "SELECT list_id FROM $campaign_lists_table WHERE campaign_id = %d",
            $campaign_id
        ));
    }
    
    public static function set_lists($campaign_id, $list_ids) {
        global $wpdb;
        $campaign_lists_table = $wpdb->prefix . 'sgnp_campaign_lists';
        
        $wpdb->delete($campaign_lists_table, ['campaign_id' => $campaign_id]);
        
        foreach ($list_ids as $list_id) {
            $wpdb->insert($campaign_lists_table, [
                'campaign_id' => $campaign_id,
                'list_id' => $list_id
            ]);
        }
    }
    
    public static function get_recipient_count($campaign_id) {
        global $wpdb;
        
        $list_ids = self::get_selected_lists($campaign_id);
        
        if (empty($list_ids)) {
            return 0;
        }
        
        $subscriber_lists_table = $wpdb->prefix . 'sgnp_subscriber_lists';
        $subscribers_table = $wpdb->prefix . 'sgnp_subscribers';
        
        $list_ids_str = implode(',', array_map('intval', $list_ids));
        
        return $wpdb->get_var("
            SELECT COUNT(DISTINCT s.id)
            FROM $subscribers_table s
            INNER JOIN $subscriber_lists_table sl ON s.id = sl.subscriber_id
            WHERE sl.list_id IN ($list_ids_str) AND s.status = 'subscribed'
        ");
    }
}
