'use client';

import DefaultLayout from "@/app/_components/defaultLayout";
import ErrorHandler from "@/app/_utils/errorHandler";
import { addToast, BreadcrumbItem, Breadcrumbs, Card, CardBody, Divider } from "@heroui/react";
import { useEffect, useState } from "react";


export default function SubTeamDetailsPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        let { slug } = await params;

        
        
        setLoading(false);
      } catch (error) {
        const errorHandler = new ErrorHandler(error);
        
        addToast({
          title: 'Aviso',
          description: errorHandler.error.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true
        });

        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumbs>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/subteams">Sub-Equipes</BreadcrumbItem>
        <BreadcrumbItem>Sub-Equipe X</BreadcrumbItem>
      </Breadcrumbs>
      <Divider />
      <Card>
        <CardBody>
          
        </CardBody>
      </Card>
    </DefaultLayout>
  );
}