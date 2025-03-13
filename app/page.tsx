"use client";
import TableMyOrders from "@/components/tableMyorders";

import { Button } from "@heroui/react";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    < div className=" w-full mx-auto h-screen text-black  justify-center items-center 
    "
    style={{
      backgroundImage: `linear-gradient(to right,rgba(54, 22, 216, 0.64), rgba(120, 99, 227, 0.48))`,
    }}
    >
      <div className="container mx-auto p-4 ">
     <h1 className="text-3xl text-center font-bold text-white pt-24"> My Orders</h1>
      <TableMyOrders/>
      
      <div>
      <div className="flex pt-4 justify-center md:justify-end">
                <Link href={"Add-order"}>
                <Button
               
                  
                  radius="full"
                  className="text-white bg-[#634AE2] w-full max-w-32 font-normal text-sm"
                >
                  New Order
                 
                </Button>
                </Link>
              </div>
      </div>
      </div>
    </div>
  );
}
