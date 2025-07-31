'use client';

import { addToast, Button, Divider, Form, Input, Spinner, User } from "@heroui/react";
import { ChangeEvent, useCallback, useState } from "react";
import { IServiceCatalog, ITicketProps, IUsersReport } from "@/types";
import { attachingTicketFiles, createTicket } from "@/app/tickets/actions";
import { handleRegisterTicketWorklog } from "@/app/ticket_worklog/actions";
import ErrorHandler from "@/app/_utils/errorHandler";
import FileItem from "../fileItem";
import FormSendFiles from "../formSendFiles";
import { IUserSignedProps } from "@/app/_contexts/AuthContext";

export default function CriacaoDeUsuarioSAP({
  catalog,
  user,
  onClose
}: {
  catalog: IServiceCatalog,
  user?: IUserSignedProps,
  onClose: () => void,
}) {
  const [loading, setLoading] = useState(false);
  const [loadingSendingFiles, setLoadingSendingFiles] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [name, setName] = useState("");
  const [rhCode, setRhCode] = useState("");
  const [email, setEmail] = useState("");

  const handleCreateTicket = async () => {
        try {
          setLoading(true);

          let description = `${catalog.serviceDescription}Nome: ${name}\nCódigo do RH: ${rhCode}\nE-mail: ${email}`;

          const ticketData: ITicketProps = await createTicket({
            serviceCatalogId: catalog.id,
            description
          });

          addToast({
            color: 'success',
            title: 'Sucesso',
            description: 'Seu chamado foi aberto',
            timeout: 3000,
            shouldShowTimeoutProgress: true
          });

          if (files.length > 0) {
            setLoadingSendingFiles(true);

            await attachingTicketFiles(ticketData.id, files);
    
            await handleRegisterTicketWorklog(description, ticketData.id, undefined, files);

            addToast({
              color: 'success',
              title: 'Sucesso',
              description: 'Arquivos anexados',
              timeout: 3000,
              shouldShowTimeoutProgress: true
            });

            setFiles([]);
            onClose();
            setName("");
            setRhCode("");
            setEmail("");
            setLoading(false);
            setLoadingSendingFiles(false);
          } else {
            await handleRegisterTicketWorklog(description, ticketData.id, "true");

            setFiles([]);
            onClose();
            setName("");
            setRhCode("");
            setEmail("");
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          const errorHandler = new ErrorHandler(error);
          
          addToast({
            color: 'warning',
            title: 'Aviso',
            description: errorHandler.message,
            timeout: 3000,
            shouldShowTimeoutProgress: true
          });
        }
      }

      return (
        loading ? 
          <div className="flex justify-center p-4">
            <Spinner size="lg" label="Abrindo seu chamado..." />
          </div>  
        : 
          <Form className="flex flex-row flex-wrap gap-4">
            <Input
              value={name}
              onValueChange={setName}
              placeholder="Informe o nome completo do novo usuário"
              label="Nome Completo"
              labelPlacement="outside"
              isRequired
            />
            <div className="w-full flex flex-row gap-4 flex-wrap">
              <Input
                value={rhCode}
                onValueChange={setRhCode}
                placeholder="Informe o código de RH usuário"
                label="Código de RH"
                labelPlacement="outside"
                className="flex-1"
                isRequired
              />
              <Input
                value={email}
                onValueChange={setEmail}
                placeholder="Informe o e-mail do usuário"
                label="E-mail"
                type="email"
                labelPlacement="outside"
                className="flex-1"
                isRequired
              />
            </div>
            <Divider />
            <div className="flex flex-col items-start flex-wrap gap-4 w-full">
              <User
                name={user?.userName}
                description={`${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString('pt-br', { hour: '2-digit', minute: '2-digit' })}`}
                avatarProps={{
                  name: user?.userName,
                  showFallback: true,
                  src: `${process.env.baseUrl}/avatar/${user?.userSlug}/${user?.avatar}`
                }}
              />
              <span>{catalog.serviceDescription}</span>
              <span>Nome completo: {name}</span>
              <span>Código do RH: {rhCode}</span>
              <span>E-mail: {email}</span>
              <Divider />
              <FormSendFiles files={files} setFiles={setFiles} />
              <div className="flex flex-row gap-4 flex-wrap">
                <Button color="danger" variant="flat" onPress={() => {
                  onClose();
                }}>
                  Cancelar
                </Button>
                <Button
                  isDisabled={user?.isOnTeam != undefined ? user.isOnTeam == 1 ? false : true : false}
                  color="primary"
                  onPress={() => handleCreateTicket()}
                >
                  Criar chamado
                </Button>
              </div>
            </div>
          </Form>
      );
}
