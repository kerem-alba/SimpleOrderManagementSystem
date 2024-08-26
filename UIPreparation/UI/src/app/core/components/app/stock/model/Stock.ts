export class Stock {
  id: number;
  productName: string;
  productId: number;
  quantity: number;
  isReadyForSale: boolean;
  isDeleted: boolean;
  colorId: number;
  colorName: string;
  colorCode: string;
}

export class Product {
  id: number;
  name: string;
}
