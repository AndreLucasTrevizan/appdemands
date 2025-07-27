'use client';

import { ITicketProps, ITicketReportProps, ITicketWorklogProps } from "@/types";
import { addToast, Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Snippet, Spinner, Textarea, Tooltip, User } from "@heroui/react";
import ChipPriority from "./chipPriority";
import { phoneMasked, whatsMasked } from "../_utils/masks";
import { FiPhone, FiSend } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ErrorHandler from "../_utils/errorHandler";
import { gettingTicketWorklog } from "../tickets/actions";
import { GrAttachment } from "react-icons/gr";
import FormSendFiles from "./formSendFiles";

export default function ModalTicketDetails({
  isOpen,
  onOpen,
  onClose,
  onOpenChange,
  ticket,
  setSelectedTicket
}: {
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onOpenChange: () => void,
  ticket: ITicketProps,
  setSelectedTicket: Dispatch<SetStateAction<ITicketReportProps>>
}) {
  const [loadingWorklog, setLoadingWorklog] = useState<boolean>(false);
  const [loadingSendTicketWorklog, setLoadingSendTicketWorklog] = useState<boolean>(false);
  const [worklog, setWorklog] = useState<ITicketWorklogProps[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    async function loadTicketWorklog() {
      try {
        setLoadingWorklog(true);
        const worklogData = await gettingTicketWorklog({ ticketId: String(ticket.id) });

        setWorklog(worklogData);
        setLoadingWorklog(false);
      } catch (error) {
        setLoadingWorklog(false);
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

    loadTicketWorklog();
  }, []);

  async function sendTicketWorklog() {
    try {
      setLoadingSendTicketWorklog(true);



      setLoadingSendTicketWorklog(false);
    } catch (error) {
      setLoadingSendTicketWorklog(false);
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

  return (
    <Modal
      size="full"
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      closeButton
      onClose={() => {
        setSelectedTicket(undefined);

        onClose();
      }}
    >
      <ModalContent className="overflow-scroll scrollbar-hide">
        <ModalHeader>
          <h1>{ticket.id} - {ticket.ticketTitle}</h1>
        </ModalHeader>
        <Divider />
        <ModalBody>
          <div className="w-full h-full flex flex-row flex-wrap gap-4">
            <div className="flex flex-1 flex-col flex-wrap gap-4">
              <Textarea
                value={ticket.ticketDescription ?? ""}
                readOnly
                label="Descrição da Solicitação"
                labelPlacement="outside"
              />
              <div className="flex flex-row flex-wrap gap-4">
                <div className="flex flex-row w-full gap-4">
                  <Input
                    value={ticket.ticketCategory ?? ""}
                    label="Categoria"
                    labelPlacement="outside"
                    readOnly
                  />
                  <div className="flex flex-col items-center">
                    <span className="mb-1">Prioridade</span>
                    <ChipPriority name={ticket.ticketPriority} time={ticket.ticketSLA} />
                  </div>
                  <Input
                    value={ticket.ticketStatus ?? ""}
                    label="Status"
                    labelPlacement="outside"
                    readOnly
                  />
                </div>
                <Input
                  value={ticket.queueName ?? ""}
                  label="Fila"
                  labelPlacement="outside"
                  readOnly
                />
                <div className="flex flex-row w-full gap-4">
                  <Input
                    value={ticket.teamName ?? ""}
                    label="Equipe"
                    labelPlacement="outside"
                    readOnly
                  />
                  <Input
                    value={ticket.subTeamName ?? ""}
                    label="Sub-equipe"
                    labelPlacement="outside"
                    readOnly
                  />
                </div>
                <div className="flex flex-row gap-4 flex-wrap">
                  
                </div>
              </div>
              <Divider />
              <div className="flex flex-row flex-wrap justify-around gap-4 w-full">
                <div className="flex flex-col items-center gap-4">
                  <span>Aberto por</span>
                  <User
                    name={ticket.userName}
                    description={ticket.userSlug}
                    avatarProps={{
                      name: ticket.userName,
                      showFallback: true,
                      src: `${process.env.baseUrl}/avatar/${ticket.userSlug}/${ticket.avatar}`
                    }}
                  />
                  {ticket.userPhoneNumber && (
                    <div className="flex flex-row gap-2 items-center">
                      <FiPhone />
                      {phoneMasked(ticket.userPhoneNumber)}
                    </div>
                  )}
                  {ticket.userWhatsNumber && (
                    <div className="flex flex-row gap-2 items-center">
                      <FaWhatsapp />
                      {whatsMasked(ticket.userWhatsNumber)}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center gap-4">
                  <span>Em atendimento por</span>
                  <User
                    name={ticket.userName}
                    description={ticket.userSlug}
                    avatarProps={{
                      name: ticket.userName,
                      showFallback: true,
                      src: `${process.env.baseUrl}/avatar/${ticket.userSlug}/${ticket.avatar}`
                    }}
                  />
                </div>
              </div>
            </div>
            <Divider orientation="vertical" />
            <div className="flex flex-1 flex-col flex-wrap gap-4">
              {loadingWorklog ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <Spinner size="lg" label="Carregando worklog..." />
                </div>
              ) : (
                <div className="flex flex-col gap-4 h-full">
                  {worklog.map((item) => (
                    <div className="h-full flex-1 overflow-scroll scrollbar-hidden" key={item.id}>
                      {item.userName ? (
                        <User
                          name={item.userName}
                        description={`${new Date(item.createdAt).toLocaleDateString('pt-br')} - ${new Date(item.createdAt).toLocaleTimeString('pt-br', { hour: '2-digit', minute: '2-digit' })}`}
                          avatarProps={{
                            name: item.userName,
                            showFallback: true,
                            src: `${process.env.baseUrl}/avatar/${item.userSlug}/${item.userAvatar}`
                          }}
                        />
                      ) : (
                        <User
                          name={item.attendantName}
                          description={`${new Date(item.createdAt).toLocaleDateString('pt-br')} - ${new Date(item.createdAt).toLocaleTimeString('pt-br', { hour: '2-digit', minute: '2-digit' })}`}
                          avatarProps={{
                            name: item.attendantName,
                            showFallback: true,
                            src: `${process.env.baseUrl}/avatar/${item.attendantSlug}/${item.attendantAvatar}`
                          }}
                        />
                      )}
                      <Textarea
                        className="mt-4"
                        value={item.worklogDesc}
                      />
                    </div>
                  ))}
                  <div className="flex flex-col gap-4">
                    <Divider />
                    <Textarea
                      size="sm"
                      variant="underlined"
                      placeholder="Responder no worklog do chamado..."
                    />
                    <FormSendFiles
                      files={files}
                      setFiles={setFiles}
                    />
                    <div className="flex flex-row justify-between gap-4 flex-wrap">
                      <Button color="danger" variant="flat" onPress={() => {
                        setSelectedTicket(undefined);

                        onClose();
                      }}>
                        Fechar
                      </Button>
                      <div className="flex flex-row gap-4 flex-wrap">
                        <Button
                          startContent={<FiSend />}
                          color="primary"
                        >Enviar</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
