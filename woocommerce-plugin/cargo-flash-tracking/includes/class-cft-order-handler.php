<?php
/**
 * Order Handler Class
 * 
 * Handles WooCommerce order integration
 */

if (!defined('ABSPATH')) {
    exit;
}

class CFT_Order_Handler {

    /**
     * Initialize order handler
     */
    public static function init() {
        // Hook into status changes
        add_action('woocommerce_order_status_changed', array(__CLASS__, 'on_status_change'), 10, 4);
        
        // Add tracking column to orders list
        add_filter('manage_edit-shop_order_columns', array(__CLASS__, 'add_order_column'));
        add_filter('manage_woocommerce_page_wc-orders_columns', array(__CLASS__, 'add_order_column'));
        add_action('manage_shop_order_posts_custom_column', array(__CLASS__, 'render_order_column'), 10, 2);
        add_action('manage_woocommerce_page_wc-orders_custom_column', array(__CLASS__, 'render_order_column_hpos'), 10, 2);
        
        // Add metabox to order page
        add_action('add_meta_boxes', array(__CLASS__, 'add_tracking_metabox'));
        
        // AJAX handlers
        add_action('wp_ajax_cft_send_to_cargo_flash', array(__CLASS__, 'ajax_send_order'));
        add_action('wp_ajax_cft_refresh_tracking', array(__CLASS__, 'ajax_refresh_tracking'));
        
        // Add bulk action
        add_filter('bulk_actions-edit-shop_order', array(__CLASS__, 'add_bulk_action'));
        add_filter('bulk_actions-woocommerce_page_wc-orders', array(__CLASS__, 'add_bulk_action'));
        add_filter('handle_bulk_actions-edit-shop_order', array(__CLASS__, 'handle_bulk_action'), 10, 3);
        add_filter('handle_bulk_actions-woocommerce_page_wc-orders', array(__CLASS__, 'handle_bulk_action'), 10, 3);
    }

    /**
     * Handle order status change
     */
    public static function on_status_change($order_id, $old_status, $new_status, $order) {
        // Check if auto-send is enabled
        if (get_option('cft_auto_send', 'yes') !== 'yes') {
            return;
        }

        // Check if this is the trigger status
        $trigger_status = get_option('cft_send_on_status', 'processing');
        if ($new_status !== $trigger_status) {
            return;
        }

        // Check if already sent
        $tracking = CFT_API::get_tracking_by_order($order_id);
        if ($tracking && !empty($tracking->tracking_code)) {
            return;
        }

        // Send to Cargo Flash
        self::send_order_to_cargo_flash($order_id);
    }

    /**
     * Send order to Cargo Flash
     */
    public static function send_order_to_cargo_flash($order_id) {
        $order = wc_get_order($order_id);
        if (!$order) {
            return new WP_Error('invalid_order', 'Pedido não encontrado');
        }

        $result = CFT_API::send_order($order);

        if (is_wp_error($result)) {
            // Add order note
            $order->add_order_note(
                sprintf('❌ Erro ao enviar para Cargo Flash: %s', $result->get_error_message())
            );
            return $result;
        }

        if (isset($result['tracking_code'])) {
            // Save tracking info
            global $wpdb;
            $table_name = $wpdb->prefix . 'cft_tracking';
            
            $wpdb->insert($table_name, array(
                'order_id' => $order_id,
                'tracking_code' => $result['tracking_code'],
                'status' => 'pending',
                'cargo_flash_id' => $result['delivery_id'] ?? '',
                'estimated_delivery' => $result['estimated_delivery'] ?? null,
                'created_at' => current_time('mysql'),
                'last_update' => current_time('mysql'),
            ));

            // Update order meta
            $order->update_meta_data('_cargo_flash_tracking_code', $result['tracking_code']);
            $order->update_meta_data('_cargo_flash_delivery_id', $result['delivery_id'] ?? '');
            $order->save();

            // Add order note
            $order->add_order_note(
                sprintf('✅ Enviado para Cargo Flash. Código de rastreio: %s', $result['tracking_code'])
            );

            return $result;
        }

        return new WP_Error('unknown_error', 'Resposta inesperada da API');
    }

