<?php
/**
 * Settings Page Class
 * 
 * Handles the plugin settings page in WooCommerce admin
 */

if (!defined('ABSPATH')) {
    exit;
}

class CFT_Settings {

    /**
     * Initialize settings
     */
    public static function init() {
        add_action('admin_menu', array(__CLASS__, 'add_menu'));
        add_action('admin_init', array(__CLASS__, 'register_settings'));
        add_action('wp_ajax_cft_test_connection', array(__CLASS__, 'ajax_test_connection'));
    }

    /**
     * Add menu item
     */
    public static function add_menu() {
        add_submenu_page(
            'woocommerce',
            'Cargo Flash Tracking',
            'Cargo Flash',
            'manage_woocommerce',
            'cft-settings',
            array(__CLASS__, 'render_settings_page')
        );
    }

    /**
     * Register settings
     */
    public static function register_settings() {
        register_setting('cft_settings', 'cft_api_url', array(
            'type' => 'string',
            'sanitize_callback' => 'esc_url_raw',
        ));
        register_setting('cft_settings', 'cft_api_key', array(
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
        ));
        register_setting('cft_settings', 'cft_auto_send', array(
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
        ));
        register_setting('cft_settings', 'cft_send_on_status', array(
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
        ));
        register_setting('cft_settings', 'cft_enable_tracking_page', array(
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
        ));
        register_setting('cft_settings', 'cft_origin_company', array(
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
        ));
        register_setting('cft_settings', 'cft_origin_address', array(
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
        ));
        register_setting('cft_settings', 'cft_origin_city', array(
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
        ));
        register_setting('cft_settings', 'cft_origin_state', array(
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
        ));
        register_setting('cft_settings', 'cft_origin_zip', array(
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
        ));
    }

