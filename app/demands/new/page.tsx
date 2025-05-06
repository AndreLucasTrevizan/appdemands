'use client';

import DefaultLayout from "@/app/_components/defaultLayout";
import FormNewDemand from "@/app/_components/formNewDemands";
import Navbar from "@/app/_components/navbar";
import { Card, CardBody, CardHeader, Spacer } from "@heroui/react";

export default function NewDemandPage() {
  return (
    <DefaultLayout>
      <Navbar />
      <Spacer y={4} />
      <Card>
        <CardHeader>
          <h1>Criar nova demanda</h1>
        </CardHeader>
        <CardBody>
          <FormNewDemand />
        </CardBody>
      </Card>
    </DefaultLayout>
  );
}
