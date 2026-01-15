# Cargo Flash Tracking - Plugin WooCommerce

![Versão](https://img.shields.io/badge/vers%C3%A3o-2.0.0-blue)
![WooCommerce](https://img.shields.io/badge/WooCommerce-6.0%2B-purple)
![WordPress](https://img.shields.io/badge/WordPress-5.8%2B-blue)

Plugin oficial para integração do WooCommerce com o sistema de rastreamento Cargo Flash.

## 🚀 Recursos

- ✅ **Envio automático** de pedidos para o Cargo Flash
- ✅ **HPOS compatível** (WooCommerce 8.0+)
- ✅ **Importação em massa** de pedidos pendentes
- ✅ **Rastreamento em emails** do WooCommerce
- ✅ **Widget na área do cliente** (Minha Conta)
- ✅ **Valor do pedido** para cálculo de seguro
- ✅ **Meta box** em cada pedido
- ✅ **Coluna de rastreamento** na lista de pedidos
- ✅ **Ações em massa** para múltiplos pedidos

## 📦 Instalação

### Método 1: Upload via WordPress

1. Baixe o arquivo `cargo-flash-tracking.zip`
2. Vá em **Plugins → Adicionar Novo → Enviar Plugin**
3. Selecione o arquivo ZIP e clique em **Instalar Agora**
4. Ative o plugin

### Método 2: Upload via FTP

1. Extraia o conteúdo do ZIP
2. Envie a pasta `cargo-flash-tracking` para `/wp-content/plugins/`
3. Ative o plugin em **Plugins**

## ⚙️ Configuração

1. Acesse **WooCommerce → Cargo Flash**
2. Insira a **URL da API**: `https://cargoflash.com.br`
3. Insira a **API Key** (gerada no painel Cargo Flash)
4. Configure o status de disparo (Processando/Concluído)
5. Salve as configurações

## 📋 Como obter a API Key

1. Acesse [cargoflash.com.br/admin](https://cargoflash.com.br/admin)
2. Vá em **Configurações → API Keys**
3. Clique em **Nova API Key**
4. Copie a chave gerada (começa com `cf_`)
5. Cole no campo "Chave de API" do plugin

## 🔄 Fluxo de Funcionamento

1. Cliente faz um pedido na loja
2. Pedido muda para status "Processando"
3. Plugin envia dados para o Cargo Flash
4. Código de rastreamento é gerado (ex: CF123456789BR)
5. Código aparece no pedido e é enviado por email ao cliente
6. Cliente acompanha pelo link de rastreamento

## 📝 Dados Enviados

| Campo | Descrição |
|-------|-----------|
| order_id | Número do pedido |
| customer.name | Nome do destinatário |
| customer.email | Email do cliente |
| customer.phone | Telefone |
| customer.address | Endereço completo |
| items | Lista de produtos |
| total | Valor total (para seguro) |

## 🛠️ Requisitos

- WordPress 5.8+
- WooCommerce 6.0+
- PHP 7.4+
- SSL (HTTPS) recomendado

## 📄 Changelog

### v2.0.0
- Interface administrativa redesenhada
- Suporte completo a HPOS
- Importação em massa
- Valor do pedido para seguro
- Widget na Minha Conta
- Ações em massa

### v1.0.0
- Versão inicial

## 🆘 Suporte

- **Email**: suporte@cargoflash.com.br
- **Site**: [cargoflash.com.br](https://cargoflash.com.br)

---

**Desenvolvido por Cargo Flash** © 2026
