'use client';

import { Button, divider, Divider, Form, Input, Spacer, Textarea, Tooltip } from "@heroui/react";
import Image from "next/image";
import { ChangeEvent, ReactNode, useCallback, useRef, useState } from "react";
import { FaArrowUp, FaDemocrat, FaFileExcel, FaFilePdf, FaFileWord, FaPlus, FaPlusCircle, FaSave, FaTrash } from "react-icons/fa";
import DeleteIcon from "./deleteIcon";
import { PlusIcon } from "./plusIcon";

export default function FormNewDemand() {
  const inputFile = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  const gettingAttachments = (e: ChangeEvent<HTMLInputElement>) => {
    let fileList: File[] = [];
    
    if (e.target.files && e.target.files?.length > 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        fileList.push(e.target.files[i]);
      }

      setFiles(fileList);
    }
  }

  const filesComponent = useCallback(() => {
    let fileItems: JSX.Element[] = [];

    if (files.length > 0) {
      files.forEach((file) => {
        console.log(`File Component ${file.name}`);
        let element: JSX.Element = <></>

        element = <FileItem file={file} key={file.name} removeFileFn={() => removingAttachment(file.name)} />

        fileItems.push(element);
      });
    }

    return fileItems;
  }, [ files ]);

  const removingAttachment = (filename: string) => {
    let fileIndex = 0;

    let newFileList: File[] = [];
    
    if (files.length > 0) {
      fileIndex = files.findIndex((file) => file.name == filename);

      newFileList = files.filter((file, index) => index != fileIndex);

      setFiles(newFileList);
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
      />
      <Spacer y={2} />
      <Textarea
        labelPlacement="outside"
        label='Descrição'
        height={200}
        placeholder="Descreva a demanda"
      />
      <Spacer y={2} />
      <Divider />
      <Spacer y={2} />
      <label htmlFor="inputFile" className="flex items-center gap-2">
        <h2>Anexos</h2>
        <span className="border-2 rounded-full hover:cursor-pointer">
          <PlusIcon size={20} height={20} width={20} />
        </span>
      </label>
      {files && (
        <div className="flex gap-2">
          {filesComponent()}
        </div>
      )}
      <Input
        className="hidden"
        type="file"
        id="inputFile"
        ref={inputFile}
        multiple
        onChange={(e) => gettingAttachments(e)}
      />
      <Spacer y={2} />
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
  file,
  removeFileFn
}: {
  file: File,
  removeFileFn: (fileName: string) => void;
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
        <span onClick={() => removeFileFn(file.name)} className="text-lg text-danger cursor-pointer active:opacity-50 p-2">
          <DeleteIcon />
        </span>
      </Tooltip>
    </div>
  );
}
