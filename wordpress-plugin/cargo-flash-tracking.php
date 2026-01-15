<?php
/**
 * Plugin Name: Cargo Flash Tracking
 * Plugin URI: https://cargoflash.com.br
 * Description: Integração completa de rastreamento Cargo Flash com WooCommerce. Envio automático de pedidos, rastreamento em emails e área do cliente.
 * Version: 2.1.0
 * Author: Cargo Flash
 * Author URI: https://cargoflash.com.br
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: cargo-flash-tracking
 * Domain Path: /languages
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * WC requires at least: 6.0
 * WC tested up to: 9.0
 */

if (!defined('ABSPATH')) {
    exit;
}

// Plugin constants
define('CFT_VERSION', '2.1.0');
define('CFT_PLUGIN_FILE', __FILE__);
define('CFT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('CFT_PLUGIN_URL', plugin_dir_url(__FILE__));

// Declare HPOS compatibility
add_action('before_woocommerce_init', function() {
    if (class_exists(\Automattic\WooCommerce\Utilities\FeaturesUtil::class)) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true);
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('cart_checkout_blocks', __FILE__, true);
    }
});

/**
 * Main Plugin Class
 */
class Cargo_Flash_Tracking {
    
    private static $instance = null;
    private $api_url = '';
    private $api_key = '';
    private $settings = [];
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        $this->api_url = rtrim(get_option('cft_api_url', ''), '/');
        $this->api_key = get_option('cft_api_key', '');
        $this->settings = [
            'auto_send' => get_option('cft_auto_send', 'yes'),
            'trigger_status' => get_option('cft_trigger_status', 'processing'),
            'include_order_total' => get_option('cft_include_order_total', 'yes'),
            'email_tracking' => get_option('cft_email_tracking', 'yes'),
            'myaccount_tracking' => get_option('cft_myaccount_tracking', 'yes'),
        ];
        
