<?php
/**
 * SendGrid API Integration Class
 */

if (!defined('ABSPATH')) {
    exit;
}

class SGNP_SendGrid_API {
    
    private $api_key;
    private $sendgrid;
    
    public function __construct($api_key = null) {
        if ($api_key) {
            $this->api_key = $api_key;
        } else {
            $this->api_key = get_option('sgnp_sendgrid_api_key', '');
        }
        
        if (!empty($this->api_key)) {
            $this->sendgrid = new \SendGrid($this->api_key);
        }
    }
    
    public function is_configured() {
        return !empty($this->api_key) && $this->sendgrid !== null;
    }
    
    private function get_client_api_key($client_id) {
        if (empty($client_id)) {
            return null;
        }
        
        $client = SGNP_Client::get($client_id);
        if ($client && !empty($client->subuser_api_key)) {
            return $client->subuser_api_key;
        }
        
        return null;
    }
    
    public function send_test_email($to_email, $subject, $content) {
        if (!$this->is_configured()) {
            return new WP_Error('not_configured', 'SendGrid API key not configured');
        }
        
        try {
            $from_email = get_option('sgnp_from_email', get_bloginfo('admin_email'));
            $from_name = get_option('sgnp_from_name', get_bloginfo('name'));
            
            $email = new \SendGrid\Mail\Mail();
            $email->setFrom($from_email, $from_name);
            $email->setSubject($subject);
            $email->addTo($to_email);
            $email->addContent("text/html", $content);
            
            $response = $this->sendgrid->send($email);
            
            if ($response->statusCode() >= 200 && $response->statusCode() < 300) {
                return [
                    'success' => true,
                    'message' => 'Test email sent successfully',
                    'status_code' => $response->statusCode()
                ];
            } else {
                return new WP_Error('send_failed', 'Failed to send email: ' . $response->body(), ['status_code' => $response->statusCode()]);
            }
            
        } catch (Exception $e) {
            return new WP_Error('exception', $e->getMessage());
        }
    }
    
    public function send_test_email_with_template($to_email, $subject, $template_id) {
        if (!$this->is_configured()) {
            return new WP_Error('not_configured', 'SendGrid API key not configured');
        }
        
        try {
            $from_email = get_option('sgnp_from_email', get_bloginfo('admin_email'));
            $from_name = get_option('sgnp_from_name', get_bloginfo('name'));
            
            $version_specific_id = $this->get_version_specific_template_id($template_id);
            
            $email = new \SendGrid\Mail\Mail();
            $email->setFrom($from_email, $from_name);
            $email->setSubject($subject);
            $email->addTo($to_email, 'Test User');
            $email->setTemplateId($version_specific_id);
            
            $dynamic_data = [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => $to_email,
                'company_name' => get_option('sgnp_company_name', get_bloginfo('name')),
                'year' => date('Y'),
                'unsubscribe_url' => '#'
            ];
            
            $email->addDynamicTemplateDatas($dynamic_data);
            
            $response = $this->sendgrid->send($email);
            
            if ($response->statusCode() >= 200 && $response->statusCode() < 300) {
                return [
                    'success' => true,
                    'message' => 'Test email sent successfully',
                    'status_code' => $response->statusCode(),
                    'template_id_sent' => $version_specific_id,
                    'original_template_id' => $template_id,
                    'debug_info' => 'Using template: ' . $version_specific_id
                ];
            } else {
                return new WP_Error('send_failed', 'Failed to send email: ' . $response->body(), ['status_code' => $response->statusCode()]);
            }
            
        } catch (Exception $e) {
            return new WP_Error('exception', $e->getMessage());
        }
    }
    
