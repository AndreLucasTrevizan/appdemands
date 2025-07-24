'use client';

import { Dispatch, SetStateAction, useState } from "react";
import { addToast, Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@heroui/react";
import ErrorHandler from "../_utils/errorHandler";
import { FaTeamspeak } from "react-icons/fa6";
import { ITicketProcessProps, ITicketStatusProps } from "@/types";
import { createTicketProcess, createTicketStatus } from "../tickets/actions";

export default function ModalCreateTicketProcess({
  process,
  setProcess,
  isOpen,
  onOpen,
  onClose,
  onOpenChange
}: {
  process: ITicketProcessProps[],
  setProcess: Dispatch<SetStateAction<ITicketProcessProps[]>>,
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onOpenChange: () => void,
}) {
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateTicketProcess = async () => {
    try {
      setLoading(true);
      
      const response = await createTicketProcess({name});

      let processArray: ITicketProcessProps[] = [];

      processArray = [...process, response];

      processArray.sort((a, b) => a.processName.localeCompare(b.processName));

      setProcess(processArray);

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'Processo criado',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });

      setLoading(false);
      setName('');
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
          <h1>Criar Novo Processo</h1>
        </ModalHeader>
        <Divider />
        {loading ? (
          <div className="flex flex-col items-center justify-center p-4">
            <Spinner size="md" label="Criando processo..." />
          </div>
        ) : (
          <ModalBody className="p-4">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              startContent={<FaTeamspeak />}
              placeholder="Nome do processo..."
              label="Nome"
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
              onPress={() => handleCreateTicketProcess()}
            >Criar</Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
