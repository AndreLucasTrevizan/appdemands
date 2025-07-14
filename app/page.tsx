'use client';

import {
  Button,
  Divider,
  Tab,
  Tabs,
  Tooltip,
  useDisclosure
} from "@heroui/react";
import DefaultLayout from "./_components/defaultLayout";
import Nav from "./_components/nav";
import { PlusIcon } from "./_components/plusIcon";
import ModalCreateTicket from "./_components/modalCreateTicket";
import { LuLayoutGrid, LuLayoutList  } from "react-icons/lu";
import { FcInfo } from "react-icons/fc";
import TicketsTable from "./_components/ticketsTable";
import MyTeamInfo from "./_components/myTeamInfo";

export default function Home() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  return (
    <DefaultLayout>
      <Nav />
      <ModalCreateTicket
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
      />
      <div className="flex flex-col gap-4 px-4 pb-4">
        <h1>Bem-vindo ao Portal de Chamados da T.I Tirol</h1>
        <div>
          <Button
            color="primary"
            startContent={<PlusIcon size={20} width={20} height={20} />}
            onPress={() => onOpenChange()}
          >Abrir Chamado</Button>
        </div>
        <Divider />
        <Tabs
          variant="underlined"
        >
          <Tab
            title="Meus Chamados"
          >
            <div className="flex flex-col flax-wrap gap-4">
              <Tabs>
                <Tab
                  key={'grid'}
                  title={
                    <div className="flex items-center space-x-2">
                      <LuLayoutGrid />
                    </div>
                  }
                >

                </Tab>
                <Tab
                  key={'table'}
                  title={
                    <div className="flex items-center space-x-2">
                      <LuLayoutList  />
                    </div>
                  }
                >
                  <TicketsTable />
                </Tab>
              </Tabs>
            </div>
          </Tab>
          <Tab
            title={
              <div className="flex items-center space-x-2">
                <span>Chamados da Equipe</span>
                <Tooltip content="
                  Esses são os chamados da sua equipe para o T.I
                ">
                  <FcInfo />
                </Tooltip>
              </div>
            }
          >
            <Tabs>
              <Tab
                key={'grid'}
                title={
                  <div className="flex items-center space-x-2">
                    <LuLayoutGrid />
                  </div>
                }
              >

              </Tab>
              <Tab
                key={'table'}
                title={
                  <div className="flex items-center space-x-2">
                    <LuLayoutList  />
                  </div>
                }
              >
                <TicketsTable />
              </Tab>
            </Tabs>
          </Tab>
          <Tab
            key={'my_team'}
            title='Minhas Equipes'
          >
            <MyTeamInfo />
          </Tab>
        </Tabs>
      </div>
    </DefaultLayout>
  );
}
