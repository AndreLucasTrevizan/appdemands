'use client';

import { BreadcrumbItem, Breadcrumbs, Card, CardBody, Divider, Tab, Tabs } from "@heroui/react";
import DefaultLayout from "../_components/defaultLayout";
import Nav from "../_components/nav";
import { FaUsers } from "react-icons/fa6";
import QueuesTable from "../_components/queuesTable";

export default function QueuesPage() {
  return (
    <DefaultLayout>
      <Nav />
      <div className="flex flex-col flex-wrap gap-4 px-4 pb-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem>Filas de Atendimento</BreadcrumbItem>
        </Breadcrumbs>
        <Divider />
        <div className="flex flex-col flex-wrap gap-4">
          <p className="text-justify">As filas de atendimento são as equipes que serão responsáveis por atender aos chamados.</p>
          <QueuesTable />
          {/* <Card>
            <CardBody>
              <Tabs variant="underlined">
                <Tab
                  key='membros'
                  title={
                    <div className="flex items-center space-x-2 ">
                      <FaUsers />
                      <span>Membros</span>
                    </div>
                  }
                >
                  
                </Tab>
              </Tabs>
            </CardBody>
          </Card> */}
        </div>
      </div>
    </DefaultLayout>
  );
}