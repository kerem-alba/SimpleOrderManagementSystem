export class Stock {
    id: number;
    productId: number;
    quantity: number; 
    product?: Product;   
    isReadyForSale: boolean;
    isDeleted: boolean;
    status: boolean;
  }
  
  
  export class Product {
    id: number;
    name: string;
  }
  