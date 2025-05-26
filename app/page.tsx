'use client';

import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardHeader, useDisclosure } from "@heroui/react";
import DefaultLayout from "./_components/defaultLayout";
import Nav from "./_components/nav";
import { PlusIcon } from "./_components/plusIcon";
import ModalCreateTicket from "./_components/modalCreateTicket";
import TicketsTable from "./_components/ticketsTable";

export default function Home() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  return (
    <DefaultLayout>
      <Nav />
      <ModalCreateTicket
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
      />
      <div className="flex flex-col gap-4 px-4 pb-4">
        <h1>Bem-vindo ao Portal de Chamados da T.I Tirol</h1>
        <div>
          <Button
            color="primary"
            startContent={<PlusIcon size={20} width={20} height={20} />}
            onPress={() => onOpenChange()}
          >Abrir Chamado</Button>
        </div>
        <TicketsTable />
      </div>
    </DefaultLayout>
  );
}
