import TableMyOrders from "@/components/tableMyorders";
import React from "react";
import { GetOrders } from "./apiroutes";



export default async function Home() {
  const orders = await GetOrders();
  return (
    <div
      className=" w-full mx-auto h-screen text-black  justify-center items-center 
    "
      style={{
        backgroundImage: `linear-gradient(to right,rgba(54, 22, 216, 0.64), rgba(120, 99, 227, 0.48))`,
      }}
    >
      <div className="container mx-auto p-4 ">
        <h1 className="text-3xl text-center font-bold text-white pt-24">
          My Orders
        </h1>
        <TableMyOrders  data={orders}/>
      </div>
    </div>
  );
}
