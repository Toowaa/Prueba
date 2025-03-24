"use client";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";

import { useEffect, useState } from "react";
import Listar from "./listProducts";

interface Product {
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
  
 const initialOrderItem: OrderItem = {
    productId: 0,
    quantity: 0,
    ProductName: "",
    price: 0,
  };

export default function FormAdd() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentItem, setCurrentItem] = useState<OrderItem>(initialOrderItem);

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

 

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProductId = parseInt(e.target.value);
    
    const selectedProduct = products.find(product => product.id === selectedProductId);
    
    setCurrentItem({
      ...currentItem,
      productId: selectedProductId,
      ProductName: selectedProduct ? selectedProduct.name : "",
      price: selectedProduct ? selectedProduct.price : 0  
    });
  };
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentItem({
      ...currentItem,
      quantity: Number(e.target.value)
    });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault(); 
    
    if (currentItem.productId === 0 || currentItem.quantity <= 0) {
      alert("Por favor selecciona un producto y una cantidad válida");
      return;
    }
    setOrderItems([...orderItems, currentItem]);
    setCurrentItem(initialOrderItem);
    console.log("Productos en la orden:", [...orderItems, currentItem]);
  };
  return (
    <>
      <div>
        <Form validationBehavior="native">
          <Input
            label="Order"
            isRequired
            placeholder="Entry an Order"
            labelPlacement="outside"
          ></Input>
          <DatePicker
            isReadOnly
            label="Date"
            labelPlacement="outside"
            value={today(getLocalTimeZone())}
            radius="full"
            variant="underlined"
            classNames={{
              label: "!text-white",
              timeInput: "!text-black",
              base: "!mt-0.5",
            }}
          ></DatePicker>
          <Input
            label="Products"
            isRequired
            placeholder="Entry a Product"
            labelPlacement="outside"
          ></Input>
          <Input
            label="Final Price"
            isReadOnly
            labelPlacement="outside"
            placeholder="Final Price"
          ></Input>
        </Form>
        <div className="pt-8">
          <Button className="rounded-full bg-[#634AE2] text-whte text-base font-medium " onPress={onOpen}>
            Add New Product
          </Button>
        </div>
      </div>
      <Listar orderItems={orderItems} setOrderItems={setOrderItems}/>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalBody>
            <Form onSubmit={handleAddItem}>
              <Select
                label="Products"
                labelPlacement="outside"
                isRequired
                radius="full"
                variant="faded"
                classNames={{
                  label: "!text-[#634AE2]",
                  trigger: "!border-2 border-[#634AE2]",
                  listbox: "!text-black",
                }}
                placeholder="Choose a Product"
                onChange={handleProductChange}

              >
                {products.map((product) => (
                  <SelectItem key={product.id} 
                  >
                    {product.name}
                  </SelectItem>
                  
                ))}
              </Select>
              <Input
                type="number"
                label="Quantity"
                labelPlacement="outside"
                isRequired
                classNames={{
                  label: "!text-[#634AE2]",
                  inputWrapper: "border-2 border-[#634AE2]",
                  input: "!text-[#634AE2]",
                }}
                placeholder="Quantity"
                onChange={handleQuantityChange}
                value={currentItem.quantity > 0 ? currentItem.quantity.toString() : ""}
              ></Input>
              <Button
                className="text-white bg-[#634AE2] w-full max-w-32 font-normal text-sm"
                radius="full"
                type="submit"
              >
                Save
              </Button>
            </Form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
