'use client';

import { IQueuesProps } from "@/types";
import {
  addToast,
  Button,
  Chip,
  Input,
  Link,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { SearchIcon } from "./searchIcon";
import { PlusIcon } from "./plusIcon";
import ErrorHandler from "../_utils/errorHandler";
import { FiRefreshCcw } from "react-icons/fi";
import ModalCreateQueue from "./modalCreateQueue";
import { listQueues } from "../queues/actions";

export default function QueuesTable() {
  const { isOpen, onClose, onOpenChange, onOpen } = useDisclosure();
  const [filterValue, setFilterValue] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(5);
  const [queues, setQueues] = useState<IQueuesProps[]>([]);
  const [loadingQueues, setLoadingQueues] = useState<boolean>(false);

  const pages = Math.ceil(queues.length / rows);

  useEffect(() => {
    async function loadQueuesData() {
      try {
        setLoadingQueues(true);

        const data = await listQueues();

        setQueues(data);

        setLoadingQueues(false);
      } catch (error) {
        setLoadingQueues(false);
        
        const errorHandler = new ErrorHandler(error);
      
        addToast({
          title: 'Aviso',
          description: errorHandler.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: 'warning',
        });
      }
    }

    loadQueuesData();
  }, []);

  const filteredItems = useMemo(() => {
    let filteredQueues = [...queues];

    filteredQueues = queues.filter((queue) => queue.queueName.toLowerCase().includes(filterValue.toLowerCase()));
  
    return filteredQueues;
  }, [ queues, filterValue ]);

  const items = useMemo(() => {
    const start = (page - 1) * rows;
    const end = start + rows;

    return filteredItems.slice(start, end);
  }, [ page, rows, filteredItems ]);

  async function loadQueuesData() {
    try {
      setLoadingQueues(true);

      const data = await listQueues();

      setQueues(data);

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'Lista de filas de atendimento atualizada',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });

      setLoadingQueues(false);
    } catch (error) {
      setLoadingQueues(false);
      
      const errorHandler = new ErrorHandler(error);
    
      addToast({
        title: 'Aviso',
        description: errorHandler.message,
        timeout: 3000,
        shouldShowTimeoutProgress: true,
        color: 'warning',
      });
    }
  }

  return (
    <div>
      <ModalCreateQueue
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        queues={queues}
        setQueues={setQueues}
        key={'createQueues'}
      />
      <Table
        isStriped
        isCompact
        topContent={
          <div className="flex flex-col gap-4">
            <h1>Lista de Filas de Atendimento</h1>
            <div className="flex justify-between flex-wrap items-center">
              <Input
                startContent={
                  <SearchIcon />
                }
                placeholder="Buscar fila..."
                type="search"
                className="sm:max-w-[40%]"
                onChange={(e) => setFilterValue(e.target.value)}
              />
              <div className="flex gap-2 items-center">
                <span>Linhas por página</span>
                <select onChange={(e) => setRows(Number(e.target.value))}>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="100">100</option>
                </select>
                <Tooltip content="Atualizar lista de filas">
                  <Button isIconOnly variant="light" onPress={() => loadQueuesData()}><FiRefreshCcw /></Button>
                </Tooltip>
                <Button
                  color="primary"
                  startContent={<PlusIcon size={20} width={20} height={20} />}
                  onPress={() => onOpenChange()}
                >Criar</Button>
              </div>
            </div>
          </div>
        }
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader>
          <TableColumn key={'queueName'}>Nome</TableColumn>
          <TableColumn key={'slug'}>Slug</TableColumn>
          <TableColumn key={'queueStatus'}>Status</TableColumn>
        </TableHeader>
        <TableBody
          items={loadingQueues ? [] : items}
          emptyContent={
            <div className="flex flex-col gap-4 items-center justify-center">
              <SearchIcon />
              <span>Nenhuma fila encontrada</span>
            </div>
          }
          isLoading={loadingQueues}
          loadingContent={<Spinner size="md" />}
        >
          {(queue) => (
            <TableRow>
              <TableCell>
                <Link
                  href={`/queues/${queue.slug}`}
                  className="hover:cursor-pointer"
                >{queue.queueName}</Link>
              </TableCell>
              <TableCell>
                <span>{queue.slug}</span>
              </TableCell>
              <TableCell>
                <Chip
                  className="text-white"
                  color={queue.queueStatus == 'ativo' ? 'success' : 'danger'}
                >{queue.queueStatus == 'ativo' ? 'Disponível' : 'Desativado'}</Chip>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}