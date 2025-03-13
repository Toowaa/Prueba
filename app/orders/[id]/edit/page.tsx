"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@heroui/react";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface OrderItem {
  productId: number;
  ProductName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  date: string | null;
  items: OrderItem[];
  totalPrice: number;
}

interface ApiOrder {
  id: number;
  OrderNo: number;
  createdAt: string;
  FinalPrice: number;
  Quantity: number;
  products: {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
  }[];
}

export default function EditOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onOpenChange: onOpenChangeDelete,
  } = useDisclosure();

  const formatDateForDatePicker = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchOrderData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/order/${orderId}`
        );

        if (!response.ok) {
          throw new Error("Error al cargar la orden");
        }

        const apiData: ApiOrder = await response.json();
        console.log("Datos de la orden:", apiData);

        const productsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/products`
        );
        const productsData: Product[] = await productsResponse.json();
        setProducts(productsData);

        const orderItems: OrderItem[] = apiData.products.map((prod) => {
          const productDetails = productsData.find(
            (p) => p.id === prod.productId
          );
          return {
            productId: prod.productId,
            ProductName: productDetails?.name || "Unknown Product",
            quantity: prod.quantity,
            price: productDetails?.price || 0,
          };
        });

        const transformedOrder: Order = {
          id: apiData.id,
          date: apiData.createdAt
            ? formatDateForDatePicker(apiData.createdAt)
            : null,
          items: orderItems,
          totalPrice: apiData.FinalPrice,
        };

        setOrder(transformedOrder);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order) return;

    try {
      const apiOrderData = {
        id: order.id,
        OrderNo: parseInt(orderId),
        createdAt: order.date,
        FinalPrice: order.totalPrice,
        Quantity: order.items.reduce((sum, item) => sum + item.quantity, 0),
        products: order.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/order/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiOrderData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar la orden");
      }

      router.push("/orders");
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const updateOrderItem = (index: number, updatedItem: Partial<OrderItem>) => {
    if (!order) return;

    const newItems = [...order.items];
    newItems[index] = { ...newItems[index], ...updatedItem };

    const totalPrice = newItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    setOrder({
      ...order,
      items: newItems,
      totalPrice,
    });
  };

  const addOrderItem = () => {
    if (!order || products.length === 0) return;

    const firstProduct = products[0];
    const newItem: OrderItem = {
      productId: firstProduct.id,
      ProductName: firstProduct.name,
      quantity: 1,
      price: firstProduct.price,
    };

    const newItems = [...order.items, newItem];
    const totalPrice = newItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    setOrder({
      ...order,
      items: newItems,
      totalPrice,
    });
  };

  const openDeleteModal = (index: number) => {
    setItemToDelete(index);
    onOpenDelete();
  };

  const confirmDelete = () => {
    if (itemToDelete === null || !order) return;

    const newItems = order.items.filter((_, i) => i !== itemToDelete);
    const totalPrice = newItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    setOrder({
      ...order,
      items: newItems,
      totalPrice,
    });

    onOpenChangeDelete();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-[#634AE2] font-semibold">
          Loading order data...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-red-500 font-semibold">
          Error Not found
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto bg-[#9494F3] p-4 h-screen">
      <h1 className="text-2xl font-bold mb-6 text-white">
        Edit Order{orderId}
      </h1>

      <Form onSubmit={handleSubmit} validationBehavior="native">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-[#7777eb]  p-6 rounded-lg shadow-sm">
          <Input
            label="Order ID"
            isReadOnly
            value={orderId}
            labelPlacement="outside"
            classNames={{
              label: "!text-white font-bold",
            }}
          />

          {order.date ? (
            <DatePicker
              label="Date"
              labelPlacement="outside"
              value={parseDate(order.date)}
              variant="bordered"
              onChange={(date) => setOrder({ ...order, date: date ? date.toString() : null })}
              classNames={{
                label: "!text-white font-bold",
                timeInput: "!text-black",
                
              }}
            />
          ) : (
            <DatePicker
              label="Fecha"
              labelPlacement="outside"
              value={today(getLocalTimeZone())}
              onChange={(date) => setOrder({ ...order, date: date ? date.toString() : null })}
              classNames={{
                label: "text-[#634AE2] font-medium",
              }}
            />
          )}
        </div>

        <div className="mt-6 w-full">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-[#634AE2]">
              List of Products
            </h2>
            <Button
              type="button"
              className="bg-[#6364F4] text-white"
              onClick={addOrderItem}
            >
              Add New Product
            </Button>
          </div>

          <div className="  w-full overflow-y-auto bg-white rounded-lg shadow-sm">
            <table className="w-full ">
              <thead className="rounded-full">
                <tr className="bg-[#6364F4] text-white h-11">
                  <th className=" font-normal">Product Name</th>
                  <th className="font-normal">Quantity </th>
                  <th className="font-normal">Unit Price</th>
                  <th className="font-normal">Final Price</th>
                  <th className=" font-normal">Options</th>
                </tr>
              </thead>

              <tbody className="text-center text-[#634AE2] font-normal text-[16px] leading-[20px]">
                {order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-100">
                      <td className="px-4 py-2 rounded-l-[34px]">
                        <Select
                          selectedKeys={[item.productId.toString()]}
                          onChange={(e) => {
                            const productId = parseInt(e.target.value);
                            const selectedProduct = products.find(
                              (p) => p.id === productId
                            );

                            if (selectedProduct) {
                              updateOrderItem(index, {
                                productId,
                                ProductName: selectedProduct.name,
                                price: selectedProduct.price,
                              });
                            }
                          }}
                          classNames={{
                            trigger: "!border-[#634AE2] text-[#634AE2]",
                          }}
                        >
                          {products.map((product) => (
                            <SelectItem
                              key={product.id.toString()}
                             
                            >
                              {product.name}
                            </SelectItem>
                          ))}
                        </Select>
                      </td>

                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          value={item.quantity.toString()}
                          onChange={(e) =>
                            updateOrderItem(index, {
                              quantity: parseInt(e.target.value) || 1,
                            })
                          }
                          min="1"
                        />
                      </td>

                      <td className="px-4 py-2">{item.price.toFixed(2)}</td>

                      <td className="px-4 py-2">
                        {(item.price * item.quantity).toFixed(2)}
                      </td>

                      <td className="px-4 py-2 rounded-r-[34px]">
                        <button
                          type="button"
                          onClick={() => openDeleteModal(index)}
                          className="flex flex-col items-center justify-center hover:opacity-75 mx-auto"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="34px"
                            viewBox="0 -960 960 960"
                            width="34px"
                            fill="#B158FF"
                          >
                            <path d="M282.98-140q-25.79 0-44.18-18.39t-18.39-44.18v-532.05H180v-50.25h174.05v-30.51h251.9v30.51H780v50.25h-40.41v532.05q0 25.79-18.39 44.18T677.02-140H282.98Zm96.56-133.23h50.25v-379.08h-50.25v379.08Zm150.67 0h50.25v-379.08h-50.25v379.08Z" />
                          </svg>
                          <h1 className="text-[#B158FF] font-light text-sm">
                            delete
                          </h1>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center">
                      No products in this order. Add at least one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mt-6 flex justify-between space-x-6 items-center">
          <div className="font-bold text-lg text-[#634AE2]">
          Total Price: ${order.totalPrice.toFixed(2)}
          </div>

          <div className="flex gap-3">
            <Button className="bg-[#6364F4] text-white" type="submit">
              Save Changes
            </Button>

            <Button
              className="bg-gray-300"
              onClick={() => router.back()}
              type="button"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Form>

      <Modal isOpen={isOpenDelete} onOpenChange={onOpenChangeDelete}>
        <ModalContent>
          <ModalBody className="p-8">
            <h1 className="text-center text-lg font-bold text-gray-500">
              Are you sure you want to delete this product?
            </h1>
            <div className="flex flex-row gap-x-4 items-center justify-center mt-4">
              <Button
                color="danger"
                variant="light"
                onPress={() => onOpenChangeDelete()}
              >
                Cancel
              </Button>
              <Button color="primary" variant="light" onPress={confirmDelete}>
                Delete
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
