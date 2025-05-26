'use client';

import { BreadcrumbItem, Breadcrumbs, Divider, Tab, Tabs } from "@heroui/react";
import DefaultLayout from "../_components/defaultLayout";
import UsersTable from "../_components/usersTable";
import Nav from "../_components/nav";
import AttendantsTable from "../_components/attendantsTable";

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
        <Tabs
          variant="underlined"
        >
          <Tab
            key={'padrões'}
            title="Padrão"
          >
            <UsersTable />
          </Tab>
          <Tab
            key={'atendentes'}
            title="Atendentes"
          >
            <AttendantsTable />
          </Tab>
        </Tabs>
      </div>
    </DefaultLayout>
  );
}