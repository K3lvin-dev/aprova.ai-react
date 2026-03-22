**PLANO TECNICO**

Plataforma SaaS de Preparacao para Concursos Publicos

_MVP de Fim de Semana | Policia Federal + INSS | Agente RAG Adaptativo_

| **48h**<br><br>de desenvolvimento | **R\$ 47-57**<br><br>por mes (target) | **1 pergunta**<br><br>a trilha gerada e util? |
| --------------------------------- | ------------------------------------- | --------------------------------------------- |

# **1\. Visao Geral do Produto**

O produto e uma plataforma SaaS mobile-first que usa um agente RAG para processar editais de concursos publicos brasileiros e gerar trilhas de estudo adaptativas e personalizadas. O MVP foca em dois concursos de alta demanda - Policia Federal e INSS - e valida a hipotese central: a geracao automatica de trilhas a partir do edital e suficientemente util para o usuario pagar por ela.

## **1.1 Hipotese de Validacao**

**Hipotese Principal**

Se um concurseiro conseguir ver, em menos de 2 minutos apos o login, uma trilha de estudos organizada e coerente com o edital do seu concurso, ele considerara isso valioso o suficiente para assinar o plano pago.

## **1.2 Modelo de Negocio**

<div class="joplin-table-wrapper"><table><tbody><tr><th><p><strong>Free</strong></p></th><th><p><strong>Pro - R$ 47-57/mes</strong></p></th><th><p><strong>Pos-MVP</strong></p></th></tr><tr><td><ul><li>1 disciplina completa desbloqueada</li><li>Visualizacao da trilha completa (locked)</li><li>Progresso basico</li></ul></td><td><ul><li><strong>Todas as disciplinas desbloqueadas</strong></li><li><strong>Trilhas de reforco por IA</strong></li><li><strong>Historico de erros e analytics</strong></li><li><strong>2 concursos simultaneos</strong></li></ul></td><td><ul><li><em>Simulados com timer</em></li><li><em>Grupos de estudo</em></li><li><em>Plano anual com desconto</em></li></ul></td></tr></tbody></table></div>

# **2\. Arquitetura do Sistema**

## **2.1 Visao Geral dos Componentes**

A arquitetura e construida em torno de um agente LangGraph que centraliza a logica de inteligencia. O FastAPI atua como camada de orquestracao, expondo endpoints REST consumidos pelo app React Native. O Supabase serve como banco de dados e camada de autenticacao. O processamento pesado (ingestao de editais, geracao de trilhas) e realizado de forma assincrona via Redis Queue para evitar timeouts na API.

**Decisao de Arquitetura: Por que LangGraph e nao LangChain puro?**

LangGraph permite modelar o fluxo de geracao de trilhas como um grafo de estados (parse → extract → generate → validate → save), facilitando debug, retry por no e inspecao de estado intermediario. Para um MVP de fim de semana, isso reduz drasticamente o tempo de debug quando um no falha.

## **2.2 Fluxo de Dados Principal**

| **#** | **Componente**            | **Responsabilidade**                                                                                          |
| ----- | ------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **1** | **React Native (Expo)**   | UI mobile-first. Consome API REST. Gerencia estado local com Zustand. React Query para cache e sincronizacao. |
| **2** | **FastAPI**               | Gateway REST. Valida JWT Supabase. Despacha jobs para Redis. Retorna dados do PostgreSQL.                     |
| **3** | **Redis Queue (Upstash)** | Fila de jobs assincronos para geracao de trilhas. Evita timeout na API (geracao pode levar 20-60s).           |
| **4** | **LangGraph Worker**      | Consome jobs da fila. Executa o grafo de geracao. Persiste resultado no PostgreSQL.                           |
| **5** | **ChromaDB**              | Vector store local para embeddings dos editais. Permite retrieval semantico por topico.                       |
| **6** | **OpenAI / Anthropic**    | LLM para extracao de disciplinas, geracao de modulos, criacao de questoes e trilhas de reforco.               |
| **7** | **PostgreSQL (Supabase)** | Fonte de verdade. Armazena usuarios, trilhas, modulos, progresso e logs de erro.                              |
| **8** | **Stripe**                | Gerencia assinaturas. Webhook atualiza campo plan no Supabase apos pagamento.                                 |

# **3\. Stack Tecnica Completa**

Cada escolha foi feita com tres criterios: velocidade de setup no fim de semana, custo proximo de zero para MVP, e caminho claro de evolucao para producao real.

