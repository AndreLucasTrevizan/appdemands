'use client';

import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import DefaultLayout from "../_components/defaultLayout";
import UsersTable from "../_components/usersTable";

export default function UsersPage() {
  return (
    <DefaultLayout>
      <Breadcrumbs className="sticky top-0 self-start z-50 p-4 bg-white border-b-1 w-full">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Usuários</BreadcrumbItem>
      </Breadcrumbs>
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-lg">Usuários</h1>
        <UsersTable />
      </div>
    </DefaultLayout>
  );
}