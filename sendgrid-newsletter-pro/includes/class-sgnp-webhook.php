<?php
/**
 * SendGrid Webhook Handler
 */

if (!defined('ABSPATH')) {
    exit;
}

class SGNP_Webhook {
    
    public function __construct() {
        add_action('init', [$this, 'register_webhook_endpoint']);
        add_action('template_redirect', [$this, 'handle_webhook']);
        add_action('init', [$this, 'handle_unsubscribe']);
    }
    
    public function register_webhook_endpoint() {
        add_rewrite_rule(
            '^sgnp-webhook/?$',
            'index.php?sgnp_webhook=1',
            'top'
        );
        
        add_rewrite_tag('%sgnp_webhook%', '1');
        
        if (get_option('sgnp_flush_rewrite_rules') !== 'yes') {
            flush_rewrite_rules();
            update_option('sgnp_flush_rewrite_rules', 'yes');
        }
    }
    
    public function handle_webhook() {
        if (!get_query_var('sgnp_webhook')) {
            return;
        }
        
        $raw_post = file_get_contents('php://input');
        
        if (!$this->verify_webhook_signature($raw_post)) {
            status_header(403);
            exit('Forbidden');
        }
        
        $events = json_decode($raw_post, true);
        
        if (!is_array($events)) {
            status_header(400);
            exit('Invalid JSON');
        }
        
        global $wpdb;
        $campaigns_table = $wpdb->prefix . 'sgnp_campaigns';
        $subscribers_table = $wpdb->prefix . 'sgnp_subscribers';
        $events_table = $wpdb->prefix . 'sgnp_email_events';
        
        foreach ($events as $event) {
            if (!isset($event['event']) || !isset($event['email'])) {
                continue;
            }
            
            $event_type = $event['event'];
            $email = sanitize_email($event['email']);
            
            $campaign_id = 0;
            if (isset($event['campaign_id'])) {
                $campaign_id = intval($event['campaign_id']);
            } elseif (isset($event['custom_args']) && isset($event['custom_args']['campaign_id'])) {
                $campaign_id = intval($event['custom_args']['campaign_id']);
            }
            
            $subscriber = $wpdb->get_row($wpdb->prepare(
                "SELECT * FROM $subscribers_table WHERE email = %s",
                $email
            ));
            
            if (!$subscriber) {
                continue;
            }
            
            $event_data = [
                'campaign_id' => $campaign_id,
                'subscriber_id' => $subscriber->id,
                'event_type' => $event_type,
                'event_date' => current_time('mysql'),
                'ip_address' => isset($event['ip']) ? sanitize_text_field($event['ip']) : '',
                'user_agent' => isset($event['useragent']) ? sanitize_text_field($event['useragent']) : '',
                'url' => isset($event['url']) ? esc_url_raw($event['url']) : '',
                'metadata' => json_encode($event)
            ];
            
            $wpdb->insert($events_table, $event_data);
            
            if ($campaign_id > 0) {
                switch ($event_type) {
                    case 'delivered':
                        $wpdb->query($wpdb->prepare(
                            "UPDATE $campaigns_table SET total_delivered = total_delivered + 1 WHERE id = %d",
                            $campaign_id
                        ));
                        break;
                        
                    case 'open':
                        $existing_opens = $wpdb->get_var($wpdb->prepare(
                            "SELECT COUNT(*) FROM $events_table 
                            WHERE campaign_id = %d AND subscriber_id = %d AND event_type = 'open'",
                            $campaign_id,
                            $subscriber->id
                        ));
                        
                        if ($existing_opens == 1) {
                            $wpdb->query($wpdb->prepare(
                                "UPDATE $campaigns_table SET total_opens = total_opens + 1 WHERE id = %d",
                                $campaign_id
                            ));
                        }
                        break;
                        
                    case 'click':
                        $existing_clicks = $wpdb->get_var($wpdb->prepare(
                            "SELECT COUNT(*) FROM $events_table 
                            WHERE campaign_id = %d AND subscriber_id = %d AND event_type = 'click'",
                            $campaign_id,
                            $subscriber->id
                        ));
                        
                        if ($existing_clicks == 1) {
                            $wpdb->query($wpdb->prepare(
                                "UPDATE $campaigns_table SET total_clicks = total_clicks + 1 WHERE id = %d",
                                $campaign_id
                            ));
                        }
                        break;
                        
                    case 'bounce':
                    case 'dropped':
                        $wpdb->query($wpdb->prepare(
                            "UPDATE $campaigns_table SET total_bounces = total_bounces + 1 WHERE id = %d",
                            $campaign_id
                        ));
                        
                        $wpdb->update(
                            $subscribers_table,
                            ['status' => 'bounced'],
                            ['id' => $subscriber->id]
                        );
                        break;
                        
                    case 'unsubscribe':
                        $wpdb->query($wpdb->prepare(
                            "UPDATE $campaigns_table SET total_unsubscribes = total_unsubscribes + 1 WHERE id = %d",
                            $campaign_id
                        ));
                        
                        SGNP_Subscriber::unsubscribe($email);
                        break;
                }
            }
        }
        
        status_header(200);
        exit('OK');
    }
    
