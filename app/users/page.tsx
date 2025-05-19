'use client';

import { BreadcrumbItem, Breadcrumbs, Card, CardBody, Divider } from "@heroui/react";
import DefaultLayout from "../_components/defaultLayout";

export default function UsersPage() {
  return (
    <DefaultLayout>
      <Breadcrumbs className="sticky top-0 self-start z-50 p-4 bg-white border-b-1 w-full">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Usuários</BreadcrumbItem>
      </Breadcrumbs>
      <div className="p-4">
        <Card>
          <CardBody></CardBody>
        </Card>
      </div>
    </DefaultLayout>
  );
}