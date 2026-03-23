<?php
/**
 * Admin Interface Handler
 */

if (!defined('ABSPATH')) {
    exit;
}

class SGNP_Admin {
    
    public function init() {
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
        add_action('admin_init', [$this, 'handle_actions']);
        add_action('admin_init', [$this, 'handle_client_switch']);
        add_action('wp_ajax_sgnp_save_campaign', [$this, 'ajax_save_campaign']);
        add_action('wp_ajax_sgnp_send_test_email', [$this, 'ajax_send_test_email']);
        add_action('wp_ajax_sgnp_send_campaign', [$this, 'ajax_send_campaign']);
        add_action('wp_ajax_sgnp_delete_subscriber', [$this, 'ajax_delete_subscriber']);
        add_action('wp_ajax_sgnp_update_subscriber', [$this, 'ajax_update_subscriber']);
        add_action('wp_ajax_sgnp_update_list', [$this, 'ajax_update_list']);
        add_action('wp_ajax_sgnp_delete_campaign', [$this, 'ajax_delete_campaign']);
        add_action('wp_ajax_sgnp_get_sendgrid_templates', [$this, 'ajax_get_sendgrid_templates']);
        add_action('wp_ajax_sgnp_debug_template', [$this, 'ajax_debug_template']);
        add_action('wp_ajax_sgnp_create_client', [$this, 'ajax_create_client']);
        add_action('wp_ajax_sgnp_delete_client', [$this, 'ajax_delete_client']);
        add_action('wp_ajax_sgnp_add_subscribers_to_list', [$this, 'ajax_add_subscribers_to_list']);
        add_action('wp_ajax_sgnp_get_lists', [$this, 'ajax_get_lists']);
    }
    
    public function add_admin_menu() {
        add_menu_page(
            'Newsletter Pro',
            'Newsletter Pro',
            'manage_options',
            'sgnp-dashboard',
            [$this, 'render_dashboard'],
            'dashicons-email-alt',
            30
        );
        
        add_submenu_page(
            'sgnp-dashboard',
            'Dashboard',
            'Dashboard',
            'manage_options',
            'sgnp-dashboard',
            [$this, 'render_dashboard']
        );
        
        add_submenu_page(
            'sgnp-dashboard',
            'Campaigns',
            'Campaigns',
            'manage_options',
            'sgnp-campaigns',
            [$this, 'render_campaigns']
        );
        
        add_submenu_page(
            'sgnp-dashboard',
            'Create Campaign',
            'Create Campaign',
            'manage_options',
            'sgnp-create-campaign',
            [$this, 'render_create_campaign']
        );
        
        add_submenu_page(
            'sgnp-dashboard',
            'Subscribers',
            'Subscribers',
            'manage_options',
            'sgnp-subscribers',
            [$this, 'render_subscribers']
        );
        
        add_submenu_page(
            'sgnp-dashboard',
            'Lists',
            'Lists',
            'manage_options',
            'sgnp-lists',
            [$this, 'render_lists']
        );
        
        add_submenu_page(
            'sgnp-dashboard',
            'Clients',
            'Clients',
            'manage_options',
            'sgnp-clients',
            [$this, 'render_clients']
        );
        
        add_submenu_page(
            null,
            'Add Client',
            'Add Client',
            'manage_options',
            'sgnp-add-client',
            [$this, 'render_add_client']
        );
        
        add_submenu_page(
            null,
            'Campaign Stats',
            'Campaign Stats',
            'manage_options',
            'sgnp-campaign-stats',
            [$this, 'render_campaign_stats']
        );
        
        add_submenu_page(
            'sgnp-dashboard',
            'Settings',
            'Settings',
            'manage_options',
            'sgnp-settings',
            [$this, 'render_settings']
        );
    }
    
