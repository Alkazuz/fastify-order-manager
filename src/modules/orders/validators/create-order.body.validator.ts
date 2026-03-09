import type { CreateOrderInput } from '../order.model.js';

export const createOrderBodySchema = {
  type: 'object',
  additionalProperties: false,
  required: ['numeroPedido', 'valorTotal', 'dataCriacao', 'items'],
  properties: {
    numeroPedido: {
      type: 'string',
      minLength: 1,
      maxLength: 64,
    },
    valorTotal: {
      type: 'number',
      minimum: 0,
    },
    dataCriacao: {
      type: 'string',
      format: 'date-time',
    },
    items: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['idItem', 'quantidadeItem', 'valorItem'],
        properties: {
          idItem: {
            anyOf: [
              {
                type: 'string',
                pattern: '^[0-9]+$',
              },
              {
                type: 'integer',
                minimum: 1,
              },
            ],
          },
          quantidadeItem: {
            type: 'integer',
            minimum: 1,
          },
          valorItem: {
            type: 'number',
            minimum: 0,
          },
        },
      },
    },
  },
} as const;

export interface CreateOrderBodyItem {
  idItem: string | number;
  quantidadeItem: number;
  valorItem: number;
}

export interface CreateOrderBody {
  numeroPedido: string;
  valorTotal: number;
  dataCriacao: string;
  items: CreateOrderBodyItem[];
}

export function mapCreateOrderBodyToInput(
  body: CreateOrderBody,
): CreateOrderInput {
  return {
    orderId: body.numeroPedido,
    value: body.valorTotal,
    creationDate: new Date(body.dataCriacao),
    items: body.items.map((item) => ({
      productId: Number(item.idItem),
      quantity: item.quantidadeItem,
      price: item.valorItem,
    })),
  };
}
