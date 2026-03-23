<?php
/**
 * Database Helper Class
 */

if (!defined('ABSPATH')) {
    exit;
}

class SGNP_Database {
    
    public static function get_table($table_name) {
        global $wpdb;
        return $wpdb->prefix . 'sgnp_' . $table_name;
    }
    
    public static function get_subscribers($args = []) {
        global $wpdb;
        $table = self::get_table('subscribers');
        
        $defaults = [
            'status' => 'subscribed',
            'limit' => -1,
            'offset' => 0,
            'orderby' => 'subscribe_date',
            'order' => 'DESC',
            'search' => '',
            'client_id' => null
        ];
        
        $args = wp_parse_args($args, $defaults);
        
        $where = "WHERE 1=1";
        
        if ($args['client_id']) {
            $where .= $wpdb->prepare(" AND client_id = %d", $args['client_id']);
        }
        
        if ($args['status'] && $args['status'] !== 'all') {
            $where .= $wpdb->prepare(" AND status = %s", $args['status']);
        }
        
        if (!empty($args['search'])) {
            $search = '%' . $wpdb->esc_like($args['search']) . '%';
            $where .= $wpdb->prepare(" AND (email LIKE %s OR first_name LIKE %s OR last_name LIKE %s)", $search, $search, $search);
        }
        
        $orderby = sanitize_sql_orderby($args['orderby'] . ' ' . $args['order']);
        
        $limit = '';
        if ($args['limit'] > 0) {
            $limit = $wpdb->prepare(" LIMIT %d OFFSET %d", $args['limit'], $args['offset']);
        }
        
        $sql = "SELECT * FROM $table $where ORDER BY $orderby $limit";
        
        return $wpdb->get_results($sql);
    }
    
    public static function count_subscribers($status = 'subscribed', $client_id = null) {
        global $wpdb;
        $table = self::get_table('subscribers');
        
        $where = "WHERE 1=1";
        
        if ($client_id) {
            $where .= $wpdb->prepare(" AND client_id = %d", $client_id);
        }
        
        if ($status !== 'all') {
            $where .= $wpdb->prepare(" AND status = %s", $status);
        }
        
        return $wpdb->get_var("SELECT COUNT(*) FROM $table $where");
    }
    
    public static function get_campaigns($args = []) {
        global $wpdb;
        $table = self::get_table('campaigns');
        
        $defaults = [
            'status' => 'all',
            'limit' => -1,
            'offset' => 0,
            'orderby' => 'created_date',
            'order' => 'DESC',
            'client_id' => null
        ];
        
        $args = wp_parse_args($args, $defaults);
        
        $where = "WHERE 1=1";
        
        if ($args['client_id']) {
            $where .= $wpdb->prepare(" AND client_id = %d", $args['client_id']);
        }
        
        if ($args['status'] && $args['status'] !== 'all') {
            $where .= $wpdb->prepare(" AND status = %s", $args['status']);
        }
        
        $orderby = sanitize_sql_orderby($args['orderby'] . ' ' . $args['order']);
        
        $limit = '';
        if ($args['limit'] > 0) {
            $limit = $wpdb->prepare(" LIMIT %d OFFSET %d", $args['limit'], $args['offset']);
        }
        
        $sql = "SELECT * FROM $table $where ORDER BY $orderby $limit";
        
        return $wpdb->get_results($sql);
    }
    
    public static function count_campaigns($status = 'all', $client_id = null) {
        global $wpdb;
        $table = self::get_table('campaigns');
        
        $where = "WHERE 1=1";
        
        if ($client_id) {
            $where .= $wpdb->prepare(" AND client_id = %d", $client_id);
        }
        
        if ($status !== 'all') {
            $where .= $wpdb->prepare(" AND status = %s", $status);
        }
        
        return $wpdb->get_var("SELECT COUNT(*) FROM $table $where");
    }
}