    public function send_campaign_email($campaign_id, $subscriber_email, $subscriber_data, $html_content = null) {
        global $wpdb;
        $campaign_table = $wpdb->prefix . 'sgnp_campaigns';
        $campaign = $wpdb->get_row($wpdb->prepare("SELECT * FROM $campaign_table WHERE id = %d", $campaign_id));
        
        if (!$campaign) {
            return new WP_Error('campaign_not_found', 'Campaign not found');
        }
        
        $client_api_key = $this->get_client_api_key($campaign->client_id);
        if ($client_api_key) {
            $sendgrid_instance = new \SendGrid($client_api_key);
        } else {
            if (!$this->is_configured()) {
                return new WP_Error('not_configured', 'SendGrid API key not configured');
            }
            $sendgrid_instance = $this->sendgrid;
        }
        
        try {
            $email = new \SendGrid\Mail\Mail();
            $email->setFrom($campaign->from_email, $campaign->from_name);
            $email->setSubject($campaign->subject);
            $email->addTo($subscriber_email, $subscriber_data['first_name'] . ' ' . $subscriber_data['last_name']);
            
            if (!empty($campaign->reply_to)) {
                $email->setReplyTo($campaign->reply_to);
            }
            
            if (!empty($campaign->sendgrid_template_id)) {
                $version_specific_id = $this->get_version_specific_template_id($campaign->sendgrid_template_id);
                $email->setTemplateId($version_specific_id);
                
                $unsubscribe_url = add_query_arg([
                    'sgnp_action' => 'unsubscribe',
                    'email' => urlencode($subscriber_email),
                    'campaign' => $campaign_id,
                    'token' => wp_hash($subscriber_email . $campaign_id)
                ], home_url());
                
                $dynamic_data = [
                    'first_name' => $subscriber_data['first_name'],
                    'last_name' => $subscriber_data['last_name'],
                    'email' => $subscriber_email,
                    'company_name' => get_option('sgnp_company_name', get_bloginfo('name')),
                    'year' => date('Y'),
                    'unsubscribe_url' => $unsubscribe_url
                ];
                
                $email->addDynamicTemplateDatas($dynamic_data);
            } else {
                $personalized_content = $this->personalize_content($html_content, $subscriber_data, $campaign_id);
                $email->addContent("text/html", $personalized_content);
            }
            
            $email->addCustomArg("campaign_id", (string)$campaign_id);
            $email->addCustomArg("subscriber_email", $subscriber_email);
            
            $tracking_settings = new \SendGrid\Mail\TrackingSettings();
            $click_tracking = new \SendGrid\Mail\ClickTracking();
            $click_tracking->setEnable(true);
            $tracking_settings->setClickTracking($click_tracking);
            
            $open_tracking = new \SendGrid\Mail\OpenTracking();
            $open_tracking->setEnable(true);
            $tracking_settings->setOpenTracking($open_tracking);
            
            $email->setTrackingSettings($tracking_settings);
            
            $response = $sendgrid_instance->send($email);
            
            if ($response->statusCode() >= 200 && $response->statusCode() < 300) {
                return [
                    'success' => true,
                    'status_code' => $response->statusCode()
                ];
            } else {
                return new WP_Error('send_failed', 'Failed to send email', ['status_code' => $response->statusCode()]);
            }
            
        } catch (Throwable $e) {
            error_log('SendGrid Newsletter Pro - Send Campaign Email Error: ' . $e->getMessage());
            return new WP_Error('exception', $e->getMessage());
        }
    }
    
    public function send_bulk_campaign($campaign_id, $subscribers) {
        if (!$this->is_configured()) {
            return new WP_Error('not_configured', 'SendGrid API key not configured');
        }
        
        $results = [
            'sent' => 0,
            'failed' => 0,
            'errors' => []
        ];
        
        global $wpdb;
        $campaign_table = $wpdb->prefix . 'sgnp_campaigns';
        $campaign = $wpdb->get_row($wpdb->prepare("SELECT * FROM $campaign_table WHERE id = %d", $campaign_id));
        
        if (!$campaign) {
            return new WP_Error('campaign_not_found', 'Campaign not found');
        }
        
        foreach ($subscribers as $subscriber) {
            $subscriber_data = [
                'first_name' => $subscriber->first_name,
                'last_name' => $subscriber->last_name,
                'email' => $subscriber->email
            ];
            
            $result = $this->send_campaign_email($campaign_id, $subscriber->email, $subscriber_data, $campaign->html_content);
            
            if (is_wp_error($result)) {
                $results['failed']++;
                $results['errors'][] = [
                    'email' => $subscriber->email,
                    'error' => $result->get_error_message()
                ];
            } else {
                $results['sent']++;
            }
            
            usleep(100000);
        }
        
        $total_recipients = count($subscribers);
        
        $wpdb->update(
            $campaign_table,
            [
                'total_recipients' => $total_recipients,
                'total_sent' => $results['sent'],
                'status' => 'sent',
                'sent_date' => current_time('mysql')
            ],
            ['id' => $campaign_id]
        );
        
        do_action('sgnp_campaign_sent', $campaign_id, $results);
        
        return $results;
    }
    
