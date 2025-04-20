"use client";
import FormAdd from "@/components/formulario";
import NewOrder from "@/components/newOrder";
import { Order } from "@/interface";
import { useSearchParams } from 'next/navigation';
import { use, useEffect, useState } from "react";

export default function AddOrder() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); 
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}api/order/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setOrder(data);
          console.log("Order data:", data); // Verifica los datos de la orden
        })
        .catch((error) => console.error("Error fetching order:", error));
    }
  }, [id]);

  return (
    <div
      className="w-full h-screen mt-0"
      style={{
        backgroundImage: `linear-gradient(to right,rgba(54, 22, 216, 0.64), rgba(120, 99, 227, 0.48)),url(/bg.jpg)`,
      }}
    >
      <div className=" max-w-7xl items-center relative mx-auto pt-10  justify-center rounded-lg ">
        <h1 className="text-center text-4xl font-extrabold text-white py-9">
          {id ? `Edit Order ${id}` : 'Add Order'} 
        </h1>
        <div
          className=" p-8 rounded-2xl"
          style={{
            backgroundImage: `linear-gradient(to right,rgba(120, 99, 227, 0.64), rgba(99, 74, 226, 0.48))`,
          }}
        >
          {/*<FormAdd data={order} />
*/}
          <NewOrder data={order} />
        </div>
      </div>
    </div>
  );
}