'use client';

import DefaultLayout from "@/app/_components/defaultLayout";
import ErrorHandler from "@/app/_utils/errorHandler";
import { IUserProps } from "@/types";
import { addToast, BreadcrumbItem, Breadcrumbs, Card, CardBody, Divider } from "@heroui/react";
import { useEffect, useState } from "react";
import { gettingAllMembersFromSubTeam, ISubTeam, listSingleSubTeamInfo } from "../actions";


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
          description: errorHandler.error.message,
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
          description: errorHandler.error.message,
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
      <Breadcrumbs className="sticky top-0 self-start z-50 p-4 bg-white border-b-1 w-full">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/teams">Equipes</BreadcrumbItem>
        <BreadcrumbItem
          href={`/teams/${subTeam ? subTeam.team.slug : ''}`}
        >
          Equipe {subTeam ? subTeam.team.name : 'X'}
        </BreadcrumbItem>
        <BreadcrumbItem>Sub-Equipe {subTeam?.name}</BreadcrumbItem>
      </Breadcrumbs>
      <div className="p-4">
        <Card>
          <CardBody>
            
          </CardBody>
        </Card>
      </div>
    </DefaultLayout>
  );
}