    private function personalize_content($content, $subscriber_data, $campaign_id) {
        $unsubscribe_url = add_query_arg([
            'sgnp_action' => 'unsubscribe',
            'email' => urlencode($subscriber_data['email']),
            'campaign' => $campaign_id,
            'token' => wp_hash($subscriber_data['email'] . $campaign_id)
        ], home_url());
        
        $replacements = [
            '{{first_name}}' => $subscriber_data['first_name'],
            '{{last_name}}' => $subscriber_data['last_name'],
            '{{email}}' => $subscriber_data['email'],
            '{{unsubscribe_url}}' => $unsubscribe_url,
            '{{year}}' => date('Y'),
            '{{company_name}}' => get_option('sgnp_company_name', get_bloginfo('name'))
        ];
        
        return str_replace(array_keys($replacements), array_values($replacements), $content);
    }
    
    public function get_statistics($campaign_id) {
        if (!$this->is_configured()) {
            return new WP_Error('not_configured', 'SendGrid API key not configured');
        }
        
        try {
            global $wpdb;
            $campaign_table = $wpdb->prefix . 'sgnp_campaigns';
            $campaign = $wpdb->get_row($wpdb->prepare("SELECT * FROM $campaign_table WHERE id = %d", $campaign_id));
            
            if (!$campaign) {
                return new WP_Error('campaign_not_found', 'Campaign not found');
            }
            
            return [
                'total_sent' => $campaign->total_sent,
                'total_delivered' => $campaign->total_delivered,
                'total_opens' => $campaign->total_opens,
                'total_clicks' => $campaign->total_clicks,
                'total_bounces' => $campaign->total_bounces,
                'total_unsubscribes' => $campaign->total_unsubscribes,
                'open_rate' => $campaign->total_sent > 0 ? round(($campaign->total_opens / $campaign->total_sent) * 100, 2) : 0,
                'click_rate' => $campaign->total_sent > 0 ? round(($campaign->total_clicks / $campaign->total_sent) * 100, 2) : 0,
                'bounce_rate' => $campaign->total_sent > 0 ? round(($campaign->total_bounces / $campaign->total_sent) * 100, 2) : 0
            ];
            
        } catch (Exception $e) {
            return new WP_Error('exception', $e->getMessage());
        }
    }
    
    public function verify_api_key($api_key) {
        try {
            $sg = new \SendGrid($api_key);
            $response = $sg->client->api_keys()->get();
            
            return $response->statusCode() === 200;
        } catch (Exception $e) {
            return false;
        }
    }
    
    public function check_api_key_scopes() {
        if (!$this->is_configured()) {
            return new WP_Error('not_configured', 'SendGrid API key not configured');
        }
        
        try {
            // Get current API key details (this only works if the key has api_keys.read permission)
            $response = $this->sendgrid->client->api_keys()->get();
            
            error_log('SendGrid API Key Scopes Check - Status: ' . $response->statusCode());
            error_log('SendGrid API Key Scopes Check - Body: ' . $response->body());
            
            if ($response->statusCode() >= 200 && $response->statusCode() < 300) {
                $body = json_decode($response->body(), true);
                return $body;
            } else {
                return new WP_Error('check_failed', 'Unable to check API key scopes. This might indicate insufficient permissions.');
            }
        } catch (Exception $e) {
            return new WP_Error('exception', $e->getMessage());
        }
    }
    
