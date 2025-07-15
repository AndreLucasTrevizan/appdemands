'use client';

import { ITicketCategoryProps, ITicketPriorityProps } from "@/types";
import {
  addToast,
  Button,
  Input,
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
import { getTicketPrioritiesList } from "../tickets/actions";
import ModalCreateTicketPriority from "./modalCreateTicketPriority";

export default function TicketPrioritiesTable() {
  const { isOpen, onClose, onOpenChange, onOpen } = useDisclosure();
  const [filterValue, setFilterValue] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(5);
  const [priorities, setPriorities] = useState<ITicketPriorityProps[]>([]);

  const pages = Math.ceil(priorities.length / rows);

  const [loadingPriorities, setLoadingPriorities] = useState<boolean>(false);

  useEffect(() => {
    async function loadCategoriesData() {
      try {
        setLoadingPriorities(true);

        const categoriesData = await getTicketPrioritiesList();

        setPriorities(categoriesData);

        setLoadingPriorities(false);
      } catch (error) {
        setLoadingPriorities(false);
        
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

    loadCategoriesData();
  }, []);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...priorities];

    filteredUsers = priorities.filter((category) => category.priorityName.toLowerCase().includes(filterValue.toLowerCase()));
    
    return filteredUsers;
  }, [ priorities, filterValue ]);

  const items = useMemo(() => {
    const start = (page - 1) * rows;
    const end = start + rows;

    return filteredItems.slice(start, end);
  }, [ page, rows, filteredItems ]);

  async function loadPrioritiesData() {
    try {
      setLoadingPriorities(true);

      const categoriesData = await getTicketPrioritiesList();

      setPriorities(categoriesData);

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'Lista de prioridades atualizada',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });

      setLoadingPriorities(false);
    } catch (error) {
      setLoadingPriorities(false);
        
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
      <ModalCreateTicketPriority
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        priorities={priorities}
        setPriorities={setPriorities}
        key={'createTicketPriotities'}
      />
      <Table
        isStriped
        isCompact
        topContent={
          <div className="flex flex-col gap-4">
            <h1>Lista de Prioridades de Chamados</h1>
            <div className="flex justify-between items-center">
              <Input
                startContent={
                  <SearchIcon />
                }
                placeholder="Buscar prioridade..."
                type="search"
                className="max-w-[40%]"
                onChange={(e) => setFilterValue(e.target.value)}
              />
              <div className="flex gap-2 items-center">
                <span>Linhas por página</span>
                <select onChange={(e) => setRows(Number(e.target.value))}>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="100">100</option>
                </select>
                <Tooltip content="Atualizar lista de prioridades">
                  <Button isIconOnly variant="light" onPress={() => loadPrioritiesData()}><FiRefreshCcw /></Button>
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
          <TableColumn key={'userName'}>ID</TableColumn>
          <TableColumn key={'email'}>NOME</TableColumn>
          <TableColumn key={'category'}>CATEGORIA</TableColumn>
          <TableColumn key={'status'}>SLUG</TableColumn>
        </TableHeader>
        <TableBody
          items={loadingPriorities ? [] : items}
          emptyContent={
            <div className="flex flex-col gap-4 items-center justify-center">
              <SearchIcon />
              <span>Nenhuma prioridades de chamados encontrada</span>
            </div>
          }
          isLoading={loadingPriorities}
          loadingContent={<Spinner size="md" />}
        >
          {(ticketPriority) => (
            <TableRow>
              <TableCell>
                <span>{ticketPriority.id}</span>
              </TableCell>
              <TableCell>
                <span>{ticketPriority.priorityName}</span>
              </TableCell>
              <TableCell>
                <span>{ticketPriority.categoryName}</span>
              </TableCell>
              <TableCell>
                <span>{ticketPriority.prioritySlug}</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}