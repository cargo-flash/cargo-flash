<?php
/**
 * Plugin Name: Cargo Flash Tracking for WooCommerce
 * Plugin URI: https://cargoflash.com.br
 * Description: Integração completa do sistema de rastreamento Cargo Flash com WooCommerce. Envie pedidos automaticamente e acompanhe entregas em tempo real.
 * Version: 1.0.0
 * Author: Cargo Flash
 * Author URI: https://cargoflash.com.br
 * Text Domain: cargo-flash-tracking
 * Domain Path: /languages
 * Requires at least: 5.0
 * Requires PHP: 7.4
 * WC requires at least: 5.0
 * WC tested up to: 8.0
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('CFT_VERSION', '1.0.0');
define('CFT_PLUGIN_FILE', __FILE__);
define('CFT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('CFT_PLUGIN_URL', plugin_dir_url(__FILE__));
define('CFT_PLUGIN_BASENAME', plugin_basename(__FILE__));

/**
 * Declare HPOS compatibility
 * Required for WooCommerce 8.0+ High-Performance Order Storage
 */
add_action('before_woocommerce_init', function() {
    if (class_exists(\Automattic\WooCommerce\Utilities\FeaturesUtil::class)) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true);
    }
});

/**
 * Check if WooCommerce is active
 */
function cft_check_woocommerce() {
    if (!class_exists('WooCommerce')) {
        add_action('admin_notices', 'cft_woocommerce_missing_notice');
        return false;
    }
    return true;
}

/**
 * Admin notice for missing WooCommerce
 */
function cft_woocommerce_missing_notice() {
    ?>
    <div class="notice notice-error">
        <p><strong>Cargo Flash Tracking</strong> requer que o WooCommerce esteja instalado e ativo.</p>
    </div>
    <?php
}

/**
 * Initialize the plugin
 */
function cft_init() {
    if (!cft_check_woocommerce()) {
        return;
    }

    // Load text domain
    load_plugin_textdomain('cargo-flash-tracking', false, dirname(CFT_PLUGIN_BASENAME) . '/languages');

    // Include required files
    require_once CFT_PLUGIN_DIR . 'includes/class-cft-settings.php';
    require_once CFT_PLUGIN_DIR . 'includes/class-cft-api.php';
    require_once CFT_PLUGIN_DIR . 'includes/class-cft-order-handler.php';
    require_once CFT_PLUGIN_DIR . 'includes/class-cft-tracking-display.php';
    require_once CFT_PLUGIN_DIR . 'includes/class-cft-webhook-handler.php';

    // Initialize classes
    CFT_Settings::init();
    CFT_Order_Handler::init();
    CFT_Tracking_Display::init();
    CFT_Webhook_Handler::init();
}
add_action('plugins_loaded', 'cft_init');

/**
 * Activation hook
 */
function cft_activate() {
    // Create tracking table
    global $wpdb;
    $table_name = $wpdb->prefix . 'cft_tracking';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        order_id bigint(20) NOT NULL,
        tracking_code varchar(50) NOT NULL,
        status varchar(50) DEFAULT 'pending',
        current_location varchar(255) DEFAULT '',
        estimated_delivery date DEFAULT NULL,
        last_update datetime DEFAULT CURRENT_TIMESTAMP,
        cargo_flash_id varchar(100) DEFAULT '',
        history longtext DEFAULT '',
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY order_id (order_id),
        KEY tracking_code (tracking_code)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);

    // Set default options
    add_option('cft_api_url', '');
    add_option('cft_api_key', '');
    add_option('cft_auto_send', 'yes');
    add_option('cft_send_on_status', 'processing');
    add_option('cft_enable_tracking_page', 'yes');
    add_option('cft_tracking_page_id', '');
    
    // Flush rewrite rules
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'cft_activate');

/**
 * Deactivation hook
 */
function cft_deactivate() {
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'cft_deactivate');

/**
 * Add settings link on plugins page
 */
function cft_plugin_action_links($links) {
    $settings_link = '<a href="' . admin_url('admin.php?page=cft-settings') . '">Configurações</a>';
    array_unshift($links, $settings_link);
    return $links;
}
add_filter('plugin_action_links_' . CFT_PLUGIN_BASENAME, 'cft_plugin_action_links');

/**
 * Enqueue admin styles
 */
function cft_admin_styles($hook) {
    if (strpos($hook, 'cft-') !== false || $hook === 'post.php' || $hook === 'post-new.php') {
        wp_enqueue_style('cft-admin', CFT_PLUGIN_URL . 'assets/css/admin.css', array(), CFT_VERSION);
        wp_enqueue_script('cft-admin', CFT_PLUGIN_URL . 'assets/js/admin.js', array('jquery'), CFT_VERSION, true);
        wp_localize_script('cft-admin', 'cft_vars', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('cft_nonce'),
        ));
    }
}
add_action('admin_enqueue_scripts', 'cft_admin_styles');

/**
 * Enqueue frontend styles
 */
function cft_frontend_styles() {
    if (is_account_page() || is_checkout()) {
        wp_enqueue_style('cft-frontend', CFT_PLUGIN_URL . 'assets/css/frontend.css', array(), CFT_VERSION);
    }
}
add_action('wp_enqueue_scripts', 'cft_frontend_styles');
