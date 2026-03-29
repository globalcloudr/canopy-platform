<?php
/**
 * Plugin Deactivation Handler
 */

if (!defined('ABSPATH')) {
    exit;
}

class SGNP_Deactivator {
    
    public static function deactivate() {
        // Clean up scheduled tasks if any
        wp_clear_scheduled_hook('sgnp_process_statistics');
    }
}
