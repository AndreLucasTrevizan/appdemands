import { Card, CardBody, CardFooter, CardHeader, Chip, Divider, Link } from "@heroui/react";
import { ITeams } from "../teams/actions";
import { FaTeamspeak } from "react-icons/fa6";
import { ISubTeam } from "../subteams/actions";

export default function SubTeamComponent({
  subTeam
}: {
  subTeam: ISubTeam
}) {
  return (
    <Card className="w-full lg:max-w-[32%]" key={subTeam.id}>
      <CardHeader className="flex gap-4 items-center">
        <FaTeamspeak size={45} />
        <div className="flex flex-col gap-2">
          <p className="text-base">{subTeam.name}</p>
          <p>@{subTeam.slug}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-col gap-4">
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
  );
}