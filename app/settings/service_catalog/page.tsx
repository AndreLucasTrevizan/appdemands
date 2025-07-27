'use client';

import DefaultLayout from "@/app/_components/defaultLayout";
import Nav from "@/app/_components/nav";
import ServiceCatalogCreateNewService from "@/app/_components/serviceCatalogCreateNewService";
import ServiceCatalogObligatoryFields from "@/app/_components/serviceCatalogFields";
import ServiceCatalogList from "@/app/_components/serviceCatalogList";
import { BreadcrumbItem, Breadcrumbs, Divider, Tab, Tabs } from "@heroui/react";

export default function ServiceCatalog() {
  return (
    <DefaultLayout>
      <Nav />
      <div className="flex flex-col gap-4 px-4 pb-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/settings">Configurações</BreadcrumbItem>
          <BreadcrumbItem>Catalogo de Serviços</BreadcrumbItem>
        </Breadcrumbs>
        <Divider />
        <Tabs
          variant="underlined"
        >
          <Tab
            key={'new_service'}
            title="Criar Novo Serviço"
          >
            <ServiceCatalogCreateNewService />
          </Tab>
          <Tab
            key={'list_service_catalog'}
            title="Ver Catalogo"
          >
            <ServiceCatalogList />
          </Tab>
          <Tab
            key={'service_catalog_obligatory_fields'}
            title="Campos Obrigatórios"
          >
            <ServiceCatalogObligatoryFields />
          </Tab>
        </Tabs>
      </div>
    </DefaultLayout>
  );
}
