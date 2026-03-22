# Architecture

## System Overview

Este repositório contém o cliente mobile **AprovaAI** — uma aplicação React Native (Expo) que é a interface principal da plataforma SaaS de preparação para concursos públicos brasileiros.

O cliente consome uma API REST externa (backend em repositório separado) e utiliza Supabase Auth diretamente para autenticação via JWT. Não existe lógica de negócio ou infraestrutura de servidor neste repo.

## Technology Stack

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | React Native + Expo | Expo SDK 51 |
| Linguagem | TypeScript | — |
| Navegação | Expo Router (file-based) | — |
| State Management | Zustand | — |
| Data Fetching / Cache | React Query | — |
| Auth | Supabase Auth (JWT — magic link + Google OAuth) | — |
| HTTP Client | axios (com JWT header automático) | — |

## Module and Service Boundaries

```
aprova.ai-react/
  app/                          # Rotas Expo Router (file-based)
    (auth)/
      login.tsx                 # Magic link email + Google OAuth + ilustração do produto
    (app)/
      concursos.tsx             # Lista de cards (PF, INSS) com badge "Em breve" para futuros
      trilha/loading.tsx        # Skeleton animado + mensagens de progresso via polling
      trilha/[id].tsx           # Lista horizontal de disciplinas; módulos travados/desbloqueados
      modulo/[id].tsx           # Conteúdo em Markdown + barra de progresso + botão "Ir para questões"
      modulo/[id]/questoes.tsx  # Questões múltipla escolha + feedback imediato + score final
      reforco/[id].tsx          # Mesma estrutura de módulo com label "Reforço" + tópicos de erro
      perfil.tsx                # Progresso geral + histórico + CTA upgrade Pro (Stripe link)

  components/                   # Componentes reutilizáveis
    ModuloCard                  # Card de módulo (desbloqueado ou com cadeado)
    DisciplinaHeader            # Header de disciplina na lista horizontal
    QuestaoItem                 # Item de questão múltipla escolha com feedback
    ProgressBar                 # Barra de progresso do módulo/disciplina
    SkeletonLoader              # Placeholder animado durante carregamento assíncrono

  store/                        # Estado global (Zustand)
    useAuthStore                # Sessão do usuário, JWT, plan (free|pro)
    useTrilhaStore              # Trilha ativa, disciplina selecionada

  hooks/                        # React Query hooks
    useGetConcursos             # GET /concursos
    useGetTrilha                # GET /trilhas/{id} (com polling quando status = "gerando")
    useGetModulo                # GET /modulos/{id}
    useSubmitProgresso          # POST /progresso
    useGerarReforco             # POST /reforco/gerar

  lib/
    api.ts                      # Instância axios com interceptor de JWT header
    supabase.ts                 # Cliente Supabase (auth only)
```

## Screen Map

Mapeamento completo das telas conforme definido no plano técnico:

| Tela | Rota | Componentes principais |
|---|---|---|
| Login / Onboarding | `/login` | Magic link email, botão Google OAuth, ilustração do produto |
| Seleção de Concurso | `/concursos` | Lista de cards (PF, INSS), badge "Em breve" para concursos futuros |
| Gerando Trilha | `/trilha/loading` | Skeleton animado + mensagens de progresso via polling |
| Trilha Principal | `/trilha/[id]` | Lista horizontal de disciplinas; módulos travados/desbloqueados |
| Módulo de Estudo | `/modulo/[id]` | Conteúdo em Markdown, barra de progresso, botão "Ir para questões" |
| Questões do Módulo | `/modulo/[id]/questoes` | Questões múltipla escolha, feedback imediato, score final |
| Trilha de Reforço | `/reforco/[id]` | Mesma estrutura do módulo, com label "Reforço" e tópicos de erro |
| Perfil / Upgrade | `/perfil` | Progresso geral, histórico, botão CTA para plano Pro (Stripe link) |

## Data and Request Flows

### Login
```
Usuário → login.tsx → Supabase Auth (magic link / Google OAuth)
       → JWT armazenado no useAuthStore (plan: free|pro)
       → Redirecionamento para /concursos
```

### Geração de Trilha
```
/concursos → Usuário seleciona concurso (card PF ou INSS)
       → POST /trilhas/gerar (API externa, job assíncrono)
       → Navega para /trilha/loading
       → Polling em /trilhas/{id} com React Query (status: "gerando")
       → SkeletonLoader + mensagens de progresso
       → Quando status = "pronto" → navega para /trilha/{id}
       → Timeout após 2 min → exibe erro com retry
```

### Estudo de Módulo
```
/trilha/{id} → DisciplinaHeader (lista horizontal) + ModuloCard (lista vertical)
       → Módulo bloqueado (disciplina com desbloqueada: false)?
           → Exibe cadeado + CTA upgrade
       → Módulo travado (travado: true)?
           → Exibe cadeado (precisa completar módulo anterior)
       → Módulo desbloqueado → /modulo/{id}
       → Conteúdo Markdown + ProgressBar → botão "Ir para questões"
       → /modulo/{id}/questoes → QuestaoItem com feedback imediato
       → POST /progresso (score, status)
       → Se reprovado → POST /reforco/gerar → /reforco/{id}
```

### Upgrade Freemium
```
Perfil ou CTA de módulo bloqueado
       → Backend gera Stripe Checkout URL
       → Linking.openURL() abre browser externo
       → Webhook no backend atualiza plan do usuário
       → App relê plan ao renovar JWT ou recarregar /perfil
```

## Architecture Invariants

- **Sem lógica de negócio no cliente:** toda decisão de acesso (desbloqueado/bloqueado) vem do backend. O campo `desbloqueada` na disciplina é a fonte de verdade.
- **Dois níveis de bloqueio:** `desbloqueada` (disciplina — controle freemium) e `travado` (módulo — sequenciamento pedagógico). Ambos vêm da API.
- **JWT via Supabase Auth:** o token é injetado automaticamente pelo interceptor em `api.ts`. Nunca armazenar manualmente fora do Supabase client.
- **Backend é externo:** a URL base da API é configurada via `EXPO_PUBLIC_API_BASE_URL`. Nenhum endpoint deve ser hardcoded.
- **Freemium é server-side:** o frontend exibe o estado correto, mas nunca concede acesso baseado em dados locais.
- **Expo Go first:** builds nativos são pós-MVP. A experiência deve funcionar via Expo Go com link compartilhável.
- **Polling, não WebSocket:** a geração de trilha usa polling com React Query (refetchInterval), não real-time. Geração pode levar 20-60s.
