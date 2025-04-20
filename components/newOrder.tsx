import { Order, OrderItem, Product } from "@/interface";
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
// Listar component is imported but not used - consider removing this
import Listar from "./newlist";

export default function NewOrder({ data }: { data: Order | null }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [products, setProducts] = useState<Product[]>([]);

  // orderItems state is not being used in the component logic - can be removed
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // currentProduct state can be simplified since we only need productId and quantity
  const [currentProduct, setCurrentProduct] = useState({
    productId: 0,
    quantity: 0,
  });

  const [currentItem, setCurrentItem] = useState({
    id: null,
    OrderNo: "",
    createdAt: new Date().toISOString(),
    FinalPrice: 0,
    Quantity: 0,
    products: [], // Initialize as empty array instead of with a default product
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/products`
        );
        const productsData = await productsResponse.json();
        setProducts(productsData);

        // If we have data, initialize currentItem with it
        if (data) {
          setCurrentItem({
            id: data.id,
            OrderNo: data.OrderNo || "",
            createdAt: data.createdAt,
            FinalPrice: data.FinalPrice,
            Quantity: data.Quantity,
            products: data.products ? [...data.products] : [],
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [data]);



  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = Number(e.target.value);
    setCurrentProduct((prev) => ({
      ...prev,
      quantity,
    }));
  };

  // Main function to handle adding a product
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();

    const { productId, quantity } = currentProduct;

    if (!productId || quantity < 1) {
      console.error("Invalid product or quantity");
      return;
    }

    // Find the selected product to get its details
    const selectedProduct = products.find((p) => p.id === productId);
    if (!selectedProduct) {
      console.error("Product not found");
      return;
    }

    // Check if product already exists in the products array
    const existingProductIndex = currentItem.products.findIndex(
      (p) => p.productId === productId
    );

    if (existingProductIndex !== -1) {
      // Update quantity if product already exists
      setCurrentItem((prev) => {
        const updatedProducts = [...prev.products];
        updatedProducts[existingProductIndex].quantity = quantity;

        // Recalculate final price
        const newFinalPrice = updatedProducts.reduce((total, item) => {
          const product = products.find((p) => p.id === item.productId);
          return total + (product ? product.price * item.quantity : 0);
        }, 0);

        return {
          ...prev,
          products: updatedProducts,
          FinalPrice: newFinalPrice,
        };
      });
    } else {
      // Add new product if it doesn't exist
      const newProduct = {
        id: null,
        orderId: null,
        productId,
        quantity,
      };

      setCurrentItem((prev) => {
        const updatedProducts = [...prev.products, newProduct];

        // Calculate new final price
        const newFinalPrice = updatedProducts.reduce((total, item) => {
          const product = products.find((p) => p.id === item.productId);
          return total + (product ? product.price * item.quantity : 0);
        }, 0);

        return {
          ...prev,
          products: updatedProducts,
          Quantity: updatedProducts.length,
          FinalPrice: newFinalPrice,
        };
      });
    }

    // Reset current product selection
    setCurrentProduct({ productId: 0, quantity: 0 });

    // Close modal
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
            value={data?.id?.toString() || ""}
            labelPlacement="outside"
            classNames={{
              label: "!text-white font-bold",
            }}
          />

          {data?.createdAt ? (
            <DatePicker
              label="Date"
              labelPlacement="outside"
              value={parseDate(data.createdAt)}
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
            value={currentItem.Quantity.toString()}
            labelPlacement="outside"
            placeholder="Nro Products"
            classNames={{
              label: "!text-white font-bold",
            }}
          />
          <Input
            label="Final Price"
            isReadOnly
            value={currentItem.FinalPrice.toString()}
            labelPlacement="outside"
            placeholder="Final Price"
            classNames={{
              label: "!text-white font-bold",
            }}
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

        {/* You could add a products list display here to show what's been added */}
        <div className="mt-4">
          <h3 className="text-white font-bold mb-2">Products in Order:</h3>
          {currentItem.products.length > 0 ? (
            <ul className="space-y-2">
              {currentItem.products.map((item, index) => {
                const productInfo = products.find(
                  (p) => p.id === item.productId
                );
                return (
                  <li
                    key={index}
                    className="flex justify-between text-white bg-gray-800 p-2 rounded"
                  >
                    <span>{productInfo?.name || "Unknown"}</span>
                    <span>Qty: {item.quantity}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-white">No products added yet.</p>
          )}
        </div>
      </div>

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
                  setCurrentProduct((prev) => ({
                    ...prev,
                    productId: selectedId,
                  }));
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
                max="100"
                classNames={{
                  label: "!text-[#634AE2]",
                  inputWrapper: "border-2 border-[#634AE2]",
                  input: "!text-[#634AE2]",
                }}
                placeholder="Quantity"
                onChange={handleQuantityChange}
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
