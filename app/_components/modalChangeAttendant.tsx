'use client';

import { IQueueAttendant, IQueuesProps } from "@/types";
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, SharedSelection } from "@heroui/react";
import { Dispatch, SetStateAction, useState } from "react";

export default function ModalChangeAttendant({
  isOpen,
  onOpen,
  onClose,
  onOpenChange,
  attendants,
  selectedAttendant,
  setSelectedAttendant
}: {
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onOpenChange: () => void,
  attendants: IQueueAttendant[],
  selectedAttendant: IQueueAttendant,
  setSelectedAttendant: Dispatch<SetStateAction<IQueueAttendant>>,
}) {
  const [selectAttendant, setSelectAttendant] = useState<SharedSelection>(new Set());

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader>
          <h1>Mudar Atendente</h1>
        </ModalHeader>
        <Divider />
        <ModalBody>
          <div className="w-full flex flex-row gap-4">
            <Select
              label="Atendentes"
              labelPlacement="outside"
              placeholder="Selecione um atendente"
              items={attendants}
              selectedKeys={selectAttendant}
              onSelectionChange={setSelectAttendant}
            >
              {(item) => <SelectItem key={item.id}>{item.userName}</SelectItem>}
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
              let attendantData = attendants.find((item) => item.id == Number(selectAttendant?.currentKey));
              
              setSelectedAttendant(attendantData);

              onClose();
            }}>Confirmar</Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
