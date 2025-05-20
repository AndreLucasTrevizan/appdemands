'use client';

import {
  addToast,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Spinner,
  useDisclosure
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
      <Breadcrumbs className="sticky top-0 self-start z-50 p-4 bg-white border-b-1 w-full">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/teams">Equipes</BreadcrumbItem>
        <BreadcrumbItem>Equipe {team?.name}</BreadcrumbItem>
      </Breadcrumbs>
      <div className="flex flex-col flex-wrap gap-4 px-4 pb-4">
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
      </div>
    </DefaultLayout>
  );
}