    public function get_templates() {
        if (!$this->is_configured()) {
            return new WP_Error('not_configured', 'SendGrid API key not configured');
        }
        
        if (!$this->sendgrid) {
            return new WP_Error('sendgrid_client_missing', 'SendGrid client not initialized');
        }
        
        try {
            // Fetch dynamic templates (use 'legacy,dynamic' to get both types)
            $query_params = json_decode('{"generations": "legacy,dynamic"}');
            $response = $this->sendgrid->client->templates()->get(null, $query_params);
            
            if ($response->statusCode() >= 200 && $response->statusCode() < 300) {
                $body = json_decode($response->body(), true);
                
                $templates = [];
                
                // Check for templates in 'result' key (v3 API format)
                if (isset($body['result']) && is_array($body['result'])) {
                    foreach ($body['result'] as $template) {
                        $active_version = null;
                        if (isset($template['versions']) && is_array($template['versions'])) {
                            foreach ($template['versions'] as $version) {
                                if (isset($version['active']) && $version['active'] == 1) {
                                    $active_version = $version;
                                    break;
                                }
                            }
                        }
                        
                        $templates[] = [
                            'id' => $template['id'],
                            'name' => $template['name'],
                            'generation' => $template['generation'] ?? 'legacy',
                            'updated_at' => $template['updated_at'] ?? '',
                            'active_version' => $active_version
                        ];
                    }
                }
                // Check for templates array (alternative format)
                elseif (isset($body['templates']) && is_array($body['templates'])) {
                    foreach ($body['templates'] as $template) {
                        $active_version = null;
                        if (isset($template['versions']) && is_array($template['versions'])) {
                            foreach ($template['versions'] as $version) {
                                if (isset($version['active']) && $version['active'] == 1) {
                                    $active_version = $version;
                                    break;
                                }
                            }
                        }
                        
                        $templates[] = [
                            'id' => $template['id'],
                            'name' => $template['name'],
                            'generation' => $template['generation'] ?? 'legacy',
                            'updated_at' => $template['updated_at'] ?? '',
                            'active_version' => $active_version
                        ];
                    }
                }
                
                return $templates;
            } else {
                $error_body = json_decode($response->body(), true);
                $error_message = 'Failed to fetch templates from SendGrid';
                
                if (isset($error_body['errors'][0]['message'])) {
                    $error_message = $error_body['errors'][0]['message'];
                }
                
                return new WP_Error(
                    'fetch_failed', 
                    $error_message, 
                    [
                        'status_code' => $response->statusCode(),
                        'response_body' => $response->body()
                    ]
                );
            }
            
        } catch (Exception $e) {
            return new WP_Error('exception', 'SendGrid API Error: ' . $e->getMessage());
        }
    }
    
    public function get_template($template_id) {
        if (!$this->is_configured()) {
            return new WP_Error('not_configured', 'SendGrid API key not configured');
        }
        
        try {
            $response = $this->sendgrid->client->templates()->_($template_id)->get();
            
            if ($response->statusCode() >= 200 && $response->statusCode() < 300) {
                return json_decode($response->body(), true);
            } else {
                return new WP_Error('fetch_failed', 'Failed to fetch template', ['status_code' => $response->statusCode()]);
            }
            
        } catch (Exception $e) {
            return new WP_Error('exception', $e->getMessage());
        }
    }
    
    private function get_version_specific_template_id($template_id) {
        $template_data = $this->get_template($template_id);
        
        if (is_wp_error($template_data)) {
            // Failed to get version-specific template ID, using base template ID
            return $template_id;
        }
        
        if (isset($template_data['versions']) && is_array($template_data['versions'])) {
            foreach ($template_data['versions'] as $version) {
                if (isset($version['active']) && $version['active'] == 1) {
                    $version_id = $version['id'];
                    $combined_id = $template_id . '.' . $version_id;
                    // Using version-specific template ID (bypasses SendGrid cache)
                    return $combined_id;
                }
            }
        }
        
        // No active version found, using template ID as-is
        return $template_id;
    }
    
