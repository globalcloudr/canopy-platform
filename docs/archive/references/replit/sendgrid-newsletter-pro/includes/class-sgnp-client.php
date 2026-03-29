<?php
/**
 * Client Management Class
 */

if (!defined('ABSPATH')) {
    exit;
}

class SGNP_Client {
    
    public static function create($data) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_clients';
        
        $defaults = [
            'name' => '',
            'email' => '',
            'subuser_username' => null,
            'subuser_api_key' => null,
            'status' => 'active',
            'metadata' => ''
        ];
        
        $data = wp_parse_args($data, $defaults);
        
        if (empty($data['name']) || empty($data['email'])) {
            return new WP_Error('invalid_data', 'Client name and email are required');
        }
        
        $result = $wpdb->insert($table, $data);
        
        if ($result === false) {
            return new WP_Error('insert_failed', 'Failed to create client');
        }
        
        return $wpdb->insert_id;
    }
    
    public static function get($id) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_clients';
        
        return $wpdb->get_row(
            $wpdb->prepare("SELECT * FROM $table WHERE id = %d", $id)
        );
    }
    
    public static function get_all($args = []) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_clients';
        
        $defaults = [
            'status' => null,
            'orderby' => 'created_date',
            'order' => 'DESC',
            'limit' => null,
            'offset' => 0
        ];
        
        $args = wp_parse_args($args, $defaults);
        
        $where = [];
        if ($args['status']) {
            $where[] = $wpdb->prepare("status = %s", $args['status']);
        }
        
        $where_clause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';
        
        $order_clause = sprintf(
            "ORDER BY %s %s",
            sanitize_sql_orderby($args['orderby']),
            $args['order'] === 'ASC' ? 'ASC' : 'DESC'
        );
        
        $limit_clause = $args['limit'] ? $wpdb->prepare("LIMIT %d OFFSET %d", $args['limit'], $args['offset']) : '';
        
        $query = "SELECT * FROM $table $where_clause $order_clause $limit_clause";
        
        return $wpdb->get_results($query);
    }
    
    public static function update($id, $data) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_clients';
        
        $result = $wpdb->update(
            $table,
            $data,
            ['id' => $id]
        );
        
        if ($result === false) {
            return new WP_Error('update_failed', 'Failed to update client');
        }
        
        return true;
    }
    
    public static function delete($id) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_clients';
        
        $result = $wpdb->delete($table, ['id' => $id]);
        
        if ($result === false) {
            return new WP_Error('delete_failed', 'Failed to delete client');
        }
        
        return true;
    }
    
    public static function get_by_subuser($username) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_clients';
        
        return $wpdb->get_row(
            $wpdb->prepare("SELECT * FROM $table WHERE subuser_username = %s", $username)
        );
    }
    
    public static function count($args = []) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_clients';
        
        $defaults = ['status' => null];
        $args = wp_parse_args($args, $defaults);
        
        $where = [];
        if ($args['status']) {
            $where[] = $wpdb->prepare("status = %s", $args['status']);
        }
        
        $where_clause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';
        
        return (int) $wpdb->get_var("SELECT COUNT(*) FROM $table $where_clause");
    }
}
