'use client'
import FormAdd from "@/components/formulario";
import Listar from "@/components/listProducts";

export default function AddOrder() {
  return (
    
    <div className=" w-full items-center justify-center rounded-lg ">
        <h1>Add Order</h1>
     <div className="bg-purple-700 p-8 rounded-2xl">   <FormAdd/>
     </div>

  
    </div>
  );
}