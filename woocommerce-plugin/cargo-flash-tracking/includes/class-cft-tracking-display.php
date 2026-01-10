<?php
/**
 * Tracking Display Class
 * 
 * Handles frontend tracking display for customers
 */

if (!defined('ABSPATH')) {
    exit;
}

class CFT_Tracking_Display {

    /**
     * Initialize tracking display
     */
    public static function init() {
        // Add tracking to order details
        add_action('woocommerce_order_details_after_order_table', array(__CLASS__, 'display_tracking_in_order'));
        
        // Add tracking tab to My Account
        add_filter('woocommerce_account_menu_items', array(__CLASS__, 'add_tracking_menu_item'));
        add_action('init', array(__CLASS__, 'add_tracking_endpoint'));
        add_action('woocommerce_account_cargo-flash-tracking_endpoint', array(__CLASS__, 'tracking_endpoint_content'));
        
        // Add tracking to order emails
        add_action('woocommerce_email_after_order_table', array(__CLASS__, 'add_tracking_to_email'), 10, 4);
        
        // Shortcode for tracking
        add_shortcode('cargo_flash_tracking', array(__CLASS__, 'tracking_shortcode'));
    }

    /**
     * Display tracking in order details page
     */
    public static function display_tracking_in_order($order) {
        if (get_option('cft_enable_tracking_page', 'yes') !== 'yes') {
            return;
        }

        $tracking = CFT_API::get_tracking_by_order($order->get_id());
        
        if (!$tracking || empty($tracking->tracking_code)) {
            return;
        }

        $api_url = get_option('cft_api_url');
        $tracking_url = $api_url ? $api_url . '/rastreio/' . $tracking->tracking_code : '';
        
        $status_labels = array(
            'pending' => array('label' => 'Pendente', 'icon' => '⏳', 'color' => '#f59e0b'),
            'collected' => array('label' => 'Coletado', 'icon' => '📦', 'color' => '#06b6d4'),
            'in_transit' => array('label' => 'Em Trânsito', 'icon' => '🚚', 'color' => '#8b5cf6'),
            'out_for_delivery' => array('label' => 'Saiu para Entrega', 'icon' => '🛵', 'color' => '#10b981'),
            'delivered' => array('label' => 'Entregue', 'icon' => '✅', 'color' => '#22c55e'),
            'failed' => array('label' => 'Falha na Entrega', 'icon' => '❌', 'color' => '#ef4444'),
            'returned' => array('label' => 'Devolvido', 'icon' => '↩️', 'color' => '#f59e0b'),
        );

        $status = $tracking->status ?? 'pending';
        $config = $status_labels[$status] ?? $status_labels['pending'];
        ?>
        <section class="cft-order-tracking">
            <h2>📍 Rastreamento da Entrega</h2>
            
            <div class="cft-tracking-card">
                <div class="cft-tracking-code">
                    <span class="label">Código de Rastreio:</span>
                    <span class="code"><?php echo esc_html($tracking->tracking_code); ?></span>
                </div>
                
                <div class="cft-tracking-status" style="--status-color: <?php echo esc_attr($config['color']); ?>">
                    <span class="icon"><?php echo $config['icon']; ?></span>
                    <span class="label"><?php echo esc_html($config['label']); ?></span>
                </div>
                
                <?php if (!empty($tracking->current_location)) : ?>
                <div class="cft-tracking-location">
                    <span class="icon">📍</span>
                    <span class="text"><?php echo esc_html($tracking->current_location); ?></span>
                </div>
                <?php endif; ?>
                
                <?php if (!empty($tracking->estimated_delivery)) : ?>
                <div class="cft-tracking-eta">
                    <span class="icon">📅</span>
                    <span class="text">
                        Previsão: <strong><?php echo esc_html(date_i18n('d/m/Y', strtotime($tracking->estimated_delivery))); ?></strong>
                    </span>
                </div>
                <?php endif; ?>
                
                <?php if ($tracking_url) : ?>
                <div class="cft-tracking-link">
                    <a href="<?php echo esc_url($tracking_url); ?>" target="_blank" class="cft-btn">
                        🔗 Acompanhar Entrega em Tempo Real
                    </a>
                </div>
                <?php endif; ?>
            </div>
            
            <!-- Timeline -->
            <?php if (!empty($tracking->history)) : 
                $history = is_string($tracking->history) ? json_decode($tracking->history, true) : $tracking->history;
                if (!empty($history) && is_array($history)) :
            ?>
            <div class="cft-tracking-timeline">
                <h3>Histórico</h3>
                <ul>
                    <?php foreach (array_reverse($history) as $event) : ?>
                    <li class="<?php echo $event === end($history) ? 'active' : ''; ?>">
                        <span class="time"><?php echo esc_html(date_i18n('d/m H:i', strtotime($event['timestamp'] ?? $event['created_at'] ?? ''))); ?></span>
                        <span class="desc"><?php echo esc_html($event['description'] ?? $event['event'] ?? ''); ?></span>
                        <?php if (!empty($event['location'])) : ?>
                        <span class="loc"><?php echo esc_html($event['location']); ?></span>
                        <?php endif; ?>
                    </li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <?php endif; endif; ?>
        </section>
        <?php
    }

