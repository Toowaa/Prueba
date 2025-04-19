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
import { Order, OrderItem, Product } from "@/interface";

// Define el tipo para el item temporal del formulario
interface FormOrderItem {
  productId: number;
  quantity: number;
  productDetails?: Product;
}

const initialOrderItem: FormOrderItem = {
  productId: 0,
  quantity: 0,
};

export default function FormAdd({ data }: { data: Order | null }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentItem, setCurrentItem] = useState<FormOrderItem>(initialOrderItem);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Cargar productos y orden existente
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar productos disponibles
        const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/products`);
        const productsData = await productsResponse.json();
        setProducts(productsData);

        // Si hay datos de orden, cargar los productos asociados
        if (data?.products) {
          const enrichedItems = data.products.map(product => ({
            productId: product.id,
            quantity: 1, // Valor por defecto, ajustar según necesidad
            ProductName: product.name,
            price: product.price,
            productDetails: product
          }));
          setOrderItems(enrichedItems);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [data]);

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProductId = parseInt(e.target.value);
    const selectedProduct = products.find(p => p.id === selectedProductId);

    setCurrentItem({
      productId: selectedProductId,
      quantity: currentItem.quantity,
      productDetails: selectedProduct
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentItem({
      ...currentItem,
      quantity: Number(e.target.value),
    });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentItem.productId || currentItem.quantity <= 0) {
      alert("Por favor selecciona un producto y una cantidad válida");
      return;
    }

    if (!currentItem.productDetails) {
      alert("No se encontraron detalles del producto");
      return;
    }

    const newOrderItem: OrderItem = {
      productId: currentItem.productId,
      ProductName: currentItem.productId.product.find,
      quantity: currentItem.quantity,
      price: currentItem.productDetails.price,
      productDetails: currentItem.productDetails
    };

    setOrderItems([...orderItems, newOrderItem]);
    setCurrentItem(initialOrderItem);
  };

  // Calcular precio final
  const calculateFinalPrice = () => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Calcular cantidad total de productos
  const calculateTotalQuantity = () => {
    return orderItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <>
      <div>
        <Form validationBehavior="native">
          <Input
            label="Order No"
            isReadOnly
            value={data?.OrderNo.toString() || ""}
            placeholder="Order Number"
            labelPlacement="outside"
          />
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
          />
          <Input
            label="Total Products"
            isReadOnly
            value={data?.Quantity.toString()}
            labelPlacement="outside"
          />
          <Input
            label="Final Price"
            isReadOnly
           value={data?.FinalPrice.toString()}
            labelPlacement="outside"
            placeholder="Final Price"
          />
        </Form>
        <div className="pt-8">
          <Button
            className="rounded-full bg-[#634AE2] text-white text-base font-medium"
            onPress={onOpen}
          >
            Add New Product
          </Button>
        </div>
      </div>
      <Listar orderItems={orderItems} setOrderItems={setOrderItems} />

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
                selectedKeys={currentItem.productId ? [currentItem.productId.toString()] : []}
              >
                {products.map((product) => (
                  <SelectItem key={product.id}>
                    {product.name} (Stock: {product.quantity}, Price: ${product.price})
                  </SelectItem>
                ))}
              </Select>
              <Input
                type="number"
                label="Quantity"
                labelPlacement="outside"
                isRequired
                min="1"
                max={currentItem.productDetails?.quantity.toString() || "100"}
                classNames={{
                  label: "!text-[#634AE2]",
                  inputWrapper: "border-2 border-[#634AE2]",
                  input: "!text-[#634AE2]",
                }}
                placeholder="Quantity"
                onChange={handleQuantityChange}
                value={currentItem.quantity > 0 ? currentItem.quantity.toString() : ""}
              />
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