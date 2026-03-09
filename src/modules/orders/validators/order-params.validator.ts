export const orderParamsSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['orderId'],
  properties: {
    orderId: {
      type: 'string',
      minLength: 1,
      maxLength: 64,
    },
  },
} as const;

export interface OrderParams {
  orderId: string;
}
