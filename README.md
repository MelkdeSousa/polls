# Polls

Aplicação backend de votação desenvolvida durante [NLW da Rocketseat](https://www.rocketseat.com.br/eventos/nlw).  
A proposta da original da trilha Nodejs é desenvolver a aplicação com [Fastify](https://fastify.dev), [Prisma ORM](https://www.prisma.io/docs/orm), mas decidi usar outras para experimentar.

## Tecnologias

- Bun
- ElysiaJS
- Drizzle ORM
- Ioredis


## Como usar

- Instale as dependências com bun
```bash
bun install
```

- Execute os serviços declarados no Docker Compose
```bash
docker compose up -d
```

- Crie um `.env` a partir da copia de `.env.example`
```bash
cp .env.example .env
```

- Aplique as *migrations* no banco
```bash
bun run db:migrate
```

- Execute a aplicação
```bash
bun run dev
```

- Acesse a aplicação pela [documentação](http://localhost:3000/swagger)
