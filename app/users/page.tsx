'use client';

import { BreadcrumbItem, Breadcrumbs, Card, CardBody, Divider } from "@heroui/react";
import DefaultLayout from "../_components/defaultLayout";

export default function UsersPage() {
  return (
    <DefaultLayout>
      <Breadcrumbs>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Usuários</BreadcrumbItem>
      </Breadcrumbs>
      <Divider />
      <Card>
        <CardBody></CardBody>
      </Card>
    </DefaultLayout>
  );
}