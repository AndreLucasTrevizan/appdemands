'use client';

import DefaultLayout from "@/app/_components/defaultLayout";
import FormNewDemand from "@/app/_components/formNewDemands";
import { BreadcrumbItem, Breadcrumbs, Card, CardBody, CardHeader, Divider, Link, Spacer } from "@heroui/react";

export default function NewDemandPage() {
  return (
    <DefaultLayout>
      <Breadcrumbs className="sticky top-0 self-start z-50 p-4 bg-white border-b-1 w-full">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/demands">Demandas</BreadcrumbItem>
        <BreadcrumbItem>Nova demanda</BreadcrumbItem>
      </Breadcrumbs>
      <div className="p-4">
        <FormNewDemand />
      </div>
    </DefaultLayout>
  );
}
