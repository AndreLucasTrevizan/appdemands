'use client';

import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { addToast, Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spinner, Textarea } from "@heroui/react";
import ErrorHandler from "../_utils/errorHandler";
import { FaTicket } from "react-icons/fa6";
import { ITicketCategoryProps, ITicketPriorityProps } from "@/types";
import { createTicketCategory, createTicketPriority, getTicketCategoriesList } from "../tickets/actions";

export default function ModalCreateTicketPriority({
  priorities,
  setPriorities,
  isOpen,
  onOpen,
  onClose,
  onOpenChange
}: {
  priorities: ITicketPriorityProps[],
  setPriorities: Dispatch<SetStateAction<ITicketPriorityProps[]>>,
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onOpenChange: () => void,
}) {
  const [categories, setCategories] = useState<ITicketCategoryProps[]>([]);
  const [categorySelected, setCategorySelected] = useState<ITicketCategoryProps>();
  const [priorityName, setPriorityName] = useState<string>('');
  const [ticketCategoryId, setTicketCategoryId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [loadingCategories, setLoadingCategories] = useState<boolean>(false);
  
  useEffect(() => {
    async function loadCategoriesData() {
      try {
        setLoadingCategories(true);

        const categoriesData = await getTicketCategoriesList();

        setCategories(categoriesData);

        setLoadingCategories(false);
      } catch (error) {
        setLoadingCategories(false);
        
        const errorHandler = new ErrorHandler(error);
      
        addToast({
          title: 'Aviso',
          description: errorHandler.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: 'warning',
        });
      }
    }

    loadCategoriesData();
  }, []);

  const handleCreateTicketPriority = async () => {
    try {
      setLoading(true);
      
      const response = await createTicketPriority(priorityName, String(categorySelected.id));

      let prioritiesArray: ITicketPriorityProps[] = [];

      prioritiesArray = [...priorities, response];

      prioritiesArray.sort((a, b) => a.priorityName.localeCompare(b.priorityName));

      setPriorities(prioritiesArray);

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'Prioridade de chamado criada',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });

      setLoading(false);
      setPriorityName('');
      setTicketCategoryId('');
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

  const selectCategory = (e: ChangeEvent<HTMLSelectElement>) => {
    let category = categories.find((category) => `${category.id}` == e.target.value);
    console.log(category);
    setCategorySelected(category);
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader>
          <h1>Criar Nova Prioridade de Chamado</h1>
        </ModalHeader>
        <Divider />
        {loading ? (
          <div className="flex flex-col items-center justify-center p-4">
            <Spinner size="md" label="Criando nova prioridade de chamado..." />
          </div>
        ) : (
          <ModalBody className="p-4">
            <Input
              type="text"
              value={priorityName}
              onChange={(e) => setPriorityName(e.target.value)}
              startContent={<FaTicket />}
              placeholder="Nome da prioridade..."
              label="Nome"
              labelPlacement="outside"
            />
            {loadingCategories ? (
              <Spinner size="md" />
            ) : (
              <Select items={categories} className="flex-1" label="Categoria" isRequired onChange={(e) => selectCategory(e)}>
                {(category) => <SelectItem key={category.id}>{category.categoryName}</SelectItem>}
              </Select>
            )}
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
              onPress={() => handleCreateTicketPriority()}
            >Criar</Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
