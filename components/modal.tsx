import { ProducApi, Product } from "@/interface";
import { Button, Form, Input, Modal, ModalBody, ModalContent, Select, SelectItem } from "@heroui/react";

export default function ProductModal({
    isOpen,
    onOpenChange,
    products,
    selectedProduct,
    quantity,
    onProductSelect,
    onQuantityChange,
    onSubmit,
  }: {
    isOpen: boolean;
    onOpenChange: () => void;
    products: ProducApi[];
    selectedProduct: number;
    quantity: number;
    onProductSelect: (productId: number) => void;
    onQuantityChange: (quantity: number) => void;
    onSubmit: (e: React.FormEvent) => void;
  }) {
    return (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalBody>
            <Form onSubmit={onSubmit}>
              <Select
                label="Products"
                labelPlacement="outside"
                isRequired
                variant="flat"
                radius="full"
                selectedKeys={selectedProduct ? [selectedProduct.toString()] : []}
                classNames={{
                  label: "!text-[#634AE2]",
                  trigger: "!border-2 border-[#634AE2]",
                  base: "!text-[#634AE2]",
                }}
                placeholder="Choose a Product"
                onChange={(e) => onProductSelect(Number(e.target.value))}
              >
                {products.map((product) => (
                  <SelectItem
                    key={product.id.toString()}
             
                    classNames={{ base: "!text-[#634AE2]" }}
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
                value={quantity.toString()}
                classNames={{
                  label: "!text-[#634AE2]",
                  inputWrapper: "border-2 border-[#634AE2]",
                  input: "!text-[#634AE2]",
                }}
                placeholder="Quantity"
                onChange={(e) => onQuantityChange(Number(e.target.value))}
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
    );
  }