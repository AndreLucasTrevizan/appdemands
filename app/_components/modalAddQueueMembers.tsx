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
import { IAttendantProps } from "@/types";
import { FaCheck } from "react-icons/fa6";
import ErrorHandler from "../_utils/errorHandler";
import { listAvailableAttendants } from "../attendants/actions";
import { addAttendantsOnQueue } from "../queues/actions";

export default function ModalAddQueueMembers({
  slug,
  isOpen,
  onOpen,
  onClose,
  onOpenChange
}: {
  slug: string,
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onOpenChange: () => void
}) {
  const [filterValue, setFilterValue] = useState<string>("");
  const [values, setValues] = useState(new Set(''));
  const [attendants, setAttendants] = useState<IAttendantProps[]>([]);
  const [loadingAttendants, setLoadingAttendants] = useState<Boolean>(false);
  const [loadingAddMembers, setLoadingAddMembers] = useState<Boolean>(false);

  const arrayValues = Array.from(values);

  useEffect(() => {
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
    loadAttendantsAvailable();
  }, []);

  const handleGettingUsers = async () => {
    let newAttendants: IAttendantProps[] = [];

    arrayValues.forEach((value) => {
      let attendant = attendants.find((attendant) => `${attendant.id}` === `${value}`);

      if (attendant) {
        newAttendants.push(attendant);
      }
    });

    return newAttendants;
  }

  const handleAddMembers = async () => {
    try {
      let selectedUsers: IAttendantProps[] = [];

      selectedUsers = await handleGettingUsers();

      if (selectedUsers.length == 0) {
        addToast({
          color: 'warning',
          title: 'Aviso',
          description: 'Nenhum atendente foi selecionado',
          timeout: 3000,
          shouldShowTimeoutProgress: true
        });

        return;
      }

      setLoadingAddMembers(true);

      const dataMembers = {
        slug,
        attendantsList: JSON.stringify(selectedUsers),
      };

      await addAttendantsOnQueue(dataMembers);

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'Membros da fila de atendimento adicionados',
        timeout: 3000,
        shouldShowTimeoutProgress: true
      });

      setLoadingAddMembers(false);
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
    let members = [...attendants];

    members = attendants.filter((attendant) => attendant.userName.toLowerCase().includes(filterValue.toLowerCase()));

    return members;
  }, [ attendants, filterValue ]);

  const selectedUsers = useMemo(() => {
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
        <ModalHeader>Adicionar Membros na Fila de Atendimento</ModalHeader>
        <Divider />
        <ModalBody className="p-4 overflow-scroll scrollbar-hide">
          {loadingAddMembers ? (
            <div className="h-full flex flex-col items-center justify-center">
              <Spinner size="md" label="Adicionando membros..." />
            </div>
          ) : (
            <div className="flex flex-row justify-between gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <span>Lista de Atendentes</span>
                <Input
                  type="search"
                  startContent={<SearchIcon />}
                  placeholder="Buscar atendente..."
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                />
                <Divider />
                {loadingAttendants ? (
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
                <span>Atendentes a serem adicionados</span>
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