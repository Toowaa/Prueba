import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@heroui/react";
import { OrderItem } from "./formulario";
import { use, useState } from "react";
import { Router, useRouter } from "next/router";
import { link } from "fs";

export default function Listar({
  orderItems,
  setOrderItems,
}: {
  orderItems: OrderItem[];
  setOrderItems: React.Dispatch<React.SetStateAction<OrderItem[]>>;
}) {
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onOpenChange: onOpenChangeDelete,
  } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onOpenChange: onOpenChangeEdit,
  } = useDisclosure();
  const [selectedItemId, setSelectedItemId] = useState<number>(0);
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null);
  const handleDeleteClick = (productId: number) => {
    setSelectedItemId(productId);
    onOpenDelete();
  };

  const handleDeleteConfirm = () => {
    setOrderItems(
      orderItems.filter((item) => item.productId !== selectedItemId)
    );
    onOpenChangeDelete();
  };

  const handleEditClick = (productId: number) => {
    const itemToEdit = orderItems.find((item) => item.productId === productId);
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setSelectedItemId(productId);
      onOpenEdit();
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingItem) {
      setEditingItem({
        ...editingItem,
        quantity: Number(e.target.value),
      });
    }
  };

  const handleEditConfirm = () => {
    if (editingItem) {
      setOrderItems(
        orderItems.map((item) =>
          item.productId === selectedItemId ? editingItem : item
        )
      );
      setEditingItem(null);
      onOpenChangeEdit();
    }
  };

  const handleSaveOrder = async () => {
 
    const formattedData = {
      products: orderItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };
    
    console.log("Datos formateados:", formattedData);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });
      
      if (!response.ok) {
        throw new Error('Error al guardar la orden');
      }
      
      const result = await response.json();
      console.log("Resultado de la orden guardada:", result);
    window.location.href = "/";
      
    } catch (error) {
      console.error("Error:", error);
   
    }
  };
  return (
    <>
      {orderItems.length > 0 && (
        <table className="w-full border-separate border-spacing-y-4">
          <thead className="rounded-full">
            <tr className="bg-[#6364F4] text-white h-11">
              <th className="rounded-tl-full font-normal">ID</th>
              <th className="font-normal">Name</th>
              <th className="font-normal">Unit Price</th>
              <th className="font-normal">Qty</th>
              <th className="font-normal">Total price</th>
              <th className="rounded-tr-full font-normal">Options</th>
            </tr>
          </thead>

          <tbody className="text-center bg-white text-[#634AE2] font-normal text-[16px] leading-[20px]">
            {orderItems.map((dat) => (
              <tr key={dat.productId} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2 rounded-l-[34px]">{dat.productId}</td>
                <td className="px-4 py-2">{dat.ProductName}</td>
                <td className="px-4 py-2">{dat.price}</td>
                <td className="px-4 py-2">{dat.quantity}</td>
                <td className="px-4 py-2">{dat.quantity * dat.price}</td>
                <td className="px-4 py-2 rounded-r-[34px]">
                  <div className="flex flex-row items-center justify-center gap-x-4">
                    <div className="">
                      <button
                        onClick={() => handleEditClick(dat.productId)}
                        className="flex flex-col items-center justify-center hover:opacity-75"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="34px"
                          viewBox="0 -960 960 960"
                          width="34px"
                          fill="#634AE2"
                        >
                          <path d="M120-120v-142l559.33-558.33q9.34-9 21.5-14 12.17-5 25.5-5 12.67 0 25 5 12.34 5 22 14.33L821-772q10 9.67 14.5 22t4.5 24.67q0 12.66-4.83 25.16-4.84 12.5-14.17 21.84L262-120H120Zm607.33-560.67L772.67-726l-46-46-45.34 45.33 46 46Z" />
                        </svg>
                        <h1 className="font-light text-sm">Editar</h1>
                      </button>
                    </div>
                    <div className="">
                      <button
                        onClick={() => handleDeleteClick(dat.productId)}
                        className="flex flex-col items-center justify-center hover:opacity-75"
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
                          Eliminar
                        </h1>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          
            <Button
              onPress={handleSaveOrder}
              color="primary"
              variant="light"
             className="text-white rounded-full bg-purple-400 w-full max-w-32 font-normal text-sm"
            >
              Save Order
            </Button>
          
        </table>
        
      )}

      <Modal isOpen={isOpenDelete} onOpenChange={onOpenChangeDelete}>
        <ModalContent>
          <ModalBody className="p-8">
            <h1 className="text-center text-lg font-bold text-gray-500">
              ¿Estás seguro?
            </h1>
            <div className="flex flex-row gap-x-4 items-center justify-center">
              <Button
                color="danger"
                variant="light"
                onPress={() => onOpenChangeDelete()}
              >
                Cancelar
              </Button>
              <Button
                color="primary"
                variant="light"
                onPress={handleDeleteConfirm}
              >
                Eliminar
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenEdit} onOpenChange={onOpenChangeEdit}>
        <ModalContent>
          <ModalBody
            className="p-8"
            style={{
              backgroundImage: `linear-gradient(to right,rgba(54,22,216, 0.64), rgba(120,99,227, 0.48))`,
            }}
          >
            <h1 className="text-center text-lg font-bold  ">
              Edit Product
            </h1>
            <Form>
              <Input
                isReadOnly
                label="Product Name"
                labelPlacement="outside"
                value={editingItem?.ProductName || ""}
              />
              <Input
                isRequired
                type="number"
                label="Quantity"
                labelPlacement="outside"
                value={editingItem?.quantity.toString() || ""}
                onChange={handleQuantityChange}
              />
              <Input
                isReadOnly
                label="Price"
                labelPlacement="outside"
                value={editingItem?.price.toString() || ""}
              />
            </Form>
            <div className="flex flex-row gap-x-4 items-center justify-center mt-4">
              <Button
                color="danger"
                variant="light"
                onPress={() => onOpenChangeEdit()}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                variant="light"
                onPress={handleEditConfirm}
              >
               Save
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
