// Estrutura crua da tabela orders no banco
export interface OrderRow {
  order_id: string;
  value: string;
  creation_date: Date;
}

// Estrutura crua da tabela items no banco
export interface ItemRow {
  order_id: string;
  product_id: number;
  quantity: number;
  price: string;
}

// Modelo de item usado pela aplicacao
export interface Item {
  orderId: string;
  productId: number;
  quantity: number;
  price: number;
}

// Modelo de pedido usado pela aplicacao
export interface Order {
  orderId: string;
  value: number;
  creationDate: Date;
  items: Item[];
}

export interface CreateOrderItemInput {
  productId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderInput {
  orderId: string;
  value: number;
  creationDate: Date;
  items: CreateOrderItemInput[];
}

export interface UpdateOrderInput {
  value: number;
  creationDate: Date;
  items: CreateOrderItemInput[];
}