| **Camada**          | **Tecnologia**                   | **Justificativa MVP**                                               |
| ------------------- | -------------------------------- | ------------------------------------------------------------------- |
| **API**             | FastAPI 0.111                    | Async nativo, OpenAPI automático, ecossistema Python para IA        |
| **Agente RAG**      | LangGraph 0.2 + LangChain        | Stateful agent flows, fácil de iterar no fim de semana              |
| **LLM**             | GPT-4o-mini / Claude Haiku       | Custo baixo, latência aceitável, suficiente para geração de trilhas |
| **Embeddings**      | text-embedding-3-small           | R\$0,02/1M tokens - custo irrelevante para MVP                      |
| **Vector Store**    | ChromaDB (local) → Qdrant Cloud  | Zero config local, migração trivial para produção                   |
| **Banco Principal** | PostgreSQL (Supabase)            | Auth, RLS e real-time inclusos; free tier generoso                  |
| **ORM**             | SQLModel (SQLAlchemy + Pydantic) | Um único schema valida API e banco                                  |
| **Cache / Queue**   | Redis (Upstash)                  | Freemium, serverless, sem infraestrutura                            |
| **Frontend**        | React Native + Expo SDK 51       | Web + iOS + Android em uma codebase; Expo Go para testar sem build  |
| **State**           | Zustand + React Query            | Simples, sem boilerplate de Redux                                   |
| **Auth**            | Supabase Auth (JWT)              | Magic link + social login sem backend extra                         |
| **Deploy Backend**  | Railway (1 worker)               | Deploy em 3 min via GitHub; free tier 5\$/mês efetivo               |
| **Deploy Frontend** | Expo EAS / Expo Go               | Nenhum app store necessário para validar                            |
| **Pagamentos**      | Stripe (Checkout hosted)         | Link de pagamento sem código; integração completa em 2h             |

## **3.1 Por que React Native e nao Next.js?**

O mercado-alvo (concurseiros) e majoritariamente mobile. React Native com Expo permite testar no celular do usuario via QR code sem publicar em nenhuma loja - critico para validacao no fim de semana. O mesmo codigo base gera uma PWA se necessario. A migracao para Next.js em uma versao futura e trivial com monorepo Turborepo.

# **4\. Backend: FastAPI + LangGraph**

## **4.1 Estrutura de Pastas**

backend/

app/

main.py # FastAPI app, CORS, routers

core/

config.py # Settings (pydantic-settings)

database.py # SQLModel engine, session factory

auth.py # Supabase JWT validation middleware

models/

user.py # SQLModel table + Pydantic schema

trilha.py # Trilha, Disciplina, Modulo, Progresso

api/

concursos.py # GET /concursos

trilhas.py # POST /trilhas/gerar, GET /trilhas/{id}

modulos.py # GET /modulos/{id}, POST /progresso

reforco.py # POST /reforco/gerar, GET /reforco/{id}

webhooks.py # POST /webhooks/stripe

rag/

ingest.py # PDF/texto -> chunks -> embeddings -> Chroma

retriever.py # Chroma query wrapper

agent/

graph.py # LangGraph StateGraph definition

nodes.py # parse_edital, extract_disciplinas, generate_modulos

state.py # TypedDict: TrilhaState

worker/

tasks.py # Redis job handlers (arq library)

scripts/

ingest_edital.py # CLI: python ingest_edital.py editais/pf_2024.pdf

Dockerfile

requirements.txt

## **4.2 LangGraph: Grafo de Geracao de Trilha**

O StateGraph define os nos de processamento. Cada no recebe o estado atual, executa uma operacao e retorna o estado atualizado. O grafo e compilado uma vez na inicializacao do worker.

| **No (Node)**           | **Input → Output**                 | **O que faz**                                                                  |
| ----------------------- | ---------------------------------- | ------------------------------------------------------------------------------ |
| **parse_edital**        | edital_text → chunks_relevantes    | Retrieval semantico no Chroma para extrair secoes de conteudo programatico     |
| **extract_disciplinas** | chunks → lista de disciplinas      | GPT-4o-mini extrai disciplinas e suas respectivas materias do edital           |
| **generate_modulos**    | disciplinas → modulos com conteudo | Para cada disciplina, gera lista de modulos sequenciais com titulo e objetivos |
| **generate_questoes**   | modulos → modulos + questoes       | Gera 3-5 questoes por modulo para avaliacao de proficiencia                    |
| **validate_schema**     | modulos_raw → modulos_valid        | Pydantic valida e corrige o output do LLM. Fallback para template se invalido. |
| **save_to_db**          | modulos_valid → trilha_id          | Persiste trilha, disciplinas e modulos no PostgreSQL via SQLModel              |

