<?php
/**
 * Plugin Activation Handler
 */

if (!defined('ABSPATH')) {
    exit;
}

class SGNP_Activator {
    
    public static function activate() {
        global $wpdb;
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        
        $charset_collate = $wpdb->get_charset_collate();
        
        // Run upgrade check for existing installations
        self::upgrade_database();
        
        $subscribers_table = $wpdb->prefix . 'sgnp_subscribers';
        $sql_subscribers = "CREATE TABLE IF NOT EXISTS $subscribers_table (
            id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            email varchar(255) NOT NULL,
            first_name varchar(100) DEFAULT '',
            last_name varchar(100) DEFAULT '',
            status varchar(20) DEFAULT 'subscribed',
            subscribe_date datetime DEFAULT CURRENT_TIMESTAMP,
            unsubscribe_date datetime NULL,
            ip_address varchar(45) DEFAULT '',
            user_agent text DEFAULT '',
            metadata longtext DEFAULT '',
            client_id bigint(20) UNSIGNED NULL,
            PRIMARY KEY (id),
            UNIQUE KEY email (email),
            KEY status (status),
            KEY client_id (client_id)
        ) $charset_collate;";
        
        $lists_table = $wpdb->prefix . 'sgnp_lists';
        $sql_lists = "CREATE TABLE IF NOT EXISTS $lists_table (
            id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            description text DEFAULT '',
            created_date datetime DEFAULT CURRENT_TIMESTAMP,
            client_id bigint(20) UNSIGNED NULL,
            PRIMARY KEY (id),
            KEY client_id (client_id)
        ) $charset_collate;";
        
        $subscriber_lists_table = $wpdb->prefix . 'sgnp_subscriber_lists';
        $sql_subscriber_lists = "CREATE TABLE IF NOT EXISTS $subscriber_lists_table (
            id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            subscriber_id bigint(20) UNSIGNED NOT NULL,
            list_id bigint(20) UNSIGNED NOT NULL,
            added_date datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY subscriber_list (subscriber_id, list_id),
            KEY subscriber_id (subscriber_id),
            KEY list_id (list_id)
        ) $charset_collate;";
        
        $campaigns_table = $wpdb->prefix . 'sgnp_campaigns';
        $sql_campaigns = "CREATE TABLE IF NOT EXISTS $campaigns_table (
            id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            subject varchar(255) NOT NULL,
            from_name varchar(100) DEFAULT '',
            from_email varchar(255) DEFAULT '',
            reply_to varchar(255) DEFAULT '',
            sendgrid_template_id varchar(255) DEFAULT NULL,
            status varchar(20) DEFAULT 'draft',
            created_date datetime DEFAULT CURRENT_TIMESTAMP,
            sent_date datetime NULL,
            total_recipients int(11) DEFAULT 0,
            total_sent int(11) DEFAULT 0,
            total_delivered int(11) DEFAULT 0,
            total_opens int(11) DEFAULT 0,
            total_clicks int(11) DEFAULT 0,
            total_bounces int(11) DEFAULT 0,
            total_unsubscribes int(11) DEFAULT 0,
            sendgrid_batch_id varchar(255) DEFAULT '',
            client_id bigint(20) UNSIGNED NULL,
            PRIMARY KEY (id),
            KEY status (status),
            KEY created_date (created_date),
            KEY client_id (client_id)
        ) $charset_collate;";
        
        $campaign_lists_table = $wpdb->prefix . 'sgnp_campaign_lists';
        $sql_campaign_lists = "CREATE TABLE IF NOT EXISTS $campaign_lists_table (
            id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            campaign_id bigint(20) UNSIGNED NOT NULL,
            list_id bigint(20) UNSIGNED NOT NULL,
            PRIMARY KEY (id),
            KEY campaign_id (campaign_id),
            KEY list_id (list_id)
        ) $charset_collate;";
        
        $clients_table = $wpdb->prefix . 'sgnp_clients';
        $sql_clients = "CREATE TABLE IF NOT EXISTS $clients_table (
            id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            email varchar(255) NOT NULL,
            subuser_username varchar(100) DEFAULT NULL,
            subuser_api_key varchar(255) DEFAULT NULL,
            status varchar(20) DEFAULT 'active',
            created_date datetime DEFAULT CURRENT_TIMESTAMP,
            metadata longtext DEFAULT '',
            PRIMARY KEY (id),
            UNIQUE KEY subuser_username (subuser_username),
            KEY status (status)
        ) $charset_collate;";
        
        $email_events_table = $wpdb->prefix . 'sgnp_email_events';
        $sql_email_events = "CREATE TABLE IF NOT EXISTS $email_events_table (
            id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            campaign_id bigint(20) UNSIGNED NOT NULL,
            subscriber_id bigint(20) UNSIGNED NOT NULL,
            event_type varchar(50) NOT NULL,
            event_date datetime DEFAULT CURRENT_TIMESTAMP,
            ip_address varchar(45) DEFAULT '',
            user_agent text DEFAULT '',
            url varchar(500) DEFAULT '',
            metadata longtext DEFAULT '',
            PRIMARY KEY (id),
            KEY campaign_id (campaign_id),
            KEY subscriber_id (subscriber_id),
            KEY event_type (event_type),
            KEY event_date (event_date)
        ) $charset_collate;";
        
        dbDelta($sql_subscribers);
        dbDelta($sql_lists);
        dbDelta($sql_subscriber_lists);
        dbDelta($sql_campaigns);
        dbDelta($sql_campaign_lists);
        dbDelta($sql_clients);
        dbDelta($sql_email_events);
        
        add_option('sgnp_version', SGNP_VERSION);
        add_option('sgnp_activation_date', current_time('mysql'));
    }
    
    private static function upgrade_database() {
        global $wpdb;
        $campaigns_table = $wpdb->prefix . 'sgnp_campaigns';
        $subscribers_table = $wpdb->prefix . 'sgnp_subscribers';
        $lists_table = $wpdb->prefix . 'sgnp_lists';
        
        // Check if sendgrid_template_id column exists
        $sg_template_exists = $wpdb->get_results(
            $wpdb->prepare(
                "SHOW COLUMNS FROM $campaigns_table LIKE %s",
                'sendgrid_template_id'
            )
        );
        
        // Add sendgrid_template_id column if it doesn't exist (for SendGrid Dynamic Templates)
        if (empty($sg_template_exists)) {
            $wpdb->query(
                "ALTER TABLE $campaigns_table 
                ADD COLUMN sendgrid_template_id varchar(255) DEFAULT NULL AFTER reply_to"
            );
        }
        
        // Add client_id to campaigns table (for multi-client support)
        $campaign_client_exists = $wpdb->get_results(
            $wpdb->prepare(
                "SHOW COLUMNS FROM $campaigns_table LIKE %s",
                'client_id'
            )
        );
        
        if (empty($campaign_client_exists)) {
            $wpdb->query(
                "ALTER TABLE $campaigns_table 
                ADD COLUMN client_id bigint(20) UNSIGNED DEFAULT NULL AFTER id,
                ADD KEY client_id (client_id)"
            );
        }
        
        // Add client_id to subscribers table
        $subscriber_client_exists = $wpdb->get_results(
            $wpdb->prepare(
                "SHOW COLUMNS FROM $subscribers_table LIKE %s",
                'client_id'
            )
        );
        
        if (empty($subscriber_client_exists)) {
            $wpdb->query(
                "ALTER TABLE $subscribers_table 
                ADD COLUMN client_id bigint(20) UNSIGNED DEFAULT NULL AFTER id,
                ADD KEY client_id (client_id)"
            );
        }
        
        // Add client_id to lists table
        $list_client_exists = $wpdb->get_results(
            $wpdb->prepare(
                "SHOW COLUMNS FROM $lists_table LIKE %s",
                'client_id'
            )
        );
        
        if (empty($list_client_exists)) {
            $wpdb->query(
                "ALTER TABLE $lists_table 
                ADD COLUMN client_id bigint(20) UNSIGNED DEFAULT NULL AFTER id,
                ADD KEY client_id (client_id)"
            );
        }
    }
}
