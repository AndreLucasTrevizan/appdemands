'use client';

import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import DefaultLayout from "../_components/defaultLayout";

export default function PositionsPage() {
  return (
    <DefaultLayout>
      <Breadcrumbs className="sticky top-0 self-start z-50 p-4 border-b-1 w-full">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/positions">Funções de usuário</BreadcrumbItem>
      </Breadcrumbs>
      <div className="flex flex-col gap-4 px-4 pb-4">
        <h1 className="text-lg">Funções de Usuário</h1>

      </div>
    </DefaultLayout>
  );
}