    /**
     * Add tracking menu item to My Account
     */
    public static function add_tracking_menu_item($items) {
        if (get_option('cft_enable_tracking_page', 'yes') !== 'yes') {
            return $items;
        }

        $new_items = array();
        foreach ($items as $key => $value) {
            $new_items[$key] = $value;
            if ($key === 'orders') {
                $new_items['cargo-flash-tracking'] = 'Rastrear Entregas';
            }
        }
        return $new_items;
    }

    /**
     * Add tracking endpoint
     */
    public static function add_tracking_endpoint() {
        add_rewrite_endpoint('cargo-flash-tracking', EP_ROOT | EP_PAGES);
    }

    /**
     * Tracking endpoint content
     */
    public static function tracking_endpoint_content() {
        $customer_id = get_current_user_id();
        
        // Get customer orders with tracking
        $orders = wc_get_orders(array(
            'customer_id' => $customer_id,
            'limit' => 20,
            'orderby' => 'date',
            'order' => 'DESC',
        ));

        $orders_with_tracking = array();
        foreach ($orders as $order) {
            $tracking = CFT_API::get_tracking_by_order($order->get_id());
            if ($tracking && !empty($tracking->tracking_code)) {
                $orders_with_tracking[] = array(
                    'order' => $order,
                    'tracking' => $tracking,
                );
            }
        }
        ?>
        <div class="cft-tracking-page">
            <h2>📦 Minhas Entregas</h2>
            
            <?php if (empty($orders_with_tracking)) : ?>
                <p class="cft-no-tracking">Você ainda não possui entregas para rastrear.</p>
            <?php else : ?>
                <div class="cft-tracking-list">
                    <?php foreach ($orders_with_tracking as $item) : 
                        $order = $item['order'];
                        $tracking = $item['tracking'];
                        $api_url = get_option('cft_api_url');
                        $tracking_url = $api_url ? $api_url . '/rastreio/' . $tracking->tracking_code : '';
                    ?>
                    <div class="cft-tracking-item">
                        <div class="cft-order-info">
                            <span class="order-number">Pedido #<?php echo $order->get_order_number(); ?></span>
                            <span class="order-date"><?php echo wc_format_datetime($order->get_date_created()); ?></span>
                        </div>
                        <div class="cft-tracking-details">
                            <div class="tracking-code">
                                <strong>Rastreio:</strong> 
                                <code><?php echo esc_html($tracking->tracking_code); ?></code>
                            </div>
                            <div class="tracking-status status-<?php echo esc_attr($tracking->status); ?>">
                                <?php echo self::get_status_label($tracking->status); ?>
                            </div>
                            <?php if (!empty($tracking->current_location)) : ?>
                            <div class="tracking-location">
                                📍 <?php echo esc_html($tracking->current_location); ?>
                            </div>
                            <?php endif; ?>
                        </div>
                        <div class="cft-tracking-actions">
                            <a href="<?php echo esc_url($order->get_view_order_url()); ?>" class="button">
                                Ver Pedido
                            </a>
                            <?php if ($tracking_url) : ?>
                            <a href="<?php echo esc_url($tracking_url); ?>" target="_blank" class="button button-primary">
                                Rastrear
                            </a>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
        <?php
    }

