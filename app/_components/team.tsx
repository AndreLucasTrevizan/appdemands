import { Card, CardBody, CardFooter, CardHeader, Chip, Divider, Link } from "@heroui/react";
import { ITeams } from "../teams/actions";
import { FaTeamspeak } from "react-icons/fa6";

export default function TeamComponent({
  team
}: {
  team: ITeams
}) {
  return (
    <Card className="w-[32%]" key={team.id}>
      <CardHeader className="flex gap-4 items-center">
        <FaTeamspeak size={45} />
        <div className="flex flex-col gap-2">
          <p className="text-base">{team.name}</p>
          <p>@{team.slug}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-col gap-4">
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
  );
}