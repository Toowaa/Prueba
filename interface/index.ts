export interface Order {
  id: number;
  OrderNo: string;
  createdAt: string;
  FinalPrice: number;
  Quantity: number;
  products: Product[];
}

export interface Product {
/*  
  id: number;
  name: string;
  price: number;
  quantity: number;*/
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
}
 


export interface ProducApi {
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
  productDetails?: Product; 
}