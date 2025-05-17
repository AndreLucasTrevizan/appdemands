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
  Spinner,
  useDisclosure
} from "@heroui/react";
import { FaTeamspeak } from "react-icons/fa6";
import { useCallback, useEffect, useState } from "react";
import DefaultLayout from "@/app/_components/defaultLayout";
import ErrorHandler from "@/app/_utils/errorHandler";
import { listSingleTeamInfo, listUsersAvailable } from "./actions";
import { ITeams } from "../actions";
import { PlusIcon } from "@/app/_components/plusIcon";
import { IUserProps } from "@/types";

export default function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false);
  const [team, setTeam] = useState<ITeams>();
  const [users, setUsers] = useState<IUserProps[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        let { slug } = await params;

        const data = await listSingleTeamInfo(slug);
        const usersData = await listUsersAvailable();

        setTeam(data);
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

  return (
    <DefaultLayout>
      <Breadcrumbs>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/teams">Equipes</BreadcrumbItem>
        <BreadcrumbItem>Equipe {team?.name}</BreadcrumbItem>
      </Breadcrumbs>
      <Divider />
      <div className="flex flex-wrap gap-4">
        {loading ? (
          <Spinner className="m-4" />
        ) : (
          <>
            <Button
              startContent={
                <PlusIcon size={20} height={20} width={20} />
              }
              color="primary"
              onPress={onOpen}
            >Criar Sub-Equipe</Button>
            <Modal size="4xl" isOpen={true} placement="top-center" onOpenChange={onOpenChange}>
              <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Criar Sub-Equipe</ModalHeader>
                <ModalBody className="flex flex-row">
                  <div className="flex-1">
                    <Input
                      label='Nome da sub-equipe'
                      labelPlacement="outside"
                      startContent={
                        <FaTeamspeak />
                      }
                      required
                      placeholder="Nome da sub-equipe..."
                      type="text"
                    />
                  </div>
                  <div className="flex-1">
                    <p>Adicionar membros</p>
                    <Listbox>
                      {users.map((user) => (
                        <ListboxItem key={user.id}>
                          <div className="flex gap-2 items-center">
                            <Avatar
                              alt={user.userName}
                              className="flex-shrink-0"
                              size="sm"
                              src={`${process.env.baseUrl}/avatar/${user.id}/${user.avatar}`}
                            />
                            <div className="flex flex-col">
                              <span className="text-small">{user.userName}</span>
                              <span className="text-tiny text-default-400">{user.email}</span>
                            </div>
                          </div>
                        </ListboxItem>
                      ))}
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
            {team?.subTeams.map((subTeam) => (
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
                  <AvatarGroup max={15}>
                    {subTeam.user.map((user) => (
                      <Avatar
                        showFallback={user.avatar == ""}
                        key={user.id}
                        src={`${process.env.baseUrl}/avatar/${user.id}/${user.avatar}`}
                      />
                    ))}
                  </AvatarGroup>
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
          </>
        )}
      </div>
    </DefaultLayout>
  );
}
