# 🗄️ Banco de Dados – Sistema Farmácia Popular

Este projeto utiliza SQLite e o esquema atual está definido em `apps/api/src/database/schema.ts`.

## Tabelas principais (conforme schema.ts)

### `medicines`
Campos principais:
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `name` TEXT NOT NULL
- `manufacturer` TEXT
- `active_principle` TEXT NOT NULL
- `category` TEXT NOT NULL
- `requires_prescription` INTEGER NOT NULL CHECK(requires_prescription IN (0,1))
- `price` REAL NOT NULL
- `stock` INTEGER NOT NULL CHECK (stock >= 0)
- `image_url` TEXT
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP

Índices sugeridos: `name`, `active_principle` para buscas.

### `doctors`
Campos principais:
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `name` TEXT NOT NULL
- `crm` TEXT UNIQUE NOT NULL
- `specialty` TEXT
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP

### `sales`
Campos principais:
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `user_id` INTEGER
- `total_value` REAL NOT NULL
- `status` TEXT DEFAULT 'pending'
- `doctor_crm` TEXT
- `prescription_date` TEXT
- `payment_method` TEXT
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP

### `sale_items`
Campos principais:
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `sale_id` INTEGER NOT NULL (FK → `sales.id`)
- `medicine_id` INTEGER NOT NULL (FK → `medicines.id`)
- `quantity` INTEGER NOT NULL
- `unit_price` REAL NOT NULL
- `total_price` REAL NOT NULL
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP

### `users`
Campos principais:
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `name` TEXT NOT NULL
- `cpf` TEXT UNIQUE NOT NULL
- `email` TEXT UNIQUE NOT NULL
- `phone` TEXT
- `address` TEXT
- `password` TEXT NOT NULL
- `role` TEXT NOT NULL DEFAULT 'attendant'
- `balance` REAL DEFAULT 0
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP

## Migrações e observações
- O arquivo `schema.ts` contém verificações (PRAGMA table_info) que aplicam alterações incrementais (ALTER TABLE) quando necessário: adição de colunas `balance`, `image_url`, `cpf`, `phone`, `address`, `user_id` em `sales`, etc.
- Use `PRAGMA table_info(<table>)` para inspecionar colunas em runtime.
- Triggers podem ser adicionadas para manter `updated_at` atualizados automaticamente;
	o arquivo atual já define `DEFAULT CURRENT_TIMESTAMP` para `created_at` e `updated_at`.

## Regras de integridade
- `sale_items.sale_id → sales.id`
- `sale_items.medicine_id → medicines.id`

Regras de negócio relacionadas a banco de dados:
1. Medicamentos controlados (`requires_prescription = 1`) só podem ser vendidos se houver registro de receita (fluxo implementado no serviço de vendas).
2. Atualizações de estoque são feitas durante o processo de finalização de venda e em operações de transferência entre filiais.
3. Operações críticas devem ser registradas em logs/auditoria (implementação opcional).

