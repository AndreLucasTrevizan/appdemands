'use client';

import { IServiceCatalog, IUsersReport } from "@/types";
import { Input } from "@heroui/input";
import { addToast, Button, Divider, Form, Spacer, Spinner, User } from "@heroui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createTicket } from "../tickets/actions";
import ErrorHandler from "../_utils/errorHandler";

export default function CreateTicketInputsGeneration({
  catalog,
  user,
  onClose
}: {
  catalog: IServiceCatalog,
  user?: IUsersReport,
  onClose: () => void,
}) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsNumber, setWhatsNumber] = useState("");
  const [plant, setPlant] = useState("");
  const [sector, setSector] = useState("");
  const [doc, setDoc] = useState("");
  const [nf, setNf] = useState("");
  const [transaction, setTransaction] = useState("");
  const [userSAP, setUserSAP] = useState("");
  const [loading, setLoading] = useState(false);

  switch(catalog?.slug) {
    case "criacao-de-usuario-de-rede":

      const handleCreateTicket = async () => {
        try {
          setLoading(true);

          let description = `${catalog.serviceDescription}Nome: ${name}\nFilial/Unidade: ${plant}\nSetor: ${sector}\nTelefone: ${phoneNumber}\nWhatsapp: ${whatsNumber}`;

          await createTicket({
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

          setName("");
          setPlant("");
          setSector("");
          setPhoneNumber("");
          setWhatsNumber("");
          setLoading(false);
          
          onClose();
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
                value={plant}
                onValueChange={setPlant}
                placeholder="Informe a unidade ou filial do novo usuário"
                label="Filial/Unidade"
                labelPlacement="outside"
                className="flex-1"
                isRequired
              />
              <Input
                value={sector}
                onValueChange={setSector}
                placeholder="Informe o setor do novo usuário"
                label="Setor"
                labelPlacement="outside"
                className="flex-1"
                isRequired
              />
            </div>
            <div className="w-full flex flex-row gap-4 flex-wrap">
              <Input
                value={phoneNumber}
                onValueChange={setPhoneNumber}
                placeholder="Informe o telefone do novo usuário"
                label="Telefone"
                labelPlacement="outside"
                type="number"
                className="flex-1"
                isRequired
              />
              <Input
                value={whatsNumber}
                onValueChange={setWhatsNumber}
                placeholder="Informe o Whatsapp do novo usuário"
                label="Whatsapp"
                labelPlacement="outside"
                type="number"
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
              <span>Filial/Unidade: {plant}</span>
              <span>Setor: {sector}</span>
              <span>Telefone: {phoneNumber}</span>
              <span>Whatsapp: {whatsNumber}</span>
              <Divider />
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
    case 'adicionar-numero-de-log-no-doc':
      return (
        <div className="flex flex-row flex-wrap gap-4">
          <Input
            value={doc}
            onValueChange={setDoc}
            placeholder="Informe o numero do DOC"
            label="Número do DOC"
            labelPlacement="outside"
            isRequired
          />
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
            <span>DOC: {doc}</span>
            <Divider />
            <div className="flex flex-row gap-4 flex-wrap">
                <Button color="danger" variant="flat" onPress={() => {
                  onClose();
                }}>
                  Cancelar
                </Button>
                <Button
                  isDisabled={user?.isOnTeam != undefined ? user.isOnTeam == 1 ? false : true : false}
                  color="primary"
                  onPress={() => {}}
                >
                  Criar chamado
                </Button>
            </div>
          </div>
        </div>
      );
    case 'computador-nao-liga':
      return (
        <div className="flex flex-row flex-wrap gap-4">
          <div className="flex flex-row flex-wrap gap-4 w-full">
            <Input
              value={plant}
              onValueChange={setPlant}
              placeholder="Informe a filial ou unidade"
              label="Filial/Unidade"
              labelPlacement="outside"
              isRequired
              className="flex-1"
            />
            <Input
              value={sector}
              onValueChange={setSector}
              placeholder="Informe o setor"
              label="Setor"
              labelPlacement="outside"
              isRequired
              className="flex-1"
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
            <span>Filial/Unidade: {plant}</span>
            <span>Setor: {sector}</span>
            <Divider />
            <div className="flex flex-row gap-4 flex-wrap">
                <Button color="danger" variant="flat" onPress={() => {
                  onClose();
                }}>
                  Cancelar
                </Button>
                <Button
                  isDisabled={user?.isOnTeam != undefined ? user.isOnTeam == 1 ? false : true : false}
                  color="primary"
                  onPress={() => {}}
                >
                  Criar chamado
                </Button>
            </div>
          </div>
        </div>
      );
    case 'solicitacao-de-nobreak':
      return (
        <div className="flex flex-row flex-wrap gap-4">
          <div className="flex flex-row flex-wrap gap-4 w-full">
            <Input
              value={plant}
              onValueChange={setPlant}
              placeholder="Informe a filial ou unidade"
              label="Filial/Unidade"
              labelPlacement="outside"
              isRequired
              className="flex-1"
            />
            <Input
              value={sector}
              onValueChange={setSector}
              placeholder="Informe o setor"
              label="Setor"
              labelPlacement="outside"
              isRequired
              className="flex-1"
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
            <span>Filial/Unidade: {plant}</span>
            <span>Setor: {sector}</span>
            <Divider />
            <div className="flex flex-row gap-4 flex-wrap">
                <Button color="danger" variant="flat" onPress={() => {
                  onClose();
                }}>
                  Cancelar
                </Button>
                <Button
                  isDisabled={user?.isOnTeam != undefined ? user.isOnTeam == 1 ? false : true : false}
                  color="primary"
                  onPress={() => {}}
                >
                  Criar chamado
                </Button>
            </div>
          </div>
        </div>
      );
    case 'acesso-a-transação':
      return (
        <div className="flex flex-row flex-wrap gap-4">
          <Input
            value={userSAP}
            onValueChange={setUserSAP}
            placeholder="Informe o usuário SAP"
            label="Usuário SAP"
            labelPlacement="outside"
            isRequired
          />
          <Input
            value={transaction}
            onValueChange={setTransaction}
            placeholder="Informe o nome da transação"
            label="Nome da transação"
            labelPlacement="outside"
            isRequired
          />
          <div className="flex flex-col items-start flex-wrap gap-4">
            <User
              name={user?.userName}
              description={new Date().toLocaleDateString()}
              avatarProps={{
                name: user?.userName,
                showFallback: true,
                src: `${process.env.baseUrl}/avatar/${user?.userSlug}/${user?.avatar}`
              }}
            />
            <span>{catalog.serviceDescription}</span>
            <span>Usuário SAP: {userSAP}</span>
            <span>Nome da transação: {transaction}</span>
          </div>
          <Divider />
            <div className="flex flex-row gap-4 flex-wrap">
                <Button color="danger" variant="flat" onPress={() => {
                  onClose();
                }}>
                  Cancelar
                </Button>
                <Button
                  isDisabled={user?.isOnTeam != undefined ? user.isOnTeam == 1 ? false : true : false}
                  color="primary"
                  onPress={() => {}}
                >
                  Criar chamado
                </Button>
            </div>
        </div>
      );
    default:
      return <></>;
  }
}
