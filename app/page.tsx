'use client';

import { addToast, BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardHeader, Divider, Listbox, ListboxItem, useDisclosure } from "@heroui/react";
import DefaultLayout from "./_components/defaultLayout";
import Nav from "./_components/nav";
import { PlusIcon } from "./_components/plusIcon";
import ModalCreateTicket from "./_components/modalCreateTicket";
import TicketsTable from "./_components/ticketsTable";
import { useEffect, useState } from "react";
import { IUserSignedProps } from "./_contexts/AuthContext";
import ErrorHandler from "./_utils/errorHandler";
import { gettingSigned } from "./_components/actions";

export default function Home() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false);
  const [userSigned, setUserSigned] = useState<IUserSignedProps>();

  useEffect(() => {
    async function loadSignedUser() {
      try {
        setLoading(true);

        const signedInfo = await gettingSigned();

        setUserSigned(signedInfo);
        
        setLoading(false);
      } catch (error) {

        const errorHandler = new ErrorHandler(error);

        addToast({
          color: 'warning',
          title: 'Aviso',
          description: errorHandler.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      }
    }

    loadSignedUser();
  }, []);

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
        <div className="flex flex-row gap-2">
          
        </div>
      </div>
    </DefaultLayout>
  );
}
