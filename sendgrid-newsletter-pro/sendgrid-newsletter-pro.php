<?php
/**
 * Plugin Name: SendGrid Newsletter Pro
 * Plugin URI: https://yoursite.com/sendgrid-newsletter-pro
 * Description: A comprehensive email newsletter plugin for adult education clients with Twilio SendGrid integration. Manage subscribers, create campaigns, and track statistics.
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://yoursite.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: sendgrid-newsletter-pro
 * Domain Path: /languages
 * Requires at least: 5.8
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit;
}

define('SGNP_VERSION', '1.0.0');
define('SGNP_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('SGNP_PLUGIN_URL', plugin_dir_url(__FILE__));
define('SGNP_PLUGIN_FILE', __FILE__);

// Check if vendor folder exists
if (!file_exists(SGNP_PLUGIN_DIR . 'vendor/autoload.php')) {
    add_action('admin_notices', function() {
        echo '<div class="error"><p><strong>SendGrid Newsletter Pro Error:</strong> Required dependencies are missing. Please ensure the "vendor" folder is uploaded with the plugin, or run "composer install" in the plugin directory.</p></div>';
    });
    return;
}

require_once SGNP_PLUGIN_DIR . 'vendor/autoload.php';

require_once SGNP_PLUGIN_DIR . 'includes/class-sgnp-activator.php';
require_once SGNP_PLUGIN_DIR . 'includes/class-sgnp-deactivator.php';
require_once SGNP_PLUGIN_DIR . 'includes/class-sgnp-database.php';
require_once SGNP_PLUGIN_DIR . 'includes/class-sgnp-sendgrid-api.php';
require_once SGNP_PLUGIN_DIR . 'includes/class-sgnp-admin.php';
require_once SGNP_PLUGIN_DIR . 'includes/class-sgnp-client.php';
require_once SGNP_PLUGIN_DIR . 'includes/class-sgnp-subscriber.php';
require_once SGNP_PLUGIN_DIR . 'includes/class-sgnp-list.php';
require_once SGNP_PLUGIN_DIR . 'includes/class-sgnp-campaign.php';
require_once SGNP_PLUGIN_DIR . 'includes/class-sgnp-statistics.php';
require_once SGNP_PLUGIN_DIR . 'includes/class-sgnp-webhook.php';

register_activation_hook(__FILE__, ['SGNP_Activator', 'activate']);
register_deactivation_hook(__FILE__, ['SGNP_Deactivator', 'deactivate']);

function sgnp_init() {
    // Initialize admin and webhook handlers
    $admin = new SGNP_Admin();
    $admin->init();
    
    $webhook = new SGNP_Webhook();
}
add_action('plugins_loaded', 'sgnp_init');
