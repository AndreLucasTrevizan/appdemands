'use client';

import { BreadcrumbItem, Breadcrumbs, Divider, Spacer } from "@heroui/react";
import DefaultLayout from "../_components/defaultLayout";
import DemandsTable from "../_components/demandsTable";

export default function DemandsPage() {
  return (
    <DefaultLayout>
      <Breadcrumbs className="sticky top-0 self-start z-50 p-4 bg-white border-b-1 w-full">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/demands">Demandas</BreadcrumbItem>
      </Breadcrumbs>
      <div className="flex flex-col gap-4 px-4 pb-4">
        <h1 className="text-lg">Demandas</h1>
        <DemandsTable />
      </div>
    </DefaultLayout>
  );
}