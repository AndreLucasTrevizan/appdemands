'use client';

import { BreadcrumbItem, Breadcrumbs, Divider, Spacer } from "@heroui/react";
import DefaultLayout from "../_components/defaultLayout";
import DemandsTable from "../_components/demandsTable";
import Nav from "../_components/nav";

export default function DemandsPage() {
  return (
    <DefaultLayout>
      <Nav />
      <div className="flex flex-col gap-4 px-4 pb-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem>Demandas</BreadcrumbItem>
        </Breadcrumbs>
        <Divider />
        <h1 className="text-lg">Demandas</h1>
        <DemandsTable />
      </div>
    </DefaultLayout>
  );
}