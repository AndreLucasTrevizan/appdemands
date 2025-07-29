'use client';

import { IQueueAttendant, IQueuesProps, ITicketProps, ITicketStatusProps, ITicketWorklogProps } from "@/types";
import { addToast, Button, Divider, Form, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, SharedSelection, Spinner } from "@heroui/react";
import { Dispatch, SetStateAction, useState } from "react";
import { changeTicketStatus } from "../tickets/actions";
import ErrorHandler from "../_utils/errorHandler";

export default function ModalChangeStatus({
  isOpen,
  onOpen,
  onClose,
  onOpenChange,
  attendant,
  statusList,
  selectedStatus,
  setSelectedStatus,
  ticket,
  worklog,
  setWorklog
}: {
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onOpenChange: () => void,
  attendant?: IQueueAttendant,
  statusList: ITicketStatusProps[],
  selectedStatus: ITicketStatusProps,
  setSelectedStatus: Dispatch<SetStateAction<ITicketStatusProps>>,
  ticket: ITicketProps,
  worklog: ITicketWorklogProps[],
  setWorklog: Dispatch<SetStateAction<ITicketWorklogProps[]>>,
}) {
  const [selectStatus, setSelectStatus] = useState<SharedSelection>(new Set());
  const [loading, setLoading] = useState(false);

  const handleChangeStatus = async () => {
    try {
      setLoading(false);

      const worklog = await changeTicketStatus({
        ticketId: ticket.id,
        ticketStatusId: Number(selectStatus.currentKey),
      });

      setWorklog(prevValues => [...prevValues, worklog]);

      setLoading(true);
    } catch (error) {
      setLoading(false);
      
      const errorHandler = new ErrorHandler(error);
              
      addToast({
        title: 'Aviso',
        description: errorHandler.message,
        timeout: 3000,
        shouldShowTimeoutProgress: true
      });
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onOpenChange}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        <ModalHeader>
          <h1>Mudar Status</h1>
        </ModalHeader>
        <Divider />
        <ModalBody>
          {loading ? (
            <div className="w-full flex flex-col p-4 items-center">
              <Spinner label="Atualizando status..." size="sm" />
            </div>
          ) : (
            <Form
              className="w-full flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();

                let statusData = statusList.find((item) => item.id == Number(selectStatus?.currentKey));

                if (!attendant && statusData.slug == 'atribuido') {
                  addToast({
                    color: 'warning',
                    title: 'Aviso',
                    description: 'Preencha o atendente para atribuir o chamado',
                    timeout: 3000,
                    shouldShowTimeoutProgress: true
                  });
                } else {
                  handleChangeStatus();

                  setSelectedStatus(statusData);
    
                  onClose();
                }
              }}
            >
              <Select
                label="Status"
                labelPlacement="outside"
                placeholder="Selecione um status"
                items={statusList}
                selectedKeys={selectStatus}
                onSelectionChange={setSelectStatus}
                isRequired
              >
                {(item) => <SelectItem key={item.id}>{item.statusName}</SelectItem>}
              </Select>
              <div className="flex flex-row w-full justify-end gap-4">
                <Button
                  color="danger"
                  onPress={() => onClose()}
                >Cancelar</Button>
                <Button color="primary" type="submit">Confirmar</Button>
              </div>
            </Form>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
