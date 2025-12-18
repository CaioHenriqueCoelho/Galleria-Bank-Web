import { OrderItemDTO } from './OrderItemDTO';

export interface OrderCreateDTO {
  customerId: number;
  items: OrderItemDTO[];
}