        $this->init_hooks();
    }
    
    private function init_hooks() {
        // Admin
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'register_settings']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
        
        // Order status hooks - IMPORTANT: These fire when status CHANGES TO this status
        add_action('woocommerce_order_status_processing', [$this, 'on_order_status_processing'], 10, 1);
        add_action('woocommerce_order_status_completed', [$this, 'on_order_status_completed'], 10, 1);
        
        // Alternative hook that fires on ANY status change
        add_action('woocommerce_order_status_changed', [$this, 'on_order_status_changed'], 10, 4);
        
        // Order columns
        add_filter('manage_edit-shop_order_columns', [$this, 'add_tracking_column']);
        add_action('manage_shop_order_posts_custom_column', [$this, 'render_tracking_column'], 10, 2);
        add_filter('manage_woocommerce_page_wc-orders_columns', [$this, 'add_tracking_column']);
        add_action('manage_woocommerce_page_wc-orders_custom_column', [$this, 'render_tracking_column_hpos'], 10, 2);
        
        // Meta box
        add_action('add_meta_boxes', [$this, 'add_order_meta_box']);
        
        // Emails
        add_action('woocommerce_email_after_order_table', [$this, 'add_tracking_to_email'], 15, 4);
        
        // My Account
        add_action('woocommerce_order_details_after_order_table', [$this, 'display_tracking_in_myaccount']);
        add_action('woocommerce_view_order', [$this, 'display_tracking_widget'], 5);
        
        // AJAX
        add_action('wp_ajax_cft_sync_order', [$this, 'ajax_sync_order']);
        add_action('wp_ajax_cft_bulk_sync', [$this, 'ajax_bulk_sync']);
        add_action('wp_ajax_cft_test_connection', [$this, 'ajax_test_connection']);
        
        // Bulk actions
        add_filter('bulk_actions-edit-shop_order', [$this, 'add_bulk_action']);
        add_filter('bulk_actions-woocommerce_page_wc-orders', [$this, 'add_bulk_action']);
        add_filter('handle_bulk_actions-edit-shop_order', [$this, 'handle_bulk_action'], 10, 3);
        add_filter('handle_bulk_actions-woocommerce_page_wc-orders', [$this, 'handle_bulk_action'], 10, 3);
        
        // Notices
        add_action('admin_notices', [$this, 'show_bulk_action_notice']);
    }
    
    // ==========================================
    // ORDER STATUS HOOKS
    // ==========================================
    
    public function on_order_status_processing($order_id) {
        $this->log("Hook fired: on_order_status_processing for order $order_id");
        if ($this->settings['trigger_status'] === 'processing') {
            $this->maybe_send_order($order_id);
        }
    }
    
    public function on_order_status_completed($order_id) {
        $this->log("Hook fired: on_order_status_completed for order $order_id");
        if ($this->settings['trigger_status'] === 'completed') {
            $this->maybe_send_order($order_id);
        }
    }
    
    public function on_order_status_changed($order_id, $old_status, $new_status, $order) {
        $this->log("Hook fired: on_order_status_changed - Order $order_id from $old_status to $new_status");
        
        // Only proceed if auto-send is enabled
        if ($this->settings['auto_send'] !== 'yes') {
            $this->log("Auto-send is disabled, skipping");
            return;
        }
        
        // Check if new status matches trigger
        if ($new_status !== $this->settings['trigger_status']) {
            $this->log("Status $new_status does not match trigger " . $this->settings['trigger_status']);
            return;
        }
        
        // Check if already sent
        $existing = $this->get_tracking_code($order);
        if (!empty($existing)) {
            $this->log("Order $order_id already has tracking code: $existing");
            return;
        }
        
        $this->log("Syncing order $order_id to Cargo Flash...");
        $result = $this->sync_order($order_id);
        $this->log("Sync result: " . print_r($result, true));
    }
    
    public function maybe_send_order($order_id) {
        if ($this->settings['auto_send'] !== 'yes') {
            return;
        }
        
        $order = wc_get_order($order_id);
        if (!$order) {
            return;
        }
        
        $existing = $this->get_tracking_code($order);
        if (!empty($existing)) {
            return;
        }
        
        $this->sync_order($order_id);
    }
    
    // ==========================================
    // SYNC ORDER
    // ==========================================
    
    public function sync_order($order_id) {
        $order = wc_get_order($order_id);
        if (!$order) {
            return ['success' => false, 'error' => 'Pedido não encontrado'];
        }
        
        if (empty($this->api_url) || empty($this->api_key)) {
            $error = 'API não configurada. URL: ' . ($this->api_url ? 'OK' : 'VAZIO') . ', Key: ' . ($this->api_key ? 'OK' : 'VAZIO');
            $order->add_order_note('❌ Cargo Flash: ' . $error);
            return ['success' => false, 'error' => $error];
        }
        
        // Build items
        $items = [];
        foreach ($order->get_items() as $item) {
            $product = $item->get_product();
            $items[] = [
                'name' => $item->get_name(),
                'quantity' => $item->get_quantity(),
                'sku' => $product ? $product->get_sku() : '',
                'price' => (float) $item->get_total(),
            ];
        }
        
        // Get shipping info - handle different address formats
        $shipping_first = $order->get_shipping_first_name() ?: $order->get_billing_first_name();
        $shipping_last = $order->get_shipping_last_name() ?: $order->get_billing_last_name();
        $shipping_address_1 = $order->get_shipping_address_1() ?: $order->get_billing_address_1();
        $shipping_address_2 = $order->get_shipping_address_2() ?: $order->get_billing_address_2();
        $shipping_city = $order->get_shipping_city() ?: $order->get_billing_city();
        $shipping_state = $order->get_shipping_state() ?: $order->get_billing_state();
        $shipping_postcode = $order->get_shipping_postcode() ?: $order->get_billing_postcode();
        $shipping_country = $order->get_shipping_country() ?: $order->get_billing_country();
        
        // Build payload
        $payload = [
            'order_id' => $order->get_order_number(),
            'customer' => [
                'name' => trim($shipping_first . ' ' . $shipping_last) ?: 'Cliente',
                'email' => $order->get_billing_email() ?: '',
                'phone' => $order->get_billing_phone() ?: '',
                'address' => [
                    'street' => $shipping_address_1 ?: '',
                    'complement' => $shipping_address_2 ?: '',
                    'city' => $shipping_city ?: '',
                    'state' => $shipping_state ?: 'SP',
                    'zip' => preg_replace('/\D/', '', $shipping_postcode) ?: '',
                    'country' => $shipping_country ?: 'BR',
                ],
            ],
            'items' => $items,
            'notes' => $order->get_customer_note() ?: '',
        ];
        
        // Include order total
        if ($this->settings['include_order_total'] === 'yes') {
            $payload['total'] = (float) $order->get_total();
        }
        
        $this->log("Sending payload to Cargo Flash: " . print_r($payload, true));
        
        // Send request
        $url = $this->api_url . '/api/webhooks/woocommerce';
        $this->log("API URL: $url");
        
        $response = wp_remote_post($url, [
            'headers' => [
                'Content-Type' => 'application/json',
                'x-api-key' => $this->api_key,
            ],
            'body' => wp_json_encode($payload),
            'timeout' => 30,
            'sslverify' => true,
        ]);
        
        if (is_wp_error($response)) {
            $error = $response->get_error_message();
            $this->log("Request error: $error");
            $order->add_order_note('❌ Cargo Flash: ' . $error);
            return ['success' => false, 'error' => $error];
        }
        
        $response_code = wp_remote_retrieve_response_code($response);
        $response_body = wp_remote_retrieve_body($response);
        $body = json_decode($response_body, true);
        
        $this->log("Response code: $response_code");
        $this->log("Response body: $response_body");
        
        if ($response_code !== 200 || empty($body['success'])) {
            $error = $body['error'] ?? "HTTP $response_code - $response_body";
            $order->add_order_note('❌ Cargo Flash: ' . $error);
            return ['success' => false, 'error' => $error];
        }
        
        // Save tracking data
        $tracking_code = $body['tracking_code'];
        $tracking_url = $this->api_url . '/rastrear/' . $tracking_code;
        
        $order->update_meta_data('_cft_tracking_code', $tracking_code);
        $order->update_meta_data('_cft_delivery_id', $body['delivery_id'] ?? '');
        $order->update_meta_data('_cft_estimated_delivery', $body['estimated_delivery'] ?? '');
        $order->update_meta_data('_cft_tracking_url', $tracking_url);
        $order->update_meta_data('_cft_sent_at', current_time('mysql'));
        $order->save();
        
        // Legacy meta for compatibility
        update_post_meta($order->get_id(), '_cft_tracking_code', $tracking_code);
        update_post_meta($order->get_id(), '_cargo_flash_tracking_code', $tracking_code);
        
        $order->add_order_note(sprintf(
            '✅ Cargo Flash: Rastreamento criado - <a href="%s" target="_blank">%s</a>',
            esc_url($tracking_url),
            $tracking_code
        ));
        
        $this->log("Successfully synced order $order_id with tracking code $tracking_code");
        
        return [
            'success' => true,
            'tracking_code' => $tracking_code,
            'tracking_url' => $tracking_url,
        ];
    }
    
    // ==========================================
    // STATISTICS - HPOS COMPATIBLE
    // ==========================================
    
    private function get_tracking_stats() {
        // Use WooCommerce API for HPOS compatibility
        $trigger_status = $this->settings['trigger_status'];
        
        // Count orders WITH tracking
        $args_with_tracking = [
            'status' => 'any',
            'limit' => -1,
            'return' => 'ids',
            'meta_query' => [
                [
                    'key' => '_cft_tracking_code',
                    'compare' => 'EXISTS',
                ],
                [
                    'key' => '_cft_tracking_code',
                    'value' => '',
                    'compare' => '!=',
                ],
            ],
        ];
        
        $orders_with_tracking = wc_get_orders($args_with_tracking);
        $total = count($orders_with_tracking);
        
        // Count orders WITHOUT tracking in the trigger status
        $args_pending = [
            'status' => $trigger_status,
            'limit' => -1,
            'return' => 'ids',
        ];
        
        $orders_in_status = wc_get_orders($args_pending);
        
        // Filter out orders that already have tracking
        $pending = 0;
        foreach ($orders_in_status as $order_id) {
            $order = wc_get_order($order_id);
            if ($order) {
                $tracking = $this->get_tracking_code($order);
                if (empty($tracking)) {
                    $pending++;
                }
            }
        }
        
        return [
            'total' => $total,
            'pending' => $pending,
        ];
    }
    
    private function get_tracking_code($order) {
        // Try HPOS first
        $code = $order->get_meta('_cft_tracking_code');
        if (!empty($code)) {
            return $code;
        }
        
        // Try legacy post meta
        $code = get_post_meta($order->get_id(), '_cft_tracking_code', true);
        if (!empty($code)) {
            return $code;
        }
        
        // Try old format
        return get_post_meta($order->get_id(), '_cargo_flash_tracking_code', true);
    }
    
    // ==========================================
    // ADMIN MENU & SETTINGS
    // ==========================================
    
    public function add_admin_menu() {
        add_submenu_page(
            'woocommerce',
            'Cargo Flash Tracking',
            'Cargo Flash',
            'manage_woocommerce',
            'cargo-flash',
            [$this, 'render_settings_page']
        );
    }
    
    public function register_settings() {
        register_setting('cft_settings', 'cft_api_url');
        register_setting('cft_settings', 'cft_api_key');
        register_setting('cft_settings', 'cft_auto_send');
        register_setting('cft_settings', 'cft_trigger_status');
        register_setting('cft_settings', 'cft_include_order_total');
        register_setting('cft_settings', 'cft_email_tracking');
        register_setting('cft_settings', 'cft_myaccount_tracking');
    }
    
    public function enqueue_admin_assets($hook) {
        if (strpos($hook, 'cargo-flash') === false && strpos($hook, 'wc-orders') === false && strpos($hook, 'edit.php') === false) {
            return;
        }
        
        // Inline styles
        wp_add_inline_style('woocommerce_admin_styles', $this->get_admin_css());
        
        // Register and enqueue inline script
        wp_enqueue_script('jquery');
        wp_add_inline_script('jquery', $this->get_admin_js());
        
        // Localize
        wp_localize_script('jquery', 'cftAjax', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('cft_ajax_nonce'),
        ]);
    }
    
    private function get_admin_css() {
        return '
            .cft-wrap { max-width: 1200px; margin: 20px 0; }
            .cft-header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 20px 30px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); }
            .cft-logo { display: flex; align-items: center; gap: 15px; }
            .cft-logo-icon { font-size: 36px; background: rgba(255,255,255,0.2); padding: 12px; border-radius: 12px; }
            .cft-logo h1 { margin: 0; color: #fff; font-size: 24px; }
            .cft-version { color: rgba(255,255,255,0.7); font-size: 12px; }
            .cft-status { display: flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 20px; font-weight: 600; }
            .cft-status.connected { background: rgba(34, 197, 94, 0.2); color: #bbf7d0; }
            .cft-status.disconnected { background: rgba(239, 68, 68, 0.2); color: #fecaca; }
            .cft-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 25px; }
            .cft-stat-card { display: flex; align-items: center; gap: 15px; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
            .cft-stat-icon { font-size: 28px; background: #eff6ff; padding: 12px; border-radius: 10px; }
            .cft-stat-number { display: block; font-size: 28px; font-weight: 700; color: #1e40af; }
            .cft-stat-label { display: block; font-size: 13px; color: #64748b; }
            .cft-content-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 25px; margin-bottom: 25px; }
            .cft-card { background: #fff; padding: 25px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
            .cft-card h2 { margin: 0 0 20px; font-size: 16px; color: #1e40af; }
            .cft-field { margin-bottom: 20px; }
            .cft-field label { display: block; font-weight: 600; margin-bottom: 8px; color: #374151; }
            .cft-field input, .cft-field select { width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 6px; }
            .cft-field .description { color: #6b7280; font-size: 12px; margin-top: 5px; }
            .cft-checkbox { display: flex; align-items: center; gap: 8px; margin-top: 8px; cursor: pointer; }
            .cft-bulk-info { background: #eff6ff; padding: 15px; border-radius: 8px; margin-bottom: 15px; text-align: center; }
            .cft-bulk-info p { margin: 0; color: #1e40af; }
            .cft-badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; text-decoration: none; }
            .cft-badge-success { background: #1e40af; color: #fff; }
            .cft-badge-pending { background: #f1f5f9; color: #94a3b8; }
            .cft-progress { margin-top: 15px; display: none; }
            .cft-progress-bar { height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
            .cft-progress-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #2563eb); width: 0%; transition: width 0.3s; }
            .cft-progress-text { text-align: center; font-size: 13px; color: #64748b; margin-top: 10px; }
            .cft-instructions { margin-bottom: 0; }
            .cft-instruction-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
            .cft-instruction { padding: 15px; background: #f8fafc; border-radius: 8px; }
            .cft-instruction h4 { margin: 0 0 8px; color: #1e40af; font-size: 14px; }
            .cft-instruction p { margin: 0; font-size: 13px; color: #64748b; }
            @media (max-width: 1024px) { .cft-content-grid, .cft-stats-grid, .cft-instruction-grid { grid-template-columns: 1fr; } }
        ';
    }
    
    private function get_admin_js() {
        return "
            jQuery(function($) {
                // Test Connection
                $('#cft-test-connection').on('click', function() {
                    var btn = $(this);
                    btn.prop('disabled', true).text('Testando...');
                    
                    $.post(cftAjax.ajaxUrl, {
                        action: 'cft_test_connection',
                        nonce: cftAjax.nonce
                    }, function(response) {
                        if (response.success) {
                            alert('✅ ' + response.data.message);
                            location.reload();
                        } else {
                            alert('❌ ' + (response.data.error || 'Erro'));
                        }
                        btn.prop('disabled', false).text('Testar Conexão');
                    });
                });
                
                // Sync Order
                $(document).on('click', '.cft-sync-btn', function() {
                    var btn = $(this);
                    var orderId = btn.data('order-id');
                    btn.prop('disabled', true).text('Enviando...');
                    
                    $.post(cftAjax.ajaxUrl, {
                        action: 'cft_sync_order',
                        order_id: orderId,
                        nonce: cftAjax.nonce
                    }, function(response) {
                        if (response.success) {
                            alert('✅ Código: ' + response.data.tracking_code);
                            location.reload();
                        } else {
                            alert('❌ ' + (response.data.error || 'Erro'));
                            btn.prop('disabled', false).text('Enviar');
                        }
                    });
                });
                
                // Bulk Sync
                $('.cft-bulk-sync').on('click', function() {
                    var btn = $(this);
                    if (!confirm('Enviar todos os pedidos pendentes?')) return;
                    
                    btn.prop('disabled', true).text('Processando...');
                    $('.cft-progress').show();
                    
                    $.post(cftAjax.ajaxUrl, {
                        action: 'cft_bulk_sync',
                        nonce: cftAjax.nonce
                    }, function(response) {
                        if (response.success) {
                            $('.cft-progress-fill').css('width', '100%');
                            $('.cft-progress-text').text('✅ ' + response.data.message);
                            setTimeout(function() { location.reload(); }, 1500);
                        } else {
                            alert('❌ ' + (response.data.error || 'Erro'));
                            btn.prop('disabled', false).text('Enviar Todos');
                        }
                    });
                });
            });
        ";
    }
    
    public function render_settings_page() {
        // Reload settings
        $this->api_url = rtrim(get_option('cft_api_url', ''), '/');
        $this->api_key = get_option('cft_api_key', '');
        $this->settings = [
            'auto_send' => get_option('cft_auto_send', 'yes'),
            'trigger_status' => get_option('cft_trigger_status', 'processing'),
            'include_order_total' => get_option('cft_include_order_total', 'yes'),
            'email_tracking' => get_option('cft_email_tracking', 'yes'),
            'myaccount_tracking' => get_option('cft_myaccount_tracking', 'yes'),
        ];
        
        $connection = $this->test_connection();
        $stats = $this->get_tracking_stats();
        ?>
        <div class="wrap cft-wrap">
            <div class="cft-header">
                <div class="cft-logo">
                    <span class="cft-logo-icon">🚚</span>
                    <div>
                        <h1>Cargo Flash Tracking</h1>
                        <span class="cft-version">v<?php echo CFT_VERSION; ?></span>
                    </div>
                </div>
                <div class="cft-status <?php echo $connection['success'] ? 'connected' : 'disconnected'; ?>">
                    <?php echo $connection['success'] ? '✅ Conectado' : '❌ Desconectado'; ?>
                </div>
            </div>
            
            <?php if (!empty($this->api_url) && !$connection['success']): ?>
            <div class="notice notice-error"><p><strong>Erro:</strong> <?php echo esc_html($connection['error']); ?></p></div>
            <?php endif; ?>
            
            <?php if (defined('WP_DEBUG') && WP_DEBUG): ?>
            <div class="notice notice-info"><p><strong>Debug:</strong> Logs disponíveis em wp-content/debug.log</p></div>
            <?php endif; ?>
            
            <div class="cft-stats-grid">
                <div class="cft-stat-card">
                    <div class="cft-stat-icon">📦</div>
                    <div class="cft-stat-content">
                        <span class="cft-stat-number"><?php echo $stats['total']; ?></span>
                        <span class="cft-stat-label">Pedidos Enviados</span>
                    </div>
                </div>
                <div class="cft-stat-card">
                    <div class="cft-stat-icon">⏳</div>
                    <div class="cft-stat-content">
                        <span class="cft-stat-number"><?php echo $stats['pending']; ?></span>
                        <span class="cft-stat-label">Aguardando Envio</span>
                    </div>
                </div>
                <div class="cft-stat-card">
                    <div class="cft-stat-icon">✅</div>
                    <div class="cft-stat-content">
                        <span class="cft-stat-number"><?php echo $connection['success'] ? 'OK' : '—'; ?></span>
                        <span class="cft-stat-label">Status da API</span>
                    </div>
                </div>
            </div>
            
            <div class="cft-content-grid">
                <div class="cft-card">
                    <h2>⚙️ Configurações</h2>
                    <form method="post" action="options.php">
                        <?php settings_fields('cft_settings'); ?>
                        
                        <div class="cft-field">
                            <label>URL da API</label>
                            <input type="url" name="cft_api_url" value="<?php echo esc_attr($this->api_url); ?>" placeholder="https://cargoflash.com.br">
                            <p class="description">URL do sistema Cargo Flash (sem barra no final)</p>
                        </div>
                        
                        <div class="cft-field">
                            <label>Chave de API</label>
                            <input type="text" name="cft_api_key" value="<?php echo esc_attr($this->api_key); ?>" placeholder="cf_xxxxx">
                            <p class="description">Gerada em Cargo Flash → Configurações → API Keys</p>
                        </div>
                        
                        <hr>
                        
                        <div class="cft-field">
                            <label>Envio Automático</label>
                            <select name="cft_auto_send">
                                <option value="yes" <?php selected($this->settings['auto_send'], 'yes'); ?>>Ativado</option>
                                <option value="no" <?php selected($this->settings['auto_send'], 'no'); ?>>Desativado</option>
                            </select>
                        </div>
                        
                        <div class="cft-field">
                            <label>Enviar quando status for</label>
                            <select name="cft_trigger_status">
                                <option value="processing" <?php selected($this->settings['trigger_status'], 'processing'); ?>>Processando</option>
                                <option value="completed" <?php selected($this->settings['trigger_status'], 'completed'); ?>>Concluído</option>
                            </select>
                        </div>
                        
                        <div class="cft-field">
                            <label>Incluir valor do pedido</label>
                            <select name="cft_include_order_total">
                                <option value="yes" <?php selected($this->settings['include_order_total'], 'yes'); ?>>Sim</option>
                                <option value="no" <?php selected($this->settings['include_order_total'], 'no'); ?>>Não</option>
                            </select>
                        </div>
                        
                        <hr>
                        
                        <div class="cft-field">
                            <label>Exibição</label>
                            <label class="cft-checkbox">
                                <input type="checkbox" name="cft_email_tracking" value="yes" <?php checked($this->settings['email_tracking'], 'yes'); ?>>
                                Mostrar nos emails
                            </label>
                            <label class="cft-checkbox">
                                <input type="checkbox" name="cft_myaccount_tracking" value="yes" <?php checked($this->settings['myaccount_tracking'], 'yes'); ?>>
                                Mostrar em Minha Conta
                            </label>
                        </div>
                        
                        <?php submit_button('Salvar Configurações', 'primary', 'submit', false); ?>
                        <button type="button" class="button" id="cft-test-connection">Testar Conexão</button>
                    </form>
                </div>
                
                <div class="cft-card">
                    <h2>📤 Importação em Massa</h2>
                    <p>Envie todos os pedidos pendentes para o Cargo Flash.</p>
                    
                    <div class="cft-bulk-info">
                        <p><strong><?php echo $stats['pending']; ?></strong> pedidos aguardando envio</p>
                    </div>
                    
                    <button type="button" class="button button-primary cft-bulk-sync" style="width:100%;">
                        📤 Enviar Todos os Pendentes
                    </button>
                    
                    <div class="cft-progress">
                        <div class="cft-progress-bar"><div class="cft-progress-fill"></div></div>
                        <p class="cft-progress-text">Enviando...</p>
                    </div>
                    
                    <hr>
                    <h3>Como funciona</h3>
                    <ol>
                        <li>Configure a API Key acima</li>
                        <li>Clique em "Enviar Todos os Pendentes"</li>
                        <li>Os códigos serão gerados automaticamente</li>
                    </ol>
                </div>
            </div>
            
            <div class="cft-card cft-instructions">
                <h2>❓ Guia Rápido</h2>
                <div class="cft-instruction-grid">
                    <div class="cft-instruction">
                        <h4>1. Obter API Key</h4>
                        <p>Acesse Cargo Flash → Configurações → API Keys</p>
                    </div>
                    <div class="cft-instruction">
                        <h4>2. Configurar</h4>
                        <p>Cole a API Key e salve</p>
                    </div>
                    <div class="cft-instruction">
                        <h4>3. Pronto!</h4>
                        <p>Pedidos serão enviados automaticamente</p>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }
    
    private function test_connection() {
        if (empty($this->api_url) || empty($this->api_key)) {
            return ['success' => false, 'error' => 'URL ou API Key não configurada'];
        }
        
        $response = wp_remote_get($this->api_url . '/api/health', [
            'headers' => ['x-api-key' => $this->api_key],
            'timeout' => 15,
        ]);
        
        if (is_wp_error($response)) {
            return ['success' => false, 'error' => $response->get_error_message()];
        }
        
        $code = wp_remote_retrieve_response_code($response);
        if ($code !== 200) {
            return ['success' => false, 'error' => "HTTP $code"];
        }
        
        return ['success' => true];
    }
    
    // ==========================================
    // ORDER COLUMNS
    // ==========================================
    
    public function add_tracking_column($columns) {
        $new = [];
        foreach ($columns as $key => $value) {
            $new[$key] = $value;
            if ($key === 'order_status') {
                $new['cft_tracking'] = 'Rastreamento';
            }
        }
        return $new;
    }
    
    public function render_tracking_column($column, $post_id) {
        if ($column !== 'cft_tracking') return;
        $order = wc_get_order($post_id);
        if ($order) $this->render_tracking_badge($order);
    }
    
    public function render_tracking_column_hpos($column, $order) {
        if ($column !== 'cft_tracking') return;
        $this->render_tracking_badge($order);
    }
    
    private function render_tracking_badge($order) {
        $code = $this->get_tracking_code($order);
        if (!empty($code)) {
            $url = $this->api_url . '/rastrear/' . $code;
            printf('<a href="%s" target="_blank" class="cft-badge cft-badge-success">%s</a>', esc_url($url), esc_html($code));
        } else {
            echo '<span class="cft-badge cft-badge-pending">—</span>';
        }
    }
    
    // ==========================================
    // META BOX
    // ==========================================
    
    public function add_order_meta_box() {
        add_meta_box('cft_tracking', '📦 Cargo Flash', [$this, 'render_meta_box'], 'shop_order', 'side', 'high');
        add_meta_box('cft_tracking', '📦 Cargo Flash', [$this, 'render_meta_box'], 'woocommerce_page_wc-orders', 'side', 'high');
    }
    
    public function render_meta_box($post_or_order) {
        $order = is_a($post_or_order, 'WC_Order') ? $post_or_order : wc_get_order($post_or_order->ID);
        if (!$order) return;
        
        $code = $this->get_tracking_code($order);
        $url = $this->api_url . '/rastrear/' . $code;
        
        if (!empty($code)): ?>
            <p><strong>Código:</strong><br><span style="font-size:16px;color:#1e40af;"><?php echo esc_html($code); ?></span></p>
            <a href="<?php echo esc_url($url); ?>" target="_blank" class="button button-primary" style="width:100%;text-align:center;">Ver Rastreamento</a>
        <?php else: ?>
            <p style="color:#666;">Rastreamento não enviado</p>
            <button type="button" class="button button-primary cft-sync-btn" data-order-id="<?php echo $order->get_id(); ?>" style="width:100%;">📤 Enviar</button>
        <?php endif;
    }
    
    // ==========================================
    // EMAILS
    // ==========================================
    
    public function add_tracking_to_email($order, $sent_to_admin, $plain_text, $email) {
        if ($sent_to_admin || $this->settings['email_tracking'] !== 'yes') return;
        
        $code = $this->get_tracking_code($order);
        if (empty($code)) return;
        
        $url = $this->api_url . '/rastrear/' . $code;
        
        if ($plain_text) {
            echo "\n\nRASTREAMENTO: $code\nLink: $url\n";
        } else {
            ?>
            <div style="margin:30px 0;padding:25px;background:#f8fafc;border-radius:12px;border-left:4px solid #3b82f6;">
                <h3 style="margin:0 0 15px;color:#1e40af;">📦 Rastreamento</h3>
                <p style="margin:8px 0;"><strong>Código:</strong> <?php echo esc_html($code); ?></p>
                <p style="margin:20px 0 0;">
                    <a href="<?php echo esc_url($url); ?>" style="display:inline-block;padding:14px 28px;background:#3b82f6;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
                        🔍 Rastrear Meu Pedido
                    </a>
                </p>
            </div>
            <?php
        }
    }
    
    // ==========================================
    // MY ACCOUNT
    // ==========================================
    
    public function display_tracking_in_myaccount($order) {
        if ($this->settings['myaccount_tracking'] !== 'yes') return;
        
        $code = $this->get_tracking_code($order);
        if (empty($code)) return;
        
        $url = $this->api_url . '/rastrear/' . $code;
        ?>
        <section style="margin:30px 0;">
            <h2 style="color:#1e40af;">📦 Rastreamento</h2>
            <p><strong>Código:</strong> <?php echo esc_html($code); ?></p>
            <p><a href="<?php echo esc_url($url); ?>" target="_blank" class="button">🔍 Acompanhar Pedido</a></p>
        </section>
        <?php
    }
    
    public function display_tracking_widget($order_id) {
        $order = wc_get_order($order_id);
        if (!$order) return;
        
        $code = $this->get_tracking_code($order);
        if (empty($code)) return;
        
        $url = $this->api_url . '/rastrear/' . $code;
        ?>
        <div style="margin-bottom:30px;padding:20px;background:#eff6ff;border-radius:8px;border:1px solid #bfdbfe;">
            <p style="margin:0;font-size:16px;color:#1e40af;">
                <strong>📍 Rastreie:</strong>
                <a href="<?php echo esc_url($url); ?>" target="_blank" style="color:#2563eb;margin-left:10px;"><?php echo esc_html($code); ?> →</a>
            </p>
        </div>
        <?php
    }
    
    // ==========================================
    // BULK ACTIONS
    // ==========================================
    
    public function add_bulk_action($actions) {
        $actions['cft_send'] = 'Enviar para Cargo Flash';
        return $actions;
    }
    
    public function handle_bulk_action($redirect, $action, $order_ids) {
        if ($action !== 'cft_send') return $redirect;
        
        $success = 0;
        foreach ($order_ids as $id) {
            $result = $this->sync_order($id);
            if ($result['success']) $success++;
        }
        
        return add_query_arg('cft_bulk_sent', $success, $redirect);
    }
    
    public function show_bulk_action_notice() {
        if (empty($_GET['cft_bulk_sent'])) return;
        printf('<div class="notice notice-success is-dismissible"><p>%d pedido(s) enviado(s) para o Cargo Flash.</p></div>', intval($_GET['cft_bulk_sent']));
    }
    
    // ==========================================
    // AJAX HANDLERS
    // ==========================================
    
    public function ajax_sync_order() {
        check_ajax_referer('cft_ajax_nonce', 'nonce');
        
        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error(['error' => 'Sem permissão']);
        }
        
        $order_id = intval($_POST['order_id'] ?? 0);
        $result = $this->sync_order($order_id);
        
        $result['success'] ? wp_send_json_success($result) : wp_send_json_error($result);
    }
    
    public function ajax_bulk_sync() {
        check_ajax_referer('cft_ajax_nonce', 'nonce');
        
        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error(['error' => 'Sem permissão']);
        }
        
        $trigger = $this->settings['trigger_status'];
        $orders = wc_get_orders([
            'status' => $trigger,
            'limit' => 100,
        ]);
        
        $success = 0;
        $failed = 0;
        
        foreach ($orders as $order) {
            $existing = $this->get_tracking_code($order);
            if (!empty($existing)) continue;
            
            $result = $this->sync_order($order->get_id());
            $result['success'] ? $success++ : $failed++;
        }
        
        wp_send_json_success([
            'success_count' => $success,
            'failed_count' => $failed,
            'message' => "$success enviados, $failed falhas",
        ]);
    }
    
    public function ajax_test_connection() {
        check_ajax_referer('cft_ajax_nonce', 'nonce');
        
        // Reload settings
        $this->api_url = rtrim(get_option('cft_api_url', ''), '/');
        $this->api_key = get_option('cft_api_key', '');
        
        $result = $this->test_connection();
        $result['success'] ? wp_send_json_success(['message' => 'Conexão OK!']) : wp_send_json_error($result);
    }
    
    // ==========================================
    // LOGGING
    // ==========================================
    
    private function log($message) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('[Cargo Flash] ' . $message);
        }
    }
}

// Initialize
add_action('plugins_loaded', function() {
    if (class_exists('WooCommerce')) {
        Cargo_Flash_Tracking::get_instance();
    }
});

// Activation
register_activation_hook(__FILE__, function() {
    if (!class_exists('WooCommerce')) {
        deactivate_plugins(plugin_basename(__FILE__));
        wp_die('Este plugin requer o WooCommerce.');
    }
});
