'use client';

import DefaultLayout from "@/app/_components/defaultLayout";
import Nav from "@/app/_components/nav";
import { BreadcrumbItem, Breadcrumbs, Divider } from "@heroui/react";

export default function QueueDetailsPage() {
  return (
    <DefaultLayout>
      <Nav />
      <div className="flex flex-col flex-wrap gap-4 px-4 pb-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/queues">Filas de Atendimento</BreadcrumbItem>
          <BreadcrumbItem>Fila de Dispatcher</BreadcrumbItem>
        </Breadcrumbs>
        <Divider />
      </div>
    </DefaultLayout>
  );
}
