// Estrutura crua da tabela orders no banco
export interface OrderRow {
  id: number;
  order_id: string;
  value: string;
  creation_date: Date;
}

// Estrutura crua da tabela items no banco
export interface ItemRow {
  id: number;
  order_id: string;
  product_id: string;
  quantity: number;
  price: string;
}

// Modelo de item usado pela aplicacao
export interface Item {
  id: number;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

// Modelo de pedido usado pela aplicacao
export interface Order {
  id: number;
  orderId: string;
  value: number;
  creationDate: Date;
  items: Item[];
}

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
  price: number;
}

export interface CreateOrderInput {
  orderId: string;
  value: number;
  creationDate: Date;
  items: CreateOrderItemInput[];
}
