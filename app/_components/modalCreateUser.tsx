'use client';

import { IAuthProfiles, IUsersReport } from "@/types";
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
import ErrorHandler from "../_utils/errorHandler";
import { createUser } from "../users/actions";
import { fetchAllAuthProfiles } from "../settings/profile_authorizations/actions";

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
  const [profileId, setProfileId] = useState<string>('');
  const [profiles, setProfiles] = useState<IAuthProfiles[]>([]);
  const [loadingCreateUser, setLoadingCreateUser] = useState<boolean>(false);
  const [loadingAuthProfiles, setLoadingAuthProfiles] = useState<boolean>(false);
  
  useEffect(() => {
    async function loadAllAuthProfiles() {
      try {
        setLoadingAuthProfiles(true);

        const data = await fetchAllAuthProfiles();

        setProfiles(data);

        setLoadingAuthProfiles(false);
      } catch (error) {
        setLoadingAuthProfiles(false);

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

    loadAllAuthProfiles();
  }, []);

  async function handleCreateUser() {
    try {
      setLoadingCreateUser(true);

      const user = await createUser({
        isAttendant: "false",
        userName,
        email,
        authProfileId: Number(profileId)
      });

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
      setProfileId("");
    } catch (error) {
      setLoadingCreateUser(false);
      setUserName("");
      setEmail("");
      setProfileId("");
      
      onClose();

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
            <Select
              onChange={(e) => setProfileId(e.target.value)}
              label="Perfil de Autorização"
              labelPlacement="outside"
              className="flex-2"
            >
              {profiles.map(((profile) => (
                <SelectItem key={profile.id}>{profile.label}</SelectItem>
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