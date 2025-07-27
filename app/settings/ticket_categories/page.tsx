'use client';

import DefaultLayout from "@/app/_components/defaultLayout";
import Nav from "@/app/_components/nav";
import TicketCategoriesTable from "@/app/_components/ticketCategoriesTable";
import { BreadcrumbItem, Breadcrumbs, Divider } from "@heroui/react";

export default function TicketCategories() {
  return (
    <DefaultLayout>
      <Nav />
      <div className="flex flex-col gap-4 px-4 pb-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/settings">Configurações</BreadcrumbItem>
          <BreadcrumbItem>Categorias de chamado</BreadcrumbItem>
        </Breadcrumbs>
        <Divider />
        <TicketCategoriesTable />
      </div>
    </DefaultLayout>
  );
}
