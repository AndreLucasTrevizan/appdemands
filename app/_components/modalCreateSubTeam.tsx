'use client';

import { IUsersReport } from "@/types";
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
import { FaCheck, FaTeamspeak } from "react-icons/fa6";
import { FiRefreshCcw } from "react-icons/fi";
import { listUsersAvailable } from "../teams/actions";
import ErrorHandler from "../_utils/errorHandler";
import {
  addingMembersOnClientSubTeam,
  createSubTeam,
  ISubTeam
} from "../teams/[teamSlug]/subteams/actions";

export default function ModalCreateSubTeam({
  isOpen,
  onOpen,
  onClose,
  onOpenChange,
  params,
  setSubTeams
}: {
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onOpenChange: () => void,
  params: Promise<{teamSlug: string}>,
  subTeams: ISubTeam[],
  setSubTeams: Dispatch<SetStateAction<ISubTeam[]>>,
}) {
  const [name, setName] = useState<string>('');
  const [values, setValues] = useState(new Set(''));
  const [users, setUsers] = useState<IUsersReport[]>([]);
  const [updatedUser, setUpdatedUsers] = useState<boolean>(false);
  const [loadingUsers, setLoadingUsers] = useState<Boolean>(false);
  const [loadingCreateSubTeam, setLoadingCreateSubTeam] = useState<Boolean>(false);
  const [loadingAddingMembers, setLoadingAddingMembers] = useState<Boolean>(false);

  const arrayValues = Array.from(values);

  useEffect(() => {
    async function loadUsersAvailable() {
      try {
        setLoadingUsers(true);

        const data = await listUsersAvailable();

        setUsers(data);

        setLoadingUsers(false);
      } catch (error) {
        const errorHandler = new ErrorHandler(error);
        
        addToast({
          title: 'Aviso',
          description: errorHandler.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true
        });

        setLoadingUsers(false);
      }
    }

    loadUsersAvailable();
  }, [ updatedUser ]);

  const creatingSubteam = async () => {
    try {
      setLoadingCreateSubTeam(true);

      const { teamSlug } = await params;

      const data = {
        teamSlug,
        name,
      };

      console.log(data);

      const subTeam: ISubTeam = await createSubTeam(data);

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'Sub-equipe criada',
        timeout: 3000,
        shouldShowTimeoutProgress: true
      });

      setSubTeams(prevArray => [...prevArray, subTeam]);

      setLoadingCreateSubTeam(false);

      setName('');

      if (arrayValues.length > 0) {
        setLoadingAddingMembers(true);

        let selectedUsers: IUsersReport[] = [];

        selectedUsers = await handleGettingUsers();

        const dataMembers = {
          slug: subTeam.slug,
          userList: JSON.stringify(selectedUsers),
        };

        await addingMembersOnClientSubTeam(dataMembers);

        addToast({
          color: 'success',
          title: 'Sucesso',
          description: 'Membros da sub-equipe adicionados',
          timeout: 3000,
          shouldShowTimeoutProgress: true
        });

        setUpdatedUsers(!updatedUser);
        setLoadingAddingMembers(false);
        setValues(new Set(''));
      } else {
        addToast({
          color: 'warning',
          title: 'Aviso',
          description: 'Nenhum usuário selecionado',
          timeout: 3000,
          shouldShowTimeoutProgress: true
        });
      }
    } catch (error) {
      setName('');
      setValues(new Set(''));
      const errorHandler = new ErrorHandler(error);

      addToast({
        color: 'warning',
        title: 'Aviso',
        description: errorHandler.message,
        timeout: 3000,
        shouldShowTimeoutProgress: true
      });

      setLoadingCreateSubTeam(false);
      setLoadingAddingMembers(false);
    }
  }

  const handleGettingUsers = async () => {
    let newUsers: IUsersReport[] = [];
    
    arrayValues.forEach((value) => {
      let user = users.find((user) => `${user.id}` === `${value}`);

      if (user) {
        newUsers.push(user);
      }
    });

    return newUsers;
  }

  const updateListUsers = async () => {
    try {
      setLoadingUsers(true);

      const data = await listUsersAvailable();

      setUsers(data);

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'Lista de usuários atualizada',
        timeout: 3000,
        shouldShowTimeoutProgress: true
      });

      setLoadingUsers(false);
    } catch (error) {
      const errorHandler = new ErrorHandler(error);
      
      addToast({
        color: 'warning',
        title: 'Aviso',
        description: errorHandler.message,
        timeout: 3000,
        shouldShowTimeoutProgress: true
      });

      setLoadingUsers(false);
    }
  };

  const selectedUsers = useMemo(() => {
    if (!arrayValues.length) {
      return <small>Nenhum usuário selecionado</small>;
    } else {
      return (
        <div className="flex gap-2 flex-wrap">
          {arrayValues.map((value) => (
            <Chip
              color="default"
              key={value}
              endContent={
                <FaCheck />
              }
            >{users.find((user) => `${user.id}` === `${value}`)?.userName}</Chip>
          ))}
        </div>
      );
    }
  }, [ arrayValues.length ]);

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
        <ModalHeader className="flex flex-col gap-1">Criar Sub-Equipe</ModalHeader>
        <Divider />
        <ModalBody className="pt-4 flex flex-row overflow-scroll scrollbar-hide">
          {loadingCreateSubTeam && (
            <div className="w-full flex gap-4 flex-col items-center justify-center">
              <Spinner size="md" label="Criando sub equipe" />
            </div>
          )}
          {loadingAddingMembers && (
            <div className="w-full flex gap-4 flex-col items-center justify-center">
              <Spinner size="md" label="Adicionando membros..." />
            </div>
          )}
          {(!loadingCreateSubTeam && !loadingAddingMembers) && (
            <div className="w-full flex flex-row gap-4">
              <div className="flex-1 flex flex-col gap-4">
                <Input
                  label='Nome da sub-equipe'
                  labelPlacement="outside"
                  startContent={
                    <FaTeamspeak />
                  }
                  required
                  placeholder="Nome da sub-equipe..."
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Divider />
                <p className="text-sm">Usuários a serem adicionados:</p>
                {selectedUsers}
              </div>
              <Divider orientation="vertical"/>
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2>Usuários Disponíveis</h2>
                  <Button isIconOnly variant="light" onPress={() => updateListUsers()}>
                    <FiRefreshCcw />
                  </Button>
                </div>
                {loadingUsers ? (
                  <Spinner size="md" />
                ) : (
                  <Listbox
                    variant="flat"
                    items={users}
                    selectionMode="multiple"
                    onSelectionChange={(keys) => setValues(keys as Set<string>)}
                    className="overflow-scroll scrollbar-hide"
                  >
                    {(user) => (
                      <ListboxItem key={user.id} textValue={user.userName}>
                        <div className="flex gap-2 items-center">
                          <Avatar
                            alt={user.userName}
                            className="flex-shrink-0"
                            size="sm"
                            showFallback={user.avatar == ""}
                            src={`${process.env.baseUrl}/avatar/${user.userSlug}/${user.avatar}`}
                          />
                          <div className="flex flex-col">
                            <span className="text-small">{user.userName}</span>
                            <span className="text-tiny text-default-400">{user.email}</span>
                          </div>
                        </div>
                      </ListboxItem>
                    )}
                  </Listbox>
                )}
              </div>
            </div>
          )}
        </ModalBody>
        {(!loadingCreateSubTeam && !loadingAddingMembers) && (
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Fechar
            </Button>
            <Button color="primary" onPress={() => creatingSubteam()}>
              Criar
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}