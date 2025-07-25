'use client';

import {
  addToast,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  SharedSelection,
  Spinner,
  User
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { IServiceCatalog, IUsersReport } from "@/types";
import ErrorHandler from "../_utils/errorHandler";
import { FiMail, FiPhone } from "react-icons/fi";
import {
  getUserDetailsForTicket
} from "../tickets/actions";
import { PlusIcon } from "./plusIcon";
import { FaWhatsapp } from "react-icons/fa6";
import { getServiceCatalog } from "../settings/actions";
import CreateTicketInputsGeneration from "./createTicketInputsGeneration";
import { phoneMasked, whatsMasked } from "../_utils/masks";

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

  const inputs = useMemo(() => {
    let item = catalog.find((data) => data.id == Number(catalogSelected.currentKey));

    return (
      <CreateTicketInputsGeneration
        catalog={item}
        user={userDetails}
        onClose={onClose}
      />
    )
  }, [ catalogSelected, isOpen ]);

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
                  {userDetails?.phoneNumber && <Input
                    readOnly
                    type="text"
                    value={phoneMasked(userDetails.phoneNumber)}
                    label='Telefone'
                    startContent={<FiPhone />}
                    className="flex-1"
                  />}
                  {userDetails?.whatsNumber && <Input
                    value={whatsMasked(userDetails?.whatsNumber)}
                    disabled={false}
                    readOnly
                    label='Whatsapp'
                    startContent={<FaWhatsapp />}
                    className="flex-1"
                  />}
                </div>
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
