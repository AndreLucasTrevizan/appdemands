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
  Tooltip,
  useDisclosure,
  User
} from "@heroui/react";
import { useEffect, useState } from "react";
import DefaultLayout from "@/app/_components/defaultLayout";
import ErrorHandler from "@/app/_utils/errorHandler";
import { ITeams, listSingleTeamInfo, listTeamMembers } from "../actions";
import { PlusIcon } from "@/app/_components/plusIcon";
import { ISubTeam } from "@/app/subteams/actions";
import TeamComponent from "@/app/_components/team";
import ModalCreateSubTeam from "@/app/_components/modalCreateSubTeam";
import SubTeamComponent from "@/app/_components/subTeam";
import Nav from "@/app/_components/nav";
import { FaTeamspeak, FaUsers } from "react-icons/fa6";
import { SearchIcon } from "@/components/icons";
import { FaTasks } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { ITeamMember, IUserProps } from "@/types";
import MembersTable from "@/app/_components/membersTable";

export default function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUpdateSubTeams, setLoadingUpdateSubTeams] = useState<boolean>(false);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState<boolean>(false);
  const [team, setTeam] = useState<ITeams>();
  const [subTeams, setSubTeams] = useState<ISubTeam[]>([]);
  const [members, setMembers] = useState<ITeamMember[]>([]);

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
            description: errorHandler.message,
            timeout: 3000,
            shouldShowTimeoutProgress: true
          });
  
          setLoading(false);
        }
      }

      async function loadMembersData() {
        try {
          setLoadingTeamMembers(true);

          let { slug } = await params;

          const data = await listTeamMembers(slug);

          setMembers(data);

          setLoadingTeamMembers(false);
        } catch (error) {
          setLoadingTeamMembers(false);
          const errorHandler = new ErrorHandler(error);
          
          addToast({
            title: 'Aviso',
            description: errorHandler.message,
            timeout: 3000,
            shouldShowTimeoutProgress: true
          });
        }
      }
  
      loadData();
      loadMembersData();
    }, []);

    async function updateSubTeamsList() {
      try {
        setLoadingUpdateSubTeams(true);

        let { slug } = await params;

        const data = await listSingleTeamInfo(slug);

        setTeam(data);
        setSubTeams(data.subTeams);

        addToast({
          color: 'success',
          title: 'Sucesso',
          description: 'A lista de sub-equipes foi atualizada',
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
  
        setLoadingUpdateSubTeams(false);
      } catch (error) {
        const errorHandler = new ErrorHandler(error);

        addToast({
          title: 'Aviso',
          description: errorHandler.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true
        });

        setLoadingUpdateSubTeams(false);
      }
    }

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
              key={'tickets'}
              title={
                <div className="flex items-center space-x-2">
                  <FaTasks />
                  <span>Tickets</span>
                </div>
              }
            >
              <CardBody>

              </CardBody>
            </Tab>
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
                    <div className="flex gap-2 items-center">
                      <Button
                        startContent={
                          <PlusIcon size={20} height={20} width={20} />
                        }
                        color="primary"
                        onPress={onOpen}
                      >Criar Sub-Equipe</Button>
                      <Tooltip content="Atualizar lista de sub-equipes">
                        <Button isIconOnly variant="light" onPress={() => updateSubTeamsList()}>
                          <FiRefreshCcw />
                        </Button>
                      </Tooltip>
                    </div>
                    <ModalCreateSubTeam
                      isOpen={isOpen}
                      onOpen={onOpen}
                      onClose={onClose}
                      onOpenChange={onOpenChange}
                      params={params}
                      subTeams={subTeams}
                      setSubTeams={setSubTeams}
                    />
                    <div className="max-w-[100%] flex flex-wrap gap-4">
                      {loadingUpdateSubTeams ? (
                        <div className="p-4">
                          <Spinner size="md" />
                        </div>
                      ) : (
                        subTeams.map((subTeam) => (
                          <SubTeamComponent key={subTeam.id} subTeam={subTeam} />
                        ))
                      )}
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
              <MembersTable params={params} />
            </Tab>
          </Tabs>
        </Card>
      </div>
    </DefaultLayout>
  );
}
