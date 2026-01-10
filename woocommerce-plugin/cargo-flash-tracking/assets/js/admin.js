/**
 * Cargo Flash Tracking - Admin JavaScript
 */

(function ($) {
    'use strict';

    // Test Connection
    $(document).on('click', '#cft-test-connection', function () {
        var $button = $(this);
        var $result = $('#cft-connection-result');

        $button.prop('disabled', true).text('Testando...');
        $result.removeClass('success error').text('');

        $.post(cft_vars.ajax_url, {
            action: 'cft_test_connection',
            nonce: cft_vars.nonce
        }, function (response) {
            if (response.success) {
                $result.addClass('success').text('✓ ' + response.data);
            } else {
                $result.addClass('error').text('✗ ' + response.data);
            }
        }).fail(function () {
            $result.addClass('error').text('✗ Erro de conexão');
        }).always(function () {
            $button.prop('disabled', false).text('🔌 Testar Conexão');
        });
    });

    // Bulk action confirmation
    $(document).on('change', 'select[name="action"], select[name="action2"]', function () {
        if ($(this).val() === 'send_to_cargo_flash') {
            if (!confirm('Enviar todos os pedidos selecionados para o Cargo Flash?')) {
                $(this).val('-1');
            }
        }
    });

    // URL params for bulk action feedback
    var urlParams = new URLSearchParams(window.location.search);
    var sent = urlParams.get('cft_sent');
    var failed = urlParams.get('cft_failed');

    if (sent !== null || failed !== null) {
        var message = '';
        if (sent > 0) {
            message += sent + ' pedido(s) enviado(s) com sucesso. ';
        }
        if (failed > 0) {
            message += failed + ' pedido(s) falharam.';
        }
        if (message) {
            // Create notice
            var notice = $('<div class="notice notice-info is-dismissible"><p>' + message + '</p></div>');
            $('.wrap h1').first().after(notice);

            // Clean URL
            var cleanUrl = window.location.href.split('?')[0];
            window.history.replaceState({}, document.title, cleanUrl + '?page=wc-orders');
        }
    }

})(jQuery);
