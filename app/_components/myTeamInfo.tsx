'use client';

import { addToast, Card, CardBody, CardHeader, Divider, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { ISubTeamMine, listUserSubTeams } from "../teams/[teamSlug]/subteams/actions";
import ErrorHandler from "../_utils/errorHandler";
import SubTeamComponent from "./subTeam";

export default function MyTeamInfo() {
  const [loading, setLoading] = useState<boolean>(false);
  const [subTeams, setSubTeams] = useState<ISubTeamMine[]>([]);

  useEffect(() => {
    async function loadSbubTeamsData() {
      try {
        setLoading(true);

        const data = await listUserSubTeams();

        setSubTeams(data);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        const errorHandler = new ErrorHandler(error);

        addToast({
          color: 'warning',
          title: 'Aviso',
          description: errorHandler.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true
        });
      }
    }

    loadSbubTeamsData();
  }, []);

  return (
    <div className="flex flex-row flex-wrap gap-4 p-4">
      {loading ? (
        <div className="p-10">
          <Spinner size="md" />
        </div>
      ) : (
        subTeams.length > 0 ? (
          subTeams.map((subTeam) => (
            <SubTeamComponent key={subTeam.id} subTeam={subTeam} teamSlug={subTeam.teamSlug} />
          ))
        ) : (
          <small>Você não foi atribuido a nenhuma equipe</small>
        )
      )}
    </div>
  );
}
