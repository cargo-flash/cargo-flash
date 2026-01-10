# Cargo Flash Tracking for WooCommerce

Plugin oficial para integração do sistema de rastreamento Cargo Flash com WooCommerce.

## 📦 Recursos

- **Envio Automático**: Pedidos são enviados automaticamente para o Cargo Flash quando mudam de status
- **Rastreamento em Tempo Real**: Acompanhe suas entregas diretamente no painel do WooCommerce
- **Notificações**: Clientes recebem links de rastreamento por email
- **Página Minha Conta**: Clientes podem ver todas suas entregas na área de login
- **Ações em Lote**: Envie múltiplos pedidos de uma vez
- **Webhooks**: Receba atualizações de status automaticamente

## 🚀 Instalação

### Método 1: Upload via WordPress

1. Baixe o arquivo ZIP do plugin
2. Acesse **WordPress Admin > Plugins > Adicionar Novo > Fazer Upload**
3. Selecione o arquivo ZIP e clique em **Instalar Agora**
4. Ative o plugin

### Método 2: Upload via FTP

1. Extraia o arquivo ZIP
2. Faça upload da pasta `cargo-flash-tracking` para `/wp-content/plugins/`
3. Acesse **WordPress Admin > Plugins** e ative o plugin

## ⚙️ Configuração

### 1. Obter Credenciais no Cargo Flash

1. Acesse seu painel admin do Cargo Flash
2. Vá em **Configurações > API Keys**
3. Crie uma nova chave de API
4. Copie a chave gerada

### 2. Configurar o Plugin

1. No WordPress, acesse **WooCommerce > Cargo Flash**
2. Preencha os campos:
   - **URL da API**: URL do seu sistema Cargo Flash (ex: `https://seu-sistema.vercel.app`)
   - **Chave da API**: Cole a chave gerada
3. Clique em **Testar Conexão** para verificar
4. Configure as opções de automação conforme necessário
5. Salve as configurações

### 3. Configurar Dados de Origem

Preencha os dados da sua empresa (remetente) para que apareçam nas entregas:
- Nome da Empresa
- Endereço
- Cidade, Estado, CEP

### 4. Configurar Webhook no Cargo Flash (Opcional)

Para receber atualizações de status automaticamente:

1. Copie a URL de webhook exibida na página de configurações
2. No Cargo Flash, configure o webhook de callback com esta URL

## 📖 Uso

### Envio Automático

Quando ativado, os pedidos são enviados automaticamente para o Cargo Flash ao atingir o status configurado (padrão: "Processando").

### Envio Manual

1. Acesse o pedido no WooCommerce
2. Na caixa "Cargo Flash Tracking" (lateral direita)
3. Clique em **Enviar para Cargo Flash**

### Envio em Lote

1. Acesse **WooCommerce > Pedidos**
2. Selecione os pedidos desejados
3. Em "Ações em Lote", escolha **Enviar para Cargo Flash**
4. Clique em **Aplicar**

### Visualizar Rastreamento

#### No Admin
- **Lista de Pedidos**: Coluna "Cargo Flash" mostra o status
- **Página do Pedido**: Caixa lateral com detalhes completos

#### Para Clientes
- **Página do Pedido**: Seção de rastreamento com timeline
- **Minha Conta > Rastrear Entregas**: Lista todas as entregas
- **Email**: Links de rastreamento nos emails de pedido

### Shortcode

Use o shortcode para criar uma página de rastreamento pública:

```
[cargo_flash_tracking]
```

## 🔌 Hooks para Desenvolvedores

### Ações

```php
// Quando o rastreamento é atualizado
do_action('cft_tracking_updated', $order, $new_status, $tracking);
```

### Filtros

```php
// Modificar dados antes de enviar para API
add_filter('cft_order_data', function($data, $order) {
    // Customizar dados
    return $data;
}, 10, 2);
```

## ❓ FAQ

### O plugin é compatível com HPOS?

Sim, o plugin é totalmente compatível com High-Performance Order Storage (HPOS) do WooCommerce.

### Posso usar com WooCommerce Subscriptions?

Sim, cada pedido de renovação gerará um novo código de rastreio.

### Como recebo atualizações de status?

Configure o webhook nas configurações. O Cargo Flash enviará atualizações automáticas que atualizarão o status no WooCommerce.

## 📞 Suporte

Para suporte, entre em contato através do painel Cargo Flash ou abra uma issue no GitHub.

## 📄 Licença

GPL v2 ou posterior. Veja [LICENSE](https://www.gnu.org/licenses/gpl-2.0.html) para detalhes.