    /**
     * Add tracking to order emails
     */
    public static function add_tracking_to_email($order, $sent_to_admin, $plain_text, $email) {
        // Only add to customer emails
        if ($sent_to_admin) {
            return;
        }

        $tracking = CFT_API::get_tracking_by_order($order->get_id());
        
        if (!$tracking || empty($tracking->tracking_code)) {
            return;
        }

        $api_url = get_option('cft_api_url');
        $tracking_url = $api_url ? $api_url . '/rastreio/' . $tracking->tracking_code : '';

        if ($plain_text) {
            echo "\n\n=== RASTREAMENTO ===\n";
            echo "Código: " . $tracking->tracking_code . "\n";
            echo "Status: " . self::get_status_label($tracking->status) . "\n";
            if ($tracking_url) {
                echo "Link: " . $tracking_url . "\n";
            }
        } else {
            ?>
            <div style="margin: 20px 0; padding: 15px; background: #f0fdf4; border-left: 4px solid #22c55e; border-radius: 4px;">
                <h3 style="margin: 0 0 10px 0; color: #166534;">📦 Rastreamento da Entrega</h3>
                <p style="margin: 5px 0;"><strong>Código:</strong> <?php echo esc_html($tracking->tracking_code); ?></p>
                <p style="margin: 5px 0;"><strong>Status:</strong> <?php echo self::get_status_label($tracking->status); ?></p>
                <?php if ($tracking_url) : ?>
                <p style="margin: 10px 0 0 0;">
                    <a href="<?php echo esc_url($tracking_url); ?>" 
                       style="display: inline-block; padding: 10px 20px; background: #22c55e; color: #fff; text-decoration: none; border-radius: 4px;">
                        Rastrear Entrega
                    </a>
                </p>
                <?php endif; ?>
            </div>
            <?php
        }
    }

    /**
     * Tracking shortcode
     */
    public static function tracking_shortcode($atts) {
        $atts = shortcode_atts(array(
            'code' => '',
        ), $atts);

        ob_start();
        ?>
        <div class="cft-tracking-form">
            <h3>🔍 Rastrear Entrega</h3>
            <form method="get" action="">
                <input type="text" name="tracking_code" 
                       placeholder="Digite o código de rastreio" 
                       value="<?php echo esc_attr($_GET['tracking_code'] ?? $atts['code']); ?>"
                       class="cft-input" />
                <button type="submit" class="cft-btn">Rastrear</button>
            </form>
            
            <?php 
            $code = sanitize_text_field($_GET['tracking_code'] ?? $atts['code']);
            if (!empty($code)) :
                $api_url = get_option('cft_api_url');
                $tracking_url = $api_url ? $api_url . '/rastreio/' . $code : '';
            ?>
            <div class="cft-tracking-redirect">
                <p>Redirecionando para página de rastreamento...</p>
                <?php if ($tracking_url) : ?>
                <script>window.location.href = '<?php echo esc_url($tracking_url); ?>';</script>
                <noscript>
                    <a href="<?php echo esc_url($tracking_url); ?>">Clique aqui para rastrear</a>
                </noscript>
                <?php endif; ?>
            </div>
            <?php endif; ?>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Get status label
     */
    private static function get_status_label($status) {
        $labels = array(
            'pending' => '⏳ Pendente',
            'collected' => '📦 Coletado',
            'in_transit' => '🚚 Em Trânsito',
            'out_for_delivery' => '🛵 Saiu para Entrega',
            'delivered' => '✅ Entregue',
            'failed' => '❌ Falha na Entrega',
            'returned' => '↩️ Devolvido',
        );
        return $labels[$status] ?? ucfirst($status);
    }
}