    public function handle_unsubscribe() {
        if (!isset($_GET['sgnp_action']) || $_GET['sgnp_action'] !== 'unsubscribe') {
            return;
        }
        
        if (!isset($_GET['email']) || !isset($_GET['campaign']) || !isset($_GET['token'])) {
            return;
        }
        
        $email = sanitize_email(urldecode($_GET['email']));
        $campaign_id = intval($_GET['campaign']);
        $token = sanitize_text_field($_GET['token']);
        
        $expected_token = wp_hash($email . $campaign_id);
        
        if (!hash_equals($expected_token, $token)) {
            wp_die('Invalid unsubscribe link');
        }
        
        $result = SGNP_Subscriber::unsubscribe($email);
        
        global $wpdb;
        $campaigns_table = $wpdb->prefix . 'sgnp_campaigns';
        $wpdb->query($wpdb->prepare(
            "UPDATE $campaigns_table SET total_unsubscribes = total_unsubscribes + 1 WHERE id = %d",
            $campaign_id
        ));
        
        $subscriber = SGNP_Subscriber::get_by_email($email);
        if ($subscriber) {
            SGNP_Statistics::record_event($campaign_id, $subscriber->id, 'unsubscribe');
        }
        
        wp_die(
            '<h1>Unsubscribed Successfully</h1><p>You have been unsubscribed from our mailing list.</p>',
            'Unsubscribed',
            ['response' => 200]
        );
    }
    
    private function verify_webhook_signature($raw_post) {
        $public_key = get_option('sgnp_sendgrid_webhook_public_key', '');
        $webhook_secret = get_option('sgnp_sendgrid_webhook_secret', '');
        
        $signature = isset($_SERVER['HTTP_X_TWILIO_EMAIL_EVENT_WEBHOOK_SIGNATURE']) ? $_SERVER['HTTP_X_TWILIO_EMAIL_EVENT_WEBHOOK_SIGNATURE'] : '';
        $timestamp = isset($_SERVER['HTTP_X_TWILIO_EMAIL_EVENT_WEBHOOK_TIMESTAMP']) ? $_SERVER['HTTP_X_TWILIO_EMAIL_EVENT_WEBHOOK_TIMESTAMP'] : '';
        
        if (!empty($signature) && !empty($timestamp) && !empty($public_key)) {
            try {
                $payload = $timestamp . $raw_post;
                
                $verify = new \SendGrid\EventWebhook\EventWebhook();
                $ecdsa_public_key = $verify->convertPublicKeyToECDSA($public_key);
                
                if ($verify->verifySignature($ecdsa_public_key, $payload, $signature, $timestamp)) {
                    return true;
                }
                
                error_log('SGNP Error: SendGrid signature verification failed');
                return false;
            } catch (Exception $e) {
                error_log('SGNP Error: Webhook signature verification exception - ' . $e->getMessage());
                return false;
            }
        }
        
        if (!empty($webhook_secret)) {
            $provided_secret = isset($_GET['secret']) ? sanitize_text_field($_GET['secret']) : '';
            
            if ($provided_secret === $webhook_secret) {
                return true;
            }
            
            error_log('SGNP Warning: Webhook secret mismatch or missing');
            return false;
        }
        
        error_log('SGNP Warning: No webhook security configured. Configure secret or public key in Settings for better security.');
        return true;
    }
    
    public static function get_webhook_url($include_secret = false) {
        $url = home_url('sgnp-webhook');
        
        if ($include_secret) {
            $secret = get_option('sgnp_sendgrid_webhook_secret', '');
            if (!empty($secret)) {
                $url = add_query_arg('secret', $secret, $url);
            }
        }
        
        return $url;
    }
}
