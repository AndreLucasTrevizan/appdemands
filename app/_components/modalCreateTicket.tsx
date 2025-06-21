'use client';

import {
  addToast,
  Button,
  Divider,
  Input,
  InputProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Textarea,
  Tooltip,
  User
} from "@heroui/react";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { ITicketCategoryProps, ITicketPriorityProps, ITicketProps, IUsersReport } from "@/types";
import ErrorHandler from "../_utils/errorHandler";
import { FiMail, FiPhone } from "react-icons/fi";
import TicketSquare from "./ticketPreview";
import { attachingTicketFiles, createTicket, getTicketCategoriesList, getTicketPrioritiesList, getUserDetailsForTicket } from "../tickets/actions";
import Image from "next/image";
import DeleteIcon from "./deleteIcon";
import { PlusIcon } from "./plusIcon";
import { FaWhatsapp } from "react-icons/fa6";
import { attachingTicketWorklogFiles, handleRegisterTicketWorklog } from "../ticket_worklog/actions";

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
  const [loadingTicketCategoriesData, setLoadingTicketCategoriesData] = useState<boolean>(false);
  const [loadingTicketPrioritiesData, setLoadingTicketPrioritiesData] = useState<boolean>(false);
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
          description: errorHandler.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      }
    }
    async function loadTicketPrioritiesData() {
      try {
        setLoadingTicketPrioritiesData(true);

        const prioritiesData: ITicketPriorityProps[] = await getTicketPrioritiesList();
        const userData = await getUserDetailsForTicket();

        if (userData?.isAttendant == 1) {
          setTicketPriorities(prioritiesData);
        } else {
          let prioritiesDataInc: ITicketPriorityProps[] = [];

          prioritiesDataInc = prioritiesData.filter((priority) => {
            priority.priorityName != "Emergência";
          });

          setTicketPriorities(prioritiesDataInc);
        }

        setLoadingTicketPrioritiesData(false);
      } catch (error) {
        setLoadingTicketPrioritiesData(false);

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
    async function loadTicketCategoriesData() {
      try {
        setLoadingTicketCategoriesData(true);

        const categoriesData: ITicketCategoryProps[] = await getTicketCategoriesList();

        setTicketCategories(categoriesData);

        setLoadingTicketCategoriesData(false);
      } catch (error) {
        setLoadingTicketCategoriesData(false);

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

    loadData();
    loadTicketCategoriesData();
    loadTicketPrioritiesData();
  }, []);

  const selectPriority = (e: ChangeEvent<HTMLSelectElement>) => {
    let priority = ticketPriorities.find((priority) => `${priority.id}` == e.target.value);
    setPrioritySelected(priority);
  }

  const selectCategory = (e: ChangeEvent<HTMLSelectElement>) => {
    let category = ticketCategories.find((category) => `${category.id}` == e.target.value);
    setCategorySelected(category);
  }

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

        console.log({
          description,
          ticketData,
          files
        });

        const worklog = await handleRegisterTicketWorklog(description, ticketData.id, files);

        console.log(worklog);

        await attachingTicketWorklogFiles(ticketData.id, worklog.id, files);

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
                <Input
                  type="text"
                  placeholder="Digite o título do chamado..."
                  label="Título"
                  labelPlacement="outside"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  isRequired
                />
                <Textarea
                  placeholder="Descreva sobre a situação..."
                  label="Descrição"
                  labelPlacement="outside"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  isRequired
                />
                <div className="flex w-full flex-wrap gap-4">
                  {loadingTicketPrioritiesData ? (
                    <Spinner size="md" />
                  ) : (
                    <Select className="flex-1" label="Prioridade" onChange={(e) => selectPriority(e)} isRequired>
                      {ticketPriorities.map((priority) => (
                        <SelectItem key={priority.id}>{`${priority.priorityName} - ${priority.hours}h`}</SelectItem>
                      ))}
                    </Select>
                  )}
                  {loadingTicketCategoriesData ? (
                    <Spinner size="md" />
                  ) : (
                    <Select className="flex-1" label="Categoria" isRequired onChange={(e) => selectCategory(e)}>
                      {ticketCategories.map((category) => (
                        <SelectItem key={category.id}>{category.categoryName}</SelectItem>
                      ))}
                    </Select>
                  )}
                </div>
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
                    type="tel"
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
                    <span>Prévia do seu chamado para a T.I</span>
                    <TicketSquare
                      user={userDetails}
                      title={title}
                      priority={prioritySelected}
                      files={files}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={() => {
            setTitle('');
            setDescription('');
            setPrioritySelected(undefined);
            setCategorySelected(undefined);
            setFiles([]);

            onClose();
          }}>
            Cancelar
          </Button>
          <Button
            isDisabled={userDetails?.isOnTeam != undefined ? userDetails.isOnTeam == 1 ? false : true : false}
            color="primary"
            onPress={() => handleCreateTicket()}
          >
            Criar
          </Button>
        </ModalFooter>
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
