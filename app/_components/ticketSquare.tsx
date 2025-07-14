'use client';

import { ITicketPriorityProps, IUsersReport } from "@/types";
import { IoIosAttach } from "react-icons/io";
import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Link,
} from "@heroui/react";

export default function TicketSquare({
  title,
  priority,
  files,
  user
}: {
  title: string,
  priority: ITicketPriorityProps | undefined,
  files: File[],
  user: IUsersReport | undefined
}) {
  return (
    <Card className="max-w-[50%] text-sm">
      <CardHeader>
        <span className="text-sm">{title}</span>
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-col justify-between items-start text-xs gap-2">
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-col items-center">
            <span>Prioridade</span>
            {priority ? (
              <Chip
                color={
                  priority.hours == 4 ? "danger" :
                  priority.hours == 8 ? "warning" :
                  priority.hours == 16 ? "primary" :
                  "success"
                }
                className="text-xs"
              >
                {priority.priorityName}
              </Chip>) : (
                <span>-</span>
              )}
          </div>
          <div className="flex flex-col items-center">
            <span>Status</span>
            <Chip color="success" className="text-xs">Novo</Chip>
          </div>
        </div>
        <Divider />
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-row items-center gap-2">
            <Avatar
              name={user?.userName}
              showFallback
              src={`${process.env.baseUrl}/avatar/${user?.id}/${user?.avatar}`}
            />
            <div className="flex flex-col">
              <span>{user?.userName}</span>
              <small>{user?.teamName}</small>
            </div>
          </div>
          {files.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-lg">{files.length}</span>
              <IoIosAttach size={20} />
            </div>
          )}
        </div>
      </CardBody>
      <Divider />
      <CardFooter>
        <Link href="#" className="text-sm">Ver detalhes</Link>
      </CardFooter>
    </Card>
  );
}
