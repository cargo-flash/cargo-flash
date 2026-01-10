<?php
/**
 * Webhook Handler Class
 * 
 * Handles incoming webhooks from Cargo Flash
 */

if (!defined('ABSPATH')) {
    exit;
}

class CFT_Webhook_Handler {

    /**
     * Initialize webhook handler
     */
    public static function init() {
        add_action('rest_api_init', array(__CLASS__, 'register_routes'));
    }

    /**
     * Register REST API routes
     */
    public static function register_routes() {
        register_rest_route('cargo-flash/v1', '/webhook', array(
            'methods' => 'POST',
            'callback' => array(__CLASS__, 'handle_webhook'),
            'permission_callback' => '__return_true',
        ));

        register_rest_route('cargo-flash/v1', '/status', array(
            'methods' => 'GET',
            'callback' => array(__CLASS__, 'status_check'),
            'permission_callback' => '__return_true',
        ));
    }

    /**
     * Handle incoming webhook
     */
    public static function handle_webhook($request) {
        $body = $request->get_json_params();

        // Log webhook
        error_log('Cargo Flash Webhook received: ' . json_encode($body));

        // Validate required fields
        if (empty($body['tracking_code']) || empty($body['status'])) {
            return new WP_REST_Response(array(
                'success' => false,
                'error' => 'Missing required fields',
            ), 400);
        }

        $tracking_code = sanitize_text_field($body['tracking_code']);
        $new_status = sanitize_text_field($body['status']);
        $location = sanitize_text_field($body['location'] ?? '');

        // Find tracking record
        global $wpdb;
        $table_name = $wpdb->prefix . 'cft_tracking';
        
        $tracking = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name WHERE tracking_code = %s",
            $tracking_code
        ));

        if (!$tracking) {
            return new WP_REST_Response(array(
                'success' => false,
                'error' => 'Tracking not found',
            ), 404);
        }

        // Update tracking record
        $wpdb->update(
            $table_name,
            array(
                'status' => $new_status,
                'current_location' => $location,
                'last_update' => current_time('mysql'),
            ),
            array('id' => $tracking->id)
        );

        // Update WooCommerce order
        $order = wc_get_order($tracking->order_id);
        if ($order) {
            // Add order note
            $status_labels = array(
                'pending' => 'Pendente',
                'collected' => 'Coletado',
                'in_transit' => 'Em Trânsito',
                'out_for_delivery' => 'Saiu para Entrega',
                'delivered' => 'Entregue',
                'failed' => 'Falha na Entrega',
                'returned' => 'Devolvido',
            );
            
            $status_label = $status_labels[$new_status] ?? $new_status;
            $note = sprintf(
                '📦 Cargo Flash: Status atualizado para "%s"',
                $status_label
            );
            
            if (!empty($location)) {
                $note .= sprintf(' - Localização: %s', $location);
            }
            
            $order->add_order_note($note);

            // Update order status if delivered
            if ($new_status === 'delivered') {
                if ($order->get_status() !== 'completed') {
                    $order->update_status('completed', 'Entrega confirmada pelo Cargo Flash.');
                }
            }

            // Trigger action for other plugins
            do_action('cft_tracking_updated', $order, $new_status, $tracking);
        }

        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Tracking updated',
        ), 200);
    }

    /**
     * Status check endpoint
     */
    public static function status_check($request) {
        return new WP_REST_Response(array(
            'success' => true,
            'plugin' => 'Cargo Flash Tracking',
            'version' => CFT_VERSION,
            'woocommerce' => class_exists('WooCommerce') ? WC()->version : 'Not installed',
            'wordpress' => get_bloginfo('version'),
        ), 200);
    }
}
