import { StatusEnum } from "./StatusEnum.enum";

export class Order {
    id: number;
    customerId: number;
    productId: number;
    quantity: number;
    customer?: Customer;  
    product?: Product;   
    orderStatus: StatusEnum; 
  }
  
  export class Customer {
    id: number;
    name: string;
  }
  
  export class Product {
    id: number;
    name: string;
  }
  
