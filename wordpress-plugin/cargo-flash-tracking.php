<?php
/**
 * Plugin Name: Cargo Flash Tracking
 * Plugin URI: https://cargoflash.com.br
 * Description: Integração completa de rastreamento Cargo Flash com WooCommerce. Envio automático de pedidos, rastreamento em emails e área do cliente.
 * Version: 2.0.0
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
define('CFT_VERSION', '2.0.0');
define('CFT_PLUGIN_FILE', __FILE__);
define('CFT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('CFT_PLUGIN_URL', plugin_dir_url(__FILE__));
define('CFT_PLUGIN_BASENAME', plugin_basename(__FILE__));

// Declare HPOS and Cart/Checkout Blocks compatibility
add_action('before_woocommerce_init', function() {
    if (class_exists(\Automattic\WooCommerce\Utilities\FeaturesUtil::class)) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true);
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('cart_checkout_blocks', __FILE__, true);
    }
});

/**
 * Main Plugin Class - Cargo Flash Tracking v2.0
 */
class Cargo_Flash_Tracking_V2 {
    
    private static $instance = null;
    private $api_url;
    private $api_key;
    private $settings = [];
    
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
        $this->load_settings();
        $this->init_hooks();
    }
    
    /**
     * Load settings
     */
    private function load_settings() {
        $this->api_url = get_option('cft_api_url', '');
        $this->api_key = get_option('cft_api_key', '');
        $this->settings = [
            'auto_send' => get_option('cft_auto_send', 'yes'),
            'trigger_status' => get_option('cft_trigger_status', 'processing'),
            'include_order_total' => get_option('cft_include_order_total', 'yes'),
            'email_tracking' => get_option('cft_email_tracking', 'yes'),
            'myaccount_tracking' => get_option('cft_myaccount_tracking', 'yes'),
        ];
    }
    
    /**
     * Initialize hooks
     */
    private function init_hooks() {
        // Admin
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'register_settings']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
        
        // Order status triggers
        add_action('woocommerce_order_status_processing', [$this, 'maybe_send_order']);
        add_action('woocommerce_order_status_completed', [$this, 'maybe_send_order']);
        add_action('woocommerce_order_status_on-hold', [$this, 'maybe_send_order']);
        
        // Orders list
        add_filter('manage_edit-shop_order_columns', [$this, 'add_tracking_column']);
        add_action('manage_shop_order_posts_custom_column', [$this, 'render_tracking_column'], 10, 2);
        
        // HPOS Orders list
        add_filter('manage_woocommerce_page_wc-orders_columns', [$this, 'add_tracking_column']);
        add_action('manage_woocommerce_page_wc-orders_custom_column', [$this, 'render_tracking_column_hpos'], 10, 2);
        
        // Order meta box
        add_action('add_meta_boxes', [$this, 'add_order_meta_box']);
        
        // Emails
        add_action('woocommerce_email_after_order_table', [$this, 'add_tracking_to_email'], 15, 4);
        
        // My Account
        add_action('woocommerce_order_details_after_order_table', [$this, 'display_tracking_in_myaccount'], 10);
        add_action('woocommerce_view_order', [$this, 'display_tracking_widget'], 5);
        
        // AJAX handlers
        add_action('wp_ajax_cft_sync_order', [$this, 'ajax_sync_order']);
        add_action('wp_ajax_cft_bulk_sync', [$this, 'ajax_bulk_sync']);
        add_action('wp_ajax_cft_test_connection', [$this, 'ajax_test_connection']);
        
        // Bulk actions
        add_filter('bulk_actions-edit-shop_order', [$this, 'add_bulk_action']);
        add_filter('bulk_actions-woocommerce_page_wc-orders', [$this, 'add_bulk_action']);
        add_filter('handle_bulk_actions-edit-shop_order', [$this, 'handle_bulk_action'], 10, 3);
        add_filter('handle_bulk_actions-woocommerce_page_wc-orders', [$this, 'handle_bulk_action'], 10, 3);
        
        // Admin notices
        add_action('admin_notices', [$this, 'show_bulk_action_notice']);
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_submenu_page(
            'woocommerce',
            __('Cargo Flash Tracking', 'cargo-flash-tracking'),
            __('Cargo Flash', 'cargo-flash-tracking'),
            'manage_woocommerce',
            'cargo-flash',
            [$this, 'render_settings_page']
        );
    }
    
    /**
     * Register settings
     */
    public function register_settings() {
        register_setting('cft_settings', 'cft_api_url', ['sanitize_callback' => 'esc_url_raw']);
        register_setting('cft_settings', 'cft_api_key', ['sanitize_callback' => 'sanitize_text_field']);
        register_setting('cft_settings', 'cft_auto_send', ['sanitize_callback' => 'sanitize_text_field']);
        register_setting('cft_settings', 'cft_trigger_status', ['sanitize_callback' => 'sanitize_text_field']);
        register_setting('cft_settings', 'cft_include_order_total', ['sanitize_callback' => 'sanitize_text_field']);
        register_setting('cft_settings', 'cft_email_tracking', ['sanitize_callback' => 'sanitize_text_field']);
        register_setting('cft_settings', 'cft_myaccount_tracking', ['sanitize_callback' => 'sanitize_text_field']);
    }
    
    /**
     * Enqueue admin assets
     */
    public function enqueue_admin_assets($hook) {
        if (strpos($hook, 'cargo-flash') === false && strpos($hook, 'wc-orders') === false && strpos($hook, 'edit.php') === false) {
            return;
        }
        
        wp_enqueue_style('cft-admin', CFT_PLUGIN_URL . 'assets/css/admin.css', [], CFT_VERSION);
        wp_enqueue_script('cft-admin', CFT_PLUGIN_URL . 'assets/js/admin.js', ['jquery'], CFT_VERSION, true);
        wp_localize_script('cft-admin', 'cftAjax', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('cft_ajax_nonce'),
        ]);
    }
    
    /**
     * Render settings page
     */
    public function render_settings_page() {
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
                    <?php if ($connection['success']): ?>
                        <span class="dashicons dashicons-yes-alt"></span> Conectado
                    <?php else: ?>
                        <span class="dashicons dashicons-warning"></span> Desconectado
                    <?php endif; ?>
                </div>
            </div>
            
            <?php if (!empty($this->api_url) && !$connection['success']): ?>
            <div class="notice notice-error">
                <p><strong>Erro de conexão:</strong> <?php echo esc_html($connection['error']); ?></p>
            </div>
            <?php endif; ?>
            
            <!-- Stats Cards -->
            <div class="cft-stats-grid">
                <div class="cft-stat-card">
                    <div class="cft-stat-icon">📦</div>
                    <div class="cft-stat-content">
                        <span class="cft-stat-number"><?php echo number_format_i18n($stats['total']); ?></span>
                        <span class="cft-stat-label">Pedidos Enviados</span>
                    </div>
                </div>
                <div class="cft-stat-card">
                    <div class="cft-stat-icon">⏳</div>
                    <div class="cft-stat-content">
                        <span class="cft-stat-number"><?php echo number_format_i18n($stats['pending']); ?></span>
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
                <!-- Settings Form -->
                <div class="cft-card cft-settings-card">
                    <h2><span class="dashicons dashicons-admin-settings"></span> Configurações</h2>
                    <form method="post" action="options.php">
                        <?php settings_fields('cft_settings'); ?>
                        
                        <div class="cft-field">
                            <label for="cft_api_url">URL da API</label>
                            <input type="url" 
                                   id="cft_api_url" 
                                   name="cft_api_url" 
                                   value="<?php echo esc_attr($this->api_url); ?>"
                                   placeholder="https://cargoflash.com.br"
                                   class="regular-text">
                            <p class="description">URL do sistema Cargo Flash</p>
                        </div>
                        
                        <div class="cft-field">
                            <label for="cft_api_key">Chave de API</label>
                            <input type="password" 
                                   id="cft_api_key" 
                                   name="cft_api_key" 
                                   value="<?php echo esc_attr($this->api_key); ?>"
                                   placeholder="cf_xxxxxxxxxxxx"
                                   class="regular-text">
                            <p class="description">Gerada em Cargo Flash → Configurações → API Keys</p>
                        </div>
                        
                        <hr>
                        
                        <div class="cft-field">
                            <label for="cft_auto_send">Envio Automático</label>
                            <select id="cft_auto_send" name="cft_auto_send">
                                <option value="yes" <?php selected($this->settings['auto_send'], 'yes'); ?>>Ativado</option>
                                <option value="no" <?php selected($this->settings['auto_send'], 'no'); ?>>Desativado</option>
                            </select>
                        </div>
                        
                        <div class="cft-field">
                            <label for="cft_trigger_status">Enviar quando status for</label>
                            <select id="cft_trigger_status" name="cft_trigger_status">
                                <option value="processing" <?php selected($this->settings['trigger_status'], 'processing'); ?>>Processando</option>
                                <option value="completed" <?php selected($this->settings['trigger_status'], 'completed'); ?>>Concluído</option>
                                <option value="on-hold" <?php selected($this->settings['trigger_status'], 'on-hold'); ?>>Aguardando</option>
                            </select>
                        </div>
                        
                        <div class="cft-field">
                            <label for="cft_include_order_total">Incluir valor do pedido</label>
                            <select id="cft_include_order_total" name="cft_include_order_total">
                                <option value="yes" <?php selected($this->settings['include_order_total'], 'yes'); ?>>Sim (para seguro)</option>
                                <option value="no" <?php selected($this->settings['include_order_total'], 'no'); ?>>Não</option>
                            </select>
                            <p class="description">Envia o valor total para cálculo de seguro</p>
                        </div>
                        
                        <hr>
                        
                        <div class="cft-field">
                            <label>Exibição do Rastreamento</label>
                            <label class="cft-checkbox">
                                <input type="checkbox" name="cft_email_tracking" value="yes" 
                                       <?php checked($this->settings['email_tracking'], 'yes'); ?>>
                                Mostrar nos emails do WooCommerce
                            </label>
                            <label class="cft-checkbox">
                                <input type="checkbox" name="cft_myaccount_tracking" value="yes" 
                                       <?php checked($this->settings['myaccount_tracking'], 'yes'); ?>>
                                Mostrar em Minha Conta
                            </label>
                        </div>
                        
                        <?php submit_button('Salvar Configurações', 'primary', 'submit', false); ?>
                        <button type="button" class="button cft-test-btn" id="cft-test-connection">
                            <span class="dashicons dashicons-update"></span> Testar Conexão
                        </button>
                    </form>
                </div>
                
                <!-- Bulk Import -->
                <div class="cft-card">
                    <h2><span class="dashicons dashicons-upload"></span> Importação em Massa</h2>
                    <p>Envie todos os pedidos pendentes de uma só vez para o Cargo Flash.</p>
                    
                    <div class="cft-bulk-info">
                        <p><strong><?php echo $stats['pending']; ?></strong> pedidos aguardando envio</p>
                    </div>
                    
                    <button type="button" class="button button-primary cft-bulk-sync" 
                            <?php echo $stats['pending'] == 0 ? 'disabled' : ''; ?>>
                        <span class="dashicons dashicons-upload"></span>
                        Enviar Todos os Pendentes
                    </button>
                    
                    <div class="cft-bulk-progress" style="display: none;">
                        <div class="cft-progress-bar">
                            <div class="cft-progress-fill"></div>
                        </div>
                        <p class="cft-progress-text">Enviando 0 de 0...</p>
                    </div>
                    
                    <hr>
                    
                    <h3>Como funciona</h3>
                    <ol>
                        <li>Configure a API Key acima</li>
                        <li>Clique em "Enviar Todos os Pendentes"</li>
                        <li>Os códigos de rastreio serão gerados automaticamente</li>
                        <li>Os clientes receberão os códigos por email</li>
                    </ol>
                </div>
            </div>
            
            <!-- Instructions -->
            <div class="cft-card cft-instructions">
                <h2><span class="dashicons dashicons-editor-help"></span> Guia Rápido</h2>
                <div class="cft-instruction-grid">
                    <div class="cft-instruction">
                        <h4>1. Obter API Key</h4>
                        <p>Acesse <a href="<?php echo esc_url($this->api_url); ?>/admin/configuracoes" target="_blank">Cargo Flash → Configurações</a> e crie uma nova API Key</p>
                    </div>
                    <div class="cft-instruction">
                        <h4>2. Configurar Plugin</h4>
                        <p>Cole a API Key nesta página e salve as configurações</p>
                    </div>
                    <div class="cft-instruction">
                        <h4>3. Pronto!</h4>
                        <p>Novos pedidos serão enviados automaticamente e os clientes poderão rastrear</p>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }
    
    /**
     * Test API connection
     */
    private function test_connection() {
        if (empty($this->api_url) || empty($this->api_key)) {
            return ['success' => false, 'error' => 'Configurações incompletas'];
        }
        
        $response = wp_remote_get(
            trailingslashit($this->api_url) . 'api/health',
            [
                'headers' => ['x-api-key' => $this->api_key],
                'timeout' => 15,
                'sslverify' => true,
            ]
        );
        
        if (is_wp_error($response)) {
            return ['success' => false, 'error' => $response->get_error_message()];
        }
        
        $code = wp_remote_retrieve_response_code($response);
        if ($code !== 200) {
            return ['success' => false, 'error' => "Erro HTTP $code"];
        }
        
        return ['success' => true];
    }
    
    /**
     * Get tracking statistics
     */
    private function get_tracking_stats() {
        global $wpdb;
        
        // Count orders with tracking
        $total = (int) $wpdb->get_var("
            SELECT COUNT(DISTINCT post_id) FROM {$wpdb->postmeta} 
            WHERE meta_key = '_cft_tracking_code' AND meta_value != ''
        ");
        
        // Count pending orders (no tracking code)
        $trigger = $this->settings['trigger_status'];
        $pending = (int) $wpdb->get_var($wpdb->prepare("
            SELECT COUNT(*) FROM {$wpdb->posts} p
            LEFT JOIN {$wpdb->postmeta} pm ON p.ID = pm.post_id AND pm.meta_key = '_cft_tracking_code'
            WHERE p.post_type = 'shop_order' 
            AND p.post_status = %s
            AND (pm.meta_value IS NULL OR pm.meta_value = '')
        ", 'wc-' . $trigger));
        
        return [
            'total' => $total,
            'pending' => $pending,
        ];
    }
    
    /**
     * Maybe send order to Cargo Flash
     */
    public function maybe_send_order($order_id) {
        if ($this->settings['auto_send'] !== 'yes') {
            return;
        }
        
        $order = wc_get_order($order_id);
        if (!$order) {
            return;
        }
        
        // Check trigger status
        if ($order->get_status() !== $this->settings['trigger_status']) {
            return;
        }
        
        // Check if already sent
        $existing = $this->get_tracking_code($order);
        if (!empty($existing)) {
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
            return ['success' => false, 'error' => 'Pedido não encontrado'];
        }
        
        if (empty($this->api_url) || empty($this->api_key)) {
            return ['success' => false, 'error' => 'API não configurada'];
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
        
        // Build payload
        $payload = [
            'order_id' => $order->get_order_number(),
            'customer' => [
                'name' => trim($order->get_shipping_first_name() . ' ' . $order->get_shipping_last_name()),
                'email' => $order->get_billing_email(),
                'phone' => $order->get_billing_phone(),
                'document' => $order->get_meta('_billing_cpf') ?: $order->get_meta('_billing_cnpj') ?: '',
                'address' => [
                    'street' => $order->get_shipping_address_1(),
                    'number' => $order->get_meta('_shipping_number') ?: '',
                    'complement' => $order->get_shipping_address_2(),
                    'neighborhood' => $order->get_meta('_shipping_neighborhood') ?: '',
                    'city' => $order->get_shipping_city(),
                    'state' => $order->get_shipping_state(),
                    'zip' => preg_replace('/\D/', '', $order->get_shipping_postcode()),
                    'country' => $order->get_shipping_country(),
                ],
            ],
            'items' => $items,
            'notes' => $order->get_customer_note(),
        ];
        
        // Include order total for insurance
        if ($this->settings['include_order_total'] === 'yes') {
            $payload['total'] = (float) $order->get_total();
        }
        
        // Send request
        $response = wp_remote_post(
            trailingslashit($this->api_url) . 'api/webhooks/woocommerce',
            [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'x-api-key' => $this->api_key,
                ],
                'body' => wp_json_encode($payload),
                'timeout' => 30,
                'sslverify' => true,
            ]
        );
        
        if (is_wp_error($response)) {
            $error = $response->get_error_message();
            $order->add_order_note('❌ Cargo Flash: ' . $error);
            return ['success' => false, 'error' => $error];
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        $code = wp_remote_retrieve_response_code($response);
        
        if ($code !== 200 || empty($body['success'])) {
            $error = $body['error'] ?? "HTTP $code";
            $order->add_order_note('❌ Cargo Flash: ' . $error);
            return ['success' => false, 'error' => $error];
        }
        
        // Save tracking data
        $tracking_code = $body['tracking_code'];
        $this->save_tracking_data($order, [
            'tracking_code' => $tracking_code,
            'delivery_id' => $body['delivery_id'] ?? '',
            'estimated_delivery' => $body['estimated_delivery'] ?? '',
            'tracking_url' => $body['tracking_url'] ?? trailingslashit($this->api_url) . 'rastrear/' . $tracking_code,
        ]);
        
        // Add order note
        $order->add_order_note(sprintf(
            '✅ Cargo Flash: Rastreamento criado - <a href="%s" target="_blank">%s</a>',
            esc_url($body['tracking_url'] ?? trailingslashit($this->api_url) . 'rastrear/' . $tracking_code),
            $tracking_code
        ));
        
        return [
            'success' => true,
            'tracking_code' => $tracking_code,
            'tracking_url' => $body['tracking_url'] ?? '',
        ];
    }
    
    /**
     * Save tracking data to order
     */
    private function save_tracking_data($order, $data) {
        $order->update_meta_data('_cft_tracking_code', $data['tracking_code']);
        $order->update_meta_data('_cft_delivery_id', $data['delivery_id']);
        $order->update_meta_data('_cft_estimated_delivery', $data['estimated_delivery']);
        $order->update_meta_data('_cft_tracking_url', $data['tracking_url']);
        $order->update_meta_data('_cft_sent_at', current_time('mysql'));
        $order->save();
        
        // Legacy post meta for compatibility
        update_post_meta($order->get_id(), '_cft_tracking_code', $data['tracking_code']);
        update_post_meta($order->get_id(), '_cargo_flash_tracking_code', $data['tracking_code']);
    }
    
    /**
     * Get tracking code from order
     */
    private function get_tracking_code($order) {
        $code = $order->get_meta('_cft_tracking_code');
        if (empty($code)) {
            $code = get_post_meta($order->get_id(), '_cft_tracking_code', true);
        }
        if (empty($code)) {
            $code = get_post_meta($order->get_id(), '_cargo_flash_tracking_code', true);
        }
        return $code;
    }
    
    /**
     * Add tracking column
     */
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
    
    /**
     * Render tracking column (legacy)
     */
    public function render_tracking_column($column, $post_id) {
        if ($column !== 'cft_tracking') return;
        $order = wc_get_order($post_id);
        if ($order) {
            $this->render_tracking_badge($order);
        }
    }
    
    /**
     * Render tracking column (HPOS)
     */
    public function render_tracking_column_hpos($column, $order) {
        if ($column !== 'cft_tracking') return;
        $this->render_tracking_badge($order);
    }
    
    /**
     * Render tracking badge
     */
    private function render_tracking_badge($order) {
        $code = $this->get_tracking_code($order);
        if (!empty($code)) {
            $url = $order->get_meta('_cft_tracking_url') ?: trailingslashit($this->api_url) . 'rastrear/' . $code;
            printf(
                '<a href="%s" target="_blank" class="cft-badge cft-badge-success">%s</a>',
                esc_url($url),
                esc_html($code)
            );
        } else {
            echo '<span class="cft-badge cft-badge-pending">—</span>';
        }
    }
    
    /**
     * Add order meta box
     */
    public function add_order_meta_box() {
        $screens = ['shop_order', 'woocommerce_page_wc-orders'];
        foreach ($screens as $screen) {
            add_meta_box(
                'cft_tracking_box',
                '📦 Cargo Flash',
                [$this, 'render_meta_box'],
                $screen,
                'side',
                'high'
            );
        }
    }
    
    /**
     * Render meta box
     */
    public function render_meta_box($post_or_order) {
        $order = is_a($post_or_order, 'WC_Order') ? $post_or_order : wc_get_order($post_or_order->ID);
        if (!$order) return;
        
        $code = $this->get_tracking_code($order);
        $url = $order->get_meta('_cft_tracking_url') ?: ($code ? trailingslashit($this->api_url) . 'rastrear/' . $code : '');
        $estimated = $order->get_meta('_cft_estimated_delivery');
        
        wp_nonce_field('cft_meta_box', 'cft_meta_nonce');
        ?>
        <div class="cft-metabox">
            <?php if (!empty($code)): ?>
                <div class="cft-metabox-info">
                    <p><strong>Código:</strong></p>
                    <p class="cft-code"><?php echo esc_html($code); ?></p>
                    
                    <?php if ($estimated): ?>
                    <p><strong>Previsão:</strong><br><?php echo esc_html(date_i18n('d/m/Y', strtotime($estimated))); ?></p>
                    <?php endif; ?>
                </div>
                <a href="<?php echo esc_url($url); ?>" target="_blank" class="button button-primary" style="width:100%;text-align:center;">
                    Ver Rastreamento
                </a>
            <?php else: ?>
                <p class="cft-no-tracking">Rastreamento não enviado</p>
                <button type="button" class="button button-primary cft-sync-btn" 
                        data-order-id="<?php echo esc_attr($order->get_id()); ?>"
                        style="width:100%;">
                    📤 Enviar para Cargo Flash
                </button>
            <?php endif; ?>
        </div>
        <?php
    }
    
    /**
     * Add tracking to email
     */
    public function add_tracking_to_email($order, $sent_to_admin, $plain_text, $email) {
        if ($sent_to_admin || $this->settings['email_tracking'] !== 'yes') {
            return;
        }
        
        $code = $this->get_tracking_code($order);
        if (empty($code)) return;
        
        $url = $order->get_meta('_cft_tracking_url') ?: trailingslashit($this->api_url) . 'rastrear/' . $code;
        $estimated = $order->get_meta('_cft_estimated_delivery');
        
        if ($plain_text) {
            echo "\n\n==========================================\n";
            echo "RASTREAMENTO DO PEDIDO\n";
            echo "==========================================\n";
            echo "Código: $code\n";
            echo "Rastrear: $url\n";
            if ($estimated) {
                echo "Previsão: " . date_i18n('d/m/Y', strtotime($estimated)) . "\n";
            }
            return;
        }
        ?>
        <div style="margin:30px 0;padding:25px;background:linear-gradient(135deg,#f8fafc 0%,#f1f5f9 100%);border-radius:12px;border-left:4px solid #3b82f6;">
            <h3 style="margin:0 0 15px;color:#1e40af;font-size:18px;">📦 Rastreamento do Pedido</h3>
            <p style="margin:8px 0;color:#475569;">
                <strong>Código:</strong> <?php echo esc_html($code); ?>
            </p>
            <?php if ($estimated): ?>
            <p style="margin:8px 0;color:#475569;">
                <strong>Previsão de Entrega:</strong> <?php echo esc_html(date_i18n('d/m/Y', strtotime($estimated))); ?>
            </p>
            <?php endif; ?>
            <p style="margin:20px 0 0;">
                <a href="<?php echo esc_url($url); ?>" 
                   style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#3b82f6 0%,#2563eb 100%);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
                    🔍 Rastrear Meu Pedido
                </a>
            </p>
        </div>
        <?php
    }
    
    /**
     * Display tracking in My Account
     */
    public function display_tracking_in_myaccount($order) {
        if ($this->settings['myaccount_tracking'] !== 'yes') return;
        
        $code = $this->get_tracking_code($order);
        if (empty($code)) return;
        
        $url = $order->get_meta('_cft_tracking_url') ?: trailingslashit($this->api_url) . 'rastrear/' . $code;
        $estimated = $order->get_meta('_cft_estimated_delivery');
        ?>
        <section class="woocommerce-tracking-info" style="margin:30px 0;">
            <h2 style="color:#1e40af;">📦 Rastreamento da Entrega</h2>
            <table class="woocommerce-table" style="width:100%;border-collapse:collapse;">
                <tr>
                    <th style="text-align:left;padding:12px;border-bottom:1px solid #e2e8f0;">Código</th>
                    <td style="padding:12px;border-bottom:1px solid #e2e8f0;font-weight:600;"><?php echo esc_html($code); ?></td>
                </tr>
                <?php if ($estimated): ?>
                <tr>
                    <th style="text-align:left;padding:12px;border-bottom:1px solid #e2e8f0;">Previsão</th>
                    <td style="padding:12px;border-bottom:1px solid #e2e8f0;"><?php echo esc_html(date_i18n('d/m/Y', strtotime($estimated))); ?></td>
                </tr>
                <?php endif; ?>
            </table>
            <p style="margin-top:15px;">
                <a href="<?php echo esc_url($url); ?>" target="_blank" class="button" 
                   style="background:#3b82f6;color:#fff;border:none;padding:12px 24px;">
                    🔍 Acompanhar Pedido
                </a>
            </p>
        </section>
        <?php
    }
    
    /**
     * Display tracking widget on view order page
     */
    public function display_tracking_widget($order_id) {
        $order = wc_get_order($order_id);
        if (!$order) return;
        
        $code = $this->get_tracking_code($order);
        if (empty($code)) return;
        
        $url = $order->get_meta('_cft_tracking_url') ?: trailingslashit($this->api_url) . 'rastrear/' . $code;
        ?>
        <div style="margin-bottom:30px;padding:20px;background:#eff6ff;border-radius:8px;border:1px solid #bfdbfe;">
            <p style="margin:0;font-size:16px;color:#1e40af;">
                <strong>📍 Rastreie sua entrega:</strong>
                <a href="<?php echo esc_url($url); ?>" target="_blank" style="color:#2563eb;margin-left:10px;">
                    <?php echo esc_html($code); ?> →
                </a>
            </p>
        </div>
        <?php
    }
    
    /**
     * Add bulk action
     */
    public function add_bulk_action($actions) {
        $actions['cft_send'] = 'Enviar para Cargo Flash';
        return $actions;
    }
    
    /**
     * Handle bulk action
     */
    public function handle_bulk_action($redirect_to, $action, $order_ids) {
        if ($action !== 'cft_send') {
            return $redirect_to;
        }
        
        $success = 0;
        $failed = 0;
        
        foreach ($order_ids as $order_id) {
            $result = $this->sync_order($order_id);
            if ($result['success']) {
                $success++;
            } else {
                $failed++;
            }
        }
        
        return add_query_arg([
            'cft_bulk_sent' => $success,
            'cft_bulk_failed' => $failed,
        ], $redirect_to);
    }
    
    /**
     * Show bulk action notice
     */
    public function show_bulk_action_notice() {
        if (empty($_GET['cft_bulk_sent'])) return;
        
        $success = intval($_GET['cft_bulk_sent']);
        $failed = isset($_GET['cft_bulk_failed']) ? intval($_GET['cft_bulk_failed']) : 0;
        
        $message = sprintf(
            '%d pedido(s) enviado(s) para o Cargo Flash.',
            $success
        );
        if ($failed > 0) {
            $message .= sprintf(' %d falha(s).', $failed);
        }
        
        printf('<div class="notice notice-success is-dismissible"><p>%s</p></div>', esc_html($message));
    }
    
    /**
     * AJAX: Sync single order
     */
    public function ajax_sync_order() {
        check_ajax_referer('cft_ajax_nonce', 'nonce');
        
        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error(['error' => 'Sem permissão']);
        }
        
        $order_id = intval($_POST['order_id'] ?? 0);
        if (!$order_id) {
            wp_send_json_error(['error' => 'ID inválido']);
        }
        
        $result = $this->sync_order($order_id);
        
        if ($result['success']) {
            wp_send_json_success($result);
        } else {
            wp_send_json_error($result);
        }
    }
    
    /**
     * AJAX: Bulk sync
     */
    public function ajax_bulk_sync() {
        check_ajax_referer('cft_ajax_nonce', 'nonce');
        
        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error(['error' => 'Sem permissão']);
        }
        
        $stats = $this->get_tracking_stats();
        $success = 0;
        $failed = 0;
        
        // Get pending orders
        $trigger = $this->settings['trigger_status'];
        $orders = wc_get_orders([
            'status' => $trigger,
            'limit' => 100,
            'meta_query' => [
                'relation' => 'OR',
                [
                    'key' => '_cft_tracking_code',
                    'compare' => 'NOT EXISTS',
                ],
                [
                    'key' => '_cft_tracking_code',
                    'value' => '',
                ],
            ],
        ]);
        
        foreach ($orders as $order) {
            $result = $this->sync_order($order->get_id());
            if ($result['success']) {
                $success++;
            } else {
                $failed++;
            }
        }
        
        wp_send_json_success([
            'success_count' => $success,
            'failed_count' => $failed,
            'message' => sprintf('%d enviados, %d falhas', $success, $failed),
        ]);
    }
    
    /**
     * AJAX: Test connection
     */
    public function ajax_test_connection() {
        check_ajax_referer('cft_ajax_nonce', 'nonce');
        
        $result = $this->test_connection();
        
        if ($result['success']) {
            wp_send_json_success(['message' => 'Conexão OK!']);
        } else {
            wp_send_json_error(['error' => $result['error']]);
        }
    }
}

// Initialize
add_action('plugins_loaded', function() {
    if (class_exists('WooCommerce')) {
        Cargo_Flash_Tracking_V2::get_instance();
    }
});

// Activation check
register_activation_hook(__FILE__, function() {
    if (!class_exists('WooCommerce')) {
        deactivate_plugins(plugin_basename(__FILE__));
        wp_die('Este plugin requer o WooCommerce instalado e ativado.');
    }
});
