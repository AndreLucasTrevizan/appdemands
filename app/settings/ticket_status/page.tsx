'use client';

import DefaultLayout from "@/app/_components/defaultLayout";
import Nav from "@/app/_components/nav";
import TicketStatusTable from "@/app/_components/ticketStatusTable";
import { BreadcrumbItem, Breadcrumbs, Divider } from "@heroui/react";

export default function TicketStatus() {
  return (
    <DefaultLayout>
      <Nav />
      <div className="flex flex-col gap-4 px-4 pb-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/settings">Configurações</BreadcrumbItem>
          <BreadcrumbItem>Status de Chamados</BreadcrumbItem>
        </Breadcrumbs>
        <Divider />
        <TicketStatusTable />
      </div>
    </DefaultLayout>
  );
}
