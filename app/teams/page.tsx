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
  Link,
  Spacer,
  Spinner
} from "@heroui/react";
import DefaultLayout from "../_components/defaultLayout";
import { FaTeamspeak } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { ITeams, listPersonalTeams, listTeams } from "./actions";
import ErrorHandler from "../_utils/errorHandler";
import { PlusIcon } from "../_components/plusIcon";
import TeamComponent from "../_components/team";
import Nav from "../_components/nav";

export default function TeamsPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPersonalTeams, setLoadingPersonalTeams] = useState<boolean>(false);
  const [personalTeams, setPersonalTeams] = useState<ITeams[]>([]);
  const [teams, setTeams] = useState<ITeams[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const teams = await listTeams();

        setTeams(teams);

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

    async function loadPersonalTeamsData() {
      try {
        setLoadingPersonalTeams(true);

        const personalTeams = await listPersonalTeams();

        setPersonalTeams(personalTeams);

        setLoadingPersonalTeams(false);
      } catch (error) {
        const errorHandler = new ErrorHandler(error);

        addToast({
          title: 'Aviso',
          description: errorHandler.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true
        });

        setLoadingPersonalTeams(false);
      }
    }

    loadData();
    loadPersonalTeamsData()
  }, []);

  return (
    <DefaultLayout>
      <Nav />
      <div className="flex flex-col flex-wrap gap-4 px-4 pb-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem>Equipes</BreadcrumbItem>
        </Breadcrumbs>
        <Divider />
        <div className="flex flex-col gap-4">
          <h2 className="text-lg">Minhas Equipes</h2>
          {loadingPersonalTeams ? (
            <div className="flex items-start">
              <Spinner size="md" />
            </div>
          ) : (
            <div className="flex items-start">
              {personalTeams.length == 0 && <span>Você ainda não faz parte de nenhuma equipe</span>}
              {personalTeams.map((team) => (
                <TeamComponent key={team.id} team={team} />
              ))}
            </div>
          )}
          <Divider />
          <h2 className="text-lg">Equipes disponíveis</h2>
          <div>
            <Button
              color="primary"
              startContent={
                <PlusIcon size={20} height={20} width={20} />
              }
            >Criar Equipe</Button>
          </div>
          {loading ? (
            <div className="flex items-start">
              <Spinner size="md" />
            </div>
          ) : (
            <div className="flex items-start justify-start gap-4 flex-wrap">
              {teams.length == 0 && <span>Nenhuma equipe disponível</span>}
              {teams.map((team) => (
                <TeamComponent key={team.id} team={team} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
