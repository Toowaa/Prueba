"use client";
import FormAdd from "@/components/formulario";

export default function AddOrder() {
  return (
    <div
      className="w-full h-screen mt-0"
      style={{
        backgroundImage: `linear-gradient(to right,rgba(54, 22, 216, 0.64), rgba(120, 99, 227, 0.48)),url(/bg.jpg)`,
      }}
    >
      <div className=" max-w-7xl items-center relative mx-auto pt-10  justify-center rounded-lg ">
        <h1 className="text-center text-4xl font-extrabold text-white py-9">
          Add Order
        </h1>
        <div
          className=" p-8 rounded-2xl"
          style={{
            backgroundImage: `linear-gradient(to right,rgba(120, 99, 227, 0.64), rgba(99, 74, 226, 0.48))`,
          }}
        >
          <FormAdd />
        </div>
      </div>
    </div>
  );
}
