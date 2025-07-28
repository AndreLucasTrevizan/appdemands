'use client';

import { IQueueAttendant, IQueuesProps, ITicketStatusProps } from "@/types";
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, SharedSelection } from "@heroui/react";
import { Dispatch, SetStateAction, useState } from "react";

export default function ModalChangeStatus({
  isOpen,
  onOpen,
  onClose,
  onOpenChange,
  statusList,
  selectedStatus,
  setSelectedStatus
}: {
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onOpenChange: () => void,
  statusList: ITicketStatusProps[],
  selectedStatus: ITicketStatusProps,
  setSelectedStatus: Dispatch<SetStateAction<ITicketStatusProps>>,
}) {
  const [selectStatus, setSelectStatus] = useState<SharedSelection>(new Set());

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader>
          <h1>Mudar Status</h1>
        </ModalHeader>
        <Divider />
        <ModalBody>
          <div className="w-full flex flex-row gap-4">
            <Select
              label="Status"
              labelPlacement="outside"
              placeholder="Selecione um status"
              items={statusList}
              selectedKeys={selectStatus}
              onSelectionChange={setSelectStatus}
            >
              {(item) => <SelectItem key={item.id}>{item.statusName}</SelectItem>}
            </Select>
          </div>
        </ModalBody>
        <Divider />
        <ModalFooter>
          <div className="flex gap-4">
            <Button
              color="danger"
              onPress={() => onClose()}
            >Cancelar</Button>
            <Button color="primary" onPress={() => {
              let statusData = statusList.find((item) => item.id == Number(selectStatus?.currentKey));
              
              setSelectedStatus(statusData);

              onClose();
            }}>Confirmar</Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
