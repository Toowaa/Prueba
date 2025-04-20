import { Order, OrderItem, ProducApi, Product } from "@/interface";
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
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { useEffect, useState } from "react";
import Listar from "./newlist";

export default function NewOrder({ data }: { data: Order | null }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [products, setProducts] = useState<ProducApi[]>([]);
  const [orderItems, setOrderItems] = useState<Product[]>([]);

  const [currentProduct, setCurrentProduct] = useState({
    productId: 0,
    quantity: 0,
    productDetails: null as ProducApi | null,
  });

  const [currentItem, setCurrentItem] = useState<Order>({
    id: 0,
    OrderNo: "",
    createdAt: new Date().toISOString(),
    FinalPrice: 0,
    Quantity: 0,
    products: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/products`
        );
        const productsData = await productsResponse.json();
        setProducts(productsData);

        if (data?.products) {
          setCurrentItem({
            id: data?.id,
            OrderNo: data.OrderNo.toString(),
            createdAt: data.createdAt,
            FinalPrice: data.FinalPrice,
            Quantity: data.Quantity,
            products: data.products,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [data]);

  const formatDateForDatePicker = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentProduct.productId === 0 || currentProduct.quantity <= 0) {
      alert("Please select a product and specify a valid quantity");
      return;
    }
    
    const existingProductIndex = currentItem.products.findIndex(
      (item) => item.productId === currentProduct.productId
    );
    
    const productDetails = products.find((p) => p.id === currentProduct.productId);
    if (!productDetails) {
      alert("Selected product not found");
      return;
    }

    const updatedItem: Order = { ...currentItem };
    
    if (existingProductIndex >= 0) {
      const updatedProducts = [...updatedItem.products];
      updatedProducts[existingProductIndex] = {
        ...updatedProducts[existingProductIndex],
        quantity: updatedProducts[existingProductIndex].quantity + currentProduct.quantity
      };
      updatedItem.products = updatedProducts;
    } else {

      updatedItem.products = [
        ...updatedItem.products,
        {
          id: 0, 
          orderId: updatedItem.id,
          productId: currentProduct.productId,
          quantity: currentProduct.quantity
        }
      ];
    }
    

    updatedItem.Quantity = updatedItem.products.reduce(
      (sum, item) => sum + item.quantity, 
      0
    );
    
    updatedItem.FinalPrice = updatedItem.products.reduce((sum, item) => {
      const productInfo = products.find((p) => p.id === item.productId);
      return sum + (productInfo?.price || 0) * item.quantity;
    }, 0);
    
    setCurrentItem(updatedItem);
    

    setCurrentProduct({
      productId: 0,
      quantity: 0,
      productDetails: null
    });
    

    onOpenChange();
  };

  return (
    <>
      <div>
        <Form validationBehavior="native">
          <Input
            label="Order ID"
            isReadOnly
            placeholder="Order ID"
            value={data?.id.toString()}
            labelPlacement="outside"
            classNames={{
              label: "!text-white font-bold",
            }}
          />

          {data?.createdAt ? (
            <DatePicker
              label="Date"
              labelPlacement="outside"
              value={parseDate(formatDateForDatePicker(data.createdAt))}
              variant="bordered"
              classNames={{
                label: "!text-white font-bold",
              }}
            />
          ) : (
            <DatePicker
              label="Fecha"
              labelPlacement="outside"
              value={today(getLocalTimeZone())}
              variant="bordered"
              classNames={{
                label: "!text-white font-bold",
                timeInput: "!text-black",
              }}
            />
          )}
          <Input
            label="Total Products"
            isReadOnly
            value={data?.Quantity.toString()}
            labelPlacement="outside"
            placeholder="Nro Products"
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

      <Listar
        orderItems={currentItem.products}
        setOrderItems={setCurrentItem}
        product={products}
      />

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalBody>
            <Form onSubmit={handleAddItem}>
              <Select
                label="Products"
                labelPlacement="outside"
                isRequired
                variant="flat"
                radius="full"
                classNames={{
                  label: "!text-[#634AE2]",
                  trigger: "!border-2 border-[#634AE2]",
                  base: "!text-[#634AE2]",
                }}
                placeholder="Choose a Product"
                onChange={(e) => {
                  const selectedId = parseInt(e.target.value);
                  const selectedProduct = products.find(
                    (p) => p.id === selectedId
                  );
                  
                  setCurrentProduct((prev) => ({
                    ...prev,
                    productId: selectedId,
                    productDetails: selectedProduct || null
                  }));
                  
                  console.log("Seleccionaste:", selectedProduct?.id);
                }}
              >
                {products.map((product) => (
                  <SelectItem
                    key={product.id.toString()}
                   
                    classNames={{
                      base: "!text-[#634AE2]",
                    }}
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
                min="1"
                max={
                  currentProduct.productDetails?.quantity?.toString() || "100"
                }
                classNames={{
                  label: "!text-[#634AE2]",
                  inputWrapper: "border-2 border-[#634AE2]",
                  input: "!text-[#634AE2]",
                }}
                placeholder="Quantity"
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setCurrentProduct((prev) => ({
                    ...prev,
                    quantity: value,
                  }));
                }}
                value={
                  currentProduct.quantity > 0
                    ? currentProduct.quantity.toString()
                    : ""
                }
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