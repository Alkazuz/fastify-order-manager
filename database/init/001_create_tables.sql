-- Tabela principal de pedidos
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL UNIQUE,
    value NUMERIC(12, 2) NOT NULL CHECK (value >= 0),
    creation_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de itens vinculados a um pedido
CREATE TABLE IF NOT EXISTS items (
    id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL,
    product_id VARCHAR(64) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    CONSTRAINT items_order_id_fkey
      FOREIGN KEY (order_id)
      REFERENCES orders(order_id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
);

-- Indices para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_orders_creation_date ON orders (creation_date);
CREATE INDEX IF NOT EXISTS idx_items_order_id ON items (order_id);
CREATE INDEX IF NOT EXISTS idx_items_product_id ON items (product_id);
