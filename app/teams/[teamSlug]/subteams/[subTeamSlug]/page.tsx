'use client';

import DefaultLayout from "@/app/_components/defaultLayout";
import ErrorHandler from "@/app/_utils/errorHandler";
import { IUserProps } from "@/types";
import {
  addToast,
  BreadcrumbItem,
  Breadcrumbs,
  Card,
  CardBody,
  Divider,
  Tab,
  Tabs
} from "@heroui/react";
import { useEffect, useState } from "react";
import Nav from "@/app/_components/nav";
import { FaTasks } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import MembersTable from "@/app/_components/membersTable";
import { gettingAllMembersFromSubTeam, ISubTeam, listSingleSubTeamInfo } from "../actions";

export default function SubTeamDetailsPage({
  params
}: {
  params: Promise<{ subTeamSlug: string }>
}) {
  const [paramsData, setParamsData] = useState<{ teamSlug: string, subTeamSlug: string }>({ teamSlug: '', subTeamSlug: ''});
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMembers, setLoadingMembers] = useState<boolean>(false);
  const [subTeam, setSubTeam] = useState<ISubTeam>();
  const [members, setMembers] = useState<IUserProps[]>([]);

  useEffect(() => {
    async function loadSubTeamData() {
      try {
        setLoading(true);

        let { subTeamSlug } = await params;

        setParamsData({ teamSlug: '', subTeamSlug });

        const data = await listSingleSubTeamInfo(subTeamSlug);

        setSubTeam(data);
        
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

    async function loadSubTeamMembers() {
      try {
        setLoadingMembers(true);

        let { subTeamSlug } = await params;

        const data = await gettingAllMembersFromSubTeam(subTeamSlug);

        setMembers(data);

        setLoadingMembers(false);
      } catch (error) {
        const errorHandler = new ErrorHandler(error);
        
        addToast({
          title: 'Aviso',
          description: errorHandler.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true
        });

        setLoadingMembers(false);
      }
    }

    loadSubTeamData();
    loadSubTeamMembers();
  }, []);

  return (
    <DefaultLayout>
      <Nav />
      <div className="flex flex-col gap-4 px-4 pb-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/teams">Equipes</BreadcrumbItem>
          <BreadcrumbItem href={`/teams/${subTeam?.team.slug}`}>Equipe {subTeam?.team.teamName}</BreadcrumbItem>
          <BreadcrumbItem>Sub-equipe {subTeam?.subTeamName}</BreadcrumbItem>
        </Breadcrumbs>
        <Divider />
        <Card className="p-2">
          <Tabs aria-label="Options" variant="underlined">
            <Tab
              key='tramites'
              title={
                <div className="flex items-center space-x-2 ">
                  <FaTasks />
                  <span>Tickets</span>
                </div>
              }
            >
              <CardBody>

              </CardBody>
            </Tab>
            <Tab
              key='membros'
              title={
                <div className="flex items-center space-x-2">
                  <FaUsers />
                  <span>Membros</span>
                </div>
              }
            >
              {subTeam && (
                <MembersTable
                  isTeam="false"
                  isService={subTeam.subTeamCategory.slug == "serviço" ? "true" : "false"}
                  endpoint={`/subteams/${subTeam.slug}/members`}
                  params={paramsData}
                />
              )}
            </Tab>
          </Tabs>
        </Card>
      </div>
    </DefaultLayout>
  );
}