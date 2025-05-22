'use client';

import {
  addToast,
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { Dispatch, SetStateAction, useState } from "react";
import { FiMail, FiUser } from "react-icons/fi";
import { RiUserSettingsLine } from "react-icons/ri";
import ErrorHandler from "../_utils/errorHandler";
import { createPositions } from "../positions/actions";
import { IPositionProps } from "@/types";

export default function ModalCreatePosition({
  isOpen,
  onOpen,
  onClose,
  onOpenChange,
  positions,
  setPositions
}: {
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onOpenChange: () => void,
  positions: IPositionProps[],
  setPositions: Dispatch<SetStateAction<IPositionProps[]>>
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [positionName, setPositionName] = useState<string>('');

  async function handleCreatePosition() {
    try {
      setLoading(true);

      const position = await createPositions({ positionName });

      setPositions(prevArray => [...prevArray, position]);

      onClose();

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'Função criada',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });

      setLoading(false);
      setPositionName("");
    } catch (error) {
      setLoading(false);
      setPositionName("");
      const errorHandler = new ErrorHandler(error);

      addToast({
        color: 'warning',
        title: 'Aviso',
        description: errorHandler.error.message,
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    }
  }

  return (
    <Modal
      size="sm"
      isOpen={isOpen}
      placement="top-center"
      onOpenChange={onOpenChange}
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Criar Função de Usuário</ModalHeader>
        <Divider />
        {loading ? (
          <div className="flex p-4 items-center justify-center">
            <Spinner size="md" label="Criando função..." />
          </div>
        ) : (
          <div>
            <ModalBody className="pt-4 flex flex-row overflow-scroll scrollbar-hide">
              <Input
                label="Nome"
                labelPlacement="outside"
                type="text"
                placeholder="Digite o nome da função..."
                startContent={<RiUserSettingsLine />}
                value={positionName}
                onChange={(e) => setPositionName(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Fechar
              </Button>
              <Button color="primary" onPress={() => handleCreatePosition()}>
                Criar
              </Button>
            </ModalFooter>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}