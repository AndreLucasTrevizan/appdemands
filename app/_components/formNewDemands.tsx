'use client';

import { Button, Divider, Form, Input, Spacer, Textarea } from "@heroui/react";
import { ChangeEvent, ReactNode, useCallback, useRef, useState } from "react";
import { FaArrowUp, FaDemocrat, FaSave } from "react-icons/fa";

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
        const ext = files[i].name.split('.')[1];
        fileItems.push(<p key={files[i].name}>{files[i].name}</p>);
      }
    }

    return fileItems;
  }, [ files ]);

  return (
    <Form>
      <Input
        isRequired
        placeholder="Entre com um título para a demanda"
        type="text"
        startContent={
          <FaDemocrat />
        }
      />
      <Textarea
        height={200}
        placeholder="Descreva a demanda"
      />
      <Spacer y={4} />
      <Divider />
      <Spacer y={4} />
      <h2>Anexos</h2>
      <Spacer y={4} />
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

const FileItem = (file: File) => {
  return (
    <div className="p-2 rounded flex flex-col items-center justify-center">
      <small>{JSON.stringify(file)}</small>
    </div>
  );
}
