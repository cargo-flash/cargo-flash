# Cargo Flash - Sistema de Rastreamento de Entregas

Sistema completo de rastreamento de entregas com painel administrativo estilo "Matrix", simulação automática de eventos e integração com WooCommerce.

## 🚀 Tecnologias

- **Framework:** Next.js 15+ com App Router
- **UI:** React 19, Tailwind CSS 4, shadcn/ui
- **Banco de Dados:** Supabase (PostgreSQL)
- **Autenticação:** JWT com cookies HTTP-only
- **Linguagem:** TypeScript 5+

## 📋 Funcionalidades

### Área Pública
- ✅ Rastreamento de entregas com código
- ✅ Mapa interativo com rota
- ✅ Timeline de eventos
- ✅ QR Code para compartilhamento
- ✅ Página Sobre e Contato funcional

### Painel Administrativo
- ✅ Dashboard em tempo real (auto-refresh 30s)
- ✅ CRUD completo de entregas
- ✅ Gestão de usuários e permissões
- ✅ Analytics e estatísticas
- ✅ Simulação automática de entregas
- ✅ Logs de atividade
- ✅ Gestão de API Keys
- ✅ Exportação CSV
- ✅ Impressão de comprovantes
- ✅ Notificações no sidebar

### Integrações
- ✅ Webhook WooCommerce
- ✅ API RESTful completa
- ✅ CRON para processamento de eventos

## 🛠️ Instalação

### 1. Clone o repositório
```bash
git clone <repository-url>
cd cargo-flash
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
```

Edite o `.env.local` com suas credenciais do Supabase.

### 4. Configure o banco de dados
Execute o script SQL no seu projeto Supabase:
```bash
# Abra o Supabase SQL Editor e execute:
scripts/COMPLETE_SETUP.sql
```

### 5. Execute o projeto
```bash
npm run dev
```

Acesse: http://localhost:3000

## 🔐 Credenciais Padrão

- **Email:** admin@cargoflash.com.br
- **Senha:** admin123

> ⚠️ Altere a senha após o primeiro login!

## 📁 Estrutura do Projeto

```
cargo-flash/
├── app/
│   ├── api/              # APIs RESTful
│   ├── admin/            # Páginas do painel admin
│   ├── rastrear/         # Página de rastreamento
│   ├── login/            # Autenticação
│   └── ...
├── components/
│   ├── admin/            # Componentes do admin
│   ├── tracking/         # Componentes de rastreamento
│   └── ui/               # Componentes shadcn/ui
├── lib/
│   ├── supabase/         # Cliente Supabase
│   ├── auth.ts           # Funções de autenticação
│   ├── types.ts          # Tipos TypeScript
│   └── utils.ts          # Utilitários
└── scripts/
    └── COMPLETE_SETUP.sql # Schema do banco
```

## 🔌 APIs Disponíveis

### Públicas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/tracking/[code]` | Rastrear entrega |
| GET | `/api/public/stats` | Estatísticas públicas |
| POST | `/api/contact` | Enviar mensagem |
| GET | `/api/health` | Health check |

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/admin/auth/login` | Login |
| POST | `/api/admin/auth/logout` | Logout |
| GET | `/api/admin/auth/me` | Sessão atual |
| POST | `/api/admin/auth/forgot-password` | Recuperar senha |
| POST | `/api/admin/auth/reset-password` | Redefinir senha |
| POST | `/api/admin/auth/change-password` | Alterar senha |

### Admin - Entregas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/admin/deliveries` | Listar entregas |
| POST | `/api/admin/deliveries` | Criar entrega |
| GET | `/api/admin/deliveries/[id]` | Detalhes |
| PUT | `/api/admin/deliveries/[id]` | Atualizar |
| DELETE | `/api/admin/deliveries/[id]` | Excluir |
| POST | `/api/admin/deliveries/[id]/status` | Atualizar status |
| POST | `/api/admin/deliveries/[id]/duplicate` | Duplicar |
| GET | `/api/admin/deliveries/export` | Exportar CSV |
| POST | `/api/admin/deliveries/bulk` | Ações em lote |

### Admin - Outros
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/admin/dashboard` | Stats dashboard |
| GET | `/api/admin/search` | Busca rápida |
| GET/POST | `/api/admin/users` | Usuários |
| GET/POST | `/api/admin/api-keys` | API Keys |
| GET/POST | `/api/admin/simulation/config` | Configuração |
| GET | `/api/admin/logs` | Logs de atividade |
| GET | `/api/admin/notifications` | Contadores |
| GET | `/api/admin/webhook-logs` | Logs de webhooks |

### Integrações Externas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/external/tracking` | Rastreamento via API Key |
| POST | `/api/webhooks/woocommerce` | Receber pedidos WooCommerce |
| POST | `/api/cron/process-events` | Processar eventos simulados |

## 🎨 Tema Matrix

O painel administrativo utiliza um tema inspirado no filme "Matrix":
- Fundo escuro (#0d1117)
- Verde neon (#00ff41)
- Efeito de chuva de caracteres
- Tipografia monospace
- Efeitos de glow

## 📦 Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm run start    # Iniciar produção
npm run lint     # Verificar código
```

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático!

### Docker
```bash
docker build -t cargo-flash .
docker run -p 3000:3000 cargo-flash
```

## 📄 Licença

Projeto proprietário - Todos os direitos reservados.

---

Desenvolvido com ❤️ para Cargo Flash
