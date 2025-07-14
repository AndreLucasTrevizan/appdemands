'use client';

import { Dispatch, SetStateAction, useState } from "react";
import { createTeam, ITeams } from "../teams/actions";
import { addToast, Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@heroui/react";
import ErrorHandler from "../_utils/errorHandler";
import { FaTeamspeak } from "react-icons/fa6";

export default function ModalCreateTeam({
  teams,
  setTeams,
  isOpen,
  onOpen,
  onClose,
  onOpenChange
}: {
  teams: ITeams[],
  setTeams: Dispatch<SetStateAction<ITeams[]>>,
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onOpenChange: () => void,
}) {
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateTeam = async () => {
    try {
      setLoading(true);
      
      const response = await createTeam(name);

      let teamsArray: ITeams[] = [];

      teamsArray = [...teams, response];

      teamsArray.sort((a, b) => a.teamName.localeCompare(b.teamName));

      setTeams(teamsArray);

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'Equipe criada',
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
          <h1>Criar Nova Equipe</h1>
        </ModalHeader>
        <Divider />
        {loading ? (
          <div className="flex flex-col items-center justify-center p-4">
            <Spinner size="md" label="Criando equipe..." />
          </div>
        ) : (
          <ModalBody className="p-4">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              startContent={<FaTeamspeak />}
              placeholder="Nome da equipe..."
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
              onPress={() => handleCreateTeam()}
            >Criar</Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
