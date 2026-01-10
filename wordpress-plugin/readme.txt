=== Cargo Flash Tracking ===
Contributors: cargoflash
Tags: woocommerce, tracking, shipping, rastreamento, entregas
Requires at least: 5.0
Tested up to: 6.4
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Integração automática de rastreamento Cargo Flash com WooCommerce.

== Description ==

O plugin Cargo Flash Tracking integra sua loja WooCommerce com o sistema de rastreamento Cargo Flash, permitindo:

* **Envio automático de pedidos** para o sistema de rastreamento
* **Código de rastreamento** exibido automaticamente nos e-mails
* **Coluna de rastreamento** na lista de pedidos do admin
* **Meta box** na página de edição do pedido
* **Link de rastreamento** na área "Meus Pedidos" do cliente

== Installation ==

1. Faça upload da pasta `cargo-flash-tracking` para `/wp-content/plugins/`
2. Ative o plugin no menu 'Plugins' do WordPress
3. Vá em WooCommerce > Cargo Flash
4. Configure a URL da API e a chave de API
5. Pronto! Novos pedidos serão enviados automaticamente

== Configuration ==

= URL da API =
Insira a URL base do sistema Cargo Flash (ex: https://rastreamento.suaempresa.com.br)

= Chave de API =
1. Acesse o painel administrativo do Cargo Flash
2. Vá em Configurações > API Keys
3. Crie uma nova chave de API
4. Copie a chave e cole no campo de configuração

= Envio Automático =
Escolha se os pedidos devem ser enviados automaticamente ou manualmente.

= Status de Envio =
Escolha em qual status do pedido o rastreamento deve ser gerado:
* **Processando**: Quando o pagamento é confirmado
* **Concluído**: Quando o pedido é marcado como completo

== Frequently Asked Questions ==

= O plugin funciona com HPOS? =
Sim! O plugin é totalmente compatível com o novo sistema High-Performance Order Storage (HPOS) do WooCommerce 8.0+.

= Como enviar um pedido manualmente? =
Acesse a página de edição do pedido e clique no botão "Enviar para Cargo Flash" na meta box lateral.

= O código aparece nos e-mails? =
Sim, automaticamente! O código de rastreamento e um botão de acompanhamento são adicionados aos e-mails de pedido.

== Changelog ==

= 1.0.0 =
* Versão inicial
* Integração automática com WooCommerce
* Suporte a HPOS
* Rastreamento em e-mails
* Meta box no admin

== Upgrade Notice ==

= 1.0.0 =
Versão inicial do plugin.