    public function create_subuser($username, $email, $password, $ips = []) {
        if (!$this->is_configured()) {
            return new WP_Error('not_configured', 'SendGrid API key not configured');
        }
        
        try {
            $request_body = json_decode(json_encode([
                'username' => $username,
                'email' => $email,
                'password' => $password,
                'ips' => $ips
            ]));
            
            $response = $this->sendgrid->client->subusers()->post($request_body);
            
            if ($response->statusCode() >= 200 && $response->statusCode() < 300) {
                return json_decode($response->body(), true);
            } else {
                $error_body = json_decode($response->body(), true);
                $error_message = isset($error_body['errors'][0]['message']) 
                    ? $error_body['errors'][0]['message'] 
                    : 'Failed to create subuser';
                return new WP_Error('create_failed', $error_message, ['status_code' => $response->statusCode()]);
            }
            
        } catch (Exception $e) {
            return new WP_Error('exception', $e->getMessage());
        }
    }
    
    public function create_subuser_api_key($subuser_username, $key_name = 'WordPress Plugin Key') {
        if (!$this->is_configured()) {
            return new WP_Error('not_configured', 'SendGrid API key not configured');
        }
        
        try {
            $request_body = json_decode(json_encode([
                'name' => $key_name,
                'scopes' => [
                    'mail.send',
                    'sender.create',
                    'sender.read',
                    'sender.update',
                    'templates.read',
                    'tracking_settings.read'
                ]
            ]));
            
            $headers = [
                'on-behalf-of' => $subuser_username
            ];
            
            $response = $this->sendgrid->client->api_keys()->post($request_body, $headers);
            
            if ($response->statusCode() >= 200 && $response->statusCode() < 300) {
                return json_decode($response->body(), true);
            } else {
                $error_body = json_decode($response->body(), true);
                $error_message = isset($error_body['errors'][0]['message']) 
                    ? $error_body['errors'][0]['message'] 
                    : 'Failed to create API key for subuser';
                return new WP_Error('create_failed', $error_message, ['status_code' => $response->statusCode()]);
            }
            
        } catch (Exception $e) {
            return new WP_Error('exception', $e->getMessage());
        }
    }
    
    public function list_subusers() {
        if (!$this->is_configured()) {
            return new WP_Error('not_configured', 'SendGrid API key not configured');
        }
        
        try {
            $response = $this->sendgrid->client->subusers()->get();
            
            if ($response->statusCode() >= 200 && $response->statusCode() < 300) {
                return json_decode($response->body(), true);
            } else {
                return new WP_Error('fetch_failed', 'Failed to fetch subusers', ['status_code' => $response->statusCode()]);
            }
            
        } catch (Exception $e) {
            return new WP_Error('exception', $e->getMessage());
        }
    }
    
    public function disable_subuser($username) {
        if (!$this->is_configured()) {
            return new WP_Error('not_configured', 'SendGrid API key not configured');
        }
        
        try {
            $request_body = json_decode(json_encode(['disabled' => true]));
            $response = $this->sendgrid->client->subusers()->_($username)->patch($request_body);
            
            if ($response->statusCode() >= 200 && $response->statusCode() < 300) {
                return true;
            } else {
                return new WP_Error('disable_failed', 'Failed to disable subuser', ['status_code' => $response->statusCode()]);
            }
            
        } catch (Exception $e) {
            return new WP_Error('exception', $e->getMessage());
        }
    }
    
    public function enable_subuser($username) {
        if (!$this->is_configured()) {
            return new WP_Error('not_configured', 'SendGrid API key not configured');
        }
        
        try {
            $request_body = json_decode(json_encode(['disabled' => false]));
            $response = $this->sendgrid->client->subusers()->_($username)->patch($request_body);
            
            if ($response->statusCode() >= 200 && $response->statusCode() < 300) {
                return true;
            } else {
                return new WP_Error('enable_failed', 'Failed to enable subuser', ['status_code' => $response->statusCode()]);
            }
            
        } catch (Exception $e) {
            return new WP_Error('exception', $e->getMessage());
        }
    }
}
