export interface Order {
    id: number;
    OrderNo: number;
    createdAt: string;
    FinalPrice: number;
    Quantity: number;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
  }
  export interface OrderItem {
      productId: number;
      ProductName: string;  
      quantity: number;
      price: number;
    }