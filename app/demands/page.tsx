'use client';

import { BreadcrumbItem, Breadcrumbs, Divider } from "@heroui/react";
import DefaultLayout from "../_components/defaultLayout";
import DemandsTable from "../_components/demandsTable";

export default function DemandsPage() {
  return (
    <DefaultLayout>
      <Breadcrumbs>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/demands">Demandas</BreadcrumbItem>
      </Breadcrumbs>
      <Divider />
      <h1>Demandas</h1>
      <DemandsTable />
    </DefaultLayout>
  );
}