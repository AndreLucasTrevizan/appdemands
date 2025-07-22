'use client';

import { Dispatch, SetStateAction, useState } from "react";
import { createTeam, ITeams } from "../teams/actions";
import { addToast, Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@heroui/react";
import ErrorHandler from "../_utils/errorHandler";
import { FaTeamspeak } from "react-icons/fa6";
import { ITicketStatusProps } from "@/types";
import { createTicketStatus } from "../tickets/actions";

export default function ModalCreateTicketStatus({
  status,
  setStatus,
  isOpen,
  onOpen,
  onClose,
  onOpenChange
}: {
  status: ITicketStatusProps[],
  setStatus: Dispatch<SetStateAction<ITicketStatusProps[]>>,
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onOpenChange: () => void,
}) {
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateTicketStatus = async () => {
    try {
      setLoading(true);
      
      const response = await createTicketStatus({name});

      let teamsArray: ITicketStatusProps[] = [];

      teamsArray = [...status, response];

      teamsArray.sort((a, b) => a.statusName.localeCompare(b.statusName));

      setStatus(teamsArray);

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'Status criado',
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
          <h1>Criar Novo Status</h1>
        </ModalHeader>
        <Divider />
        {loading ? (
          <div className="flex flex-col items-center justify-center p-4">
            <Spinner size="md" label="Criando status..." />
          </div>
        ) : (
          <ModalBody className="p-4">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              startContent={<FaTeamspeak />}
              placeholder="Nome do status..."
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
              onPress={() => handleCreateTicketStatus()}
            >Criar</Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
