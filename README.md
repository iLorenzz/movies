# Octagram - Busca e Avaliação de Filmes
 
API REST em Django para buscar filmes (via TMDB), autenticar usuários e permitir que avaliem os filmes que já assistiram, com frontend em Next.js.
 
## Stack
 
**Backend**
- Django 6.0.7 + Django REST Framework
- Autenticação via JWT (`djangorestframework-simplejwt`), com modelo de usuário customizado (login por email)
- SQLite
- Integração com a API do TMDB (busca, detalhes e elenco)
- Cache das respostas do TMDB
**Frontend**
- Next.js (App Router) + TypeScript
- Tailwind CSS
**Infra**
- Docker / Docker Compose
## Funcionalidades
 
| Feature | Status |
|---|---|
| Barra de pesquisa via API do TMDB |✅|
| Listagem de resultados |✅|
| Estados de loading |✅|
| Ao clicar, abre modal do filme |✅|
| Sinpose, data de lançamento, elenco |✅|
| Sem avaliação: usuário pode dar uma nota |✅|
| Com avaliação: editar ou remover a nota |✅|
| Botão de fechar |✅|
| Listagem dos filmes avaliados |✅|
| Título, pôster + nota do usuário |✅|
| Ao clicar, abre modal / página do filme |✅|
| Autenticação (cadastro e login com JWT) |✅|
| Paginação |✅|
| Cache das respostas da API do TMDB |✅|
| Filtro por gênero ou ano |❌|
 
### Sobre o filtro por gênero ou ano
 
> O filtro por gênero ou ano não foi implementadod devido a uma dúvida na melhor abordagem 
entre  puxar todas a categorias pela API do TMDB e filtrar no front ou criar uma rota que 
busca já com esses filtros. Faltou conciliar o tempo para entender qual abordagem seria
possível ou mais fácil. 
 
## Como rodar o projeto
 
### Pré-requisitos
- [Docker](https://docs.docker.com/get-docker/) e Docker Compose instalados
### Passo a passo
 
1. Clone o repositório:
```bash
   git clone https://github.com/iLorenzz/movies/
   cd movies/search_movie_service/
```
 
2. Copie o arquivo de variáveis de ambiente de exemplo e preencha com seus próprios valores:
```bash
   cp .env.example .env
```
 
3. Suba a aplicação:
```bash
   docker-compose up
```
 
A API fica disponível em `http://localhost:8000` e o frontend em `http://localhost:3000`.
 
## Variáveis de ambiente
 
O `.env.example` na raiz do projeto lista todas as variáveis necessárias. As principais:
 
| Variável | Descrição |
|---|---|
| `TMDB_ACCESS_TOKEN` | Read Access Token da API do TMDB ([obtenha aqui](https://www.themoviedb.org/settings/api)) |


## Uso de Inteligência Artificial

### Backend

No backend, o Claude foi utilizado como apoio para gerar alguns exemplos de como implementar um método ou função que já havia sido elaborada, mas que não havia certeza da melhor abordagem, o que pode ser caracterizado como Spec Driven. Também foi utilizado como auxilio para erros que  estavam mais dificeis de encontrar a causa do problema.

Algumas duvidas em realção a arquitetura MVT do Django foram sanadas em pesquisas exibidas no Google, auxiliada pelo Gemini.

### Frontend

O mesmo tipo de uso do Claude no backend foi feito com o frontend
porém, principalemnte para interfaces algumas escolhas de design também foram consultadas na Inteligência
Artificial
