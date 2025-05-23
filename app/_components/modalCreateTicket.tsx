'use client';

import { addToast, Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, SelectSection, Spinner, Textarea, User, user } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { IUserSignedProps } from "../_contexts/AuthContext";
import { gettingSigned } from "./actions";
import { IUsersReport } from "@/types";
import { getUserDetailsForTicket } from "../actions";
import ErrorHandler from "../_utils/errorHandler";
import { FiMail, FiUser } from "react-icons/fi";

export default function ModalCreateTicket({
  isOpen,
  onOpen,
  onClose,
  onOpenChange
}: {
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onOpenChange: () => void,
}) {
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<IUsersReport>();

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingData(true);

        const userData = await getUserDetailsForTicket();

        setUserDetails(userData);

        setLoadingData(false);
      } catch (error) {
        setLoadingData(false);

        const errorHandler = new ErrorHandler(error);
        
        addToast({
          color: 'warning',
          title: 'Aviso',
          description: errorHandler.error.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      }
    }

    loadData();
  }, []);

  const timer = useMemo(() => {
    let date = '';

    setInterval(() => {
      date = new Date(Date.now()).toLocaleTimeString('pt-br')
    }, 1000);

    return (
      <span>{date}</span>
    );
  }, []);

  return (
    <Modal
      size="full"
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader>
          <h1>Abrindo Chamado</h1>
        </ModalHeader>
        <Divider />
        <ModalBody>
          <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-4 flex-1 flex-wrap">
              <Input
                type="text"
                placeholder="Digite o título do chamado..."
                label="Título"
                labelPlacement="outside"
              />
              <Textarea
                placeholder="Descreva sobre a situação..."
                label="Descrição"
                labelPlacement="outside"
              />
              <div className="flex w-full flex-wrap gap-4">
                <Select className="flex-1" label="Prioridade">
                  <SelectItem>Baixa</SelectItem>
                  <SelectItem>Media</SelectItem>
                  <SelectItem>Alta</SelectItem>
                  <SelectItem>Emergencia</SelectItem>
                </Select>
                <Select className="flex-1" label="Categoria">
                  <SelectItem>Incidente</SelectItem>
                  <SelectItem>Problema</SelectItem>
                  <SelectItem>Solicitação de Serviço</SelectItem>
                  <SelectItem>Solicitação de Mudança</SelectItem>
                </Select>
              </div>
              <Divider />
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1">
                  <User
                    name="Pessoa de contato"
                    description={userDetails?.userName}
                    avatarProps={{
                      name: userDetails?.userName,
                      showFallback: true,
                      src: `${process.env.baseUrl}/avatar/${userDetails?.id}/${userDetails?.avatar}`
                    }}
                  />
                </div>
                <Input
                  readOnly
                  type="text"
                  value={userDetails?.email}
                  label='E-mail de contato'
                  startContent={<FiMail />}
                  className="flex-1"
                />
              </div>
            </div>
            <Divider orientation="vertical" />
            <div className="flex flex-col flex-1 gap-4 flex-wrap">
              {loadingData ? (
                <Spinner size="md" />
              ) : (
                <div className="flex flex-col flex-wrap gap-4">
                  <span>Chamado sendo criado na fila da equipe de {userDetails?.teamName}</span>
                  <span>Sub-equipe {userDetails?.subTeamName}</span>
                </div>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            Cancelar
          </Button>
          <Button color="primary" onPress={() => {}}>
            Criar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
