<?php
/**
 * List Management Class
 */

if (!defined('ABSPATH')) {
    exit;
}

class SGNP_List {
    
    public static function get($id) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_lists';
        return $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE id = %d", $id));
    }
    
    public static function get_all($client_id = null) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_lists';
        
        if ($client_id) {
            return $wpdb->get_results($wpdb->prepare(
                "SELECT * FROM $table WHERE client_id = %d ORDER BY created_date DESC",
                $client_id
            ));
        }
        
        return $wpdb->get_results("SELECT * FROM $table ORDER BY created_date DESC");
    }
    
    public static function create($data) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_lists';
        
        $defaults = [
            'name' => '',
            'description' => '',
            'created_date' => current_time('mysql')
        ];
        
        $data = wp_parse_args($data, $defaults);
        
        $wpdb->insert($table, $data);
        return $wpdb->insert_id;
    }
    
    public static function update($id, $data) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_lists';
        return $wpdb->update($table, $data, ['id' => $id]);
    }
    
    public static function delete($id) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_lists';
        
        $subscriber_lists_table = $wpdb->prefix . 'sgnp_subscriber_lists';
        $wpdb->delete($subscriber_lists_table, ['list_id' => $id]);
        
        return $wpdb->delete($table, ['id' => $id]);
    }
    
    public static function get_subscribers($list_id) {
        global $wpdb;
        $subscriber_lists_table = $wpdb->prefix . 'sgnp_subscriber_lists';
        $subscribers_table = $wpdb->prefix . 'sgnp_subscribers';
        
        return $wpdb->get_results($wpdb->prepare(
            "SELECT s.* FROM $subscribers_table s
            INNER JOIN $subscriber_lists_table sl ON s.id = sl.subscriber_id
            WHERE sl.list_id = %d AND s.status = 'subscribed'
            ORDER BY s.subscribe_date DESC",
            $list_id
        ));
    }
    
    public static function count_subscribers($list_id) {
        global $wpdb;
        $subscriber_lists_table = $wpdb->prefix . 'sgnp_subscriber_lists';
        $subscribers_table = $wpdb->prefix . 'sgnp_subscribers';
        
        return $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM $subscribers_table s
            INNER JOIN $subscriber_lists_table sl ON s.id = sl.subscriber_id
            WHERE sl.list_id = %d AND s.status = 'subscribed'",
            $list_id
        ));
    }
}
