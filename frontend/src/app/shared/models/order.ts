import { Address } from "./User";

export interface Order {
    id: number;
    buyerEmail: string;
    shipToAddress: Address;
    deliveryMethod: string;
    shippingPrice: number;
    orderItems: OrderItem[];
    subtotal: number;
    total: number;
    status: string;
  }
  
  export interface OrderItem {
    productId: number;
    productName: string;
    pictureUrl: string;
    price: number;
    quantity: number;
  }

  export interface OrderToCreate{
    basketId:string;
    deliveryMethodId: number;
    shipToAddress: Address;
  }
  
