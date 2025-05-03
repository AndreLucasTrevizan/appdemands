'use client';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
  Input,
  Button,
  addToast,
  Spinner
} from '@heroui/react';
import { useEffect, useState } from 'react';
import ErrorHandler from '../_utils/errorHandler';
import { SearchIcon } from '@/components/icons';
import { PlusIcon } from './plusIcon';
import { api } from '../_api/api';
import { useAuthContext } from '../_contexts/AuthContext';
import { IDemandProps } from '@/types';

export default function DemandsTable() {
  const {
    userSigned
  } = useAuthContext();
  const [demands, setDemands] = useState<IDemandProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadDemands() {
      try {
        setLoading(true);

        console.log(userSigned);

        if (userSigned) {
          const response = await api.get('/demands', {
            headers: {
              Authorization: `Bearer ${userSigned!.token}`
            }
          });
  
          setDemands(response.data.demands);
        }
      } catch (error) {
        const errorHandler = new ErrorHandler(error);

        addToast({
          title: 'Aviso',
          description: errorHandler.error.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: 'warning',
        });
      } finally {
        setLoading(false);
      }
    }

    loadDemands();
  }, []);

  return (
    <Table
      aria-label="Tabela de Demandas"
      topContent={<TopContent />}
    >
      <TableHeader>
        <TableColumn>Título</TableColumn>
        <TableColumn>Descrição</TableColumn>
        <TableColumn>Analista</TableColumn>
      </TableHeader>
      <TableBody isLoading={loading} loadingContent={<Spinner variant='dots' />} items={demands} emptyContent={<EmptyContent />}>
        {(item) => (
          <TableRow key={item.id}>
            <TableCell>{item.title}</TableCell>
            <TableCell>{item.description}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

const TopContent = () => {
  return (
    <div className="flex justify-between">
      <Input
        isClearable
        placeholder='Procurar demanda...'
        className="w-full sm:max-w-[44%]"
        startContent={<SearchIcon />}
        type='search'
      />
      <Button
        color='primary'
        endContent={
          <PlusIcon
            width={24}
            height={24}
            size={24}
            props={<></>}
          />
        }
      >Criar</Button>
    </div>
  );
}

const EmptyContent = () => {
  return (
    <div className='w-full flex flex-col items-center justify-center gap-4'>
      <SearchIcon />
      <span>Não encontramos nenhuma demanda...</span>
    </div>
  );
}
