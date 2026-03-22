# Environments

## Environment Matrix

| Ambiente | Propósito | API Base URL | Distribuição | Supabase |
|---|---|---|---|---|
| local | Dev no simulador/dispositivo | `http://localhost:8000` | `npx expo start` | Projeto de dev |
| dev | Integração com backend de dev | A definir (URL Railway dev) | Expo Go via QR | Projeto de dev |
| staging | Validação pré-release | A definir (URL Railway staging) | EAS Preview | Projeto de staging |
| prod | Usuários reais | A definir (URL Railway prod) | Expo Go (MVP) / App Store-Play Store (pós-MVP) | Projeto de prod |

## Configuration and Secrets Boundaries

### Variáveis de ambiente

Gerenciadas em tres lugares:
- **`.env` local** (nao commitado, adicionado ao `.gitignore`): para desenvolvimento local. Manter `.env.example` commitado com as chaves (sem valores).
- **`app.config.ts`**: le `process.env.EXPO_PUBLIC_*` e injeta no bundle. Ponto de entrada para todas as config de runtime.
- **`eas.json`**: define variaveis por profile (dev/staging/prod) para builds EAS.

| Variável | Descrição | Sensível? |
|---|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | URL base da API REST backend | Não (pública no bundle) |
| `EXPO_PUBLIC_SUPABASE_URL` | URL do projeto Supabase | Não (pública) |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Chave anon do Supabase | Não (pública, por design) |

> Todas as vars do Expo com prefixo `EXPO_PUBLIC_` são embutidas no bundle e visíveis no cliente. Nunca colocar secrets reais (service role key, API keys privadas) com esse prefixo.

### Secrets reais (não pertencem a este repo)
- `SUPABASE_SERVICE_ROLE_KEY` — exclusivo do backend
- `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` — exclusivos do backend
- `STRIPE_SECRET_KEY` — exclusivo do backend

## Deployment Differences

| Aspecto | local / dev | staging | prod |
|---|---|---|---|
| Build | Expo Go (sem build nativo) | EAS Preview build | EAS Production build |
| API URL | localhost ou Railway dev | Railway staging | Railway prod |
| Logs | Console nativo do Expo | EAS + crash reports | EAS + crash reports |
| Auth | Supabase dev project | Supabase staging | Supabase prod |
| Over-the-air updates | N/A | EAS Update (pós-MVP) | EAS Update (pós-MVP) |

## Operational Access

| Recurso | Acesso |
|---|---|
| Expo dashboard | expo.dev — gerencia builds, submissions e OTA updates |
| Supabase dashboard | supabase.com — visualizar usuários, sessões (projetos dev/staging/prod) |
| Logs de crash (pós-MVP) | A definir — Sentry ou Expo EAS Insights |
| Stripe (assinaturas) | stripe.com — gerenciado pelo repositório backend |
