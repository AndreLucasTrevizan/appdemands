'use client';

import DefaultLayout from "@/app/_components/defaultLayout";
import Nav from "@/app/_components/nav";
import TicketProcessTable from "@/app/_components/ticketProcessTable";
import { BreadcrumbItem, Breadcrumbs, Divider } from "@heroui/react";

export default function ProfileAuthorizations() {
  return (
    <DefaultLayout>
      <Nav />
      <div className="flex flex-col gap-4 px-4 pb-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/settings">Configurações</BreadcrumbItem>
          <BreadcrumbItem>Perfis de Autorização</BreadcrumbItem>
        </Breadcrumbs>
        <Divider />
      </div>
    </DefaultLayout>
  );
}
