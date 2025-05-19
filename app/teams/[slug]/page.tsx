'use client';

import {
  addToast,
  Avatar,
  AvatarGroup,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Input,
  Link,
  Listbox,
  ListboxItem,
  ListboxSection,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  Spinner,
  useDisclosure
} from "@heroui/react";
import { FaCheck, FaTeamspeak } from "react-icons/fa6";
import { useCallback, useEffect, useMemo, useState } from "react";
import DefaultLayout from "@/app/_components/defaultLayout";
import ErrorHandler from "@/app/_utils/errorHandler";
import { createSubTeam, listSingleTeamInfo, listUsersAvailable } from "./actions";
import { ITeams } from "../actions";
import { PlusIcon } from "@/app/_components/plusIcon";
import { IUserProps } from "@/types";
import { ISubTeam } from "@/app/subteams/[slug]/actions";

export default function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCreateSubTeam, setLoadingCreateSubTeam] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [team, setTeam] = useState<ITeams>();
  const [subTeams, setSubTeams] = useState<ISubTeam[]>([]);
  const [users, setUsers] = useState<IUserProps[]>([]);
  const [userList, setUserList] = useState<IUserProps[]>([]);
  const [values, setValues] = useState(new Set(""));

  const arrayValues = Array.from(values);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        let { slug } = await params;

        const data = await listSingleTeamInfo(slug);
        const usersData = await listUsersAvailable();

        setTeam(data);
        setSubTeams(data.subTeams);
        setUsers(usersData);
        
        setLoading(false);
      } catch (error) {
        const errorHandler = new ErrorHandler(error);
        
        addToast({
          title: 'Aviso',
          description: errorHandler.error.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true
        });

        setLoading(false);
      }
    }

    loadData();
  }, []);

  const selectedUsers = useMemo(() => {
    if (!arrayValues.length) {
      return <small>Nenhum usuário selecionado</small>;
    } else {
      return (
        <div>
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

  const creatingSubteam = async () => {
    try {
      setLoadingCreateSubTeam(true);

      const { slug } = await params;

      const data = {
        teamSlug: slug,
        name,
      };

      const subTeam = await createSubTeam(data);



      setLoadingCreateSubTeam(true);
    } catch (error) {
      const errorHandler = new ErrorHandler(error);
        
      addToast({
        title: 'Aviso',
        description: errorHandler.error.message,
        timeout: 3000,
        shouldShowTimeoutProgress: true
      });

      setLoadingCreateSubTeam(false);
    }
  }

  return (
    <DefaultLayout>
      <Breadcrumbs>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/teams">Equipes</BreadcrumbItem>
        <BreadcrumbItem>Equipe {team?.name}</BreadcrumbItem>
      </Breadcrumbs>
      <Divider />
      <div className="flex flex-col flex-wrap gap-4">
        {loading ? (
          <Spinner className="m-4" />
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <Button
                startContent={
                  <PlusIcon size={20} height={20} width={20} />
                }
                color="primary"
                onPress={onOpen}
              >Criar Sub-Equipe</Button>
            </div>
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
                <ModalBody className="pt-4 flex flex-row">
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
                    <h2>Usuários Disponíveis</h2>
                    <Listbox
                      classNames={{
                        base: "max-w-xs",
                        list: "max-h-[300px]",
                      }}
                      variant="flat"
                      items={users}
                      selectionMode="multiple"
                      onSelectionChange={(keys) => setValues(keys as Set<string>)}
                    >
                      {(user) => (
                        <ListboxItem key={user.id} textValue={user.userName}>
                          <div className="flex gap-2 items-center">
                            <Avatar
                              alt={user.userName}
                              className="flex-shrink-0"
                              size="sm"
                              showFallback={user.avatar == ""}
                              src={`${process.env.baseUrl}/avatar/${user.id}/${user.avatar}`}
                            />
                            <div className="flex flex-col">
                              <span className="text-small">{user.userName}</span>
                              <span className="text-tiny text-default-400">{user.email}</span>
                            </div>
                          </div>
                        </ListboxItem>
                      )}
                    </Listbox>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Fechar
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Criar
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            {subTeams.map((subTeam) => (
              <Card className="w-1/6" key={subTeam.id}>
                <CardHeader className="flex gap-4 items-center">
                  <FaTeamspeak size={45} />
                  <div className="flex flex-col gap-2">
                    <p className="text-base">{subTeam.name}</p>
                    <p>@{subTeam.slug}</p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="flex flex-col gap-4">
                  {subTeam.user.length > 0 && (
                    <AvatarGroup max={15}>
                      {subTeam.user.map((user) => (
                        <Avatar
                          showFallback={user.avatar == ""}
                          key={user.id}
                          src={`${process.env.baseUrl}/avatar/${user.id}/${user.avatar}`}
                        />
                      ))}
                    </AvatarGroup>
                  )}
                  <Chip
                    color={subTeam.status == "disponivel" ? "success" : "danger"}
                    title="Disponível"
                    className="text-sm text-white"
                  >
                    {subTeam.status == "disponivel" ? "Disponivel" : "Indisponivel"}
                  </Chip>
                </CardBody>
                <Divider />
                <CardFooter>
                  <Link href={`/subteams/${subTeam.slug}`} className="text-sm">Acessar</Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
