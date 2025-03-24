import { Order } from "@/interface";

export async function GetOrders(): Promise<Order[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/order`);
    if (!response.ok) throw new Error("Error en la respuesta del servidor");
    const data: Order[] = await response.json();
    return data;
  }