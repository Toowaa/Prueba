import { Button, Modal, ModalBody, ModalContent, useDisclosure } from "@heroui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Order {
    id: number;
    OrderNo: number;
    createdAt: string;
    FinalPrice: number;
    Quantity: number;
}

export default function TableMyOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [idToDelete, setIdToDelete] = useState<number | null>(null);
      
    const {
        isOpen: isOpenDelete,
        onOpen: onOpenDelete,
        onOpenChange: onOpenChangeDelete,
    } = useDisclosure();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/order");
                if (!response.ok) throw new Error("Error en la respuesta del servidor");
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []); 

    const openDeleteModal = (id: number) => {
        setIdToDelete(id);
        onOpenDelete();
    };

    const confirmDelete = async () => {
        if (idToDelete === null) return;
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/order/${idToDelete}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Error al eliminar la orden');
            }
            const result = await response.json();
            console.log("Resultado de la orden eliminada:", result);
            onOpenChangeDelete();
            window.location.href = "/"; 
        } catch (error) {
            console.error("Error:", error);
        }
    };



    const handleEdit = (id: number) => {
        window.location.href = `/orders/${id}/edit`;
    };
    return (
        <>
        <div className="max-h-[500px] overflow-y-auto overflow-scroll:scrollbar-none">
          <table className="w-full border-separate border-spacing-y-4 ">
            <thead className="rounded-full">
              <tr className="bg-[#6364F4] text-white h-11 ">
                <th className="rounded-tl-full font-normal">ID</th>
                <th className="font-normal">Order</th>
                <th className="font-normal">date</th>
                <th className="font-normal">Products</th>
                <th className=" font-normal">Final price</th>
                <th className="rounded-tr-full font-normal">Options</th>
              </tr>
            </thead>
    
            <tbody className="text-center bg-white text-[#634AE2] font-normal text-[16px] leading-[20px]">
              {orders.map((dat) => (
                <tr key={dat.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2 rounded-l-[34px]">{dat.id}</td>
                  <td className="px-4 py-2">{dat.OrderNo}</td>
                  <td className="px-4 py-2">{dat.createdAt}</td>
                  <td className="px-4 py-2">{dat.Quantity}</td>
                  <td className="px-4 py-2">{dat.FinalPrice}</td>
                  <td className="px-4 py-2 rounded-r-[34px]">
                    <div className="flex flex-row items-center justify-center gap-x-4">
                      <div className="">
                        <button 
                          onClick={() =>  handleEdit(dat.id)}

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
                            onClick={() => openDeleteModal(dat.id)}
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
          </table>
        </div>

        <Modal isOpen={isOpenDelete} onOpenChange={onOpenChangeDelete}>
          <ModalContent>
            <ModalBody className="p-8">
              <h1 className="text-center text-lg font-bold text-gray-500">
               ¿Are you sure?
              </h1>
              <div className="flex flex-row gap-x-4 items-center justify-center">
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => onOpenChangeDelete()}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  variant="light"
                  onPress={confirmDelete}
                >
                Delete
                </Button>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
        </>
    );
}