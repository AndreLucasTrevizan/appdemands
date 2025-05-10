'use client';

import { addToast, Button, divider, Divider, Form, Input, Modal, ModalBody, ModalContent, Spacer, Spinner, Textarea, Tooltip, useDisclosure } from "@heroui/react";
import Image from "next/image";
import { ChangeEvent, ReactNode, useCallback, useRef, useState } from "react";
import { FaArrowUp, FaDemocrat, FaFileExcel, FaFilePdf, FaFileWord, FaPlus, FaPlusCircle, FaSave, FaTrash } from "react-icons/fa";
import DeleteIcon from "./deleteIcon";
import { PlusIcon } from "./plusIcon";
import { addingAttachments, creatingDemand } from "../demands/new/actions";
import ErrorHandler from "../_utils/errorHandler";

export default function FormNewDemand() {
  const inputFile = useRef<HTMLInputElement>(null);
  const [loadingDemand, setLoadingDemand] = useState<boolean>(false);
  const [loadingAttachments, setLoadingAttachments] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const {
    isOpen,
    onOpen,
    onClose,
    onOpenChange
  } = useDisclosure();

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

  const handleCreateDemand = async () => {
    try {
      onOpen();
      setLoadingDemand(true);
      setMessage('Criando demanda...');

      const response = await creatingDemand({
        title,
        description
      });

      if (files.length > 0) {
        setLoadingAttachments(true);
        setMessage('Enviando anexos...');

        await addingAttachments({ demandId: response, files });

        addToast({
          title: 'Sucesso',
          description: 'Anexos enviados',
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      }

      addToast({
        title: 'Sucesso',
        description: 'Demanda criada',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      const errorHandler = new ErrorHandler(error);

      addToast({
        title: 'Aviso',
        description: errorHandler.error.message,
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } finally {
      setLoadingDemand(false);
      setLoadingAttachments(false);
      onClose();
    }
  }

  const showMessage = useCallback(() => {
    return <p>{message}</p>;
  }, [ message ]);

  return (
    <Form>
      <Modal size="xs" backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalBody className="flex items-center">
            <Spinner size="md" />
            {showMessage()}
          </ModalBody>
        </ModalContent>
      </Modal>
      <Input
        labelPlacement="outside"
        label='Título'
        isRequired
        placeholder="Entre com um título para a demanda"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Spacer y={2} />
      <Textarea
        labelPlacement="outside"
        label='Descrição'
        height={200}
        placeholder="Descreva a demanda"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
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
          onPress={() => handleCreateDemand()}
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
