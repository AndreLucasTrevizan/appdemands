import { addToast, Avatar, Button, Chip, Divider, Input, Listbox, ListboxItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@heroui/react";
import { SearchIcon } from "./searchIcon";
import { useEffect, useMemo, useState } from "react";
import { IAttendantProps, IUserProps } from "@/types";
import { ISubTeam, listSingleSubTeamInfo } from "../subteams/actions";
import { FaCheck } from "react-icons/fa6";
import ErrorHandler from "../_utils/errorHandler";
import { listAvailableAttendants } from "../attendants/actions";
import { listUsersAvailable } from "../teams/actions";

export default function ModalAddMembers({
  subTeamSlug,
  isOpen,
  onOpen,
  onClose,
  onOpenChange
}: {
  subTeamSlug: string,
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onOpenChange: () => void
}) {
  const [updatedUser, setUpdatedUser] = useState<boolean>(false);
  const [values, setValues] = useState(new Set(''));
  const [subTeam, setSubTeam] = useState<ISubTeam>();
  const [users, setUsers] = useState<IUserProps[]>([]);
  const [attendants, setAttendants] = useState<IAttendantProps[]>([]);
  const [loadingSubTeam, setLoadingSubTeam] = useState<Boolean>(false);
  const [loadingUsers, setLoadingUsers] = useState<Boolean>(false);
  const [loadingAttendants, setLoadingAttendants] = useState<Boolean>(false);

  const arrayValues = Array.from(values);

  useEffect(() => {
    async function loadSubTeamData() {
      try {
        setLoadingSubTeam(true);

        const data = await listSingleSubTeamInfo(subTeamSlug);

        setSubTeam(data);

        setLoadingSubTeam(false);
      } catch (error) {
        const errorHandler = new ErrorHandler(error);
        
        addToast({
          title: 'Aviso',
          description: errorHandler.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true
        });

        setLoadingSubTeam(false);
      }
    }

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
    
    async function loadAttendantsAvailable() {
      try {
        setLoadingAttendants(true);

        const data = await listAvailableAttendants();

        setAttendants(data);

        setLoadingAttendants(false);
      } catch (error) {
        const errorHandler = new ErrorHandler(error);
        
        addToast({
          title: 'Aviso',
          description: errorHandler.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true
        });

        setLoadingAttendants(false);
      }
    }

    loadSubTeamData();
    loadUsersAvailable();
    loadAttendantsAvailable();
  }, [ updatedUser ]);

  const handleGettingUsers = async () => {
    if (subTeam?.subTeamCategory.slug == 'serviço') {
      let newAttendants: IAttendantProps[] = [];
    
      arrayValues.forEach((value) => {
        let attendant = attendants.find((attendant) => `${attendant.id}` === `${value}`);

        if (attendant) {
          newAttendants.push(attendant);
        }
      });

      return newAttendants;
    } else {
      let newUsers: IUserProps[] = [];
    
      arrayValues.forEach((value) => {
        let user = users.find((user) => `${user.id}` === `${value}`);

        if (user) {
          newUsers.push(user);
        }
      });

      return newUsers;
    }
  }

  const selectedUsers = useMemo(() => {
    if (subTeam?.subTeamCategory.slug == 'serviço') {
      if (!arrayValues.length) {
        return <small>Nenhum atendente selecionado</small>;
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
              >{attendants.find((attendant) => `${attendant.id}` === `${value}`)?.userName}</Chip>
            ))}
          </div>
        );
      }
    } else {
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
    }
  }, [ arrayValues.length ]);

  return (
    <Modal
      size="4xl"
      className="text-sm h-2/3"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader>Adicionar Membros na Sub-Equipe</ModalHeader>
        <Divider />
        <ModalBody className="p-4">
          <div className="flex flex-row justify-between gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <span>Lista de Usuários</span>
              <Input
                type="search"
                startContent={<SearchIcon />}
                placeholder="Buscar usuário..."
              />
              <Divider />
              {loadingUsers || loadingAttendants ? (
                  <Spinner size="md" />
                ) : (
                  <Listbox
                    variant="flat"
                    items={subTeam?.subTeamCategory.slug == 'serviço' ? attendants : users}
                    selectionMode="multiple"
                    onSelectionChange={(keys) => setValues(keys as Set<string>)}
                    className="overflow-scroll scrollbar-hide"
                  >
                    {(person) => (
                      <ListboxItem key={person.id} textValue={person.userName}>
                        <div className="flex gap-2 items-center">
                          <Avatar
                            alt={person.userName}
                            className="flex-shrink-0"
                            size="sm"
                            showFallback={person.avatar == ""}
                            src={`${process.env.baseUrl}/avatar/${person.slug}/${person.avatar}`}
                          />
                          <div className="flex flex-col">
                            <span className="text-small">{person.userName}</span>
                            <span className="text-tiny text-default-400">{person.email}</span>
                          </div>
                        </div>
                      </ListboxItem>
                    )}
                  </Listbox>
                )}
            </div>
            <div>
              <Divider orientation="vertical" />
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <span>Usuário a serem adicionados</span>
              {selectedUsers}
            </div>
          </div>
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