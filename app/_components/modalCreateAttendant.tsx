'use client';

import { IAttendantsReport, IAuthProfiles, IUsersReport } from "@/types";
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
  Spinner,
} from "@heroui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FiMail, FiUser } from "react-icons/fi";
import ErrorHandler from "../_utils/errorHandler";
import { createUser } from "../users/actions";
import { fetchAllAuthProfiles } from "../settings/profile_authorizations/actions";

export default function ModalCreateAttendant({
  isOpen,
  onOpen,
  onClose,
  onOpenChange,
  attendants,
  setAttendants
}: {
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onOpenChange: () => void,
  attendants: IAttendantsReport[],
  setAttendants: Dispatch<SetStateAction<IAttendantsReport[]>>,
}) {
  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [profileId, setProfileId] = useState<string>('');
  const [profiles, setProfiles] = useState<IAuthProfiles[]>([]);
  const [loadingCreateAttendant, setLoadingCreateAttendant] = useState<boolean>(false);
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

  async function handleCreateAttendant() {
    try {
      setLoadingCreateAttendant(true);

      const attendant = await createUser({
        isAttendant: "true",
        userName,
        email,
        authProfileId: Number(profileId)
      });

      setAttendants(prevArray => [...prevArray, attendant]);

      onClose();

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'Atendente criado',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });

      setLoadingCreateAttendant(false);
      setUserName("");
      setEmail("");
      setProfileId("");
    } catch (error) {
      setLoadingCreateAttendant(false);
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
        <ModalHeader className="flex flex-col gap-1">Criar Atendente</ModalHeader>
        <Divider />
        <ModalBody className="pt-4 overflow-scroll scrollbar-hide">
          {loadingCreateAttendant ? (
            <Spinner size="md" />
          ) : (
            <div className="flex flex-col gap-4 ">
              <Input
                label="Nome"
                labelPlacement="outside"
                type="text"
                placeholder="Digite o nome do atendente..."
                startContent={<FiUser />}
                value={userName}
                onChange={(e) => setUserName(e.target.value)} className="flex-1"
              />
              <Input
                label="E-mail"
                labelPlacement="outside"
                type="email"
                placeholder="Digite o email do atendente..."
                startContent={<FiMail />}
                value={email}
                onChange={(e) => setEmail(e.target.value)} className="flex-1"
              />
              {loadingAuthProfiles ? (
                <Spinner size="md" />
              ) : (
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
              )}
              <span>Lembrando que senha inicial do login vai ser <strong>inicial</strong>.</span>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            Fechar
          </Button>
          <Button color="primary" onPress={() => handleCreateAttendant()}>
            Criar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}