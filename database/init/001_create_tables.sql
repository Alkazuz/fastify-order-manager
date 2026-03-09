-- Tabela principal de pedidos
CREATE TABLE IF NOT EXISTS "Order" (
    "orderId" VARCHAR(64) NOT NULL UNIQUE,
    "value" NUMERIC(12, 2) NOT NULL CHECK ("value" >= 0),
    "creationDate" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de itens vinculados a um pedido
CREATE TABLE IF NOT EXISTS "Items" (
    "orderId" VARCHAR(64) NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL CHECK ("quantity" > 0),
    "price" NUMERIC(12, 2) NOT NULL CHECK ("price" >= 0),
    CONSTRAINT "Items_orderId_fkey"
      FOREIGN KEY ("orderId")
      REFERENCES "Order"("orderId")
      ON UPDATE CASCADE
      ON DELETE CASCADE
);

-- Indices para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_order_creation_date ON "Order" ("creationDate");
CREATE INDEX IF NOT EXISTS idx_items_order_id ON "Items" ("orderId");
CREATE INDEX IF NOT EXISTS idx_items_product_id ON "Items" ("productId");
