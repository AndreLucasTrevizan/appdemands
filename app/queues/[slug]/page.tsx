'use client';

import DefaultLayout from "@/app/_components/defaultLayout";
import Nav from "@/app/_components/nav";
import ErrorHandler from "@/app/_utils/errorHandler";
import { IQueuesProps } from "@/types";
import { addToast, BreadcrumbItem, Breadcrumbs, Card, CardBody, Chip, Divider, Spinner, Tab, Tabs, Tooltip } from "@heroui/react";
import { useEffect, useState } from "react";
import { getQueueDetails } from "../actions";
import { FcInfo } from "react-icons/fc";
import { FaUsers } from "react-icons/fa6";
import QueueMembersTable from "@/app/_components/queueMembersTable";

export default function QueueDetailsPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [queue, setQueue] = useState<IQueuesProps>();

  useEffect(() => {
    async function loadQueueData() {
      try {
        setLoading(true);

        const { slug } = await params;

        const data = await getQueueDetails(slug);

        setQueue(data);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        const errorHandler = new ErrorHandler(error);

        addToast({
          color: 'warning',
          title: 'Aviso',
          description: errorHandler.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      }
    }

    loadQueueData();
  }, []);

  return (
    <DefaultLayout>
      <Nav />
      <div className="flex flex-col flex-wrap gap-4 px-4 pb-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/queues">Filas de Atendimento</BreadcrumbItem>
          <BreadcrumbItem>Fila de {queue?.queueName}</BreadcrumbItem>
        </Breadcrumbs>
        <Divider />
        {!queue ? (
          <div className="p-10">
            <Spinner size="md" />
          </div>
        ) : (
          <Card>
            <CardBody>
              <Tabs variant="underlined">
                <Tab
                  title={
                    <div className="flex items-center space-x-2">
                      <FcInfo />
                      <span>Informação</span>
                    </div>
                  }
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-1 items-center">
                      <span>Status: </span>
                      <Tooltip
                        content={queue.queueStatus == "ativo" ? "Pode receber chamados" : "Não pode receber chamados"}
                      >
                        <Chip
                          color={queue.queueStatus == "ativo" ? "success" : "danger"}
                        >{queue.queueStatus == "ativo" ? "Ativo" : "Desativada"}</Chip>
                      </Tooltip>
                    </div>
                    <span>Criada em: {new Date(queue.createdAt).toLocaleDateString('pt-br', { day: '2-digit', month: '2-digit', 'year': 'numeric' })}</span>
                  </div>
                </Tab>
                <Tab
                  title={
                    <div className="flex items-center space-x-2">
                      <FaUsers />
                      <span>Membros</span>
                    </div>
                  }
                >
                  <QueueMembersTable slug={queue.slug} />
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
        )}
      </div>
    </DefaultLayout>
  );
}
