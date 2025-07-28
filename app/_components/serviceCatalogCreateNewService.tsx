'use client';

import { ICreateService, IQueuesProps, IServiceCatalogField, IServiceCatalogProps, ITicketCategoryProps, ITicketPriorityProps } from "@/types";
import { Input, Textarea } from "@heroui/input";
import { addToast, Button, Card, CardBody, Chip, Divider, Form, Listbox, ListboxItem, ScrollShadow, Select, Selection, SelectItem, SharedSelection, Spinner } from "@heroui/react";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import ErrorHandler from "../_utils/errorHandler";
import { getTicketCategoriesList, getTicketPrioritiesList } from "../tickets/actions";
import { PlusIcon } from "./plusIcon";
import { createCatalogsService, listServiceCatalogFields } from "../settings/actions";
import { listQueues } from "../queues/actions";
import ChipPriority from "./chipPriority";

export default function ServiceCatalogCreateNewService() {
  const [loadingTicketCategories, setLoadingTicketCategories] = useState(false);
  const [loadingTicketPriorities, setLoadingTicketPriorities] = useState(false);
  const [loadingListQueues, setLoadingListQueues] = useState(false);
  const [loadingCreateService, setLoadingCreateService] = useState(false);
  const [ticketCategories, setTicketCategories] = useState<ITicketCategoryProps[]>([]);
  const [ticketPriorities, setTicketPriorities] = useState<ITicketPriorityProps[]>([]);
  const [ticketCategorySelected, setTicketCategorySelected] = useState<SharedSelection>();
  const [ticketCategorySelectedData, setTicketCategorySelectedData] = useState<ITicketCategoryProps>();
  const [ticketPrioritySelected, setTicketPrioritySelected] = useState<SharedSelection>();
  const [ticketPrioritySelectedData, setTicketPrioritySelectedData] = useState<ITicketPriorityProps>();
  const [selectedServiceCatalogKeys, setSelectedServiceCatalogKeys] = useState<Selection>(new Set());
  const [queues, setQueues] = useState<IQueuesProps[]>([]);
  const [selectedQueue, setSelectedQueue] = useState<SharedSelection>(new Set());
  const [selectedQueueData, setSelectedQueueData] = useState<IQueuesProps>();
  const [service, setService] = useState("");
  const [loadingListField, setLoadingListField] = useState(false);
  const [fields, setFields] = useState<IServiceCatalogField[]>([]);
  const [description, setDescription] = useState("");

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

    async function loadFieldsData() {
      try {
        setLoadingListField(true);

        const fieldsData = await listServiceCatalogFields();

        setFields(fieldsData);

        setLoadingListField(false);
      } catch (error) {
        const errorHandler = new ErrorHandler(error);

        addToast({
          color: 'warning',
          title: 'Aviso',
          description: errorHandler.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });

        setLoadingListField(false);
      }
    }

    async function loadQueues() {
      try {
        setLoadingListQueues(true);

        const response = await listQueues();

        setQueues(response);

        setLoadingListQueues(false);
      } catch (error) {
        const errorHandler = new ErrorHandler(error);

        addToast({
          color: 'warning',
          title: 'Aviso',
          description: errorHandler.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });

        setLoadingListQueues(false);
      }
    }

    loadTicketCategoriesData();
    loadTicketPrioritiesData();
    loadFieldsData();
    loadQueues();
  }, []);

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
        <ChipPriority name={priorityData.priorityName} />
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
        className="w-full flex flex-col py-0.5 px-2 gap-1 flex-wrap"
        orientation="horizontal"
      >
        {arrayValues.map((value) => (
          <Chip color="primary" key={value}>{fields.find((serviceKey) => `${serviceKey.id}` === `${value}`).label}</Chip>
        ))}
      </ScrollShadow>
    );
  }, [arrayValues.length]);

  const handleCreateServiceCatalog = async () => {
    try {
      setLoadingCreateService(true);
      
      let serviceData = new Object(); 
      let listOfFields = [];

      arrayValues.forEach((value) => {
        let label = fields.find((serviceKey) => `${serviceKey.id}` == `${value}`).label;

        let data = {
          label,
        }
        
        listOfFields.push(data);
      });

      serviceData["service"] = service;
      serviceData["fields"] = JSON.stringify(listOfFields);
      serviceData["serviceDescription"] = `${description}\n\n`;
      serviceData["queueId"] = selectedQueueData?.id;
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
      setSelectedQueue(undefined);
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

  const queueComp = useMemo(() => {
    let queueData = queues.find((item) => item.id == Number(selectedQueue?.currentKey));

    if (queueData) {
      setSelectedQueueData(queueData);

      return (
        <span>Fila de {queueData?.queueName}</span>
      );
    } else {
      return null;
    }
}, [ selectedQueue ]);

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
              className="flex flex-col gap-4"
            >
              <Input
                label="Serviço"
                labelPlacement="outside"
                placeholder="Digite o texto do serviço"
                isRequired
                value={service}
                onValueChange={setService}
              />
              <Textarea
                value={description}
                onValueChange={setDescription}
                label="Descrição"
                labelPlacement="outside"
                placeholder="Criar um usuário para..."
              />
              <Select
                label="Categoria"
                labelPlacement="outside"
                placeholder="Escolha a categoria para esse serviço"
                items={ticketCategories}
                isLoading={loadingTicketCategories}
                onSelectionChange={setTicketCategorySelected}
                isRequired
              >
                {(ticketCategory) => <SelectItem key={ticketCategory.id}>{ticketCategory.categoryName}</SelectItem>}
              </Select>
              <Select
                label="Fila de Atendimento"
                labelPlacement="outside"
                placeholder="Selecione a fila de atendimento desse ticket"
                items={queues}
                onSelectionChange={setSelectedQueue}
                isLoading={loadingListQueues}
                isRequired
              >
                {(item) => <SelectItem key={item.id}>{item.queueName}</SelectItem>}
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
            {loadingListField ? (
              <div className="p-4">
                <Spinner size="md" />
              </div>
            ) : (
              <Listbox
                items={fields}
                selectionMode="multiple"
                selectedKeys={selectedServiceCatalogKeys}
                onSelectionChange={setSelectedServiceCatalogKeys}
              >
                {(serviceCatalog) => <ListboxItem key={serviceCatalog.id}>{serviceCatalog.label}</ListboxItem>}
              </Listbox>
            )}
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
                {queueComp}
                <Divider />
                <span className="text-medium">{description}</span>
                {selectedkeyComponent}
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}