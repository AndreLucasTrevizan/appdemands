'use client';

import {
  Card,
  CardBody,
  CardHeader,
  Spacer,
  User
} from "@heroui/react";
import DefaultLayout from "../_components/defaultLayout";
import Navbar from "../_components/navbar";

export default function SettingsPage() {
  return (
    <DefaultLayout>
      <Navbar />
      <Spacer y={8} />
      <Card>
        <CardHeader>
          <h1>Configurações</h1>
        </CardHeader>
        <CardBody>
          
        </CardBody>
      </Card>
    </DefaultLayout>
  );
}