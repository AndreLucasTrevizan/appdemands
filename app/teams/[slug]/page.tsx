'use client';

import {
  addToast,
  Avatar,
  AvatarGroup,
  BreadcrumbItem,
  Breadcrumbs,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Link,
  Spinner
} from "@heroui/react";
import { FaTeamspeak } from "react-icons/fa6";
import { useEffect, useState } from "react";
import DefaultLayout from "@/app/_components/defaultLayout";
import ErrorHandler from "@/app/_utils/errorHandler";
import { listSingleTeamInfo } from "./actions";
import { ITeams } from "../actions";

export default function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [team, setTeam] = useState<ITeams>();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        let { slug } = await params;

        const data = await listSingleTeamInfo(slug);

        setTeam(data);
        
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
