'use client';

import { IPositionProps, IUsersReport } from "@/types";
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
  Select,
  SelectItem,
  Switch,
} from "@heroui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FiMail, FiUser } from "react-icons/fi";
import { listPositions } from "../positions/actions";
import ErrorHandler from "../_utils/errorHandler";
import { createUser } from "../users/actions";

export default function ModalCreateUser({
  isOpen,
  onOpen,
  onClose,
  onOpenChange,
  users,
  setUsers
}: {
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onOpenChange: () => void,
  users: IUsersReport[],
  setUsers: Dispatch<SetStateAction<IUsersReport[]>>,
}) {
  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [positionId, setPositionId] = useState<string>('');
  const [positions, setPositions] = useState<IPositionProps[]>([]);
  const [loadingCreateUser, setLoadingCreateUser] = useState<boolean>(false);
  const [loadingListPositions, setLoadingListPositions] = useState<boolean>(false);
  
  useEffect(() => {
    async function loadListPositions() {
      try {
        setLoadingListPositions(true);

        const data = await listPositions();

        setPositions(data);

        setLoadingListPositions(false);
      } catch (error) {
        setLoadingListPositions(false);

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

    loadListPositions();
  }, []);

  async function handleCreateUser() {
    try {
      setLoadingCreateUser(true);

      const user = await createUser({ userName, email, positionId: Number(positionId) });

      setUsers(prevArray => [...prevArray, user]);

      onClose();

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'Usuário criado',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });

      setLoadingCreateUser(false);
      setUserName("");
      setEmail("");
      setPositionId("");
    } catch (error) {
      setLoadingCreateUser(false);
      setUserName("");
      setEmail("");
      setPositionId("");
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
      size="4xl"
      isOpen={isOpen}
      placement="top-center"
      onOpenChange={onOpenChange}
      className="h-2/3"
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Criar Usuário</ModalHeader>
        <Divider />
        <ModalBody className="pt-4 overflow-scroll scrollbar-hide">
          <div className="flex flex-col gap-4 ">
            <Input
              label="Nome"
              labelPlacement="outside"
              type="text"
              placeholder="Digite o nome do usuário..."
              startContent={<FiUser />}
              value={userName}
              onChange={(e) => setUserName(e.target.value)} className="flex-1"
            />
            <Input
              label="E-mail"
              labelPlacement="outside"
              type="email"
              placeholder="Digite o email do usuário..."
              startContent={<FiMail />}
              value={email}
              onChange={(e) => setEmail(e.target.value)} className="flex-1"
            />
            <Select onChange={(e) => setPositionId(e.target.value)} label="Função do usuário" labelPlacement="outside" className="flex-2">
              {positions.map(((position) => (
                <SelectItem key={position.id}>{position.positionName}</SelectItem>
              )))}
            </Select>
            <span>Lembrando que senha inicial do usuário vai ser <strong>inicial</strong>.</span>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            Fechar
          </Button>
          <Button color="primary" onPress={() => handleCreateUser()}>
            Criar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}