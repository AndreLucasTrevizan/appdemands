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
  CardHeader,
  divider,
  Divider,
  Tab,
  Tabs
} from "@heroui/react";
import { IoMdAttach } from "react-icons/io";
import { useEffect, useState } from "react";
import { gettingAllMembersFromSubTeam, ISubTeam, listSingleSubTeamInfo } from "../actions";
import Nav from "@/app/_components/nav";
import { FaTasks } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import MembersTable from "@/app/_components/membersTable";


export default function SubTeamDetailsPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMembers, setLoadingMembers] = useState<boolean>(false);
  const [subTeam, setSubTeam] = useState<ISubTeam>();
  const [members, setMembers] = useState<IUserProps[]>([]);

  useEffect(() => {
    async function loadSubTeamData() {
      try {
        setLoading(true);

        let { slug } = await params;

        const data = await listSingleSubTeamInfo(slug);

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

        let { slug } = await params;

        const data = await gettingAllMembersFromSubTeam(slug);

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
          <BreadcrumbItem href={`/teams/${subTeam?.team.slug}`}>Equipe {subTeam?.team.name}</BreadcrumbItem>
          <BreadcrumbItem>Sub-equipe {subTeam?.name}</BreadcrumbItem>
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
              <MembersTable
                isTeam="false"
                isService={subTeam?.subTeamCategory.slug == "serviço" ? "true" : "false"}
                endpoint={`/subteams/${subTeam?.slug}/members`}
                params={params}
              />
            </Tab>
          </Tabs>
        </Card>
      </div>
    </DefaultLayout>
  );
}