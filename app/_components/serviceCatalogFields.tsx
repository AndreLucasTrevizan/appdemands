'use client';

import { Button } from "@heroui/button";
import { PlusIcon } from "./plusIcon";
import { Input } from "@heroui/input";
import { useEffect, useState } from "react";
import { addToast, Chip, Divider, Form, Spinner } from "@heroui/react";
import ErrorHandler from "../_utils/errorHandler";
import { createServiceCatalogField, listServiceCatalogFields } from "../settings/actions";
import { IServiceCatalogField } from "@/types";

export default function ServiceCatalogObligatoryFields() {
  const [loadingListField, setLoadingListField] = useState(false);
  const [loadingCreateField, setLoadingCreateField] = useState(false);
  const [label, setLabel] = useState('');
  const [fields, setFields] = useState<IServiceCatalogField[]>([]);

  useEffect(() => {
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

        setLoadingCreateField(false);
      }
    }

    loadFieldsData();
  }, []);

  const handleCreateField = async () => {
    try {
      setLoadingCreateField(true);

      const field = await createServiceCatalogField({ label });

      let fieldsList = [...fields];

      fieldsList.push(field);

      fieldsList = fieldsList.sort((a, b) => a.label.localeCompare(b.label));

      setFields(fieldsList);

      setLoadingCreateField(false);
    } catch (error) {
      const errorHandler = new ErrorHandler(error);

      addToast({
        color: 'warning',
        title: 'Aviso',
        description: errorHandler.message,
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });

      setLoadingCreateField(false);
    }
  }
  
  return (
    <div className="flex flex-col gap-4 flex-wrap">
      {loadingCreateField ? (
        <div className="p-4">
          <Spinner size="md" label="Criando campo..." />
        </div>
      ) : (
        <Form
          className="flex flex-row gap-4 flex-wrap items-end"
          onSubmit={(e) => {
            e.preventDefault();
            
            handleCreateField();
          }}
        >
          <Input
            placeholder="Digite o nome do campo obrigatório"
            value={label}
            onValueChange={setLabel}
            className="max-w-[33%]"
            label="Nome do Campo"
            labelPlacement="outside"
            required
          />
          <Button
            color="primary"
            startContent={
              <PlusIcon
                height={20}
                size={20}
                width={20}
              />
            }
            type="submit"
            >
            Criar
          </Button>
        </Form>
      )}
      <Divider />
      <div className="flex flex-wrap gap-4">
        {loadingListField ? (
          <div className="p-4">
            <Spinner size="md" label="Carregando campos..." />
          </div>
        ) : (
          fields.length > 0 ? (
            <div className="flex flex-row gap-4 flex-wrap">
              {fields.map((field) => (
                <Chip
                  color="primary"
                  key={field.id}
                >
                  {field.label}
                </Chip>
              ))}
            </div>
          ) : (
            <div className="flex flex-row gap-4 flex-wrap">
              <small>Nenhum campo encontrado</small>
            </div>
          )
        )}
      </div>
    </div>
  );
}
