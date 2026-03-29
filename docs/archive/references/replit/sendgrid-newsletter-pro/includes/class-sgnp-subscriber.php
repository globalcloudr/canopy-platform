<?php
/**
 * Subscriber Management Class
 */

if (!defined('ABSPATH')) {
    exit;
}

class SGNP_Subscriber {
    
    public static function get($id) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_subscribers';
        return $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE id = %d", $id));
    }
    
    public static function get_by_email($email) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_subscribers';
        return $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE email = %s", $email));
    }
    
    public static function create($data) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_subscribers';
        
        $defaults = [
            'email' => '',
            'first_name' => '',
            'last_name' => '',
            'status' => 'subscribed',
            'subscribe_date' => current_time('mysql'),
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? '',
            'metadata' => ''
        ];
        
        $data = wp_parse_args($data, $defaults);
        
        $wpdb->insert($table, $data);
        return $wpdb->insert_id;
    }
    
    public static function update($id, $data) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_subscribers';
        return $wpdb->update($table, $data, ['id' => $id]);
    }
    
    public static function delete($id) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_subscribers';
        return $wpdb->delete($table, ['id' => $id]);
    }
    
    public static function unsubscribe($email) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_subscribers';
        
        return $wpdb->update(
            $table,
            [
                'status' => 'unsubscribed',
                'unsubscribe_date' => current_time('mysql')
            ],
            ['email' => $email]
        );
    }
    
    public static function add_to_list($subscriber_id, $list_id) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_subscriber_lists';
        
        $existing = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM $table WHERE subscriber_id = %d AND list_id = %d",
            $subscriber_id,
            $list_id
        ));
        
        if ($existing) {
            return false;
        }
        
        $wpdb->insert($table, [
            'subscriber_id' => $subscriber_id,
            'list_id' => $list_id,
            'added_date' => current_time('mysql')
        ]);
        
        return $wpdb->insert_id;
    }
    
    public static function remove_from_list($subscriber_id, $list_id) {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_subscriber_lists';
        
        return $wpdb->delete($table, [
            'subscriber_id' => $subscriber_id,
            'list_id' => $list_id
        ]);
    }
    
    public static function get_lists($subscriber_id) {
        global $wpdb;
        $subscriber_lists_table = $wpdb->prefix . 'sgnp_subscriber_lists';
        $lists_table = $wpdb->prefix . 'sgnp_lists';
        
        return $wpdb->get_results($wpdb->prepare(
            "SELECT l.* FROM $lists_table l
            INNER JOIN $subscriber_lists_table sl ON l.id = sl.list_id
            WHERE sl.subscriber_id = %d",
            $subscriber_id
        ));
    }
    
    public static function import_csv($file_path) {
        if (!file_exists($file_path)) {
            return new WP_Error('file_not_found', 'CSV file not found');
        }
        
        $handle = fopen($file_path, 'r');
        if (!$handle) {
            return new WP_Error('file_error', 'Could not open CSV file');
        }
        
        $header = fgetcsv($handle);
        $imported = 0;
        $errors = [];
        
        while (($row = fgetcsv($handle)) !== false) {
            $data = array_combine($header, $row);
            
            if (empty($data['email']) || !is_email($data['email'])) {
                $errors[] = 'Invalid email: ' . ($data['email'] ?? 'empty');
                continue;
            }
            
            $existing = self::get_by_email($data['email']);
            if ($existing) {
                continue;
            }
            
            $subscriber_data = [
                'email' => sanitize_email($data['email']),
                'first_name' => isset($data['first_name']) ? sanitize_text_field($data['first_name']) : '',
                'last_name' => isset($data['last_name']) ? sanitize_text_field($data['last_name']) : '',
                'status' => 'subscribed'
            ];
            
            if (self::create($subscriber_data)) {
                $imported++;
            }
        }
        
        fclose($handle);
        
        return [
            'imported' => $imported,
            'errors' => $errors
        ];
    }
}