    /**
     * Render settings page
     */
    public static function render_settings_page() {
        $api_url = get_option('cft_api_url', '');
        $api_key = get_option('cft_api_key', '');
        $auto_send = get_option('cft_auto_send', 'yes');
        $send_on_status = get_option('cft_send_on_status', 'processing');
        $enable_tracking = get_option('cft_enable_tracking_page', 'yes');
        $origin_company = get_option('cft_origin_company', get_bloginfo('name'));
        $origin_address = get_option('cft_origin_address', '');
        $origin_city = get_option('cft_origin_city', '');
        $origin_state = get_option('cft_origin_state', '');
        $origin_zip = get_option('cft_origin_zip', '');
        
        // Get WooCommerce order statuses
        $order_statuses = wc_get_order_statuses();
        ?>
        <div class="wrap cft-settings-wrap">
            <h1>
                <span class="dashicons dashicons-location-alt" style="font-size: 30px; margin-right: 10px;"></span>
                Cargo Flash Tracking
            </h1>
            
            <div class="cft-header-banner">
                <div class="cft-logo">
                    <span style="font-size: 24px; font-weight: bold; color: #00ff41;">⚡ CARGO FLASH</span>
                </div>
                <p>Sistema de Rastreamento de Entregas em Tempo Real</p>
            </div>

            <form method="post" action="options.php">
                <?php settings_fields('cft_settings'); ?>
                
                <!-- Connection Settings -->
                <div class="cft-settings-section">
                    <h2>🔗 Conexão com API</h2>
                    <table class="form-table">
                        <tr>
                            <th scope="row">
                                <label for="cft_api_url">URL da API Cargo Flash</label>
                            </th>
                            <td>
                                <input type="url" id="cft_api_url" name="cft_api_url" 
                                       value="<?php echo esc_attr($api_url); ?>" 
                                       class="regular-text" 
                                       placeholder="https://seu-cargoflash.vercel.app" />
                                <p class="description">URL base do seu sistema Cargo Flash (sem barra no final)</p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="cft_api_key">Chave da API</label>
                            </th>
                            <td>
                                <input type="password" id="cft_api_key" name="cft_api_key" 
                                       value="<?php echo esc_attr($api_key); ?>" 
                                       class="regular-text" 
                                       placeholder="Sua chave de API" />
                                <button type="button" class="button" onclick="toggleApiKey()">Mostrar</button>
                                <p class="description">Chave gerada no painel admin do Cargo Flash (Configurações > API Keys)</p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Testar Conexão</th>
                            <td>
                                <button type="button" class="button button-secondary" id="cft-test-connection">
                                    🔌 Testar Conexão
                                </button>
                                <span id="cft-connection-result"></span>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Automation Settings -->
                <div class="cft-settings-section">
                    <h2>⚙️ Automação</h2>
                    <table class="form-table">
                        <tr>
                            <th scope="row">
                                <label for="cft_auto_send">Envio Automático</label>
                            </th>
                            <td>
                                <select id="cft_auto_send" name="cft_auto_send">
                                    <option value="yes" <?php selected($auto_send, 'yes'); ?>>Sim - Enviar pedidos automaticamente</option>
                                    <option value="no" <?php selected($auto_send, 'no'); ?>>Não - Enviar manualmente</option>
                                </select>
                                <p class="description">Quando ativado, os pedidos serão enviados automaticamente para o Cargo Flash</p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="cft_send_on_status">Enviar no Status</label>
                            </th>
                            <td>
                                <select id="cft_send_on_status" name="cft_send_on_status">
                                    <?php foreach ($order_statuses as $status_key => $status_label) : ?>
                                        <option value="<?php echo esc_attr(str_replace('wc-', '', $status_key)); ?>" 
                                                <?php selected($send_on_status, str_replace('wc-', '', $status_key)); ?>>
                                            <?php echo esc_html($status_label); ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                                <p class="description">Status do pedido que dispara o envio para Cargo Flash</p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="cft_enable_tracking_page">Página de Rastreamento</label>
                            </th>
                            <td>
                                <select id="cft_enable_tracking_page" name="cft_enable_tracking_page">
                                    <option value="yes" <?php selected($enable_tracking, 'yes'); ?>>Ativado</option>
                                    <option value="no" <?php selected($enable_tracking, 'no'); ?>>Desativado</option>
                                </select>
                                <p class="description">Exibe informações de rastreamento na página "Minha Conta" do cliente</p>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Origin Settings -->
                <div class="cft-settings-section">
                    <h2>📦 Dados de Origem (Remetente)</h2>
                    <p class="section-description">Informações da sua loja que serão usadas como origem das entregas</p>
                    <table class="form-table">
                        <tr>
                            <th scope="row">
                                <label for="cft_origin_company">Nome da Empresa</label>
                            </th>
                            <td>
                                <input type="text" id="cft_origin_company" name="cft_origin_company" 
                                       value="<?php echo esc_attr($origin_company); ?>" 
                                       class="regular-text" />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="cft_origin_address">Endereço</label>
                            </th>
                            <td>
                                <input type="text" id="cft_origin_address" name="cft_origin_address" 
                                       value="<?php echo esc_attr($origin_address); ?>" 
                                       class="large-text" 
                                       placeholder="Rua, número, complemento" />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="cft_origin_city">Cidade</label>
                            </th>
                            <td>
                                <input type="text" id="cft_origin_city" name="cft_origin_city" 
                                       value="<?php echo esc_attr($origin_city); ?>" 
                                       class="regular-text" />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="cft_origin_state">Estado</label>
                            </th>
                            <td>
                                <select id="cft_origin_state" name="cft_origin_state">
                                    <option value="">Selecione...</option>
                                    <?php
                                    $states = array('AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO');
                                    foreach ($states as $state) {
                                        printf('<option value="%s" %s>%s</option>', $state, selected($origin_state, $state, false), $state);
                                    }
                                    ?>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="cft_origin_zip">CEP</label>
                            </th>
                            <td>
                                <input type="text" id="cft_origin_zip" name="cft_origin_zip" 
                                       value="<?php echo esc_attr($origin_zip); ?>" 
                                       class="regular-text" 
                                       placeholder="00000-000" />
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Webhook Info -->
                <div class="cft-settings-section cft-info-section">
                    <h2>🔔 Webhook para Atualizações</h2>
                    <p>Configure este URL no Cargo Flash para receber atualizações de status automaticamente:</p>
                    <div class="cft-webhook-url">
                        <code><?php echo esc_url(home_url('/wp-json/cargo-flash/v1/webhook')); ?></code>
                        <button type="button" class="button" onclick="copyWebhookUrl()">📋 Copiar</button>
                    </div>
                </div>

                <?php submit_button('Salvar Configurações', 'primary', 'submit', true, array('id' => 'cft-save-settings')); ?>
            </form>

            <!-- Statistics -->
            <div class="cft-settings-section cft-stats-section">
                <h2>📊 Estatísticas</h2>
                <?php
                global $wpdb;
                $table_name = $wpdb->prefix . 'cft_tracking';
                $total = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
                $delivered = $wpdb->get_var("SELECT COUNT(*) FROM $table_name WHERE status = 'delivered'");
                $in_transit = $wpdb->get_var("SELECT COUNT(*) FROM $table_name WHERE status = 'in_transit'");
                $pending = $wpdb->get_var("SELECT COUNT(*) FROM $table_name WHERE status = 'pending'");
                ?>
                <div class="cft-stats-grid">
                    <div class="cft-stat-box">
                        <span class="stat-number"><?php echo intval($total); ?></span>
                        <span class="stat-label">Total de Envios</span>
                    </div>
                    <div class="cft-stat-box cft-stat-success">
                        <span class="stat-number"><?php echo intval($delivered); ?></span>
                        <span class="stat-label">Entregues</span>
                    </div>
                    <div class="cft-stat-box cft-stat-warning">
                        <span class="stat-number"><?php echo intval($in_transit); ?></span>
                        <span class="stat-label">Em Trânsito</span>
                    </div>
                    <div class="cft-stat-box cft-stat-info">
                        <span class="stat-number"><?php echo intval($pending); ?></span>
                        <span class="stat-label">Pendentes</span>
                    </div>
                </div>
            </div>
        </div>

        <script>
        function toggleApiKey() {
            var input = document.getElementById('cft_api_key');
            input.type = input.type === 'password' ? 'text' : 'password';
        }
        
        function copyWebhookUrl() {
            var url = '<?php echo esc_url(home_url('/wp-json/cargo-flash/v1/webhook')); ?>';
            navigator.clipboard.writeText(url).then(function() {
                alert('URL copiado!');
            });
        }
        </script>
        <?php
    }

    /**
     * AJAX test connection
     */
    public static function ajax_test_connection() {
        check_ajax_referer('cft_nonce', 'nonce');

        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error('Permissão negada');
        }

        $api_url = get_option('cft_api_url');
        $api_key = get_option('cft_api_key');

        if (empty($api_url) || empty($api_key)) {
            wp_send_json_error('Configure a URL e chave da API primeiro');
        }

        $response = wp_remote_get($api_url . '/api/health', array(
            'headers' => array(
                'x-api-key' => $api_key,
            ),
            'timeout' => 10,
        ));

        if (is_wp_error($response)) {
            wp_send_json_error('Erro de conexão: ' . $response->get_error_message());
        }

        $code = wp_remote_retrieve_response_code($response);
        
        if ($code === 200) {
            wp_send_json_success('Conexão estabelecida com sucesso!');
        } else {
            wp_send_json_error('Erro na API (código ' . $code . ')');
        }
    }
}
