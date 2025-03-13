"use client";
import TableMyOrders from "@/components/tableMyorders";
import { Letras } from "@/components/textfinal";
import { Textver1 } from "@/components/textver1";
import { Button } from "@heroui/react";
import Link from "next/link";
import React from "react";

export default function Home() {
  const [istext, setText] = React.useState(true);
  return (
    < div className=" max-w-7xl mx-auto h-screen text-black  justify-center items-center ">
     <h1 className="text-3xl text-center"> My Orders</h1>
      <TableMyOrders/>
      
      <div>
      <div className="flex pt-4 justify-center md:justify-end">
                <Link href={"Add-order"}>
                <Button
                 // onClick={handleSubmit}
                  
                  radius="full"
                  className="text-white bg-[#634AE2] w-full max-w-32 font-normal text-sm"
                >
                  New Order
                  {/*editingBlogId ? "Actualizar" : "Enviar"*/}
                </Button>
                </Link>
              </div>
      </div>
    </div>
  );
}