## **4.3 Pipeline RAG: Ingestao de Editais**

- Extracao de texto: PyMuPDF para PDF nativo; pdfplumber como fallback para PDFs com tabelas
- Chunking: RecursiveCharacterTextSplitter com chunk_size=1000, overlap=200. Chunks maiores preservam contexto de topicos
- Embeddings: text-embedding-3-small da OpenAI. Custo estimado: menos de R\$ 0,50 para processar ambos os editais completos
- Armazenamento: ChromaDB com persistencia em disco. Colecao por concurso (pf_2024, inss_2024)
- Retrieval: similarity search com k=8 chunks por consulta. Metadados incluem secao do edital e numero de pagina

## **4.4 Endpoints da API**

| **Método** | **Endpoint**         | **Descrição**                               |
| ---------- | -------------------- | ------------------------------------------- |
| **POST**   | /auth/login          | Magic link / social OAuth via Supabase      |
| **GET**    | /concursos           | Lista concursos disponíveis                 |
| **POST**   | /trilhas/gerar       | Dispara geração de trilha (LangGraph job)   |
| **GET**    | /trilhas/{id}        | Trilha completa com disciplinas e módulos   |
| **GET**    | /modulos/{id}        | Conteúdo do módulo (texto + questões)       |
| **POST**   | /progresso           | Registra resposta do usuário (score, erros) |
| **POST**   | /reforco/gerar       | Dispara geração de trilha de reforço        |
| **GET**    | /reforco/{modulo_id} | Conteúdo da trilha de reforço               |
| **POST**   | /webhooks/stripe     | Atualiza plan do usuário após pagamento     |

# **5\. Banco de Dados**

## **5.1 Schema PostgreSQL**

Todas as tabelas usam UUID como chave primaria. O Supabase gerencia automaticamente as politicas de Row Level Security (RLS) baseadas no JWT do usuario. O MVP usa SQLModel para definir tabelas e schemas Pydantic em um unico lugar.

| **Tabela**         | **Campos principais**                                                             |
| ------------------ | --------------------------------------------------------------------------------- |
| **users**          | id, email, plan (free\|pro), concurso_id, created_at                              |
| **concursos**      | id, nome, banca, ano, edital_url, edital_text, embeddings_ready                   |
| **trilhas**        | id, user_id, concurso_id, disciplinas_json, gerado_em, status                     |
| **disciplinas**    | id, trilha_id, nome, ordem, desbloqueada                                          |
| **modulos**        | id, disciplina_id, titulo, conteudo_md, ordem, travado                            |
| **progresso**      | id, user_id, modulo_id, status (pendente\|aprovado\|reprovado), score, tentativas |
| **trilha_reforco** | id, user_id, modulo_id, erros_json, gerado_em, modulos_reforco_json               |
| **erros_log**      | id, user_id, questao_id, topico, conceito_errado, timestamp                       |

## **5.2 Decisoes de Schema**

- disciplinas_json na tabela trilhas: armazena a ordem das disciplinas como JSON para flexibilidade. Disciplinas sao independentes (usuario pode alternar livremente).
- modulos_reforco_json em trilha_reforco: conteudo da trilha de reforco em JSON para evitar tabela extra no MVP.
- erros_log e separado de progresso para permitir analise de padroes sem joins pesados.
- Campo embeddings_ready em concursos sinaliza quando o RAG esta pronto para aceitar queries.

# **6\. Frontend: React Native + Expo**

## **6.1 Estrutura de Telas**

| **Tela**                | **Rota**             | **Componentes principais**                                         |
| ----------------------- | -------------------- | ------------------------------------------------------------------ |
| **Login / Onboarding**  | /login               | Magic link email, botao Google OAuth, ilustracao do produto        |
| **Selecao de Concurso** | /concursos           | Lista de cards (PF, INSS), badge 'Em breve' para futuros           |
| **Gerando Trilha**      | /trilha/loading      | Skeleton animado + mensagens de progresso via polling              |
| **Trilha Principal**    | /trilha/:id          | Lista horizontal de disciplinas; modulos travados/desbloqueados    |
| **Modulo de Estudo**    | /modulo/:id          | Conteudo em Markdown, barra de progresso, botao 'Ir para questoes' |
| **Questoes do Modulo**  | /modulo/:id/questoes | Questoes multipla escolha, feedback imediato, score final          |
| **Trilha de Reforco**   | /reforco/:id         | Mesma estrutura do modulo, com label 'Reforco' e topicos de erro   |
| **Perfil / Upgrade**    | /perfil              | Progresso geral, historico, botao CTA para plano Pro (Stripe link) |

