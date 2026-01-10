<?php
/**
 * Plugin Name: Cargo Flash Tracking
 * Plugin URI: https://github.com/cargoflash/woocommerce-plugin
 * Description: Integração automática de rastreamento Cargo Flash com WooCommerce. Envia pedidos automaticamente para o sistema de rastreamento.
 * Version: 1.0.0
 * Author: Cargo Flash
 * Author URI: https://cargoflash.com.br
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: cargo-flash-tracking
 * Domain Path: /languages
 * WC requires at least: 5.0
 * WC tested up to: 8.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Define constants
define('CARGO_FLASH_VERSION', '1.0.0');
define('CARGO_FLASH_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('CARGO_FLASH_PLUGIN_URL', plugin_dir_url(__FILE__));

// Declare HPOS compatibility
add_action('before_woocommerce_init', function() {
    if (class_exists(\Automattic\WooCommerce\Utilities\FeaturesUtil::class)) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true);
    }
});

/**
 * Main Plugin Class
 */
class Cargo_Flash_Tracking {
    
    private static $instance = null;
    private $api_url;
    private $api_key;
    
    /**
     * Get singleton instance
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor
     */
    private function __construct() {
        $this->api_url = get_option('cargo_flash_api_url', '');
        $this->api_key = get_option('cargo_flash_api_key', '');
        
        // Admin hooks
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_enqueue_scripts', array($this, 'admin_styles'));
        
        // WooCommerce hooks
        add_action('woocommerce_order_status_processing', array($this, 'send_order_to_cargo_flash'));
        add_action('woocommerce_order_status_completed', array($this, 'send_order_to_cargo_flash'));
        
        // Add tracking column to orders
        add_filter('manage_edit-shop_order_columns', array($this, 'add_tracking_column'));
        add_action('manage_shop_order_posts_custom_column', array($this, 'display_tracking_column'), 10, 2);
        
        // HPOS compatibility (WooCommerce 8.0+)
        add_filter('manage_woocommerce_page_wc-orders_columns', array($this, 'add_tracking_column'));
        add_action('manage_woocommerce_page_wc-orders_custom_column', array($this, 'display_tracking_column_hpos'), 10, 2);
        
        // Add tracking info to order emails
        add_action('woocommerce_email_after_order_table', array($this, 'add_tracking_to_email'), 10, 4);
        
        // Add tracking info to order details
        add_action('woocommerce_order_details_after_order_table', array($this, 'display_tracking_info'));
        
        // Add meta box to order edit page
        add_action('add_meta_boxes', array($this, 'add_order_meta_box'));
        
        // AJAX handler for manual sync
        add_action('wp_ajax_cargo_flash_sync_order', array($this, 'ajax_sync_order'));
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_submenu_page(
            'woocommerce',
            'Cargo Flash Tracking',
            'Cargo Flash',
            'manage_woocommerce',
            'cargo-flash-tracking',
            array($this, 'render_settings_page')
        );
    }
    
    /**
     * Register settings
     */
    public function register_settings() {
        register_setting('cargo_flash_settings', 'cargo_flash_api_url');
        register_setting('cargo_flash_settings', 'cargo_flash_api_key');
        register_setting('cargo_flash_settings', 'cargo_flash_auto_send');
        register_setting('cargo_flash_settings', 'cargo_flash_order_status');
    }
    
