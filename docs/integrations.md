# Integrations

## Integration Catalog

| Servico | Tipo | Proposito no cliente | Auth |
|---|---|---|---|
| Backend API (FastAPI) | REST interno | Fonte de todos os dados de dominio (concursos, trilhas, modulos, progresso) | JWT Bearer (Supabase) |
| Supabase Auth | SDK direto | Login (magic link + Google OAuth), sessao, renovacao de JWT | Chave anon publica |
| Stripe | Link externo | Checkout de upgrade de plano (sem SDK nativo) | N/A (URL gerada pelo backend) |

## Authentication and Access

### Supabase Auth
- Inicializado em `lib/supabase.ts` com `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Suporta magic link (email) e Google OAuth.
- JWT e armazenado e renovado automaticamente pelo SDK do Supabase.
- O `useAuthStore` (Zustand) expoe a sessao para o restante do app, incluindo o campo `plan` (free|pro).
- O frontend **nao** chama `POST /auth/login` diretamente — auth e feito inteiramente via SDK Supabase. O backend valida o JWT resultante em cada request.

### Backend API
- Instancia axios configurada em `lib/api.ts`.
- Interceptor injeta o JWT do Supabase no header `Authorization: Bearer <token>` em todas as requisicoes.
- Base URL configurada via `EXPO_PUBLIC_API_BASE_URL`.

### Stripe
- Sem SDK nativo no cliente.
- O frontend solicita a URL de checkout ao backend (a definir: endpoint dedicado ou campo na response de perfil).
- Abre o link via `Linking.openURL()` no browser externo do dispositivo.
- Apos pagamento, o webhook do Stripe notifica o backend, que atualiza o `plan` do usuario no Supabase.
- O app rele o `plan` ao renovar o JWT ou ao recarregar a tela `/perfil`.

## Contracts and Data Flows

### Endpoints consumidos pelo cliente

| Metodo | Endpoint | Uso no app |
|---|---|---|
| GET | /concursos | Lista concursos disponiveis na tela de selecao |
| POST | /trilhas/gerar | Dispara geracao de trilha (job assincrono — resposta imediata com `trilha_id`) |
| GET | /trilhas/{id} | Polling para obter trilha gerada (status + disciplinas + modulos) |
| GET | /modulos/{id} | Conteudo completo do modulo (Markdown + questoes) |
| POST | /progresso | Registra resposta do usuario (modulo_id, score, status) |
| POST | /reforco/gerar | Dispara geracao de trilha de reforco apos reprovacao |
| GET | /reforco/{modulo_id} | Conteudo da trilha de reforco |

> **Nota:** `POST /auth/login` e `POST /webhooks/stripe` sao endpoints do backend que o frontend **nao** consome diretamente. Auth e via SDK Supabase e o webhook e chamado pelo Stripe.

### Formato esperado das respostas (referencia)

**GET /concursos**
```json
[
  {
    "id": "uuid",
    "nome": "Policia Federal",
    "banca": "CEBRASPE",
    "ano": 2024,
    "edital_url": "https://...",
    "embeddings_ready": true
  },
  {
    "id": "uuid",
    "nome": "INSS",
    "banca": "CEBRASPE",
    "ano": 2024,
    "edital_url": "https://...",
    "embeddings_ready": false
  }
]
```

**POST /trilhas/gerar** (request)
```json
{
  "concurso_id": "uuid"
}
```

**POST /trilhas/gerar** (response — imediata)
```json
{
  "trilha_id": "uuid",
  "status": "gerando"
}
```

**GET /trilhas/{id}**
```json
{
  "id": "uuid",
  "concurso_id": "uuid",
  "status": "gerando | pronto | erro",
  "gerado_em": "2024-01-15T10:30:00Z",
  "disciplinas": [
    {
      "id": "uuid",
      "nome": "Direito Constitucional",
      "ordem": 1,
      "desbloqueada": true,
      "modulos": [
        {
          "id": "uuid",
          "titulo": "Principios Fundamentais",
          "ordem": 1,
          "travado": false
        }
      ]
    },
    {
      "id": "uuid",
      "nome": "Direito Administrativo",
      "ordem": 2,
      "desbloqueada": false,
      "modulos": [...]
    }
  ]
}
```

**GET /modulos/{id}**
```json
{
  "id": "uuid",
  "titulo": "Principios Fundamentais",
  "conteudo_md": "# Principios Fundamentais\n\nA Constituicao Federal...",
  "ordem": 1,
  "travado": false,
  "questoes": [
    {
      "id": "uuid",
      "enunciado": "Qual dos seguintes e um principio fundamental da Republica?",
      "alternativas": [
        {"label": "A", "texto": "Soberania"},
        {"label": "B", "texto": "Federalismo"},
        {"label": "C", "texto": "Parlamentarismo"},
        {"label": "D", "texto": "Monarquia"},
        {"label": "E", "texto": "Teocracia"}
      ],
      "resposta_correta": "A"
    }
  ]
}
```

**POST /progresso** (request)
```json
{
  "modulo_id": "uuid",
  "status": "aprovado | reprovado",
  "score": 0.8,
  "tentativas": 1,
  "erros": [
    {
      "questao_id": "uuid",
      "topico": "Principios Fundamentais",
      "conceito_errado": "Confundiu federalismo com soberania"
    }
  ]
}
```

**GET /reforco/{modulo_id}**
```json
{
  "id": "uuid",
  "modulo_id": "uuid",
  "erros_json": [...],
  "modulos_reforco_json": [
    {
      "titulo": "Reforco: Soberania vs Federalismo",
      "conteudo_md": "...",
      "questoes": [...]
    }
  ]
}
```

## Failure Modes and Retries

| Cenario | Comportamento esperado no cliente |
|---|---|
| API indisponivel | React Query exibe estado de erro com opcao de retry manual |
| Geracao de trilha em andamento (status = "gerando") | Polling a cada 3-5s com SkeletonLoader; timeout apos 2 min com opcao de retry |
| Geracao de trilha falhou (status = "erro") | Exibe mensagem de erro com opcao de tentar novamente |
| JWT expirado | SDK Supabase renova silenciosamente; se falhar, redireciona para login |
| Stripe link indisponivel | Exibe mensagem de erro; nao bloqueia navegacao |
| Modulo com `travado: true` | Exibe cadeado (sequenciamento); nao requisita conteudo |
| Disciplina com `desbloqueada: false` | Exibe cadeado + CTA de upgrade (freemium); nao requisita modulos |
| Concurso com `embeddings_ready: false` | Desabilita card na tela de selecao; exibe badge "Em breve" |
| Latencia alta na geracao (20-60s normal) | SkeletonLoader com mensagens rotativas de progresso |

## Ownership

| Integracao | Proprietario da integracao |
|---|---|
| Backend API | Repositorio backend (FastAPI + LangGraph) |
| Supabase projeto | Compartilhado — configuracao no repo backend/infra |
| Stripe conta | Produto/negocio — configuracao no repo backend |
