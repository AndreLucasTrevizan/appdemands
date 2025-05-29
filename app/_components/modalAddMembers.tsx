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
import { SearchIcon } from "./searchIcon";
import { useEffect, useMemo, useState } from "react";
import { IAttendantProps, IUserProps } from "@/types";
import { FaCheck } from "react-icons/fa6";
import ErrorHandler from "../_utils/errorHandler";
import { listAvailableAttendants } from "../attendants/actions";
import { listUsersAvailable } from "../teams/actions";
import {
  addingMembersOnClientSubTeam,
  addingMembersOnServiceSubTeam,
  ISubTeam,
  listSingleSubTeamInfo,

} from "../teams/[teamSlug]/subteams/actions";

export default function ModalAddMembers({
  params,
  isOpen,
  onOpen,
  onClose,
  onOpenChange
}: {
  params: {teamSlug: string, subTeamSlug: string},
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onOpenChange: () => void
}) {
  const [filterValue, setFilterValue] = useState<string>("");
  const [updatedUser, setUpdatedUser] = useState<boolean>(false);
  const [values, setValues] = useState(new Set(''));
  const [subTeam, setSubTeam] = useState<ISubTeam>();
  const [users, setUsers] = useState<IUserProps[]>([]);
  const [attendants, setAttendants] = useState<IAttendantProps[]>([]);
  const [loadingSubTeam, setLoadingSubTeam] = useState<Boolean>(false);
  const [loadingUsers, setLoadingUsers] = useState<Boolean>(false);
  const [loadingAttendants, setLoadingAttendants] = useState<Boolean>(false);
  const [loadingAddMembers, setLoadingAddMembers] = useState<Boolean>(false);

  const arrayValues = Array.from(values);

  useEffect(() => {
    async function loadSubTeamData() {
      try {
        setLoadingSubTeam(true);

        const { subTeamSlug } = params;

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
    if (!subTeam) {
      return [];
    }

    if (subTeam.subTeamCategory.slug == 'serviço') {
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

  const handleAddMembers = async () => {
    try {
      let selectedUsers: IAttendantProps[] = [];

      selectedUsers = await handleGettingUsers();

      if (!subTeam) {
        addToast({
          color: 'warning',
          title: 'Aviso',
          description: 'Nenhuma sub-categoria encontrada, tente recarregar a página',
          timeout: 3000,
          shouldShowTimeoutProgress: true
        });

        return;
      }

      if (selectedUsers.length == 0) {
        addToast({
          color: 'warning',
          title: 'Aviso',
          description: 'Nenhum membro foi selecionado',
          timeout: 3000,
          shouldShowTimeoutProgress: true
        });

        return;
      }

      setLoadingAddMembers(true);

      if (subTeam.subTeamCategory.slug == 'serviço') {
        const dataMembers = {
          slug: subTeam.slug,
          attendantsList: JSON.stringify(selectedUsers),
        };

        await addingMembersOnServiceSubTeam(dataMembers);

        addToast({
          color: 'success',
          title: 'Sucesso',
          description: 'Membros da sub-equipe adicionados',
          timeout: 3000,
          shouldShowTimeoutProgress: true
        });

        setLoadingAddMembers(false);
      } else {
        const dataMembers = {
          slug: subTeam?.slug!,
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

        setLoadingAddMembers(false);
      }
    } catch (error) {
      const errorHandler = new ErrorHandler(error);

      addToast({
        color: 'warning',
        title: 'Aviso',
        description: errorHandler.message,
        timeout: 3000,
        shouldShowTimeoutProgress: true
      });

      setLoadingAddMembers(false);
    }
  }

  const filteredItems = useMemo(() => {
    if (subTeam?.subTeamCategory.slug == 'client') {
      let members = [...users];

      members = users.filter((user) => user.userName.toLowerCase().includes(filterValue.toLowerCase()));

      return members;
    } else {
      let members = [...attendants];

      members = attendants.filter((attendant) => attendant.userName.toLowerCase().includes(filterValue.toLowerCase()));

      return members;
    }
  }, [ users, attendants, filterValue ]);

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
        <ModalBody className="p-4 overflow-scroll scrollbar-hide">
          {loadingAddMembers ? (
            <div className="h-full flex flex-col items-center justify-center">
              <Spinner size="md" label="Adicionando membros..." />
            </div>
          ) : (
            <div className="flex flex-row justify-between gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <span>Lista de Usuários</span>
                <Input
                  type="search"
                  startContent={<SearchIcon />}
                  placeholder="Buscar usuário..."
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                />
                <Divider />
                {loadingUsers || loadingAttendants ? (
                    <Spinner size="md" />
                  ) : (
                    <Listbox
                      variant="flat"
                      items={filteredItems}
                      selectionMode="multiple"
                      onSelectionChange={(keys) => setValues(keys as Set<string>)}
                    >
                      {(person) => (
                        <ListboxItem
                          key={person.id}
                          textValue={person.userName}
                        >
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
              <div className="flex flex-col gap-4 flex-1 sticky top-0 self-start">
                <span>Usuário a serem adicionados</span>
                {selectedUsers}
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            Fechar
          </Button>
          <Button color="primary" onPress={() => handleAddMembers()}>
            Criar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}