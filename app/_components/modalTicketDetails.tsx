'use client';

import { IQueueAttendant, IQueuesProps, ITicketProps, ITicketReportProps, ITicketStatusProps, ITicketWorklogProps } from "@/types";
import { addToast, Button, Chip, Divider, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, SharedSelection, Snippet, Spinner, Textarea, Tooltip, useDisclosure, User } from "@heroui/react";
import ChipPriority from "./chipPriority";
import { phoneMasked, whatsMasked } from "../_utils/masks";
import { FiEdit, FiPhone, FiSend } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import ErrorHandler from "../_utils/errorHandler";
import { getTicketStatusList, gettingTicketWorklog } from "../tickets/actions";
import { GrAttachment } from "react-icons/gr";
import FormSendFiles from "./formSendFiles";
import { getQueueMembers, listQueues } from "../queues/actions";
import ModalChangeAttendant from "./modalChangeAttendant";
import ModalChangeStatus from "./modalChangeStatus";
import { handleRegisterTicketWorklog } from "../ticket_worklog/actions";

export default function ModalTicketDetails({
  isOpenModalTicketDetails,
  onOpenModalTicketDetails,
  onCloseModalTicketDetails,
  onOpenChangeModalTicketDetails,
  ticket,
  setSelectedTicket
}: {
  isOpenModalTicketDetails: boolean,
  onOpenModalTicketDetails: () => void,
  onCloseModalTicketDetails: () => void,
  onOpenChangeModalTicketDetails: () => void,
  ticket: ITicketProps,
  setSelectedTicket: Dispatch<SetStateAction<ITicketReportProps>>
}) {
  const {
    isOpen: isOpenChangeAttendantModal,
    onOpen: onOpenChangeAttendantModal,
    onClose: onCloseChangeAttendantModal,
    onOpenChange: onOpenChangeChangeAttendantModal
  } = useDisclosure();
  
  const {
    isOpen: isOpenChangeStatusModal,
    onOpen: onOpenChangeStatusModal,
    onClose: onCloseChangeStatusModal,
    onOpenChange: onOpenChangeChangeStatusModal
  } = useDisclosure();
  const [loadingWorklog, setLoadingWorklog] = useState<boolean>(false);
  const [loadingSendTicketWorklog, setLoadingSendTicketWorklog] = useState<boolean>(false);
  const [worklog, setWorklog] = useState<ITicketWorklogProps[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loadingListQueues, setLoadingListQueues] = useState(false);
  const [loadingQueueAttendants, setLoadingQueueAttendants] = useState(false);
  const [loadingTicketStatus, setLoadingTicketStatus] = useState(false);
  const [queues, setQueues] = useState<IQueuesProps[]>([]);
  const [selectedQueue, setSelectedQueue] = useState<SharedSelection>(new Set());
  const [selectedQueueData, setSelectedQueueData] = useState<IQueuesProps>();
  const [attendants, setAttendants] = useState<IQueueAttendant[]>([]);
  const [selectedAttendant, setSelectedAttendant] = useState<IQueueAttendant>();
  const [statusList, setStatusList] = useState<ITicketStatusProps[]>([]);
  const [selectedTicketStatus, setSelectedTicketStatus] = useState<ITicketStatusProps>();
  const [description, setDescription] = useState("");

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

    async function loadQueues() {
      try {
        setLoadingListQueues(true);

        const response = await listQueues();

        setQueues(response);

        setLoadingListQueues(false);
      } catch (error) {
        const errorHandler = new ErrorHandler(error);

        addToast({
          color: 'warning',
          title: 'Aviso',
          description: errorHandler.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });

        setLoadingListQueues(false);
      }
    }

    async function loadAttendants() {
      try {
        setLoadingQueueAttendants(true);

        const response: IQueueAttendant[] = await getQueueMembers({
          bySlug: true,
          slug: ticket.queueSlug
        });

        setAttendants(response);

        setLoadingQueueAttendants(false);
      } catch (error) {
        setLoadingQueueAttendants(false);
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
    
    async function loadStatus() {
      try {
        setLoadingTicketStatus(true);

        const response: ITicketStatusProps[] = await getTicketStatusList();

        setStatusList(response);

        setLoadingTicketStatus(false);
      } catch (error) {
        setLoadingTicketStatus(false);
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
    loadQueues()
    loadAttendants();
    loadStatus();
  }, []);

  async function sendTicketWorklog() {
    try {
      setLoadingSendTicketWorklog(true);

      if (description != "") {
        const response = await handleRegisterTicketWorklog(description, ticket.id, undefined);

        setWorklog((prevValues) => [...prevValues, response]);

        addToast({
          color: 'success',
          title: 'Sucesso',
          description: 'Worklog atualizado',
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      }

      if (files.length > 0) {

      }

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

  const selectedAttendantComp = useMemo(() => {
    return <Input
      value={selectedAttendant?.userName ?? "Atendente invalido"}
      isReadOnly
      label="Atendente"
      labelPlacement="outside"
    />
  }, [ selectedAttendant ]);
  
  const selectedStatusComp = useMemo(() => {
    return <Input
      value={selectedTicketStatus?.statusName ?? "Status invalido"}
      isReadOnly
      label="Status"
      labelPlacement="outside"
    />
  }, [ selectedTicketStatus ]);

  return (
    <Modal
      size="full"
      backdrop="blur"
      isOpen={isOpenModalTicketDetails}
      onOpenChange={onOpenChangeModalTicketDetails}
      isKeyboardDismissDisabled={true}
      closeButton
      onClose={() => {
        setSelectedTicket(undefined);

        onCloseModalTicketDetails();
      }}
    >
      <ModalContent>
        <ModalHeader>
          <h1>{ticket.id} - {ticket.ticketTitle}</h1>
        </ModalHeader>
        <Divider />
        <ModalBody>
          <div className="w-full flex flex-row flex-wrap gap-4">
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
                    className="flex-1"
                  />
                  <div className="flex flex-1 items-end gap-4">
                    {selectedTicketStatus ? (
                      selectedStatusComp
                    ) : (
                      <Input
                        value={ticket.ticketStatus ?? "Status não atribuido"}
                        isReadOnly
                        label="Status"
                        labelPlacement="outside"
                      />
                    )}
                    <ModalChangeStatus
                      isOpen={isOpenChangeStatusModal}
                      onOpen={onOpenChangeStatusModal}
                      onClose={onCloseChangeStatusModal}
                      onOpenChange={onOpenChangeChangeStatusModal}
                      attendant={selectedAttendant}
                      statusList={statusList}
                      selectedStatus={selectedTicketStatus}
                      setSelectedStatus={setSelectedTicketStatus}
                      ticket={ticket}
                      worklog={worklog}
                      setWorklog={setWorklog}
                    />
                    <Tooltip content="Mudar status">
                      <Button isIconOnly startContent={<FiEdit />} color="warning" onPress={() => onOpenChangeChangeStatusModal()} />
                    </Tooltip>
                  </div>
                </div>
                <div className="flex flex-row gap-4 w-full">
                  <Input
                    value={ticket.queueName}
                    label="Fila de Atendimento"
                    labelPlacement="outside"
                    readOnly
                    className="flex-1"
                  />
                  <div className="flex items-end gap-4 flex-1">
                    {selectedAttendant ? (
                      selectedAttendantComp
                    ) : (
                      <Input
                        value={ticket.attendantName ?? "Atendente não atribuido"}
                        isReadOnly
                        label="Atendente"
                        labelPlacement="outside"
                      />
                    )}
                    <ModalChangeAttendant
                      isOpen={isOpenChangeAttendantModal}
                      onOpen={onOpenChangeAttendantModal}
                      onClose={onCloseChangeAttendantModal}
                      onOpenChange={onOpenChangeChangeAttendantModal}
                      attendants={attendants}
                      selectedAttendant={selectedAttendant}
                      setSelectedAttendant={setSelectedAttendant}
                      ticket={ticket}
                      worklog={worklog}
                      setWorklog={setWorklog}
                    />
                    <Tooltip content="Mudar atendente">
                      <Button isIconOnly startContent={<FiEdit />} color="warning" onPress={() => onOpenChangeChangeAttendantModal()} />
                    </Tooltip>
                  </div>
                </div>
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
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col items-center">
                    <span className="mb-1">Prioridade</span>
                    <ChipPriority name={ticket.ticketPriority} time={ticket.ticketSLA} />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="mb-1">Tempo com Dispatcher</span>
                    <Chip>{Math.floor((ticket.timeWithDispatcher /  60) / 60)}h</Chip>
                  </div>
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
            <div className="flex-1 h-[650px] overflow-scroll scrollbar-hide">
              {loadingWorklog ? (
                <div></div>
              ) : (
                worklog.map((item) => (
                  <div className="flex-1 mb-4" key={item?.id}>
                    {item?.userName ? (
                      <User
                        name={item?.userName}
                      description={`${new Date(item?.createdAt).toLocaleDateString('pt-br')} - ${new Date(item?.createdAt).toLocaleTimeString('pt-br', { hour: '2-digit', minute: '2-digit' })}`}
                        avatarProps={{
                          name: item?.userName,
                          showFallback: true,
                          src: `${process.env.baseUrl}/avatar/${item?.userSlug}/${item?.userAvatar}`
                        }}
                      />
                    ) : (
                      <User
                        name={item?.attendantName}
                        description={`${new Date(item?.createdAt).toLocaleDateString('pt-br')} - ${new Date(item?.createdAt).toLocaleTimeString('pt-br', { hour: '2-digit', minute: '2-digit' })}`}
                        avatarProps={{
                          name: item?.attendantName,
                          showFallback: true,
                          src: `${process.env.baseUrl}/avatar/${item?.attendantSlug}/${item?.attendantAvatar}`
                        }}
                      />
                    )}
                    <Textarea
                      className="mt-4"
                      value={item?.worklogDesc}
                      variant="faded"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex flex-row gap-4">
          <div className="flex-1"></div>
          <Form
            onSubmit={(e) => {
              e.preventDefault();

              sendTicketWorklog()
            }}
            className="flex-1"
          >
            <Textarea
              size="sm"
              variant="underlined"
              placeholder="Responder no worklog do chamado..."
              value={description}
              onValueChange={setDescription}
            />
            <FormSendFiles
              files={files}
              setFiles={setFiles}
            />
            <div className="flex flex-row justify-between gap-4 flex-wrap">
              <Button color="danger" variant="flat" onPress={() => {
                setSelectedTicket(undefined);

                onCloseModalTicketDetails();
              }}>
                Cancelar
              </Button>
              <div className="flex flex-row gap-4 flex-wrap">
                <Button
                  startContent={<FiSend />}
                  color="primary"
                  type="submit"
                >Enviar</Button>
              </div>
            </div>
          </Form>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
