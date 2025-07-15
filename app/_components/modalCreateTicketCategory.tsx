'use client';

import { Dispatch, SetStateAction, useState } from "react";
import { addToast, Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, Textarea } from "@heroui/react";
import ErrorHandler from "../_utils/errorHandler";
import { FaTicket } from "react-icons/fa6";
import { ITicketCategoryProps } from "@/types";
import { createTicketCategory } from "../tickets/actions";

export default function ModalCreateTicketCategory({
  categories,
  setCategories,
  isOpen,
  onOpen,
  onClose,
  onOpenChange
}: {
  categories: ITicketCategoryProps[],
  setCategories: Dispatch<SetStateAction<ITicketCategoryProps[]>>,
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onOpenChange: () => void,
}) {
  const [categoryDesc, setCategoryDesc] = useState<string>('');
  const [categoryName, setCategoryName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateTicketCategory = async () => {
    try {
      setLoading(true);
      
      const response = await createTicketCategory(categoryName, categoryDesc);

      let categoriesArray: ITicketCategoryProps[] = [];

      categoriesArray = [...categories, response];

      categoriesArray.sort((a, b) => a.categoryName.localeCompare(b.categoryName));

      setCategories(categoriesArray);

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'Categoria de chamado criada',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });

      setLoading(false);
      setCategoryName('');
      setCategoryDesc('');
    } catch (error) {
      setLoading(false);

      const errorHandler = new ErrorHandler(error);

      addToast({
        color: 'warning',
        title: 'Aviso',
        description: errorHandler.message,
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader>
          <h1>Criar Nova Categoria de Chamado</h1>
        </ModalHeader>
        <Divider />
        {loading ? (
          <div className="flex flex-col items-center justify-center p-4">
            <Spinner size="md" label="Criando nova categoria de chamado..." />
          </div>
        ) : (
          <ModalBody className="p-4">
            <Input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              startContent={<FaTicket />}
              placeholder="Nome da categoria..."
              label="Nome"
              labelPlacement="outside"
            />
            <Textarea
              value={categoryDesc}
              onChange={(e) => setCategoryDesc(e.target.value)}
              placeholder="Descrição da categoria do chamado..."
              label="Descrição da Categoria"
              labelPlacement="outside"
            />
          </ModalBody>
        )}
        <Divider />
        <ModalFooter>
          <div className="flex flex-row justify-between gap-4">
            <Button
              color="danger"
              onPress={() => onClose()}
            >Cancelar</Button>
            <Button
              color="primary"
              onPress={() => handleCreateTicketCategory()}
            >Criar</Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