    /**
     * Add tracking column
     */
    public static function add_order_column($columns) {
        $new_columns = array();
        foreach ($columns as $key => $value) {
            $new_columns[$key] = $value;
            if ($key === 'order_status') {
                $new_columns['cargo_flash'] = 'Cargo Flash';
            }
        }
        return $new_columns;
    }

    /**
     * Render tracking column (legacy)
     */
    public static function render_order_column($column, $post_id) {
        if ($column === 'cargo_flash') {
            self::render_tracking_status($post_id);
        }
    }

    /**
     * Render tracking column (HPOS)
     */
    public static function render_order_column_hpos($column, $order) {
        if ($column === 'cargo_flash') {
            $order_id = is_a($order, 'WC_Order') ? $order->get_id() : $order;
            self::render_tracking_status($order_id);
        }
    }

    /**
     * Render tracking status badge
     */
    private static function render_tracking_status($order_id) {
        $tracking = CFT_API::get_tracking_by_order($order_id);
        
        if (!$tracking || empty($tracking->tracking_code)) {
            echo '<span class="cft-badge cft-badge-none">—</span>';
            return;
        }

        $status_labels = array(
            'pending' => array('label' => 'Pendente', 'class' => 'warning'),
            'collected' => array('label' => 'Coletado', 'class' => 'info'),
            'in_transit' => array('label' => 'Em Trânsito', 'class' => 'info'),
            'out_for_delivery' => array('label' => 'Saiu p/ Entrega', 'class' => 'primary'),
            'delivered' => array('label' => 'Entregue', 'class' => 'success'),
            'failed' => array('label' => 'Falhou', 'class' => 'danger'),
            'returned' => array('label' => 'Devolvido', 'class' => 'warning'),
        );

        $status = $tracking->status ?? 'pending';
        $config = $status_labels[$status] ?? $status_labels['pending'];

        printf(
            '<span class="cft-badge cft-badge-%s" title="%s">%s</span>',
            esc_attr($config['class']),
            esc_attr($tracking->tracking_code),
            esc_html($config['label'])
        );
    }

    /**
     * Add tracking metabox
     */
    public static function add_tracking_metabox() {
        $screen = class_exists('Automattic\WooCommerce\Internal\DataStores\Orders\CustomOrdersTableController')
            && wc_get_container()->get(Automattic\WooCommerce\Internal\DataStores\Orders\CustomOrdersTableController::class)->custom_orders_table_usage_is_enabled()
            ? wc_get_page_screen_id('shop-order')
            : 'shop_order';

        add_meta_box(
            'cft_tracking_metabox',
            '⚡ Cargo Flash Tracking',
            array(__CLASS__, 'render_tracking_metabox'),
            $screen,
            'side',
            'high'
        );
    }

