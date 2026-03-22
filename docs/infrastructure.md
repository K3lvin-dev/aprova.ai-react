# Infrastructure

## Infrastructure Overview

Este repositório não gerencia infraestrutura de servidor. Toda a infraestrutura backend (API, banco de dados, filas, vector store) reside em repositórios separados.

A infraestrutura deste repo é restrita ao ciclo de build e distribuição do app React Native.

## Environments

| Ambiente | Propósito | Distribuição |
|---|---|---|
| local | Desenvolvimento no simulador/dispositivo via Expo Go | `npx expo start` |
| dev | Integração com backend de dev | Expo Go com variáveis de dev |
| staging | Validação pré-release | Expo Go / EAS Preview |
| prod | Usuários reais | Expo Go (MVP) → App Store / Play Store (pós-MVP) |

## Core Services and Dependencies

| Serviço | Responsabilidade neste repo | Repo proprietário |
|---|---|---|
| Backend API (FastAPI) | Fonte de dados REST consumida via axios | Repositório backend |
| Supabase Auth | Autenticação JWT — cliente inicializado em `lib/supabase.ts` | Supabase cloud (externo) |
| Stripe | Upgrade de plano — link externo de Checkout (sem SDK nativo) | Repositório backend (webhook) |
| Expo EAS | Build e distribuição do app nativo (pós-MVP) | Expo cloud |

## Deployment and Operations

### MVP (atual)
- Distribuição via **Expo Go** com link QR compartilhável.
- Sem build nativo necessário para validação.
- `npx expo start --tunnel` para acesso externo.

### Pós-MVP
- **iOS:** App Store via `eas build --platform ios` + `eas submit`
- **Android:** Google Play via `eas build --platform android` + `eas submit`
- CI/CD: a definir (GitHub Actions + EAS CLI)

### Variaveis de ambiente
Gerenciadas em tres lugares:
- **`.env`** (local, nao commitado): para desenvolvimento local.
- **`app.config.ts`**: le `process.env.EXPO_PUBLIC_*` e injeta no bundle da app.
- **`eas.json`**: define variaveis por profile (dev/staging/prod) para builds EAS.

Variaveis minimas esperadas:
```
EXPO_PUBLIC_API_BASE_URL=    # URL base da API REST backend
EXPO_PUBLIC_SUPABASE_URL=    # URL do projeto Supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=  # Chave anon publica do Supabase
```

> Manter um arquivo `.env.example` commitado com todas as variaveis (sem valores reais) para facilitar onboarding de novos desenvolvedores.

## Known Constraints and Risks

| Risco | Impacto | Mitigação |
|---|---|---|
| Expo Go não suporta módulos nativos arbitrários | Limitação de libs nativas no MVP | Preferir libs compatíveis com Expo managed workflow |
| JWT expirado sem renovação silenciosa | Usuário perde sessão | Configurar refresh automático no cliente Supabase |
| URL da API hardcoded em builds | Builds quebram ao mudar ambiente | Usar `EXPO_PUBLIC_*` vars obrigatoriamente |
| ChromaDB perde dados em restart (backend) | Trilhas não podem ser regeneradas | Responsabilidade do repo backend; frontend exibe erro de estado |
