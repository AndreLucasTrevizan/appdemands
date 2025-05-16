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
  Spacer,
  Spinner
} from "@heroui/react";
import DefaultLayout from "../_components/defaultLayout";
import { FaTeamspeak } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { ITeams, listTeams } from "./actions";
import ErrorHandler from "../_utils/errorHandler";

export default function TeamsPage() {
  const [loading, setLoading] = useState<boolean>(false);
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
        <BreadcrumbItem>Equipes</BreadcrumbItem>
      </Breadcrumbs>
      <Divider />
      <div className="flex flex-wrap gap-4">
        {loading ? (
          <Spinner className="m-4" />
        ) : (
          <>
            {teams.map((team) => (
              <Card className="w-1/6" key={team.id}>
                <CardHeader className="flex gap-4 items-center">
                  <FaTeamspeak size={45} />
                  <div className="flex flex-col gap-2">
                    <p className="text-base">{team.name}</p>
                    <p>@{team.slug}</p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="flex flex-col gap-4">
                  <AvatarGroup max={15}>
                    {team.subTeams.map((subTeam) => (
                      subTeam.user.map((user) => (
                        <Avatar
                          showFallback={user.avatar == ""}
                          key={user.id}
                          src={`${process.env.baseUrl}/avatar/${user.id}/${user.avatar}`}
                        />
                      ))
                    ))}
                  </AvatarGroup>
                  <Chip
                    color={team.status == "disponivel" ? "success" : "danger"}
                    title="Disponível"
                    className="text-sm text-white"
                  >
                    {team.status == "disponivel" ? "Disponivel" : "Indisponivel"}
                  </Chip>
                </CardBody>
                <Divider />
                <CardFooter>
                  <Link href={`/teams/${team.slug}`} className="text-sm">Acessar</Link>
                </CardFooter>
              </Card>
            ))}
          </>
        )}
      </div>
    </DefaultLayout>
  );
}