    /**
     * Render tracking metabox
     */
    public static function render_tracking_metabox($post_or_order) {
        $order_id = is_a($post_or_order, 'WC_Order') ? $post_or_order->get_id() : $post_or_order->ID;
        $tracking = CFT_API::get_tracking_by_order($order_id);
        ?>
        <div class="cft-metabox">
            <?php if ($tracking && !empty($tracking->tracking_code)) : ?>
                <div class="cft-tracking-info">
                    <p>
                        <strong>Código:</strong><br>
                        <code><?php echo esc_html($tracking->tracking_code); ?></code>
                    </p>
                    <p>
                        <strong>Status:</strong><br>
                        <?php self::render_tracking_status($order_id); ?>
                    </p>
                    <?php if (!empty($tracking->current_location)) : ?>
                    <p>
                        <strong>Localização:</strong><br>
                        <?php echo esc_html($tracking->current_location); ?>
                    </p>
                    <?php endif; ?>
                    <?php if (!empty($tracking->estimated_delivery)) : ?>
                    <p>
                        <strong>Previsão:</strong><br>
                        <?php echo esc_html(date_i18n('d/m/Y', strtotime($tracking->estimated_delivery))); ?>
                    </p>
                    <?php endif; ?>
                    <p>
                        <strong>Última Atualização:</strong><br>
                        <?php echo esc_html(date_i18n('d/m/Y H:i', strtotime($tracking->last_update))); ?>
                    </p>
                    
                    <div class="cft-metabox-actions">
                        <button type="button" class="button" onclick="cftRefreshTracking(<?php echo $order_id; ?>)">
                            🔄 Atualizar
                        </button>
                        <?php 
                        $api_url = get_option('cft_api_url');
                        if ($api_url) :
                        ?>
                        <a href="<?php echo esc_url($api_url . '/rastreio/' . $tracking->tracking_code); ?>" 
                           target="_blank" class="button">
                            🔗 Ver no Cargo Flash
                        </a>
                        <?php endif; ?>
                    </div>
                </div>
            <?php else : ?>
                <p>Este pedido ainda não foi enviado para o Cargo Flash.</p>
                <button type="button" class="button button-primary" onclick="cftSendOrder(<?php echo $order_id; ?>)">
                    📦 Enviar para Cargo Flash
                </button>
            <?php endif; ?>
        </div>
        
        <script>
        function cftSendOrder(orderId) {
            if (!confirm('Enviar este pedido para o Cargo Flash?')) return;
            
            jQuery.post(ajaxurl, {
                action: 'cft_send_to_cargo_flash',
                order_id: orderId,
                nonce: '<?php echo wp_create_nonce('cft_nonce'); ?>'
            }, function(response) {
                if (response.success) {
                    alert('Pedido enviado com sucesso!');
                    location.reload();
                } else {
                    alert('Erro: ' + response.data);
                }
            });
        }
        
        function cftRefreshTracking(orderId) {
            jQuery.post(ajaxurl, {
                action: 'cft_refresh_tracking',
                order_id: orderId,
                nonce: '<?php echo wp_create_nonce('cft_nonce'); ?>'
            }, function(response) {
                if (response.success) {
                    location.reload();
                } else {
                    alert('Erro ao atualizar: ' + response.data);
                }
            });
        }
        </script>
        <?php
    }

    /**
     * AJAX send order
     */
    public static function ajax_send_order() {
        check_ajax_referer('cft_nonce', 'nonce');

        if (!current_user_can('edit_shop_orders')) {
            wp_send_json_error('Permissão negada');
        }

        $order_id = intval($_POST['order_id']);
        $result = self::send_order_to_cargo_flash($order_id);

        if (is_wp_error($result)) {
            wp_send_json_error($result->get_error_message());
        }

        wp_send_json_success($result);
    }

    /**
     * AJAX refresh tracking
     */
    public static function ajax_refresh_tracking() {
        check_ajax_referer('cft_nonce', 'nonce');

        if (!current_user_can('edit_shop_orders')) {
            wp_send_json_error('Permissão negada');
        }

        $order_id = intval($_POST['order_id']);
        $tracking = CFT_API::get_tracking_by_order($order_id);

        if (!$tracking) {
            wp_send_json_error('Rastreamento não encontrado');
        }

        wp_send_json_success(array(
            'status' => $tracking->status,
            'location' => $tracking->current_location,
        ));
    }

    /**
     * Add bulk action
     */
    public static function add_bulk_action($actions) {
        $actions['send_to_cargo_flash'] = 'Enviar para Cargo Flash';
        return $actions;
    }

    /**
     * Handle bulk action
     */
    public static function handle_bulk_action($redirect_to, $action, $order_ids) {
        if ($action !== 'send_to_cargo_flash') {
            return $redirect_to;
        }

        $sent = 0;
        $failed = 0;

        foreach ($order_ids as $order_id) {
            $result = self::send_order_to_cargo_flash($order_id);
            if (is_wp_error($result)) {
                $failed++;
            } else {
                $sent++;
            }
        }

        return add_query_arg(array(
            'cft_sent' => $sent,
            'cft_failed' => $failed,
        ), $redirect_to);
    }
}
