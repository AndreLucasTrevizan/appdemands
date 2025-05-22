'use client';

import { BreadcrumbItem, Breadcrumbs, Divider, Input } from "@heroui/react";
import DefaultLayout from "../_components/defaultLayout";
import Nav from "../_components/nav";
import PositionTable from "../_components/positionsTable";

export default function PositionsPage() {
  return (
    <DefaultLayout>
      <Nav />
      <div className="flex flex-col gap-4 px-4 pb-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem>Funções de Usuário</BreadcrumbItem>
        </Breadcrumbs>
        <Divider />
        <h1 className="text-lg">Funções de Usuário</h1>
        <PositionTable />
      </div>
    </DefaultLayout>
  );
}
