import { OrderItemDTO } from "./OrderItemDTO";

export interface OrderDTO {
  id: number;
  customerName: string;
  total: number;
  createdAt: string;
  items: OrderItemDTO[];
}
