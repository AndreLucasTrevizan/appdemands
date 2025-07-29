'use client';

import { IQueueAttendant, IQueuesProps, ITicketProps, ITicketWorklogProps } from "@/types";
import { addToast, Button, Divider, Form, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, SharedSelection, Spinner } from "@heroui/react";
import { Dispatch, SetStateAction, useState } from "react";
import { changeTicketAttendant } from "../tickets/actions";
import ErrorHandler from "../_utils/errorHandler";

export default function ModalChangeAttendant({
  isOpen,
  onOpen,
  onClose,
  onOpenChange,
  attendants,
  selectedAttendant,
  setSelectedAttendant,
  ticket,
  worklog,
  setWorklog
}: {
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onOpenChange: () => void,
  attendants: IQueueAttendant[],
  selectedAttendant: IQueueAttendant,
  setSelectedAttendant: Dispatch<SetStateAction<IQueueAttendant>>,
  ticket: ITicketProps,
  worklog: ITicketWorklogProps[],
  setWorklog: Dispatch<SetStateAction<ITicketWorklogProps[]>>,
}) {
  const [selectAttendant, setSelectAttendant] = useState<SharedSelection>(new Set());
  const [loading, setLoading] = useState(false);

  const handleChangeAttendant = async () => {
    try {
      setLoading(false);

      const worklog = await changeTicketAttendant({
        ticketId: ticket.id,
        queueId: ticket.queueId,
        attendantId: Number(selectAttendant?.currentKey)
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
          <h1>Mudar Atendente</h1>
        </ModalHeader>
        <Divider />
        <ModalBody>
          {loading ? (
            <div className="flex flex-col p-4 items-center">
              <Spinner size="sm" label="Alterando atendente..." />
            </div>
          ) : (
            <Form
              className="w-full flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();

                let attendantData = attendants.find((item) => item.id == Number(selectAttendant?.currentKey));

                handleChangeAttendant();
                  
                setSelectedAttendant(attendantData);

                onClose();
              }}
            >
              <Select
                label="Atendentes"
                labelPlacement="outside"
                placeholder="Selecione um atendente"
                items={attendants}
                selectedKeys={selectAttendant}
                onSelectionChange={setSelectAttendant}
                isRequired
              >
                {(item) => <SelectItem key={item.id}>{item.userName}</SelectItem>}
              </Select>
              <div className="flex flex-row gap-4 w-full justify-end">
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
