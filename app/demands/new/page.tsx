'use client';

import DefaultLayout from "@/app/_components/defaultLayout";
import FormNewDemand from "@/app/_components/formNewDemands";
import { BreadcrumbItem, Breadcrumbs, Card, CardBody, CardHeader, Divider, Link, Spacer } from "@heroui/react";

export default function NewDemandPage() {
  return (
    <DefaultLayout>
      <Breadcrumbs>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/demands">Demandas</BreadcrumbItem>
        <BreadcrumbItem>Nova demanda</BreadcrumbItem>
      </Breadcrumbs>
      <Divider />
      <FormNewDemand />
    </DefaultLayout>
  );
}
