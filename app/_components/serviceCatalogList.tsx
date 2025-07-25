'use client';

import { IServiceCatalog } from "@/types";
import { useEffect, useMemo, useState } from "react";
import ErrorHandler from "../_utils/errorHandler";
import { Accordion, AccordionItem, addToast, Chip, Divider, Input, Spinner, Switch } from "@heroui/react";
import { getServiceCatalog, toggleServiceStatus } from "../settings/actions";
import ChipPriority from "./chipPriority";

interface IFields {
  label: string
}

export default function ServiceCatalogList() {
  const [loading, setLoading] = useState(false);
  const [loadingChangeServiceStatus, setLoadingChangeServiceStatus] = useState(false);
  const [catalog, setCatalog] = useState<IServiceCatalog[]>([]);
  const [filterValue, setFilterValue] = useState("");
  
  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoading(true);

        const catalogData = await getServiceCatalog("all");

        setCatalog(catalogData);

        setLoading(false);
      } catch (error) {
        setLoading(false);
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

    loadCatalog();
  }, []);

  const filteredCatalog = useMemo(() => {
    let filteredItems = [...catalog];

    let hasSearchFilter = Boolean(filterValue);

    if (hasSearchFilter) {
      filteredItems = catalog.filter((item) => item.service.toLowerCase().includes(filterValue.toLowerCase()));
    }

    return filteredItems;
  }, [ catalog, filterValue ]);

  const changeServiceStatus = async (item: IServiceCatalog) => {
    try {
      setLoadingChangeServiceStatus(true);

      const service = await toggleServiceStatus(item.id);

      let listOfServices = [...filteredCatalog];

      let itemToUpdateIndex = listOfServices.findIndex((data) => data.id == item.id);

      listOfServices[itemToUpdateIndex].isActive = (service as IServiceCatalog).isActive;

      listOfServices = listOfServices.sort((a, b) => a.service.localeCompare(b.service));

      setCatalog(listOfServices);

      if ((service as IServiceCatalog).isActive) {
        addToast({
          color: 'success',
          title: 'Sucesso',
          description: 'Serviço ativado no catalogo',
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      } else {
        addToast({
          color: 'success',
          title: 'Sucesso',
          description: 'Serviço desativado no catalogo',
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      }

      setLoadingChangeServiceStatus(false);
    } catch (error) {
      setLoadingChangeServiceStatus(false);
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
    <div>
      {loading ? (
        <div className="p-4">
          <Spinner size="md" label="Buscando catalogo..." />
        </div>
      ) : (
        <div className="flex flex-col gap-4 flex-wrap">
          <Input
            label="Item"
            labelPlacement="outside"
            value={filterValue}
            onValueChange={setFilterValue}
            placeholder="Buscar item..."
            className="max-w-[50%]"
          />
          {filteredCatalog ? (
            <Accordion variant="shadow">
              {filteredCatalog.map((item) => {
                return (
                  <AccordionItem
                    key={item.id}
                    title={
                      <div className="flex flex-col flex-wrap gap-4">
                        <span className="text-md">{item.service}</span>
                        <Switch size="sm" isSelected={item.isActive} onChange={() => changeServiceStatus(item)}>
                          {item.isActive ? (<span>Ativado</span>) : (<span>Desativado</span>)}
                        </Switch>
                      </div>
                    }
                  >
                    <div className="flex flex-col gap-4">
                      <span>{item.categoryName}</span>
                      <ChipPriority name={item.priorityName} time={item.slaTime} />
                      <div className="flex flex-col gap-4">
                        <span>Campos a serem preenchidos pelo usuário</span>
                        <div>
                          {(JSON.parse(item.fields) as IFields[]).map((field) => {
                            return <Chip className="mr-4" color="primary" key={field.label}>{field.label}</Chip>;
                          })}
                        </div>
                      </div>
                    </div>
                  </AccordionItem>
                )
              })}
            </Accordion>
          ) : (
            <div>
              <small>Nenhum item no catalog</small>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


