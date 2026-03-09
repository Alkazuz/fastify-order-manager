import type { Item, ItemRow, Order, OrderRow } from './order.model.js';

// Converter uma linha da tabela items para o modelo da aplicacao
export function toItemModel(row: ItemRow): Item {
  return {
    orderId: row.order_id,
    productId: Number(row.product_id),
    quantity: row.quantity,
    price: Number(row.price),
  };
}

// Converter uma linha da tabela orders para o modelo da aplicacao
export function toOrderModel(row: OrderRow, items: Item[]): Order {
  return {
    orderId: row.order_id,
    value: Number(row.value),
    creationDate: row.creation_date,
    items,
  };
}