    public function enqueue_admin_assets($hook) {
        // Only load on plugin pages - check the actual page parameter in URL
        if (!isset($_GET['page']) || strpos($_GET['page'], 'sgnp-') !== 0) {
            return; // Don't load on non-plugin pages
        }
        
        // Strong cache busting - force fresh load every time
        $js_file = SGNP_PLUGIN_DIR . 'assets/js/admin.js';
        $cache_buster = SGNP_VERSION . '.' . filemtime($js_file);
        
        wp_enqueue_style('sgnp-admin-css', SGNP_PLUGIN_URL . 'assets/css/admin.css', [], $cache_buster);
        
        // Enqueue jQuery UI for modal functionality - MUST load before our script
        wp_enqueue_script('jquery-ui-resizable');
        wp_enqueue_script('jquery-ui-draggable');
        wp_enqueue_script('jquery-ui-dialog');
        wp_enqueue_script('jquery-ui-datepicker');
        wp_enqueue_style('wp-jquery-ui-dialog');
        
        wp_enqueue_script('sgnp-admin-js', SGNP_PLUGIN_URL . 'assets/js/admin.js', ['jquery', 'jquery-ui-dialog', 'jquery-ui-resizable', 'jquery-ui-draggable'], $cache_buster, true);
        
        wp_localize_script('sgnp-admin-js', 'sgnpAdmin', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('sgnp_nonce'),
            'companyName' => get_option('sgnp_company_name', get_bloginfo('name')),
            'adminUrl' => admin_url()
        ]);
    }
    
    public function handle_actions() {
        if (!isset($_GET['page']) || strpos($_GET['page'], 'sgnp-') === false) {
            return;
        }
        
        if (isset($_POST['sgnp_save_settings']) && check_admin_referer('sgnp_settings')) {
            $this->save_settings();
        }
        
        if (isset($_POST['sgnp_add_subscriber']) && check_admin_referer('sgnp_add_subscriber')) {
            $this->add_subscriber();
        }
        
        if (isset($_POST['sgnp_create_list']) && check_admin_referer('sgnp_create_list')) {
            $this->create_list();
        }
        
        if (isset($_POST['sgnp_add_client']) && check_admin_referer('sgnp_add_client')) {
            $this->add_client();
        }
    }
    
    public function handle_client_switch() {
        if (isset($_GET['sgnp_client']) && check_admin_referer('sgnp_switch_client', '_wpnonce')) {
            $client_id = intval($_GET['sgnp_client']);
            $user_id = get_current_user_id();
            
            // Guard against non-authenticated contexts
            if (!$user_id) {
                return;
            }
            
            if ($client_id === 0 || SGNP_Client::get($client_id)) {
                // Store per-user to maintain data isolation
                update_user_meta($user_id, 'sgnp_current_client_id', $client_id);
                
                // Clean up legacy global option if it exists
                delete_option('sgnp_current_client_id');
                
                wp_redirect(remove_query_arg(['sgnp_client', '_wpnonce']));
                exit;
            }
        }
    }
    
    public static function get_current_client_id() {
        $user_id = get_current_user_id();
        
        // Return 0 for non-authenticated contexts (cron, webhooks, etc)
        if (!$user_id) {
            return 0;
        }
        
        // Get client selection per-user for proper data isolation
        return get_user_meta($user_id, 'sgnp_current_client_id', true) ?: 0;
    }
    
    public static function get_current_client() {
        $client_id = self::get_current_client_id();
        if ($client_id) {
            return SGNP_Client::get($client_id);
        }
        return null;
    }
    
    public function render_client_selector() {
        $clients = SGNP_Client::get_all(['status' => 'active']);
        $current_client_id = self::get_current_client_id();
        $current_client = self::get_current_client();
        
        if (count($clients) <= 1) {
            return; // Don't show selector if only one client
        }
        
        ?>
        <div class="sgnp-client-selector">
            <select id="sgnp-client-dropdown" onchange="sgnpSwitchClient(this.value)">
                <option value="0" <?php selected($current_client_id, 0); ?>>All Clients</option>
                <?php foreach ($clients as $client): ?>
                    <option value="<?php echo esc_attr($client->id); ?>" <?php selected($current_client_id, $client->id); ?>>
                        <?php echo esc_html($client->name); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>
        <script>
        function sgnpSwitchClient(clientId) {
            const url = new URL(window.location.href);
            url.searchParams.set('sgnp_client', clientId);
            url.searchParams.set('_wpnonce', '<?php echo wp_create_nonce('sgnp_switch_client'); ?>');
            window.location.href = url.toString();
        }
        </script>
        <?php
    }
    
    private function save_settings() {
        update_option('sgnp_sendgrid_api_key', sanitize_text_field($_POST['sendgrid_api_key']));
        update_option('sgnp_from_email', sanitize_email($_POST['from_email']));
        update_option('sgnp_from_name', sanitize_text_field($_POST['from_name']));
        update_option('sgnp_company_name', sanitize_text_field($_POST['company_name']));
        
        if (isset($_POST['webhook_secret'])) {
            update_option('sgnp_sendgrid_webhook_secret', sanitize_text_field($_POST['webhook_secret']));
        }
        
        if (isset($_POST['webhook_public_key'])) {
            update_option('sgnp_sendgrid_webhook_public_key', sanitize_textarea_field($_POST['webhook_public_key']));
        }
        
        add_settings_error('sgnp_messages', 'sgnp_message', 'Settings saved successfully', 'success');
    }
    
    private function add_subscriber() {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_subscribers';
        
        $email = sanitize_email($_POST['email']);
        $first_name = sanitize_text_field($_POST['first_name']);
        $last_name = sanitize_text_field($_POST['last_name']);
        
        $existing = $wpdb->get_var($wpdb->prepare("SELECT id FROM $table WHERE email = %s", $email));
        
        if ($existing) {
            add_settings_error('sgnp_messages', 'sgnp_message', 'This email already exists', 'error');
            return;
        }
        
        $wpdb->insert($table, [
            'email' => $email,
            'first_name' => $first_name,
            'last_name' => $last_name,
            'status' => 'subscribed',
            'subscribe_date' => current_time('mysql')
        ]);
        
        $subscriber_id = $wpdb->insert_id;
        
        if ($subscriber_id && isset($_POST['lists']) && is_array($_POST['lists'])) {
            foreach ($_POST['lists'] as $list_id) {
                SGNP_Subscriber::add_to_list($subscriber_id, intval($list_id));
            }
        }
        
        add_settings_error('sgnp_messages', 'sgnp_message', 'Subscriber added successfully', 'success');
    }
    
    private function create_list() {
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_lists';
        
        $name = sanitize_text_field($_POST['list_name']);
        $description = sanitize_textarea_field($_POST['list_description']);
        
        $wpdb->insert($table, [
            'name' => $name,
            'description' => $description,
            'created_date' => current_time('mysql')
        ]);
        
        add_settings_error('sgnp_messages', 'sgnp_message', 'List created successfully', 'success');
    }
    
    public function render_dashboard() {
        include SGNP_PLUGIN_DIR . 'admin/dashboard.php';
    }
    
    public function render_campaigns() {
        include SGNP_PLUGIN_DIR . 'admin/campaigns.php';
    }
    
    public function render_create_campaign() {
        include SGNP_PLUGIN_DIR . 'admin/create-campaign.php';
    }
    
    public function render_subscribers() {
        include SGNP_PLUGIN_DIR . 'admin/subscribers.php';
    }
    
    public function render_lists() {
        include SGNP_PLUGIN_DIR . 'admin/lists.php';
    }
    
    public function render_settings() {
        include SGNP_PLUGIN_DIR . 'admin/settings.php';
    }
    
    public function ajax_save_campaign() {
        check_ajax_referer('sgnp_nonce', 'nonce');
        
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_campaigns';
        
        $campaign_id = isset($_POST['campaign_id']) ? intval($_POST['campaign_id']) : 0;
        
        $data = [
            'name' => sanitize_text_field($_POST['name']),
            'subject' => sanitize_text_field($_POST['subject']),
            'from_name' => sanitize_text_field($_POST['from_name']),
            'from_email' => sanitize_email($_POST['from_email']),
            'reply_to' => sanitize_email($_POST['reply_to']),
            'status' => sanitize_text_field($_POST['status']),
            'client_id' => isset($_POST['client_id']) && !empty($_POST['client_id']) ? intval($_POST['client_id']) : null
        ];
        
        if (isset($_POST['sendgrid_template_id']) && !empty($_POST['sendgrid_template_id'])) {
            $data['sendgrid_template_id'] = sanitize_text_field($_POST['sendgrid_template_id']);
            $data['template_id'] = 0;
            $data['heading'] = '';
            $data['subheading'] = '';
            $data['content'] = '';
            $data['html_content'] = '';
        }
        
        if ($campaign_id > 0) {
            $result = $wpdb->update($table, $data, ['id' => $campaign_id]);
            if ($result === false) {
                wp_send_json_error(['message' => 'Failed to update campaign: ' . $wpdb->last_error]);
                return;
            }
        } else {
            $data['created_date'] = current_time('mysql');
            $result = $wpdb->insert($table, $data);
            
            if ($result === false) {
                wp_send_json_error(['message' => 'Failed to create campaign: ' . $wpdb->last_error]);
                return;
            }
            
            $campaign_id = $wpdb->insert_id;
            
            if (!$campaign_id) {
                wp_send_json_error(['message' => 'Failed to get campaign ID after insert']);
                return;
            }
        }
        
        if (isset($_POST['selected_lists']) && is_array($_POST['selected_lists'])) {
            $campaign_lists_table = $wpdb->prefix . 'sgnp_campaign_lists';
            $wpdb->delete($campaign_lists_table, ['campaign_id' => $campaign_id]);
            
            foreach ($_POST['selected_lists'] as $list_id) {
                $wpdb->insert($campaign_lists_table, [
                    'campaign_id' => $campaign_id,
                    'list_id' => intval($list_id)
                ]);
            }
        }
        
        wp_send_json_success(['campaign_id' => $campaign_id]);
    }
    
    public function ajax_send_test_email() {
        check_ajax_referer('sgnp_nonce', 'nonce');
        
        try {
            // Check if SendGrid API is configured
            $api_key = get_option('sgnp_sendgrid_api_key', '');
            if (empty($api_key)) {
                wp_send_json_error(['message' => 'SendGrid API key is not configured. Please go to Newsletter Pro → Settings and enter your API key.']);
                return;
            }
            
            // Try to instantiate SendGrid API (may fail if vendor folder missing)
            try {
                $api = new SGNP_SendGrid_API();
            } catch (Error $e) {
                error_log('SendGrid Newsletter Pro - Failed to load SendGrid API: ' . $e->getMessage());
                wp_send_json_error(['message' => 'SendGrid library could not be loaded. The vendor folder may be missing. Please reinstall the plugin with all files included.']);
                return;
            }
            
            if (!$api->is_configured()) {
                error_log('SendGrid Newsletter Pro - API not configured. API key may be invalid.');
                wp_send_json_error(['message' => 'SendGrid API is not properly configured. Please check your API key in Settings.']);
                return;
            }
            
            $to_email = sanitize_email($_POST['to_email']);
            $subject = sanitize_text_field($_POST['subject']);
            
            if (isset($_POST['template_id']) && !empty($_POST['template_id'])) {
                $template_id = sanitize_text_field($_POST['template_id']);
                $result = $api->send_test_email_with_template($to_email, $subject, $template_id);
            } else {
                $content = $_POST['content'];
                $result = $api->send_test_email($to_email, $subject, $content);
            }
            
            if (is_wp_error($result)) {
                wp_send_json_error(['message' => $result->get_error_message()]);
                return;
            } else {
                wp_send_json_success($result);
                return;
            }
        } catch (Throwable $e) {
            error_log('SendGrid Newsletter Pro - Test Email Error: ' . $e->getMessage());
            error_log('SendGrid Newsletter Pro - Error Type: ' . get_class($e));
            error_log('SendGrid Newsletter Pro - Stack Trace: ' . $e->getTraceAsString());
            wp_send_json_error(['message' => 'Server error: ' . $e->getMessage() . ' (Check WordPress error log for details)']);
            return;
        }
    }
    
    public function ajax_send_campaign() {
        check_ajax_referer('sgnp_nonce', 'nonce');
        
        try {
            $campaign_id = intval($_POST['campaign_id']);
            
            global $wpdb;
            $campaign_lists_table = $wpdb->prefix . 'sgnp_campaign_lists';
            $list_ids = $wpdb->get_col($wpdb->prepare(
                "SELECT list_id FROM $campaign_lists_table WHERE campaign_id = %d",
                $campaign_id
            ));
            
            if (empty($list_ids)) {
                wp_send_json_error(['message' => 'No lists selected for this campaign']);
                return;
            }
            
            $subscriber_lists_table = $wpdb->prefix . 'sgnp_subscriber_lists';
            $subscribers_table = $wpdb->prefix . 'sgnp_subscribers';
            
            $list_ids_str = implode(',', array_map('intval', $list_ids));
            
            $subscribers = $wpdb->get_results("
                SELECT DISTINCT s.* 
                FROM $subscribers_table s
                INNER JOIN $subscriber_lists_table sl ON s.id = sl.subscriber_id
                WHERE sl.list_id IN ($list_ids_str) AND s.status = 'subscribed'
            ");
            
            if (empty($subscribers)) {
                wp_send_json_error(['message' => 'No subscribers found in selected lists']);
                return;
            }
            
            $api = new SGNP_SendGrid_API();
            $result = $api->send_bulk_campaign($campaign_id, $subscribers);
            
            if (is_wp_error($result)) {
                wp_send_json_error(['message' => $result->get_error_message()]);
            } else {
                wp_send_json_success($result);
            }
        } catch (Throwable $e) {
            error_log('SendGrid Newsletter Pro - Send Campaign Error: ' . $e->getMessage());
            
            if (strpos($e->getMessage(), 'SendGrid') !== false || strpos($e->getMessage(), 'vendor') !== false) {
                wp_send_json_error(['message' => 'SendGrid library not found. Please ensure the vendor folder is included with the plugin.']);
            } else {
                wp_send_json_error(['message' => 'Error sending campaign: ' . $e->getMessage()]);
            }
        }
    }
    
    public function ajax_get_sendgrid_templates() {
        check_ajax_referer('sgnp_nonce', 'nonce');
        
        $api = new SGNP_SendGrid_API();
        $templates = $api->get_templates();
        
        if (is_wp_error($templates)) {
            $error_data = $templates->get_error_data();
            $error_response = [
                'message' => $templates->get_error_message(),
                'code' => $templates->get_error_code()
            ];
            
            // Include additional error details if available
            if (is_array($error_data)) {
                $error_response['details'] = $error_data;
            }
            
            error_log('SendGrid Templates AJAX Error: ' . $templates->get_error_message());
            wp_send_json_error($error_response);
        } else {
            // Add debug information to help diagnose template issues
            $debug_info = [
                'templates' => $templates,
                'count' => count($templates),
                'api_key_configured' => !empty(get_option('sgnp_sendgrid_api_key'))
            ];
            
            wp_send_json_success($debug_info);
        }
    }
    
    public function ajax_debug_template() {
        check_ajax_referer('sgnp_nonce', 'nonce');
        
        $template_id = sanitize_text_field($_POST['template_id']);
        
        if (empty($template_id)) {
            wp_send_json_error(['message' => 'Template ID required']);
            return;
        }
        
        $api = new SGNP_SendGrid_API();
        $template = $api->get_template($template_id);
        
        if (is_wp_error($template)) {
            wp_send_json_error(['message' => $template->get_error_message()]);
        } else {
            wp_send_json_success($template);
        }
    }
    
    public function ajax_delete_subscriber() {
        check_ajax_referer('sgnp_nonce', 'nonce');
        
        $subscriber_id = intval($_POST['subscriber_id']);
        
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_subscribers';
        $wpdb->delete($table, ['id' => $subscriber_id]);
        
        wp_send_json_success();
    }
    
    public function ajax_update_subscriber() {
        check_ajax_referer('sgnp_nonce', 'nonce');
        
        $subscriber_id = intval($_POST['subscriber_id']);
        $email = sanitize_email($_POST['email']);
        $first_name = sanitize_text_field($_POST['first_name']);
        $last_name = sanitize_text_field($_POST['last_name']);
        $status = sanitize_text_field($_POST['status']);
        
        if (empty($email)) {
            wp_send_json_error(['message' => 'Email is required']);
            return;
        }
        
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_subscribers';
        
        $updated = $wpdb->update(
            $table,
            [
                'email' => $email,
                'first_name' => $first_name,
                'last_name' => $last_name,
                'status' => $status
            ],
            ['id' => $subscriber_id]
        );
        
        $current_lists = SGNP_Subscriber::get_lists($subscriber_id);
        foreach ($current_lists as $list) {
            SGNP_Subscriber::remove_from_list($subscriber_id, $list->id);
        }
        
        if (isset($_POST['lists']) && is_array($_POST['lists'])) {
            foreach ($_POST['lists'] as $list_id) {
                SGNP_Subscriber::add_to_list($subscriber_id, intval($list_id));
            }
        }
        
        if ($updated !== false) {
            wp_send_json_success(['message' => 'Subscriber updated successfully']);
        } else {
            wp_send_json_error(['message' => 'Failed to update subscriber']);
        }
    }
    
    public function ajax_update_list() {
        check_ajax_referer('sgnp_nonce', 'nonce');
        
        $list_id = intval($_POST['list_id']);
        $name = sanitize_text_field($_POST['name']);
        $description = sanitize_textarea_field($_POST['description']);
        
        if (empty($name)) {
            wp_send_json_error(['message' => 'List name is required']);
            return;
        }
        
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_lists';
        
        $updated = $wpdb->update(
            $table,
            [
                'name' => $name,
                'description' => $description
            ],
            ['id' => $list_id]
        );
        
        if ($updated !== false) {
            wp_send_json_success(['message' => 'List updated successfully']);
        } else {
            wp_send_json_error(['message' => 'Failed to update list']);
        }
    }
    
    public function ajax_delete_campaign() {
        check_ajax_referer('sgnp_nonce', 'nonce');
        
        $campaign_id = intval($_POST['campaign_id']);
        
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_campaigns';
        $wpdb->delete($table, ['id' => $campaign_id]);
        
        wp_send_json_success();
    }
    
    public function render_clients() {
        include SGNP_PLUGIN_DIR . 'admin/clients.php';
    }
    
    public function render_add_client() {
        include SGNP_PLUGIN_DIR . 'admin/add-client.php';
    }
    
    public function render_campaign_stats() {
        include SGNP_PLUGIN_DIR . 'admin/campaign-stats.php';
    }
    
    private function add_client() {
        $name = sanitize_text_field($_POST['client_name']);
        $email = sanitize_email($_POST['client_email']);
        $create_subuser = isset($_POST['create_subuser']);
        
        if (empty($name) || empty($email)) {
            add_settings_error('sgnp_messages', 'sgnp_message', 'Client name and email are required', 'error');
            return;
        }
        
        $client_data = [
            'name' => $name,
            'email' => $email,
            'status' => 'active'
        ];
        
        if ($create_subuser) {
            $api = new SGNP_SendGrid_API();
            
            $subuser_username = sanitize_title($name) . '_' . substr(md5($email), 0, 6);
            $password = wp_generate_password(16, true, true);
            
            $subuser_result = $api->create_subuser($subuser_username, $email, $password);
            
            if (is_wp_error($subuser_result)) {
                add_settings_error('sgnp_messages', 'sgnp_message', 'Failed to create SendGrid subuser: ' . $subuser_result->get_error_message(), 'error');
                return;
            }
            
            $api_key_result = $api->create_subuser_api_key($subuser_username);
            
            if (is_wp_error($api_key_result)) {
                add_settings_error('sgnp_messages', 'sgnp_message', 'Subuser created but failed to generate API key: ' . $api_key_result->get_error_message(), 'error');
                return;
            }
            
            $client_data['subuser_username'] = $subuser_username;
            $client_data['subuser_api_key'] = $api_key_result['api_key'];
        }
        
        $client_id = SGNP_Client::create($client_data);
        
        if (is_wp_error($client_id)) {
            add_settings_error('sgnp_messages', 'sgnp_message', 'Failed to create client', 'error');
        } else {
            add_settings_error('sgnp_messages', 'sgnp_message', 'Client created successfully!', 'success');
        }
    }
    
    public function ajax_create_client() {
        check_ajax_referer('sgnp_nonce', 'nonce');
        
        $name = sanitize_text_field($_POST['name']);
        $email = sanitize_email($_POST['email']);
        $create_subuser = isset($_POST['create_subuser']) && $_POST['create_subuser'] === 'true';
        
        if (empty($name) || empty($email)) {
            wp_send_json_error(['message' => 'Client name and email are required']);
            return;
        }
        
        $client_data = [
            'name' => $name,
            'email' => $email,
            'status' => 'active'
        ];
        
        if ($create_subuser) {
            $api = new SGNP_SendGrid_API();
            
            $subuser_username = sanitize_title($name) . '_' . substr(md5($email . time()), 0, 6);
            $password = wp_generate_password(16, true, true);
            
            $subuser_result = $api->create_subuser($subuser_username, $email, $password);
            
            if (is_wp_error($subuser_result)) {
                wp_send_json_error(['message' => 'Failed to create SendGrid subuser: ' . $subuser_result->get_error_message()]);
                return;
            }
            
            $api_key_result = $api->create_subuser_api_key($subuser_username);
            
            if (is_wp_error($api_key_result)) {
                wp_send_json_error(['message' => 'Subuser created but failed to generate API key: ' . $api_key_result->get_error_message()]);
                return;
            }
            
            $client_data['subuser_username'] = $subuser_username;
            $client_data['subuser_api_key'] = $api_key_result['api_key'];
        }
        
        $client_id = SGNP_Client::create($client_data);
        
        if (is_wp_error($client_id)) {
            wp_send_json_error(['message' => 'Failed to create client']);
        } else {
            wp_send_json_success(['client_id' => $client_id, 'message' => 'Client created successfully']);
        }
    }
    
    public function ajax_delete_client() {
        check_ajax_referer('sgnp_nonce', 'nonce');
        
        $client_id = intval($_POST['client_id']);
        
        $result = SGNP_Client::delete($client_id);
        
        if (is_wp_error($result)) {
            wp_send_json_error(['message' => 'Failed to delete client']);
        } else {
            wp_send_json_success();
        }
    }
    
    public function ajax_add_subscribers_to_list() {
        check_ajax_referer('sgnp_nonce', 'nonce');
        
        $list_id = intval($_POST['list_id']);
        $subscriber_ids = isset($_POST['subscriber_ids']) ? array_map('intval', $_POST['subscriber_ids']) : [];
        
        if (empty($subscriber_ids)) {
            wp_send_json_error(['message' => 'No subscribers selected']);
            return;
        }
        
        global $wpdb;
        $table = $wpdb->prefix . 'sgnp_subscriber_lists';
        
        $added_count = 0;
        foreach ($subscriber_ids as $subscriber_id) {
            // Check if already in list
            $exists = $wpdb->get_var($wpdb->prepare(
                "SELECT COUNT(*) FROM $table WHERE subscriber_id = %d AND list_id = %d",
                $subscriber_id,
                $list_id
            ));
            
            if (!$exists) {
                $result = $wpdb->insert($table, [
                    'subscriber_id' => $subscriber_id,
                    'list_id' => $list_id
                ]);
                
                if ($result) {
                    $added_count++;
                }
            }
        }
        
        if ($added_count > 0) {
            wp_send_json_success(['message' => "$added_count subscriber(s) added to list"]);
        } else {
            wp_send_json_error(['message' => 'No new subscribers were added. They may already be in this list.']);
        }
    }
    
    public function ajax_get_lists() {
        check_ajax_referer('sgnp_nonce', 'nonce');
        
        $lists = SGNP_List::get_all();
        
        wp_send_json_success(['lists' => $lists]);
    }
}