## **6.2 Estrutura de Pastas**

- app/ (Expo Router file-based): (auth)/login.tsx, (app)/concursos.tsx, (app)/trilha/\[id\].tsx, (app)/modulo/\[id\].tsx
- components/: ModuloCard, DisciplinaHeader, QuestaoItem, ProgressBar, SkeletonLoader
- store/: useAuthStore (Zustand), useTrilhaStore (Zustand)
- hooks/: useGetTrilha, useGetModulo, useSubmitProgresso (React Query)
- lib/: api.ts (axios instance com JWT header), supabase.ts

## **6.3 Logica de Freemium no Frontend**

A tela de Trilha Principal exibe todas as disciplinas, mas modulos de disciplinas bloqueadas mostram um icone de cadeado e um CTA de upgrade. A verificacao de permissao e feita no backend (endpoint retorna campo desbloqueada na disciplina). O frontend nunca confia em dados locais para decisoes de acesso.

# **7\. Cronograma de Execucao (48 horas)**

**Principio do fim de semana**

Prefira funcionalidade feia a perfeicao incompleta. Se um bloco de tempo estourar, corte features do bloco seguinte, nunca estenda o anterior. O objetivo e ter algo rodando em producao ao final de domingo.

| **Bloco**       | **Foco**                 | **Entregável**                                                                                       | **Dia** |
| --------------- | ------------------------ | ---------------------------------------------------------------------------------------------------- | ------- |
| **SAB 08h-10h** | **Setup**                | Repos, Railway, Supabase, Upstash, chaves API. Docker Compose local. ChromaDB rodando.               | Sábado  |
| **SAB 10h-13h** | **RAG Pipeline**         | Script ingest_edital.py: extrai texto, chunking, embeddings → ChromaDB. Testar retrieval básico.     | Sábado  |
| **SAB 13h-14h** | **Pausa**                | Almoço                                                                                               | Sábado  |
| **SAB 14h-17h** | **LangGraph Agent**      | Grafo: parse_edital → extract_disciplinas → generate_modulos → save_db. Testar com edital PF real.   | Sábado  |
| **SAB 17h-19h** | **API FastAPI**          | Endpoints: /concursos, /trilhas/gerar, /trilhas/{id}, /modulos/{id}. Auth middleware Supabase.       | Sábado  |
| **SAB 19h-21h** | **Deploy backend**       | Railway deploy. Testar endpoints com curl/Postman. Debug pipeline em produção.                       | Sábado  |
| **DOM 08h-11h** | **React Native**         | Expo init. Telas: Home, Concurso, Trilha, Disciplina, Módulo. Zustand store.                         | Domingo |
| **DOM 11h-13h** | **Integração**           | React Query hooks para todos os endpoints. Testar fluxo completo: login → gerar trilha → ver módulo. | Domingo |
| **DOM 13h-14h** | **Pausa**                | Almoço                                                                                               |         |
| **DOM 14h-16h** | **Freemium + Pagamento** | Lógica de bloqueio por plan no backend. Stripe Checkout link. Testar upgrade.                        | Domingo |
| **DOM 16h-18h** | **Trilha de Reforço**    | LangGraph node extra: analisa erros → gera módulos corretivos. Endpoint /reforco/gerar.              | Domingo |
| **DOM 18h-20h** | **Polimento + Demo**     | Loading states, tratamento de erro, screenshot para landing page. Publicar no Expo Go.               | Domingo |

## **7.1 Criterios de Sucesso ao Final de Domingo**

- Usuario consegue criar conta, selecionar PF ou INSS e ver uma trilha gerada em menos de 2 minutos
- Pelo menos uma disciplina completa funciona (modulos sequenciais + questoes + score)
- Trilha de reforco e gerada quando o usuario reprova um modulo
- Link do Stripe funcional para upgrade de Free para Pro
- App acessivel via Expo Go com link compartilhavel
- Backend em producao no Railway sem crashes evidentes

# **8\. Escopo do MVP**

Definicao explicita do que entra e o que fica fora e o principal mecanismo de controle de tempo num sprint de 48h. Tudo que esta fora do escopo pode virar backlog na proxima semana se o MVP for validado.

