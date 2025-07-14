'use client';

import {
  addToast,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Divider,
  Input,
  Spinner,
  Tooltip,
  useDisclosure
} from "@heroui/react";
import DefaultLayout from "../_components/defaultLayout";
import { useEffect, useMemo, useState } from "react";
import { ITeams, listPersonalTeams, listTeams } from "./actions";
import ErrorHandler from "../_utils/errorHandler";
import { PlusIcon } from "../_components/plusIcon";
import TeamComponent from "../_components/team";
import Nav from "../_components/nav";
import ModalCreateTeam from "../_components/modalCreateTeam";
import { FiRefreshCcw } from "react-icons/fi";
import { IUserSignedProps, useAuthContext } from "../_contexts/AuthContext";
import { gettingSigned } from "../_components/actions";
import { SearchIcon } from "../_components/searchIcon";

export default function TeamsPage() {
  const { userSigned } = useAuthContext();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [filterValuePersonalTeams, setFilterValuePersonalTeams] = useState<string>('');
  const [filterValueTeams, setFilterValueTeams] = useState<string>('');
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

  async function updateTeamsList() {
    try {
      setLoading(true);

      const teams = await listTeams();

      setTeams(teams);

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'Lista de equipes foi atualizada',
        timeout: 3000,
        shouldShowTimeoutProgress: true
      });

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
  
  async function updatePersonalTeamsList() {
    try {
      setLoadingPersonalTeams(true);

      const personalTeams = await listPersonalTeams();

      setPersonalTeams(personalTeams);

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'Sua lista de equipes foi atualizada',
        timeout: 3000,
        shouldShowTimeoutProgress: true
      });

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

  const filteredPersonalTeams = useMemo(() => {
      let filteredData = [ ...personalTeams ];

      filteredData = personalTeams.filter((team) => team.teamName.toLowerCase().includes(filterValuePersonalTeams.toLowerCase()));

      return filteredData;
    }, [ personalTeams, filterValuePersonalTeams ]);
  
  const filteredTeams = useMemo(() => {
    let filteredData = [ ...teams ];

    filteredData = teams.filter((team) => team.teamName.toLowerCase().includes(filterValueTeams.toLowerCase()));

    return filteredData;
  }, [ teams, filterValueTeams ]);

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
          <ModalCreateTeam
            teams={teams}
            setTeams={setTeams}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            onOpenChange={onOpenChange}
          />
          <div className="flex flex-row gap-4 items-center">
            <h2 className="text-lg">Minhas Equipes</h2>
            <Tooltip content="Atualizar minha lista de equipes">
              <Button isIconOnly variant="light" onPress={() => updatePersonalTeamsList()}>
                <FiRefreshCcw />
              </Button>
            </Tooltip>
            <Input
              className="max-w-[33%]"
              type="search"
              placeholder="Buscar equipe..."
              startContent={<SearchIcon />}
              value={filterValuePersonalTeams}
              onChange={(e) => setFilterValuePersonalTeams(e.target.value)}
            />
          </div>
          {loadingPersonalTeams ? (
            <div className="flex items-start p-8">
              <Spinner size="md" />
            </div>
          ) : (
            <div className="flex items-start">
              {personalTeams.length == 0 && <span>Você ainda não faz parte de nenhuma equipe</span>}
              {filteredPersonalTeams.map((team) => (
                <TeamComponent key={team.id} team={team} />
              ))}
            </div>
          )}
          <Divider />
          <h2 className="text-lg">Equipes disponíveis</h2>
          <div className="flex flex-row items-center gap-4">
            <Button
              color="primary"
              startContent={
                <PlusIcon size={20} height={20} width={20} />
              }
              onPress={() => onOpenChange()}
            >Criar Equipe</Button>
            <Tooltip content="Atualizar lista de equipes">
              <Button isIconOnly variant="light" onPress={() => updateTeamsList()}>
                <FiRefreshCcw />
              </Button>
            </Tooltip>
            <Input
              className="max-w-[33%]"
              type="search"
              placeholder="Buscar equipe..."
              startContent={<SearchIcon />}
              value={filterValueTeams}
              onChange={(e) => setFilterValueTeams(e.target.value)}
            />
          </div>
          {loading ? (
            <div className="flex items-start p-8">
              <Spinner size="md" />
            </div>
          ) : (
            (userSigned as IUserSignedProps)?.position.positionName == 'administrador' || (userSigned as IUserSignedProps)?.isAttendant ? (
              <div className="flex items-start justify-start gap-4 flex-wrap">
                {teams.length == 0 && <span>Nenhuma equipe disponível</span>}
                {filteredTeams.map((team) => (
                  <TeamComponent key={team.id} team={team} />
                ))}
              </div>
            ) : null
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
