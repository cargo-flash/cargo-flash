/**
 * Cargo Flash Tracking - Admin JavaScript
 * Version: 2.0.0
 */

jQuery(function ($) {
    'use strict';

    // Test Connection
    $('#cft-test-connection').on('click', function () {
        var btn = $(this);
        var originalText = btn.html();

        btn.prop('disabled', true).html('<span class="dashicons dashicons-update spinning"></span> Testando...');

        $.ajax({
            url: cftAjax.ajaxUrl,
            type: 'POST',
            data: {
                action: 'cft_test_connection',
                nonce: cftAjax.nonce
            },
            success: function (response) {
                if (response.success) {
                    alert('✅ ' + response.data.message);
                    location.reload();
                } else {
                    alert('❌ Erro: ' + (response.data.error || 'Falha na conexão'));
                }
            },
            error: function () {
                alert('❌ Erro de conexão com o servidor');
            },
            complete: function () {
                btn.prop('disabled', false).html(originalText);
            }
        });
    });

    // Sync Single Order (Meta Box)
    $(document).on('click', '.cft-sync-btn', function () {
        var btn = $(this);
        var orderId = btn.data('order-id');
        var originalText = btn.text();

        btn.prop('disabled', true).text('Enviando...');

        $.ajax({
            url: cftAjax.ajaxUrl,
            type: 'POST',
            data: {
                action: 'cft_sync_order',
                order_id: orderId,
                nonce: cftAjax.nonce
            },
            success: function (response) {
                if (response.success) {
                    alert('✅ Rastreamento criado: ' + response.data.tracking_code);
                    location.reload();
                } else {
                    alert('❌ Erro: ' + (response.data.error || 'Falha ao enviar'));
                    btn.prop('disabled', false).text(originalText);
                }
            },
            error: function () {
                alert('❌ Erro de conexão');
                btn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Bulk Sync
    $('.cft-bulk-sync').on('click', function () {
        var btn = $(this);
        var originalText = btn.html();
        var progressContainer = $('.cft-bulk-progress');
        var progressFill = $('.cft-progress-fill');
        var progressText = $('.cft-progress-text');

        if (!confirm('Deseja enviar todos os pedidos pendentes para o Cargo Flash?')) {
            return;
        }

        btn.prop('disabled', true).html('<span class="dashicons dashicons-update spinning"></span> Processando...');
        progressContainer.show();
        progressFill.css('width', '0%');
        progressText.text('Iniciando...');

        // Simulate progress
        var progress = 0;
        var progressInterval = setInterval(function () {
            progress += Math.random() * 15;
            if (progress > 90) progress = 90;
            progressFill.css('width', progress + '%');
        }, 500);

        $.ajax({
            url: cftAjax.ajaxUrl,
            type: 'POST',
            data: {
                action: 'cft_bulk_sync',
                nonce: cftAjax.nonce
            },
            success: function (response) {
                clearInterval(progressInterval);
                progressFill.css('width', '100%');

                if (response.success) {
                    progressText.text('✅ ' + response.data.message);
                    setTimeout(function () {
                        location.reload();
                    }, 1500);
                } else {
                    progressText.text('❌ ' + (response.data.error || 'Erro'));
                    btn.prop('disabled', false).html(originalText);
                }
            },
            error: function () {
                clearInterval(progressInterval);
                progressText.text('❌ Erro de conexão');
                btn.prop('disabled', false).html(originalText);
            }
        });
    });

    // Spinning animation for dashicons
    $('<style>.dashicons.spinning { animation: cft-spin 1s linear infinite; } @keyframes cft-spin { to { transform: rotate(360deg); } }</style>').appendTo('head');
});
