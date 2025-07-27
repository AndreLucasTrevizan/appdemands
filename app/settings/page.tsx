'use client';

import {
  BreadcrumbItem,
  Breadcrumbs,
  Card,
  CardBody,
  Divider,
} from "@heroui/react";
import DefaultLayout from "../_components/defaultLayout";
import { BiCategory } from "react-icons/bi";
import { MdOutlinePriorityHigh } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import { VscServerProcess } from "react-icons/vsc";
import { GrCatalog } from "react-icons/gr";
import Nav from "../_components/nav";
import { FiClock, FiUser } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <DefaultLayout>
      <Nav />
      <div className="flex flex-col gap-4 px-4 pb-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem>Configurações</BreadcrumbItem>
        </Breadcrumbs>
        <Divider />
        <div className="w-full flex flex-row gap-4 flex-wrap">
          <Card isPressable onPress={() => router.push('/settings/my_account')} className="w-64 hover:underline cursor-pointer flex flex-col items-center text-center">
            <CardBody className="flex flex-col gap-4 items-center justify-center">
              <FiUser size={30} />
              <span>Minha conta</span>
            </CardBody>
          </Card>
          <Card isPressable onPress={() => router.push('/settings/slas')} className="w-64 hover:underline cursor-pointer flex flex-col items-center text-center">
            <CardBody className="flex flex-col gap-4 items-center justify-center">
              <FiClock size={30} />
              <span>SLA's</span>
            </CardBody>
          </Card>
          <Card isPressable onPress={() => router.push('/settings/ticket_categories')} className="w-64 hover:underline cursor-pointer flex flex-col items-center text-center">
            <CardBody className="flex flex-col gap-4 items-center justify-center">
              <BiCategory size={30} />
              <span>Categoria dos Chamados</span>
            </CardBody>
          </Card>
          <Card isPressable onPress={() => router.push('/settings/ticket_priorities')} className="w-64 hover:underline cursor-pointer flex flex-col items-center text-center">
            <CardBody className="flex flex-col gap-4 items-center justify-center">
              <MdOutlinePriorityHigh size={30} />
              <span>Prioridade dos Chamados</span>
            </CardBody>
          </Card>
          <Card isPressable onPress={() => router.push('/settings/ticket_status')} className="w-64 hover:underline cursor-pointer flex flex-col items-center text-center">
            <CardBody className="flex flex-col gap-4 items-center justify-center">
              <GrStatusGood size={30} />
              <span>Status dos Chamados</span>
            </CardBody>
          </Card>
          <Card isPressable onPress={() => router.push('/settings/ticket_process')} className="w-64 hover:underline cursor-pointer flex flex-col items-center text-center">
            <CardBody className="flex flex-col gap-4 items-center justify-center">
              <VscServerProcess size={30} />
              <span>Processo dos Chamados</span>
            </CardBody>
          </Card>
          <Card isPressable onPress={() => router.push('/settings/service_catalog')} className="w-64 hover:underline cursor-pointer flex flex-col items-center text-center">
            <CardBody className="flex flex-col gap-4 items-center justify-center">
              <GrCatalog size={30} />
              <span>Catalogo de Serviços</span>
            </CardBody>
          </Card>
        </div>
      </div>
    </DefaultLayout>
  );
}
