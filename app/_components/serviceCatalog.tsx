'use client';

import { ICreateService, IServiceCatalogProps, ITicketCategoryProps, ITicketPriorityProps } from "@/types";
import { Input } from "@heroui/input";
import { addToast, Button, Card, CardBody, Chip, Divider, Form, Listbox, ListboxItem, ScrollShadow, Select, Selection, SelectItem, SharedSelection, Spinner } from "@heroui/react";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import ErrorHandler from "../_utils/errorHandler";
import { getTicketCategoriesList, getTicketPrioritiesList } from "../tickets/actions";
import { PlusIcon } from "./plusIcon";
import { createCatalogsService } from "../settings/actions";

const serviceCatalogKeys: IServiceCatalogProps[] = [
  {desc: "Nome", key: "informName"},
  {desc: "Número de Telefone", key: "informPhoneNumber"},
  {desc: "Número de Whatsapp", key: "informWhatsNumber"},
  {desc: "Usuário", key: "informUser"},
  {desc: "Nota Fiscal (NF)", key: "informNf"},
  {desc: "Condição", key: "informCondition"},
  {desc: "Erro", key: "informError"},
  {desc: "E-mail", key: "informEmail"},
  {desc: "Setor", key: "informSector"},
  {desc: "Unidade/Filial", key: "informPlant"},
  {desc: "Código de RH", key: "informRHCode"},
  {desc: "Descrição", key: "informDescription"},
];

