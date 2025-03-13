'use client'
import FormAdd from "@/components/formulario";


export default function AddOrder() {
  return (
    
    <div className=" max-w-7xl items-center relative mx-auto my-24 justify-center rounded-lg ">
        <h1 className="text-center text-3xl font-bold text-gray-400">Add Order</h1>
     <div className="bg-purple-700 p-8 rounded-2xl"> 
        
          <FormAdd/>
     </div>

  
    </div>
  );
}