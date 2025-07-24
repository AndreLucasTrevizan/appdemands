'use client';

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
  Select,
  Selection,
  SelectItem,
  SharedSelection,
  Spinner,
  Textarea,
  Tooltip,
  User
} from "@heroui/react";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { IServiceCatalog, ITicketCategoryProps, ITicketPriorityProps, ITicketProps, IUsersReport } from "@/types";
import ErrorHandler from "../_utils/errorHandler";
import { FiMail, FiPhone } from "react-icons/fi";
import {
  attachingTicketFiles,
  createTicket,
  getTicketCategoriesList,
  getTicketPrioritiesList,
  getUserDetailsForTicket
} from "../tickets/actions";
import Image from "next/image";
import DeleteIcon from "./deleteIcon";
import { PlusIcon } from "./plusIcon";
import { FaWhatsapp } from "react-icons/fa6";
import { handleRegisterTicketWorklog } from "../ticket_worklog/actions";
import { getServiceCatalog } from "../settings/actions";
import CreateTicketInputsGeneration from "./createTicketInputsGeneration";

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
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [prioritySelected, setPrioritySelected] = useState<ITicketPriorityProps>();
  const [cateogorySelected, setCategorySelected] = useState<ITicketCategoryProps>();
  const [ticketCategories, setTicketCategories] = useState<ITicketCategoryProps[]>([]);
  const [ticketPriorities, setTicketPriorities] = useState<ITicketPriorityProps[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [loadingCreateTicket, setLoadingCreateTicket] = useState<boolean>(false);
  const [loadingSendingFiles, setLoadingSendingFiles] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<IUsersReport>();
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [catalog, setCatalog] = useState<IServiceCatalog[]>([]);
  const [catalogSelected, setCatalogSelected] = useState<SharedSelection>(new Set());

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
          description: errorHandler.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      }
    }

    async function loadServiceCatalog() {
      try {
        setLoadingCatalog(true);

        const catalogData = await getServiceCatalog("active");

        setCatalog(catalogData);

        setLoadingCatalog(false);
      } catch (error) {
        const errorHandler = new ErrorHandler(error);

        addToast({
          color: 'warning',
          title: 'Aviso',
          description: errorHandler.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });

        setLoadingCatalog(false);
      }
    }

    loadData();
    loadServiceCatalog();
  }, []);

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

  async function handleCreateTicket() {
    try {
      setLoadingCreateTicket(true);

      const ticketData: ITicketProps = await createTicket({
        title,
        description,
        categoryId: cateogorySelected?.id,
        priorityId: prioritySelected?.id,
        teamSlug: userDetails?.teamSlug,
        subTeamSlug: userDetails?.teamSlug
      });

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'Seu chamado foi aberto',
        timeout: 3000,
        shouldShowTimeoutProgress: true
      });

      if (files.length > 0) {
        setLoadingSendingFiles(true);

        await attachingTicketFiles(ticketData.id, files);

        await handleRegisterTicketWorklog(description, ticketData.id, files);

        addToast({
          color: 'success',
          title: 'Sucesso',
          description: 'Arquivos anexados',
          timeout: 3000,
          shouldShowTimeoutProgress: true
        });

        setFiles([]);
        onClose();
        setTitle("");
        setDescription(""); 
        setCategorySelected(undefined);
        setPrioritySelected(undefined);

        setLoadingCreateTicket(false);
        setLoadingSendingFiles(false);
      } else {
        await handleRegisterTicketWorklog(description, ticketData.id);

        onClose();
        setTitle("");
        setDescription(""); 
        setCategorySelected(undefined);
        setPrioritySelected(undefined);

        setLoadingCreateTicket(false);
      }
    } catch (error) {
      setLoadingSendingFiles(false);
      setLoadingCreateTicket(false);
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

  const inputs = useMemo(() => {
    let item = catalog.find((data) => data.id == Number(catalogSelected.currentKey));

    return (
      <CreateTicketInputsGeneration
        catalog={item}
        user={userDetails}
        onClose={onClose}
      />
    )
  }, [ catalogSelected ]);

  return (
    <Modal
      size="full"
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent className="overflow-scroll scrollbar-hide">
        <ModalHeader>
          <h1>Abrindo Chamado</h1>
        </ModalHeader>
        <Divider />
        <ModalBody>
          {loadingCreateTicket ? (
            loadingSendingFiles ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Spinner size="md" label="Enviando os anexos..." />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Spinner size="md" label="Abrindo seu chamado..." />
              </div>
            )
          ) : (
            <div className="flex flex-row gap-4">
              <div className="flex flex-col gap-4 flex-1 flex-wrap">
                {loadingCatalog ? (
                  <div className="p-4">
                    <Spinner size="sm" />
                  </div>
                ) : (
                  <Select
                    items={catalog}
                    label="Abrir catalogo"
                    labelPlacement="outside"
                    selectedKeys={catalogSelected}
                    onSelectionChange={setCatalogSelected}
                  >
                    {(item) => <SelectItem key={item.id}>{item.service}</SelectItem>}
                  </Select>
                )}
                <Divider />
                <div className="flex gap-4 flex-wrap">
                  <div className="flex flex-col items-start flex-1">
                    <User
                      name="Pessoa de contato"
                      description={userDetails?.userName}
                      avatarProps={{
                        name: userDetails?.userName,
                        showFallback: true,
                        src: `${process.env.baseUrl}/avatar/${userDetails?.userSlug}/${userDetails?.avatar}`
                      }}
                    />
                    {userDetails?.isOnTeam != undefined ? (
                      userDetails.isOnTeam == 1 ? (null) : (
                        <small className="text-danger">Você precisa estar numa equipe para abrir chamados.</small>
                      )
                    ) : (
                      null
                    )}
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
                <div className="flex gap-4 flex-wrap">
                  <Input
                    readOnly
                    type="text"
                    value={userDetails?.phoneNumber}
                    label='Telefone'
                    startContent={<FiPhone />}
                    className="flex-1"
                  />
                  <Input
                    value={userDetails?.whatsNumber}
                    disabled={false}
                    readOnly
                    label='Whatsapp'
                    startContent={<FaWhatsapp />}
                    className="flex-1"
                  />
                </div>
                <Divider />
                <div className="flex flex-row gap-4">
                  <label htmlFor="inputFile" className="flex items-center gap-2">
                    <h2>Anexos</h2>
                    <span className="border-2 rounded-full hover:cursor-pointer">
                      <PlusIcon size={20} height={20} width={20} />
                    </span>
                  </label>
                  <Input
                    className="hidden"
                    type="file"
                    id="inputFile"
                    multiple
                    accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf"
                    onChange={(e) => gettingAttachments(e)}
                  />
                </div>
                {files && (
                  <div className="flex flex-wrap gap-2">
                    {filesComponent()}
                  </div>
                )}
              </div>
              <Divider orientation="vertical" />
              <div className="flex flex-col flex-1 gap-4 flex-wrap">
                {loadingData ? (
                  <Spinner size="md" />
                ) : (
                  <div className="flex flex-col flex-wrap gap-4">
                    {inputs}
                  </div>
                )}
              </div>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
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
