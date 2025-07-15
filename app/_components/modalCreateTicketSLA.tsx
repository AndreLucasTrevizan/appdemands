'use client';

import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { addToast, Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spacer, Spinner } from "@heroui/react";
import ErrorHandler from "../_utils/errorHandler";
import { FaTicket } from "react-icons/fa6";
import { ITicketPriorityProps, ITicketSLASProps } from "@/types";
import { createTicketSLA, getTicketPrioritiesList } from "../tickets/actions";

export default function ModalCreateTicketSLAS({
  slas,
  setSlas,
  isOpen,
  onOpen,
  onClose,
  onOpenChange
}: {
  slas: ITicketSLASProps[],
  setSlas: Dispatch<SetStateAction<ITicketSLASProps[]>>,
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onOpenChange: () => void,
}) {
  const [priorities, setPriorities] = useState<ITicketPriorityProps[]>([]);
  const [prioritySelected, setPrioritySelected] = useState<ITicketPriorityProps>();
  const [slaTime, setSlaTime] = useState<string>('');
  const [hoursToFirstResponse, setHoursToFirstResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [loadingPriorities, setLoadingPriorities] = useState<boolean>(false);
  
  useEffect(() => {
    async function loadPrioritiesData() {
      try {
        setLoadingPriorities(true);
  
        const categoriesData = await getTicketPrioritiesList();
  
        setPriorities(categoriesData);
  
        setLoadingPriorities(false);
      } catch (error) {
        setLoadingPriorities(false);
          
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

    loadPrioritiesData();
  }, []);

  const handleCreateTicketSLA = async () => {
    try {
      setLoading(true);

      await createTicketSLA(slaTime, hoursToFirstResponse, prioritySelected.id);

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'SLA de chamado criado',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });

      setLoading(false);
      setSlaTime('');
      setHoursToFirstResponse('');
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

  const selectPriority = (e: ChangeEvent<HTMLSelectElement>) => {
    let priority = priorities.find((priority) => `${priority.id}` == e.target.value);
    setPrioritySelected(priority);
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader>
          <h1>Criar Novo SLA de Chamado</h1>
        </ModalHeader>
        <Divider />
        {loading ? (
          <div className="flex flex-col items-center justify-center p-4">
            <Spinner size="md" label="Criando novo SLA de chamado..." />
          </div>
        ) : (
          <ModalBody className="p-4">
            <Input
              type="text"
              value={slaTime}
              onChange={(e) => setSlaTime(e.target.value)}
              startContent={<FaTicket />}
              placeholder="Horas de SLA..."
              label="Horas de SLA"
              labelPlacement="outside"
            />
            <Spacer y={2} />
            <Input
              type="text"
              value={hoursToFirstResponse}
              onChange={(e) => setHoursToFirstResponse(e.target.value)}
              startContent={<FaTicket />}
              placeholder="Horas para primeira resposta..."
              label="Horas para Primeira Resposta do Chamado"
              labelPlacement="outside"
            />
            <Spacer y={2} />
            {loadingPriorities ? (
              <Spinner size="md" />
            ) : (
              <Select items={priorities} label="Prioridade" onChange={(e) => selectPriority(e)}>
                {(priority) => <SelectItem key={priority.id}>{`${priority.priorityName} - ${priority.categoryName}`}</SelectItem>}
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
              onPress={() => handleCreateTicketSLA()}
            >Criar</Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
