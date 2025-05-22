'use client';

import { BreadcrumbItem, Breadcrumbs, Divider } from "@heroui/react";
import DefaultLayout from "../_components/defaultLayout";
import UsersTable from "../_components/usersTable";
import Nav from "../_components/nav";

export default function UsersPage() {
  return (
    <DefaultLayout>
      <Nav />
      <div className="flex flex-col gap-4 px-4 pb-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem>Usuários</BreadcrumbItem>
        </Breadcrumbs>
        <Divider />
        <h1 className="text-lg">Usuários</h1>
        <UsersTable />
      </div>
    </DefaultLayout>
  );
}