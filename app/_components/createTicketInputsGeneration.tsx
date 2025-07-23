'use client';

import { IServiceCatalog } from "@/types";
import { Input } from "@heroui/input";
import { Dispatch, SetStateAction } from "react";

export default function CreateTicketInputsGeneration({
  catalog,
  name,
  setName,
  phoneNumber,
  setPhoneNumber,
  whatsNumber,
  setWhatsNumber,
  plant,
  setPlant,
  sector,
  setSector,
  doc,
  setDoc,
  nf,
  setNf,
  transaction,
  setTransaction,
  userSAP,
  setUserSAP
}: {
  catalog: IServiceCatalog,
  name?: string,
  setName?: Dispatch<SetStateAction<string>>,
  phoneNumber?: string,
  setPhoneNumber?: Dispatch<SetStateAction<string>>,
  whatsNumber?: string,
  setWhatsNumber?: Dispatch<SetStateAction<string>>,
  plant?: string,
  setPlant?: Dispatch<SetStateAction<string>>,
  sector?: string
  setSector?: Dispatch<SetStateAction<string>>,
  doc?: string,
  setDoc?: Dispatch<SetStateAction<string>>,
  nf?: string,
  setNf?: Dispatch<SetStateAction<string>>,
  transaction?: string,
  setTransaction?: Dispatch<SetStateAction<string>>,
  userSAP?: string,
  setUserSAP?: Dispatch<SetStateAction<string>>,
}) {
  switch(catalog?.slug) {
    case "criar-usuário-de-computador":
      return (
        <div className="flex flex-row flex-wrap gap-4">
          <Input
            value={name}
            onValueChange={setName}
            placeholder="Informe o nome completo do novo usuário"
            label="Nome Completo"
            labelPlacement="outside"
          />
          <Input
            value={phoneNumber}
            onValueChange={setPhoneNumber}
            placeholder="Informe o telefone do novo usuário"
            label="Telefone"
            labelPlacement="outside"
          />
          <Input
            value={whatsNumber}
            onValueChange={setWhatsNumber}
            placeholder="Informe o Whatsapp do novo usuário"
            label="Whatsapp"
            labelPlacement="outside"
          />
          <Input
            value={plant}
            onValueChange={setPlant}
            placeholder="Informe a unidade ou filial do novo usuário"
            label="Filial ou Unidade"
            labelPlacement="outside"
          />
          <Input
            value={sector}
            onValueChange={setSector}
            placeholder="Informe o setor do novo usuário"
            label="Setor"
            labelPlacement="outside"
          />
        </div>
      );
    case 'preencher-log-no-doc':
      return (
        <div className="flex flex-row flex-wrap gap-4">
          <Input
            value={doc}
            onValueChange={setDoc}
            placeholder="Informe o numero do DOC"
            label="Número do DOC"
            labelPlacement="outside"
          />
          <Input
            value={nf}
            onValueChange={setNf}
            placeholder="Informe o número da NF"
            label="Número da NF"
            labelPlacement="outside"
          />
        </div>
      );
    case 'acesso-a-transação':
      return (
        <div className="flex flex-row flex-wrap gap-4">
          <Input
            value={transaction}
            onValueChange={setTransaction}
            placeholder="Informe o nome da transação"
            label="Nome da transação"
            labelPlacement="outside"
          />
          <Input
            value={userSAP}
            onValueChange={setUserSAP}
            placeholder="Informe o usuário SAP"
            label="Usuário SAP"
            labelPlacement="outside"
          />
        </div>
      );
    default:
      return <></>;
  }
}
