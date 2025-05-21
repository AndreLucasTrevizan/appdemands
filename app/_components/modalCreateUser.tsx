'use client';

import { IUserProps } from "@/types";
import {
  addToast,
  Avatar,
  Button,
  Chip,
  Divider,
  Input,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner
} from "@heroui/react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { FaCheck, FaMailchimp, FaTeamspeak, FaUser } from "react-icons/fa6";
import { FiMail, FiRefreshCcw, FiUser } from "react-icons/fi";
import { listUsersAvailable } from "../teams/actions";
import ErrorHandler from "../_utils/errorHandler";
import { addingMembersOnSubTeam, createSubTeam, ISubTeam } from "../subteams/actions";

export default function ModalCreateUser({
  isOpen,
  onOpen,
  onClose,
  onOpenChange,
  userCreated,
  setUserCreated
}: {
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onOpenChange: () => void,
  userCreated: boolean,
  setUserCreated: Dispatch<SetStateAction<boolean>>,
}) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

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
        <ModalBody className="pt-4 flex flex-row overflow-scroll scrollbar-hide">
          <Input
            label="Nome"
            labelPlacement="outside"
            type="text"
            placeholder="Digite o nome do usuário..."
            startContent={<FiUser />}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="E-mail"
            labelPlacement="outside"
            type="email"
            placeholder="Digite o email do usuário..."
            startContent={<FiMail />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            Fechar
          </Button>
          <Button color="primary" onPress={() => {}}>
            Criar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}