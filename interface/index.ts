export interface Order {
  id: number;
  OrderNo: number;
  createdAt: string;
  FinalPrice: number;
  Quantity: number;
  products: Product[];
}

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}


export interface OrderItem {
  productId: number;
  ProductName: string;
  quantity: number;
  price: number;
  productDetails?: Product; // Añade esta línea
}