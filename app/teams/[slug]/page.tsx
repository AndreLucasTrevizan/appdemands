'use client';

import {
  addToast,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  Divider,
  Input,
  Listbox,
  ListboxItem,
  Spinner,
  Tab,
  Tabs,
  useDisclosure,
  User
} from "@heroui/react";
import { useEffect, useState } from "react";
import DefaultLayout from "@/app/_components/defaultLayout";
import ErrorHandler from "@/app/_utils/errorHandler";
import { ITeams, listSingleTeamInfo } from "../actions";
import { PlusIcon } from "@/app/_components/plusIcon";
import { ISubTeam } from "@/app/subteams/actions";
import TeamComponent from "@/app/_components/team";
import ModalCreateSubTeam from "@/app/_components/modalCreateSubTeam";
import SubTeamComponent from "@/app/_components/subTeam";
import Nav from "@/app/_components/nav";
import { FaTeamspeak, FaUsers } from "react-icons/fa6";
import { SearchIcon } from "@/components/icons";

export default function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false);
  const [team, setTeam] = useState<ITeams>();
  const [subTeams, setSubTeams] = useState<ISubTeam[]>([]);
  const [subTeamCreated, setSubTeamCreated] = useState<boolean>(false);

  useEffect(() => {
      async function loadData() {
        try {
          setLoading(true);
  
          let { slug } = await params;
  
          const data = await listSingleTeamInfo(slug);
  
          setTeam(data);
          setSubTeams(data.subTeams);
   
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
      <Nav />
      <div className="flex flex-col flex-wrap gap-4 px-4 pb-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/teams">Equipes</BreadcrumbItem>
          <BreadcrumbItem>Equipe {team?.name}</BreadcrumbItem>
        </Breadcrumbs>
        <Divider />
        <Card>
          <Tabs variant="underlined">
            <Tab
              key='sub-equipes'
              title={
                <div className="flex items-center space-x-2 ">
                  <FaTeamspeak />
                  <span>Sub-equipes</span>
                </div>
              }
            >
              <CardBody>
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
                    <ModalCreateSubTeam
                      isOpen={isOpen}
                      onOpen={onOpen}
                      onClose={onClose}
                      onOpenChange={onOpenChange}
                      params={params}
                      subTeamCreated={subTeamCreated}
                      setSubTeamCreated={setSubTeamCreated}
                    />
                    <div className="max-w-[100%] flex flex-wrap gap-4">
                      {subTeams.map((subTeam) => (
                        <SubTeamComponent key={subTeam.id} subTeam={subTeam} />
                      ))}
                    </div>
                  </div>
                )}
              </CardBody>
            </Tab>
            <Tab
              key='membros'
              title={
                <div className="flex items-center space-x-2 ">
                  <FaUsers />
                  <span>Membros</span>
                </div>
              }
            >
              <CardBody className="flex flex-col gap-4">
                <Input
                  type="search"
                  startContent={<SearchIcon />}
                  className="max-w-[40%]"
                  placeholder="Buscar..."
                />
                <Divider />
                <Listbox selectionMode="none" className="max-w-[40%]">
                  <ListboxItem>
                    <div
                      className="flex justify-between items-center"
                    >
                      <User
                        avatarProps={{
                          name: "Andre",
                          src: "",
                          showFallback: true
                        }}
                        name="André Lucas"
                        description="@andrelucas"
                      />
                      <div className="flex flex-col">
                        <small>Equipe</small>
                        <span>Sistemas</span>
                      </div>
                    </div>
                  </ListboxItem>
                </Listbox>
              </CardBody>
            </Tab>
          </Tabs>
        </Card>
      </div>
    </DefaultLayout>
  );
}