| **ENTRA no MVP (fim de semana)**       | **FORA do MVP (pós-validação)**             |
| -------------------------------------- | ------------------------------------------- |
| Ingestão de edital PF e INSS           | Múltiplos concursos simultâneos             |
| Geração de trilha completa via RAG     | Editor de trilha manual pelo usuário        |
| Visualização de módulos sequenciais    | Gamificação (XP, badges, ranking)           |
| Score por módulo (passar/reprovar)     | App nativo compilado (iOS/Android stores)   |
| Geração de trilha de reforço por erros | Simulado cronometrado com gabarito oficial  |
| Freemium: 1 disciplina desbloqueada    | Integração com provas anteriores (CEBRASPE) |
| Upgrade via Stripe Checkout link       | Notificações push / email                   |
| Deploy em produção (Railway)           | Dashboard administrativo                    |

# **9\. Riscos e Mitigacoes**

| **Risco**                                 | **Prob.** | **Mitigação**                                                                             | **Resid.** |
| ----------------------------------------- | --------- | ----------------------------------------------------------------------------------------- | ---------- |
| LLM gera trilha inconsistente             | **Alta**  | Pós-processamento com Pydantic para validar schema da trilha; fallback para template fixo | **Média**  |
| Edital em PDF complexo (tabelas, imagens) | **Média** | PyMuPDF + pdfplumber para extração; aceitar qualidade imperfeita no MVP                   | **Baixa**  |
| Latência alta na geração (>30s)           | **Alta**  | Job assíncrono com Redis queue; polling no frontend; skeleton loading                     | **Baixa**  |
| Custo de tokens excede budget             | **Média** | Limitar geração a 10 módulos/disciplina no MVP; monitorar com LangSmith                   | **Baixa**  |
| Railway down no fim de semana             | **Baixa** | Render.com como backup imediato; Dockerfile pronto                                        | **Baixa**  |
| ChromaDB perder dados em restart          | **Alta**  | Persistência em volume Railway; planejar migração Qdrant na semana seguinte               | **Média**  |

## **9.1 Budget de Tokens Estimado**

| **Operacao**                         | **Tokens (est.)**         | **Custo (USD)** | **Frequencia**       |
| ------------------------------------ | ------------------------- | --------------- | -------------------- |
| Ingestao edital completo (embedding) | ~150k tokens              | **~\$0.003**    | 1x por edital        |
| Geracao de trilha completa           | ~20k tokens (GPT-4o-mini) | **~\$0.006**    | 1x por usuario       |
| Geracao de modulo individual         | ~3k tokens                | **~\$0.001**    | Por modulo gerado    |
| Geracao de trilha de reforco         | ~5k tokens                | **~\$0.0015**   | Por modulo reprovado |
| 100 usuarios ativos no MVP           | ~2M tokens total          | **~\$0.60/mes** | Custo total MVP      |

**Custo total de infra para o MVP**

Railway: \$5/mes (free tier cobrindo 500h). Supabase: gratis (free tier). Upstash Redis: gratis (free tier). OpenAI: menos de \$1/mes para 100 usuarios ativos. Custo total estimado: menos de \$10/mes ate os primeiros 50 assinantes.

# **10\. Proximos Passos Pos-Validacao**

## **Semana 1 - Se o MVP funcionar**

- Migrar ChromaDB local para Qdrant Cloud (plano free suporta 1M vetores)
- Adicionar LangSmith para observabilidade do agente (traces, latencia por no, custo por chamada)
- Landing page minimalista com waitlist e link direto para o Expo Go
- Entrevistar 5 usuarios reais: o que faltou? o que surpreendeu?

## **Mes 1 - Se houver signal de pagamento**

- Publicar app nativo na App Store e Play Store via Expo EAS Build
- Adicionar concursos CEBRASPE (TRF, STJ, AGU) - o pipeline ja esta pronto
- Integrar provas anteriores reais para geracao de questoes mais realistas
- Implementar gamificacao basica: streak diario e progresso percentual
- Migrar infra para producao: Railway Pro + Supabase Pro + Qdrant Starter

## **Mes 3 - Escala**

- Modelo de fine-tuning em questoes de concursos para melhorar qualidade das avaliacoes
- Grupos de estudo colaborativos com trilhas compartilhadas
- API para escolas e cursinhos preparatorios (B2B)
- Plano anual com desconto para reduzir churn

**Bom sprint.**

_A unica metrica que importa no fim de domingo e: alguem achou util o suficiente para me pedir acesso._