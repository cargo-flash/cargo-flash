<?php
/**
 * API Client Class
 * 
 * Handles communication with Cargo Flash API
 */

if (!defined('ABSPATH')) {
    exit;
}

class CFT_API {

    /**
     * Get API URL
     */
    public static function get_api_url() {
        return rtrim(get_option('cft_api_url', ''), '/');
    }

    /**
     * Get API Key
     */
    public static function get_api_key() {
        return get_option('cft_api_key', '');
    }

    /**
     * Make API request
     */
    public static function request($endpoint, $method = 'GET', $body = null) {
        $api_url = self::get_api_url();
        $api_key = self::get_api_key();

        if (empty($api_url) || empty($api_key)) {
            return new WP_Error('missing_config', 'API não configurada');
        }

        $args = array(
            'method' => $method,
            'headers' => array(
                'Content-Type' => 'application/json',
                'x-api-key' => $api_key,
            ),
            'timeout' => 30,
        );

        if ($body && in_array($method, array('POST', 'PUT', 'PATCH'))) {
            $args['body'] = json_encode($body);
        }

        $response = wp_remote_request($api_url . $endpoint, $args);

        if (is_wp_error($response)) {
            return $response;
        }

        $code = wp_remote_retrieve_response_code($response);
        $body = json_decode(wp_remote_retrieve_body($response), true);

        if ($code >= 200 && $code < 300) {
            return $body;
        }

        return new WP_Error(
            'api_error',
            isset($body['error']) ? $body['error'] : 'Erro na API',
            array('status' => $code, 'response' => $body)
        );
    }

    /**
     * Send order to Cargo Flash
     */
    public static function send_order($order) {
        if (!is_a($order, 'WC_Order')) {
            $order = wc_get_order($order);
        }

        if (!$order) {
            return new WP_Error('invalid_order', 'Pedido inválido');
        }

        // Build order data
        $items = array();
        foreach ($order->get_items() as $item) {
            $items[] = array(
                'name' => $item->get_name(),
                'quantity' => $item->get_quantity(),
                'sku' => $item->get_product() ? $item->get_product()->get_sku() : '',
            );
        }

        $data = array(
            'order_id' => $order->get_id(),
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
                ),
            ),
            'items' => $items,
            'total' => $order->get_total(),
            'notes' => $order->get_customer_note(),
        );

        // Add origin data if configured
        $origin_company = get_option('cft_origin_company');
        if ($origin_company) {
            $data['origin'] = array(
                'company' => $origin_company,
                'address' => get_option('cft_origin_address'),
                'city' => get_option('cft_origin_city'),
                'state' => get_option('cft_origin_state'),
                'zip' => get_option('cft_origin_zip'),
            );
        }

        $result = self::request('/api/webhooks/woocommerce', 'POST', $data);

        if (is_wp_error($result)) {
            // Log error
            error_log('Cargo Flash API Error: ' . $result->get_error_message());
            return $result;
        }

        return $result;
    }

    /**
     * Get tracking info
     */
    public static function get_tracking($tracking_code) {
        return self::request('/api/external/tracking?code=' . urlencode($tracking_code));
    }

    /**
     * Get tracking by order ID
     */
    public static function get_tracking_by_order($order_id) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'cft_tracking';
        
        $tracking = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name WHERE order_id = %d ORDER BY created_at DESC LIMIT 1",
            $order_id
        ));

        if (!$tracking) {
            return null;
        }

        // Get fresh data from API if we have a tracking code
        if (!empty($tracking->tracking_code)) {
            $api_data = self::get_tracking($tracking->tracking_code);
            if (!is_wp_error($api_data) && isset($api_data['delivery'])) {
                // Update local data
                $wpdb->update(
                    $table_name,
                    array(
                        'status' => $api_data['delivery']['status'],
                        'current_location' => $api_data['delivery']['current_location'] ?? '',
                        'last_update' => current_time('mysql'),
                        'history' => json_encode($api_data['history'] ?? array()),
                    ),
                    array('id' => $tracking->id)
                );
                
                $tracking->status = $api_data['delivery']['status'];
                $tracking->current_location = $api_data['delivery']['current_location'] ?? '';
                $tracking->history = $api_data['history'] ?? array();
            }
        }

        return $tracking;
    }

    /**
     * Test connection
     */
    public static function test_connection() {
        $result = self::request('/api/health');
        return !is_wp_error($result);
    }
}
