'use client';

import { IQueuesProps } from "@/types";
import {
  addToast,
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { Dispatch, SetStateAction, useState } from "react";
import { FiUser } from "react-icons/fi";
import ErrorHandler from "../_utils/errorHandler";
import { createNewQueue } from "../queues/actions";

export default function ModalCreateQueue({
  isOpen,
  onOpen,
  onClose,
  onOpenChange,
  queues,
  setQueues
}: {
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onOpenChange: () => void,
  queues: IQueuesProps[],
  setQueues: Dispatch<SetStateAction<IQueuesProps[]>>,
}) {
  const [queueName, setQueueName] = useState<string>('');
  const [loadingCreateQueue, setLoadingCreateQueue] = useState<boolean>(false);

  async function handleCreateQueue() {
    try {
      setLoadingCreateQueue(true);

      const queue: IQueuesProps = await createNewQueue({ queueName });

      setQueues(prevArray => [...prevArray, queue]);

      onClose();

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'Fila de Atendimento criada',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });

      setLoadingCreateQueue(false);
      setQueueName("");
    } catch (error) {
      setLoadingCreateQueue(false);
      setQueueName("");
      
      onClose();

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
      size="4xl"
      isOpen={isOpen}
      placement="top-center"
      onOpenChange={onOpenChange}
      className="h-2/3"
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Criar Fila de Atendimento</ModalHeader>
        <Divider />
        <ModalBody className="pt-4 overflow-scroll scrollbar-hide">
          {loadingCreateQueue ? (
            <Spinner size="md" />
          ) : (
            <div className="flex flex-col gap-4 ">
              <Input
                label="Nome"
                labelPlacement="outside"
                type="text"
                placeholder="Digite o nome da fila..."
                startContent={<FiUser />}
                value={queueName}
                onChange={(e) => setQueueName(e.target.value)} className="flex-1"
              />
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            Fechar
          </Button>
          <Button color="primary" onPress={() => handleCreateQueue()}>
            Criar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}