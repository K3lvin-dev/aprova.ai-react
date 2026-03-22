# Glossary

## Domain Terms

| Termo | Definicao |
|---|---|
| AprovaAI | Plataforma SaaS mobile-first de preparacao para concursos publicos brasileiros |
| Concurso | Processo seletivo publico (ex: Policia Federal, INSS) — unidade central de organizacao do estudo |
| Edital | Documento oficial do concurso que define o conteudo programatico; e ingerido pelo backend RAG para gerar trilhas |
| Conteudo Programatico | Lista de disciplinas e topicos exigidos no edital — base para a geracao automatica da trilha |
| Trilha | Plano de estudos gerado por IA a partir do edital, organizado em disciplinas e modulos sequenciais |
| Disciplina | Area do conhecimento dentro de uma trilha (ex: Direito Constitucional, Informatica). Pode estar desbloqueada (acessivel) ou bloqueada (freemium) |
| Modulo | Unidade de estudo dentro de uma disciplina; contem conteudo em Markdown e questoes de avaliacao. Pode estar travado (sequenciamento) ou destravado |
| Questao | Item de multipla escolha (5 alternativas: A-E) gerado por IA para avaliacao de proficiencia no modulo |
| Score | Resultado numerico (0-1) do desempenho do usuario nas questoes de um modulo |
| Progresso | Registro de respostas e score do usuario por modulo. Status: `pendente`, `aprovado`, `reprovado` |
| Trilha de Reforco | Trilha gerada automaticamente quando o usuario reprova um modulo; foca nos conceitos errados identificados no log de erros |
| Concurseiro | Usuario-alvo do produto: pessoa se preparando para concursos publicos |
| Plano Free | Acesso gratuito: 1 disciplina completa desbloqueada + visualizacao da trilha completa (bloqueada) + progresso basico |
| Plano Pro | Assinatura paga (R$47-57/mes): todas as disciplinas, trilhas de reforco por IA, historico de erros e analytics, 2 concursos simultaneos |
| Banca | Organizadora do concurso (ex: CEBRASPE, FCC, Vunesp) |
| Magic Link | Metodo de login sem senha — usuario recebe link de autenticacao por email via Supabase Auth |

## Technical Terms and Acronyms

| Sigla / Termo | Significado |
|---|---|
| RN | React Native |
| EAS | Expo Application Services — plataforma de build e deploy da Expo |
| RAG | Retrieval-Augmented Generation — tecnica de IA usada no backend para gerar trilhas a partir do edital |
| JWT | JSON Web Token — token de autenticacao emitido pelo Supabase Auth |
| RLS | Row Level Security — politica de acesso no PostgreSQL gerenciada pelo Supabase |
| OTA | Over-the-Air update — atualizacao do bundle JS sem publicar nova versao nas lojas |
| CTA | Call to Action — botao/elemento que convida o usuario a realizar uma acao (ex: upgrade para Pro) |
| PF | Policia Federal — um dos concursos do MVP |
| INSS | Instituto Nacional do Seguro Social — um dos concursos do MVP |
| CEBRASPE | Centro Brasileiro de Pesquisa em Avaliacao e Selecao — banca organizadora dos concursos PF e INSS |

## Naming Conventions

| Contexto | Convencao | Exemplo |
|---|---|---|
| Rotas Expo Router | file-based, parametros dinamicos com `[id]` | `trilha/[id].tsx` |
| Stores Zustand | prefixo `use` + dominio + `Store` | `useAuthStore`, `useTrilhaStore` |
| Hooks React Query | prefixo `use` + verbo + entidade | `useGetTrilha`, `useSubmitProgresso` |
| Componentes | PascalCase | `ModuloCard`, `SkeletonLoader` |
| Variaveis de ambiente publicas | `EXPO_PUBLIC_` + SCREAMING_SNAKE_CASE | `EXPO_PUBLIC_API_BASE_URL` |
| Status de progresso | em portugues, minusculo (definidos pela API) | `pendente`, `aprovado`, `reprovado` |
| Status de trilha | em portugues, minusculo (definidos pela API) | `gerando`, `pronto`, `erro` |
| Campos de bloqueio | booleanos em portugues (definidos pela API) | `desbloqueada` (disciplina), `travado` (modulo) |
