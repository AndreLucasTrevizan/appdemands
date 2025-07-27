'use client';

import DefaultLayout from "@/app/_components/defaultLayout";
import Nav from "@/app/_components/nav";
import TicketSLASTable from "@/app/_components/ticketSLASTable";
import { BreadcrumbItem, Breadcrumbs, Divider } from "@heroui/react";

export default function Slas() {
  return (
    <DefaultLayout>
      <Nav />
      <div className="flex flex-col gap-4 px-4 pb-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/settings">Configurações</BreadcrumbItem>
          <BreadcrumbItem>SLAs</BreadcrumbItem>
        </Breadcrumbs>
        <Divider />
        <TicketSLASTable />
      </div>
    </DefaultLayout>
  );
}
