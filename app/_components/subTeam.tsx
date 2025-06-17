import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Link
} from "@heroui/react";
import { FaTeamspeak } from "react-icons/fa6";
import { ISubTeam, ISubTeamMine } from "../teams/[teamSlug]/subteams/actions";

export default function SubTeamComponent({
  teamSlug,
  subTeam
}: {
  teamSlug: string,
  subTeam: ISubTeam | ISubTeamMine
}) {
  return (
    <Card className="w-full lg:max-w-[32%]" key={subTeam.id}>
      <CardHeader className="flex gap-4 items-center">
        <FaTeamspeak size={45} />
        <div className="flex flex-col gap-2">
          <p className="text-base">{subTeam.subTeamName}</p>
          <p>@{subTeam.slug}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-col gap-4">
        <Chip
          color={subTeam.subTeamStatus == "ativo" ? "success" : "danger"}
          title={subTeam.subTeamStatus == "ativo" ? "Ativo" : "Inativo"}
          className="text-sm text-white"
        >
          {subTeam.subTeamStatus == "ativo" ? "Ativo" : "Inativo"}
        </Chip>
      </CardBody>
      <Divider />
      <CardFooter>
        <Link href={`/teams/${teamSlug}/subteams/${subTeam.slug}`} className="text-sm">Acessar</Link>
      </CardFooter>
    </Card>
  );
}