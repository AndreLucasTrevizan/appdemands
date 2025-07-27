'use client';

import DefaultLayout from "@/app/_components/defaultLayout";
import Nav from "@/app/_components/nav";
import TicketPrioritiesTable from "@/app/_components/ticketPrioritiesTable";
import { BreadcrumbItem, Breadcrumbs, Divider } from "@heroui/react";

export default function TicketPriorities() {
  return (
    <DefaultLayout>
      <Nav />
      <div className="flex flex-col gap-4 px-4 pb-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/settings">Configurações</BreadcrumbItem>
          <BreadcrumbItem>Piroridades de Chamados</BreadcrumbItem>
        </Breadcrumbs>
        <Divider />
        <TicketPrioritiesTable />
      </div>
    </DefaultLayout>
  );
}
