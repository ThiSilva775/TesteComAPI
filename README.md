# Monitor PNCP (versão inicial)

## 1. Visão geral da solução
Projeto full stack para coletar, sincronizar, persistir e exibir dados públicos de contratações do PNCP com foco inicial em contratações por data de publicação, listagem local e dashboard.

## 2. Arquitetura
- **Backend (Node.js + TypeScript + Express + Prisma)**: API interna para sincronização, listagem e métricas.
- **Integração PNCP (Axios)**: camada dedicada em `src/integrations/pncp` com retry e paginação.
- **Banco PostgreSQL**: persistência com deduplicação via `upsert` por `numeroControlePNCP`.
- **Frontend (Next.js + Tailwind)**: dashboard inicial com KPIs e últimas contratações.
- **Infra**: Docker + Docker Compose para subir banco, backend e frontend.

Fluxo resumido:
1. Job/manual chama sincronização por data.
2. Backend consulta endpoint paginado do PNCP.
3. Mapeia payload oficial para entidades internas.
4. Salva/atualiza no PostgreSQL.
5. Frontend consulta API interna e exibe indicadores.

## 3. Estrutura de pastas

```text
.
├── backend
│   ├── prisma
│   │   └── schema.prisma
│   └── src
│       ├── common
│       ├── config
│       ├── database
│       ├── integrations
│       │   └── pncp
│       ├── jobs
│       └── modules
│           ├── atas
│           ├── contratos
│           ├── dashboard
│           ├── documentos
│           ├── licitacoes
│           ├── pncp
│           └── usuarios
├── frontend
│   └── src
│       ├── app
│       ├── components
│       └── lib
└── docker-compose.yml
```

## 4. Modelagem do banco
Principais tabelas:
- `organizations`
- `procurements`
- `procurement_documents`
- `price_registry_acts`
- `contracts`
- `sync_logs`
- `domain_modalities`
- `domain_judgment_criteria`
- `domain_dispute_modes`
- `domain_document_types`

Regras já implementadas:
- deduplicação por `pncpControlNumber`.
- índices por data de publicação, modalidade e situação.
- armazenamento de `localRaw` para auditoria e evolução de parser.

## 5. Variáveis de ambiente
Veja `.env.example` com todas as variáveis necessárias para backend e frontend.

## 6. Código completo
Todo o código inicial está versionado neste repositório em `backend/` e `frontend/`.

## 7. Rotina de execução
### Com Docker
```bash
docker compose up --build
```

### Local (sem Docker)
```bash
cd backend && npm install && npx prisma generate && npm run dev
cd frontend && npm install && npm run dev
```

## 8. Exemplos de uso
### Sincronização por período
`POST /api/procurements/sync`

Body:
```json
{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31"
}
```

### Listagem paginada
`GET /api/procurements?page=1&limit=20&modalityCode=1`

### Dashboard
`GET /api/dashboard`

## 9. Melhorias futuras
- Coleta de atas por vigência.
- Coleta de contratos por data de publicação.
- Filtros avançados por órgão, palavra-chave e situação.
- Histórico de mudanças por contratação.
- Alertas por e-mail/WhatsApp.
- Exportação CSV/Excel.
- Autenticação e RBAC para usuários internos.