    /**
     * Admin styles
     */
    public function admin_styles($hook) {
        if (strpos($hook, 'cargo-flash') === false) {
            return;
        }
        
        wp_add_inline_style('wp-admin', '
            .cargo-flash-settings {
                max-width: 800px;
                background: #fff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                margin-top: 20px;
            }
            .cargo-flash-settings h1 {
                color: #0066cc;
                border-bottom: 2px solid #0066cc;
                padding-bottom: 15px;
            }
            .cargo-flash-field {
                margin-bottom: 25px;
            }
            .cargo-flash-field label {
                display: block;
                font-weight: 600;
                margin-bottom: 8px;
                color: #333;
            }
            .cargo-flash-field input[type="text"],
            .cargo-flash-field input[type="url"],
            .cargo-flash-field select {
                width: 100%;
                padding: 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }
            .cargo-flash-field .description {
                color: #666;
                font-size: 13px;
                margin-top: 5px;
            }
            .cargo-flash-status {
                padding: 15px;
                border-radius: 4px;
                margin-bottom: 20px;
            }
            .cargo-flash-status.success {
                background: #d4edda;
                border: 1px solid #c3e6cb;
                color: #155724;
            }
            .cargo-flash-status.error {
                background: #f8d7da;
                border: 1px solid #f5c6cb;
                color: #721c24;
            }
            .cargo-flash-test-btn {
                background: #0066cc !important;
                border-color: #0055b3 !important;
                color: #fff !important;
                padding: 10px 25px !important;
            }
        ');
    }
    
    /**
     * Render settings page
     */
    public function render_settings_page() {
        $connection_status = $this->test_connection();
        ?>
        <div class="wrap cargo-flash-settings">
            <h1>🚚 Cargo Flash Tracking</h1>
            
            <?php if ($connection_status['success']): ?>
                <div class="cargo-flash-status success">
                    ✅ Conexão com Cargo Flash estabelecida com sucesso!
                </div>
            <?php elseif (!empty($this->api_url) && !empty($this->api_key)): ?>
                <div class="cargo-flash-status error">
                    ❌ Erro de conexão: <?php echo esc_html($connection_status['error']); ?>
                </div>
            <?php endif; ?>
            
            <form method="post" action="options.php">
                <?php settings_fields('cargo_flash_settings'); ?>
                
                <div class="cargo-flash-field">
                    <label for="cargo_flash_api_url">URL da API Cargo Flash</label>
                    <input type="url" 
                           id="cargo_flash_api_url" 
                           name="cargo_flash_api_url" 
                           value="<?php echo esc_attr(get_option('cargo_flash_api_url')); ?>"
                           placeholder="https://seu-cargo-flash.vercel.app">
                    <p class="description">
                        URL base do sistema Cargo Flash (ex: https://rastreamento.suaempresa.com.br)
                    </p>
                </div>
                
                <div class="cargo-flash-field">
                    <label for="cargo_flash_api_key">Chave de API</label>
                    <input type="text" 
                           id="cargo_flash_api_key" 
                           name="cargo_flash_api_key" 
                           value="<?php echo esc_attr(get_option('cargo_flash_api_key')); ?>"
                           placeholder="cf_xxxxxxxxxxxx">
                    <p class="description">
                        Chave de API gerada no painel administrativo do Cargo Flash
                    </p>
                </div>
                
                <div class="cargo-flash-field">
                    <label for="cargo_flash_auto_send">Envio Automático</label>
                    <select id="cargo_flash_auto_send" name="cargo_flash_auto_send">
                        <option value="1" <?php selected(get_option('cargo_flash_auto_send', '1'), '1'); ?>>
                            Ativado - Enviar pedidos automaticamente
                        </option>
                        <option value="0" <?php selected(get_option('cargo_flash_auto_send'), '0'); ?>>
                            Desativado - Enviar manualmente
                        </option>
                    </select>
                </div>
                
                <div class="cargo-flash-field">
                    <label for="cargo_flash_order_status">Enviar quando o pedido estiver em</label>
                    <select id="cargo_flash_order_status" name="cargo_flash_order_status">
                        <option value="processing" <?php selected(get_option('cargo_flash_order_status', 'processing'), 'processing'); ?>>
                            Processando
                        </option>
                        <option value="completed" <?php selected(get_option('cargo_flash_order_status'), 'completed'); ?>>
                            Concluído
                        </option>
                    </select>
                </div>
                
                <?php submit_button('Salvar Configurações'); ?>
            </form>
            
            <hr style="margin: 30px 0;">
            
            <h2>📋 Instruções de Configuração</h2>
            <ol>
                <li>Acesse o painel administrativo do Cargo Flash</li>
                <li>Vá em <strong>Configurações > API Keys</strong></li>
                <li>Crie uma nova chave de API</li>
                <li>Copie a chave e cole no campo acima</li>
                <li>Salve as configurações</li>
            </ol>
            
            <h3>Endpoint do Webhook</h3>
            <code style="background: #f1f1f1; padding: 10px; display: block; border-radius: 4px;">
                POST <?php echo esc_html(get_option('cargo_flash_api_url')); ?>/api/webhooks/woocommerce
            </code>
        </div>
        <?php
    }
    
    /**
     * Test API connection
     */
    private function test_connection() {
        if (empty($this->api_url) || empty($this->api_key)) {
            return array('success' => false, 'error' => 'Configurações incompletas');
        }
        
        $response = wp_remote_get(
            trailingslashit($this->api_url) . 'api/health',
            array(
                'headers' => array(
                    'x-api-key' => $this->api_key
                ),
                'timeout' => 10
            )
        );
        
        if (is_wp_error($response)) {
            return array('success' => false, 'error' => $response->get_error_message());
        }
        
        $code = wp_remote_retrieve_response_code($response);
        if ($code !== 200) {
            return array('success' => false, 'error' => "HTTP $code");
        }
        
        return array('success' => true);
    }
    
    /**
     * Send order to Cargo Flash
     */
    public function send_order_to_cargo_flash($order_id) {
        // Check if auto-send is enabled
        if (get_option('cargo_flash_auto_send', '1') !== '1') {
            return;
        }
        
        // Check if already sent
        $tracking_code = get_post_meta($order_id, '_cargo_flash_tracking_code', true);
        if (!empty($tracking_code)) {
            return;
        }
        
        $this->sync_order($order_id);
    }
    
    /**
     * Sync order with Cargo Flash
     */
    public function sync_order($order_id) {
        $order = wc_get_order($order_id);
        if (!$order) {
            return array('success' => false, 'error' => 'Pedido não encontrado');
        }
        
        if (empty($this->api_url) || empty($this->api_key)) {
            return array('success' => false, 'error' => 'Configurações incompletas');
        }
        
        // Build items array
        $items = array();
        foreach ($order->get_items() as $item) {
            $items[] = array(
                'name' => $item->get_name(),
                'quantity' => $item->get_quantity(),
                'sku' => $item->get_product() ? $item->get_product()->get_sku() : '',
            );
        }
        
        // Build payload
        $payload = array(
            'order_id' => $order->get_order_number(),
            'customer' => array(
                'name' => $order->get_shipping_first_name() . ' ' . $order->get_shipping_last_name(),
                'email' => $order->get_billing_email(),
                'phone' => $order->get_billing_phone(),
                'address' => array(
                    'street' => $order->get_shipping_address_1(),
                    'complement' => $order->get_shipping_address_2(),
                    'city' => $order->get_shipping_city(),
                    'state' => $order->get_shipping_state(),
                    'zip' => $order->get_shipping_postcode(),
                    'country' => $order->get_shipping_country(),
                ),
            ),
            'items' => $items,
        );
        
        // Send request
        $response = wp_remote_post(
            trailingslashit($this->api_url) . 'api/webhooks/woocommerce',
            array(
                'headers' => array(
                    'Content-Type' => 'application/json',
                    'x-api-key' => $this->api_key,
                ),
                'body' => json_encode($payload),
                'timeout' => 30,
            )
        );
        
        if (is_wp_error($response)) {
            $order->add_order_note('❌ Cargo Flash: Erro ao enviar - ' . $response->get_error_message());
            return array('success' => false, 'error' => $response->get_error_message());
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        $code = wp_remote_retrieve_response_code($response);
        
        if ($code !== 200 || empty($body['success'])) {
            $error = isset($body['error']) ? $body['error'] : "HTTP $code";
            $order->add_order_note('❌ Cargo Flash: ' . $error);
            return array('success' => false, 'error' => $error);
        }
        
        // Save tracking code
        $tracking_code = $body['tracking_code'];
        update_post_meta($order_id, '_cargo_flash_tracking_code', $tracking_code);
        update_post_meta($order_id, '_cargo_flash_delivery_id', $body['delivery_id']);
        update_post_meta($order_id, '_cargo_flash_estimated_delivery', $body['estimated_delivery']);
        
        // For HPOS orders
        if (method_exists($order, 'update_meta_data')) {
            $order->update_meta_data('_cargo_flash_tracking_code', $tracking_code);
            $order->update_meta_data('_cargo_flash_delivery_id', $body['delivery_id']);
            $order->update_meta_data('_cargo_flash_estimated_delivery', $body['estimated_delivery']);
            $order->save();
        }
        
        // Add order note
        $tracking_url = trailingslashit($this->api_url) . 'rastrear/' . $tracking_code;
        $order->add_order_note(sprintf(
            '✅ Cargo Flash: Código de rastreamento gerado: %s - <a href="%s" target="_blank">Rastrear</a>',
            $tracking_code,
            esc_url($tracking_url)
        ));
        
        return array(
            'success' => true,
            'tracking_code' => $tracking_code,
            'tracking_url' => $tracking_url,
        );
    }
    
    /**
     * Add tracking column to orders list
     */
    public function add_tracking_column($columns) {
        $new_columns = array();
        foreach ($columns as $key => $value) {
            $new_columns[$key] = $value;
            if ($key === 'order_status') {
                $new_columns['cargo_flash'] = 'Rastreamento';
            }
        }
        return $new_columns;
    }
    
    /**
     * Display tracking column (legacy)
     */
    public function display_tracking_column($column, $post_id) {
        if ($column !== 'cargo_flash') {
            return;
        }
        
        $tracking_code = get_post_meta($post_id, '_cargo_flash_tracking_code', true);
        $this->render_tracking_badge($tracking_code, $post_id);
    }
    
    /**
     * Display tracking column (HPOS)
     */
    public function display_tracking_column_hpos($column, $order) {
        if ($column !== 'cargo_flash') {
            return;
        }
        
        $tracking_code = $order->get_meta('_cargo_flash_tracking_code');
        $this->render_tracking_badge($tracking_code, $order->get_id());
    }
    
    /**
     * Render tracking badge
     */
    private function render_tracking_badge($tracking_code, $order_id) {
        if (!empty($tracking_code)) {
            $tracking_url = trailingslashit($this->api_url) . 'rastrear/' . $tracking_code;
            printf(
                '<a href="%s" target="_blank" style="background:#0066cc;color:#fff;padding:4px 8px;border-radius:3px;text-decoration:none;font-size:11px;">%s</a>',
                esc_url($tracking_url),
                esc_html($tracking_code)
            );
        } else {
            echo '<span style="color:#999;font-size:12px;">—</span>';
        }
    }
    
    /**
     * Add tracking to email
     */
    public function add_tracking_to_email($order, $sent_to_admin, $plain_text, $email) {
        if ($sent_to_admin) {
            return;
        }
        
        $tracking_code = $order->get_meta('_cargo_flash_tracking_code');
        if (empty($tracking_code)) {
            $tracking_code = get_post_meta($order->get_id(), '_cargo_flash_tracking_code', true);
        }
        
        if (empty($tracking_code)) {
            return;
        }
        
        $tracking_url = trailingslashit($this->api_url) . 'rastrear/' . $tracking_code;
        $estimated = $order->get_meta('_cargo_flash_estimated_delivery');
        if (empty($estimated)) {
            $estimated = get_post_meta($order->get_id(), '_cargo_flash_estimated_delivery', true);
        }
        
        if ($plain_text) {
            echo "\n\n===========================================\n";
            echo "RASTREAMENTO DO PEDIDO\n";
            echo "===========================================\n";
            echo "Código: $tracking_code\n";
            echo "Rastrear: $tracking_url\n";
            if ($estimated) {
                echo "Previsão de entrega: " . date('d/m/Y', strtotime($estimated)) . "\n";
            }
        } else {
            ?>
            <div style="margin: 20px 0; padding: 20px; background: #f8f9fa; border-left: 4px solid #0066cc; border-radius: 4px;">
                <h3 style="margin: 0 0 15px; color: #0066cc;">📦 Rastreamento do Pedido</h3>
                <p style="margin: 5px 0;">
                    <strong>Código de rastreamento:</strong> <?php echo esc_html($tracking_code); ?>
                </p>
                <?php if ($estimated): ?>
                <p style="margin: 5px 0;">
                    <strong>Previsão de entrega:</strong> <?php echo date('d/m/Y', strtotime($estimated)); ?>
                </p>
                <?php endif; ?>
                <p style="margin: 15px 0 0;">
                    <a href="<?php echo esc_url($tracking_url); ?>" 
                       style="display: inline-block; padding: 12px 25px; background: #0066cc; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">
                        🔍 Rastrear Pedido
                    </a>
                </p>
            </div>
            <?php
        }
    }
    
    /**
     * Display tracking info on order details
     */
    public function display_tracking_info($order) {
        $tracking_code = $order->get_meta('_cargo_flash_tracking_code');
        if (empty($tracking_code)) {
            $tracking_code = get_post_meta($order->get_id(), '_cargo_flash_tracking_code', true);
        }
        
        if (empty($tracking_code)) {
            return;
        }
        
        $tracking_url = trailingslashit($this->api_url) . 'rastrear/' . $tracking_code;
        $estimated = $order->get_meta('_cargo_flash_estimated_delivery');
        if (empty($estimated)) {
            $estimated = get_post_meta($order->get_id(), '_cargo_flash_estimated_delivery', true);
        }
        ?>
        <section class="woocommerce-tracking-info" style="margin-top: 30px;">
            <h2 style="color: #0066cc;">📦 Rastreamento da Entrega</h2>
            <table class="woocommerce-table" style="width: 100%;">
                <tr>
                    <th style="text-align: left; padding: 10px;">Código de Rastreamento</th>
                    <td style="padding: 10px;">
                        <strong><?php echo esc_html($tracking_code); ?></strong>
                    </td>
                </tr>
                <?php if ($estimated): ?>
                <tr>
                    <th style="text-align: left; padding: 10px;">Previsão de Entrega</th>
                    <td style="padding: 10px;"><?php echo date('d/m/Y', strtotime($estimated)); ?></td>
                </tr>
                <?php endif; ?>
                <tr>
                    <td colspan="2" style="padding: 15px 10px;">
                        <a href="<?php echo esc_url($tracking_url); ?>" 
                           target="_blank"
                           style="display: inline-block; padding: 12px 25px; background: #0066cc; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">
                            🔍 Acompanhar Pedido
                        </a>
                    </td>
                </tr>
            </table>
        </section>
        <?php
    }
    
    /**
     * Add meta box to order edit
     */
    public function add_order_meta_box() {
        add_meta_box(
            'cargo_flash_tracking',
            '📦 Cargo Flash Tracking',
            array($this, 'render_order_meta_box'),
            'shop_order',
            'side',
            'high'
        );
        
        // HPOS compatibility
        add_meta_box(
            'cargo_flash_tracking',
            '📦 Cargo Flash Tracking',
            array($this, 'render_order_meta_box'),
            'woocommerce_page_wc-orders',
            'side',
            'high'
        );
    }
    
    /**
     * Render order meta box
     */
    public function render_order_meta_box($post_or_order) {
        $order_id = is_a($post_or_order, 'WC_Order') ? $post_or_order->get_id() : $post_or_order->ID;
        $order = wc_get_order($order_id);
        
        $tracking_code = $order->get_meta('_cargo_flash_tracking_code');
        if (empty($tracking_code)) {
            $tracking_code = get_post_meta($order_id, '_cargo_flash_tracking_code', true);
        }
        
        wp_nonce_field('cargo_flash_sync', 'cargo_flash_nonce');
        ?>
        <div style="padding: 10px 0;">
            <?php if (!empty($tracking_code)): ?>
                <?php $tracking_url = trailingslashit($this->api_url) . 'rastrear/' . $tracking_code; ?>
                <p style="margin: 0 0 10px;">
                    <strong>Código:</strong><br>
                    <a href="<?php echo esc_url($tracking_url); ?>" target="_blank" 
                       style="font-size: 16px; color: #0066cc;">
                        <?php echo esc_html($tracking_code); ?>
                    </a>
                </p>
                <?php 
                $estimated = $order->get_meta('_cargo_flash_estimated_delivery');
                if (empty($estimated)) {
                    $estimated = get_post_meta($order_id, '_cargo_flash_estimated_delivery', true);
                }
                if ($estimated): 
                ?>
                <p style="margin: 0 0 10px;">
                    <strong>Previsão:</strong><br>
                    <?php echo date('d/m/Y', strtotime($estimated)); ?>
                </p>
                <?php endif; ?>
                <a href="<?php echo esc_url($tracking_url); ?>" 
                   target="_blank"
                   class="button button-primary"
                   style="width: 100%; text-align: center;">
                    Ver Rastreamento
                </a>
            <?php else: ?>
                <p style="color: #666; margin: 0 0 10px;">
                    Pedido ainda não enviado para o Cargo Flash.
                </p>
                <button type="button" 
                        class="button button-primary cargo-flash-sync-btn"
                        data-order-id="<?php echo esc_attr($order_id); ?>"
                        style="width: 100%;">
                    📤 Enviar para Cargo Flash
                </button>
            <?php endif; ?>
        </div>
        
        <script>
        jQuery(function($) {
            $('.cargo-flash-sync-btn').on('click', function() {
                var btn = $(this);
                var orderId = btn.data('order-id');
                
                btn.prop('disabled', true).text('Enviando...');
                
                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'cargo_flash_sync_order',
                        order_id: orderId,
                        nonce: $('#cargo_flash_nonce').val()
                    },
                    success: function(response) {
                        if (response.success) {
                            location.reload();
                        } else {
                            alert('Erro: ' + response.data.error);
                            btn.prop('disabled', false).text('📤 Enviar para Cargo Flash');
                        }
                    },
                    error: function() {
                        alert('Erro de conexão');
                        btn.prop('disabled', false).text('📤 Enviar para Cargo Flash');
                    }
                });
            });
        });
        </script>
        <?php
    }
    
    /**
     * AJAX handler for manual sync
     */
    public function ajax_sync_order() {
        check_ajax_referer('cargo_flash_sync', 'nonce');
        
        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error(array('error' => 'Sem permissão'));
        }
        
        $order_id = intval($_POST['order_id']);
        $result = $this->sync_order($order_id);
        
        if ($result['success']) {
            wp_send_json_success($result);
        } else {
            wp_send_json_error($result);
        }
    }
}

// Initialize plugin
add_action('plugins_loaded', function() {
    if (class_exists('WooCommerce')) {
        Cargo_Flash_Tracking::get_instance();
    }
});

// Activation hook
register_activation_hook(__FILE__, function() {
    if (!class_exists('WooCommerce')) {
        deactivate_plugins(plugin_basename(__FILE__));
        wp_die('Este plugin requer o WooCommerce instalado e ativado.');
    }
});
