import { Order } from "@/interface";

export async function GetOrders(): Promise<Order[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/order`, {
        cache: "no-store", 
    });
    if (!response.ok) throw new Error("Error en la respuesta del servidor");
    return response.json();
}

export async function GetOrder(id: string): Promise<Order> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/order/${id}`, {
        cache: "no-store", 
    });
    if (!response.ok) throw new Error("Error en la respuesta del servidor");
    return response.json();
}