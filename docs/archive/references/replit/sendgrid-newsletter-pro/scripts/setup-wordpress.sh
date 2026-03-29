#!/bin/bash

set -e

echo "Setting up WordPress development environment..."

WP_DIR="wordpress"
PLUGIN_NAME="sendgrid-newsletter-pro"

if [ ! -d "$WP_DIR" ]; then
    echo "Downloading WordPress..."
    curl -sL https://wordpress.org/latest.tar.gz -o latest.tar.gz
    tar -xzf latest.tar.gz
    rm latest.tar.gz
    echo "WordPress downloaded successfully"
else
    echo "WordPress directory already exists"
fi

echo "Setting up SQLite integration for WordPress..."
if [ ! -f "$WP_DIR/wp-content/db.php" ]; then
    cd "$WP_DIR/wp-content"
    
    if [ ! -d "sqlite-database-integration" ]; then
        curl -sL https://downloads.wordpress.org/plugin/sqlite-database-integration.2.1.15.zip -o sqlite.zip
        unzip -q sqlite.zip
        rm sqlite.zip
    fi
    
    if [ -f "sqlite-database-integration/db.copy" ]; then
        cp sqlite-database-integration/db.copy db.php
        echo "SQLite integration installed"
    fi
    
    cd ../..
fi

if [ ! -d "$WP_DIR/wp-content/plugins/$PLUGIN_NAME" ]; then
    echo "Creating symlink for plugin..."
    mkdir -p "$WP_DIR/wp-content/plugins"
    ln -sf "$(pwd)" "$WP_DIR/wp-content/plugins/$PLUGIN_NAME"
    echo "Plugin symlinked to WordPress"
fi

if [ ! -f "$WP_DIR/wp-config.php" ]; then
    echo "Creating wp-config.php..."
    cat > "$WP_DIR/wp-config.php" << 'WPCONFIG'
<?php
define('DB_NAME', 'wordpress');
define('DB_USER', 'root');
define('DB_PASSWORD', '');
define('DB_HOST', 'localhost');
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', '');
define('USE_MYSQL', false);

define('AUTH_KEY',         'put your unique phrase here');
define('SECURE_AUTH_KEY',  'put your unique phrase here');
define('LOGGED_IN_KEY',    'put your unique phrase here');
define('NONCE_KEY',        'put your unique phrase here');
define('AUTH_SALT',        'put your unique phrase here');
define('SECURE_AUTH_SALT', 'put your unique phrase here');
define('LOGGED_IN_SALT',   'put your unique phrase here');
define('NONCE_SALT',       'put your unique phrase here');

$table_prefix = 'wp_';

define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

if ( ! defined( 'ABSPATH' ) ) {
    define( 'ABSPATH', __DIR__ . '/' );
}

require_once ABSPATH . 'wp-settings.php';
WPCONFIG
    echo "wp-config.php created"
fi

echo "Installing Composer dependencies..."
if [ ! -d "vendor" ]; then
    composer install --no-interaction --no-dev 2>/dev/null || echo "Composer install completed with warnings"
fi

echo ""
echo "========================================="
echo "WordPress development environment ready!"
echo "========================================="
echo ""
echo "The plugin has been set up at:"
echo "  wordpress/wp-content/plugins/$PLUGIN_NAME"
echo ""
echo "Starting WordPress server on port 5000..."
echo ""
