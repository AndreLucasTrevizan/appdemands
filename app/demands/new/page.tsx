'use client';

import DefaultLayout from "@/app/_components/defaultLayout";
import FormNewDemand from "@/app/_components/formNewDemands";
import Nav from "@/app/_components/nav";
import { BreadcrumbItem, Breadcrumbs, Card, CardBody, CardHeader, Divider, Link, Spacer } from "@heroui/react";

export default function NewDemandPage() {
  return (
    <DefaultLayout>
      <Nav />
      <div className="flex flex-col gap-4 px-4 pb-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem>Demandas</BreadcrumbItem>
        </Breadcrumbs>
        <Divider />
        <FormNewDemand />
      </div>
    </DefaultLayout>
  );
}
