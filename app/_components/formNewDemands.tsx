'use client';

import { Button, divider, Divider, Form, Input, Spacer, Textarea, Tooltip } from "@heroui/react";
import Image from "next/image";
import { ChangeEvent, ReactNode, useCallback, useRef, useState } from "react";
import { FaArrowUp, FaDemocrat, FaFileExcel, FaFilePdf, FaFileWord, FaSave, FaTrash } from "react-icons/fa";
import DeleteIcon from "./deleteIcon";

export default function FormNewDemand() {
  const inputFile = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | null>(null);

  const gettingAttachments = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files?.length > 0) {
      setFiles(e.target.files);
    }
  }

  const filesComponent = useCallback(() => {
    let fileItems: JSX.Element[] = [];

    if (files) {
      for (let i = 0; i < files.length; i++) {
        let element: JSX.Element = <></>

        element = <FileItem file={files[i]} key={files[i].name} />

        fileItems.push(element);
      }
    }

    return fileItems;
  }, [ files ]);

  const removingAttachment = (file: File) => {
    if (files) {
      for (let i = 0; i < files.length; i++) {
        
      }
    }
  }

  return (
    <Form>
      <Input
        labelPlacement="outside"
        label='Título'
        isRequired
        placeholder="Entre com um título para a demanda"
        type="text"
        startContent={
          <FaDemocrat />
        }
      />
      <Spacer y={4} />
      <Textarea
        labelPlacement="outside"
        label='Descrição'
        height={200}
        placeholder="Descreva a demanda"
      />
      <Spacer y={4} />
      <Divider />
      <Spacer y={4} />
      <h2>Anexos</h2>
      {files && (
        <div className="flex gap-2">
          {filesComponent()}
        </div>
      )}
      <label htmlFor="inputFile" className="flex items-center gap-2 hover:cursor-pointer">
        <FaArrowUp />
        <small>Inserir anexos</small>
      </label>
      <Input
        className="hidden"
        type="file"
        id="inputFile"
        ref={inputFile}
        multiple
        onChange={(e) => gettingAttachments(e)}
      />
      <Divider />
      <Spacer y={4} />
      <div>
        <Button
          color="primary"
          startContent={
            <FaSave />
          }
          type="button"
        >Cadastrar</Button>
      </div>
    </Form>
  );
}

const FileItem = ({
  file
}: {
  file: File
}) => {
  const extArray = file.name.split('.');

  const ext = extArray.pop();

  return (
    <div className="flex items-center border rounded">
      <div
        className="flex items-center gap-2 p-2"
      >
        <Image src={`/svgs/${ext}.svg`} width={20} height={20} alt={file.name} />
        <small>{file.name}</small>
      </div>
      <Tooltip color="danger" content="Remover anexo" >
        <span className="text-lg text-danger cursor-pointer active:opacity-50 p-2">
          <DeleteIcon />
        </span>
      </Tooltip>
    </div>
  );
}