export default function ServiceCatalog() {
  const [loadingTicketCategories, setLoadingTicketCategories] = useState(false);
  const [loadingTicketPriorities, setLoadingTicketPriorities] = useState(false);
  const [loadingCreateService, setLoadingCreateService] = useState(false);
  const [ticketCategories, setTicketCategories] = useState<ITicketCategoryProps[]>([]);
  const [ticketPriorities, setTicketPriorities] = useState<ITicketPriorityProps[]>([]);
  const [ticketCategorySelected, setTicketCategorySelected] = useState<SharedSelection>();
  const [ticketCategorySelectedData, setTicketCategorySelectedData] = useState<ITicketCategoryProps>();
  const [ticketPrioritySelected, setTicketPrioritySelected] = useState<SharedSelection>();
  const [ticketPrioritySelectedData, setTicketPrioritySelectedData] = useState<ITicketPriorityProps>();
  const [selectedServiceCatalogKeys, setSelectedServiceCatalogKeys] = useState<Selection>(new Set());
  const [service, setService] = useState("");

  const arrayValues = Array.from(selectedServiceCatalogKeys);

  useEffect(() => {
    async function loadTicketCategoriesData() {
      try {
        setLoadingTicketCategories(true);

        const ticketCategoriesData = await getTicketCategoriesList();

        setTicketCategories(ticketCategoriesData);

        setLoadingTicketCategories(false);
      } catch (error) {
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
        setLoadingTicketPriorities(true);

        const ticketPrioritiesData = await getTicketPrioritiesList();

        setTicketPriorities(ticketPrioritiesData);

        setLoadingTicketPriorities(false);
      } catch (error) {
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

    loadTicketCategoriesData();
    loadTicketPrioritiesData();
  }, []);

  const gettingSelectedPriority = (e: ChangeEvent<HTMLSelectElement>) => {
    let priorityId = Number(e.target.value);

    if (ticketPrioritySelected) {
      let prioritySelected = ticketPriorities.filter((priority) => priority.id == priorityId)[0];

      setTicketPrioritySelectedData(prioritySelected);
    }
  }

  const prioritiesSelect = useMemo(() => {
    let prioritiesData = [...ticketPriorities];

    if (ticketCategorySelected) {
      let categorySelected = ticketCategories.filter((category) => category.id == Number(ticketCategorySelected.currentKey))[0];

      setTicketCategorySelectedData(categorySelected);

      prioritiesData = ticketPriorities.filter((ticketPriority) => {
        return ticketPriority.ticketCategoryId == Number(ticketCategorySelected.currentKey);
      });
    }

    return (
      <Select
        label="Prioridade"
        labelPlacement="outside"
        placeholder="Esolha a prioridade para esse serviço"
        items={prioritiesData}
        isRequired
        selectedKeys={ticketPrioritySelected}
        onSelectionChange={setTicketPrioritySelected}
      > 
        {(ticketPriority) => <SelectItem key={ticketPriority.id}>{ticketPriority.priorityName}</SelectItem>}
      </Select>
    );
  }, [ ticketCategorySelected ]);

  const priorityMemo = useMemo(() => {
    if (ticketPrioritySelected) {
      let priorityData = ticketPriorities.filter((ticketPriority) => {
        return ticketPriority.id == Number(ticketPrioritySelected.currentKey);
      })[0];

      setTicketPrioritySelectedData(priorityData);

      return (
        <Input
          label="Prioridade"
          labelPlacement="outside"
          value={priorityData.priorityName}
          isReadOnly
        />
      );
    }
  }, [ ticketPrioritySelected ]);

  const selectedkeyComponent = useMemo(() => {
    if (!arrayValues.length) {
      return null;
    }

    return (
      <ScrollShadow
        hideScrollBar
        className="w-full flex py-0.5 px-2 gap-1 flex-wrap"
        orientation="horizontal"
      >
        {arrayValues.map((value) => (
          <Chip key={value}>{serviceCatalogKeys.find((serviceKey) => `${serviceKey.key}` === `${value}`).desc}</Chip>
        ))}
      </ScrollShadow>
    );
  }, [arrayValues.length]);

  const handleCreateServiceCatalog = async () => {
    try {
      setLoadingCreateService(true);

      let serviceData = new Object();

      arrayValues.forEach((value) => {
        serviceData[value] = true;
      });

      serviceData["service"] = service;
      serviceData["ticketCategoryId"] = ticketCategorySelectedData?.id;
      serviceData["ticketPriorityId"] = ticketPrioritySelectedData?.id;

      await createCatalogsService(serviceData as ICreateService);

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: "Serviço criado e adicionado ao catalogo",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });

      setService("");
      setSelectedServiceCatalogKeys(new Set());
      setTicketCategorySelected(undefined);
      setTicketPrioritySelected(undefined);
      setLoadingCreateService(false);
    } catch (error) {
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
    <div className="flex flex-col gap-4">
      {loadingCreateService ? (
        <div className="text-center p-10">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="flex gap-4">
          <div className="flex flex-col flex-1 gap-4">
            <Form
              onSubmit={(e) => {
                e.preventDefault();

                handleCreateServiceCatalog();
              }}
            >
              <Input
                label="Serviço"
                labelPlacement="outside"
                placeholder="Digite o texto do serviço"
                isRequired
                value={service}
                onValueChange={setService}
              />
              <Select
                label="Categoria"
                labelPlacement="outside"
                placeholder="Esolha a categoria para esse serviço"
                items={ticketCategories}
                isLoading={loadingTicketCategories}
                onSelectionChange={setTicketCategorySelected}
                isRequired
              >
                {(ticketCategory) => <SelectItem key={ticketCategory.id}>{ticketCategory.categoryName}</SelectItem>}
              </Select>
              {ticketCategorySelected && (
                prioritiesSelect
              )}
              <div>
                <Button
                  type="submit"
                  color="primary"
                  startContent={<PlusIcon height={20} size={20} width={20} />}
                >Criar</Button>
              </div>
            </Form>
            <Listbox
              items={serviceCatalogKeys}
              selectionMode="multiple"
              selectedKeys={selectedServiceCatalogKeys}
              onSelectionChange={setSelectedServiceCatalogKeys}
            >
              {(serviceCatalog) => <ListboxItem key={serviceCatalog.key}>{serviceCatalog.desc}</ListboxItem>}
            </Listbox>
          </div>
          <Divider orientation="vertical" />
          <div className="flex-1">
            <Card>
              <CardBody className="flex flex-col gap-4 flex-wrap">
                <h1 className="text-large">{service}</h1>
                <Divider />
                {ticketCategorySelectedData && (
                  <Input
                  label="Categoria"
                  labelPlacement="outside"
                  value={ticketCategorySelectedData.categoryName}
                  isReadOnly
                  />
                )}
                {priorityMemo}
                <Divider />
                <span className="text-medium">O usuário vai precisar preencher os seguintes dados na abertura do chamado:</span>
                {selectedkeyComponent}
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}