'use client';

import { ITicketCategoryProps } from "@/types";
import {
  addToast,
  Button,
  Input,
  Pagination,
  Selection,
  SortDescriptor,
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
import { getTicketCategoriesList } from "../tickets/actions";
import ModalCreateTicketCategory from "./modalCreateTicketCategory";
import { FaChevronDown, FaHandDots } from "react-icons/fa6";
import { PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import { utils, writeFile } from "xlsx";

interface ITicketCategoryTableColumns {
  name: string,
  uid: string,
  sortable: boolean,
}

const tableColumns: ITicketCategoryTableColumns[] = [
  {name: 'ID', uid: 'ID', sortable: true},
  {name: 'CATEGORIA', uid: 'SLA', sortable: true},
  {name: 'SLUG', uid: 'SLA EM SEGUNDOS', sortable: true},
  {name: 'DESCRIÇÃO', uid: 'PRIORIDADE', sortable: true},
  {name: 'CRIADO EM', uid: 'CRIADO EM', sortable: true},
  {name: 'ATUALIZADO EM', uid: 'ATUALIZADO EM', sortable: true},
  {name: 'ACTIONS', uid: 'ACTIONS', sortable: false},
];

const INITIAL_VISIBLE_COLUMNS = ["ID", "CATEGORIA", "SLUG", "DESCRIÇÃO", "ACTIONS"];

export default function TicketCategoriesTable() {
  const { isOpen, onClose, onOpenChange, onOpen } = useDisclosure();
  const [filterValue, setFilterValue] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(5);
  const [categories, setCategories] = useState<ITicketCategoryProps[]>([]);
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'CATEGORIA',
    direction: 'ascending',
  });

  const pages = Math.ceil(categories.length / rows);

  const headerColumns = useMemo(() => {
    return tableColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const [loadingCategories, setLoadingCategories] = useState<boolean>(false);

  const hasSearchFilter = Boolean(filterValue);

  useEffect(() => {
    async function loadCategoriesData() {
      try {
        setLoadingCategories(true);

        const categoriesData = await getTicketCategoriesList();

        setCategories(categoriesData);

        setLoadingCategories(false);
      } catch (error) {
        setLoadingCategories(false);
        
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
    let filteredCategories = [...categories];

    if (hasSearchFilter) {
      filteredCategories = filteredCategories.filter((slas) =>
        slas.categoryName.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredCategories;
  }, [categories, filterValue ]);

  const items = useMemo(() => {
    const start = (page - 1) * rows;
    const end = start + rows;

    return filteredItems.slice(start, end);
  }, [ page, rows, filteredItems ]);

  const sortedItems = useMemo(() => {
    let attendantsToSort = [...items];

    attendantsToSort = attendantsToSort.sort((a: ITicketCategoryProps, b: ITicketCategoryProps) => {
      switch(sortDescriptor.column) {
        case "ID":
          const idA = a["id" as keyof ITicketCategoryProps] as number;
          const idB = b["id" as keyof ITicketCategoryProps] as number;
          const cmpId = idA < idB ? -1 : idA > idB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpId : cmpId; 
        case "SLA":
          const slaA = a["categoryName" as keyof ITicketCategoryProps] as number;
          const slaB = b["categoryName" as keyof ITicketCategoryProps] as number;
          const cmpSla = slaA < slaB ? -1 : slaA > slaB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpSla : cmpSla; 
        case "SLA EM SEGUNDOS":
          const slaInSecondsA = a["slug" as keyof ITicketCategoryProps] as number;
          const slaInSecondsB = b["slug" as keyof ITicketCategoryProps] as number;
          const cmpSlaInSeconds = slaInSecondsA < slaInSecondsB ? -1 : slaInSecondsA > slaInSecondsB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpSlaInSeconds : cmpSlaInSeconds;
        case "PRIORIDADE":
          const priorityA = a["categoryDesc" as keyof ITicketCategoryProps] as number;
          const priorityB = b["categoryDesc" as keyof ITicketCategoryProps] as number;
          const cmpPriority = priorityA < priorityB ? -1 : priorityA > priorityB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpPriority : cmpPriority;
        case "HORAS PARA PRIMEIRA RESPOSTA":
          const hfrA = a["" as keyof ITicketCategoryProps] as number;
          const hfrB = b["hoursToFirstResponse" as keyof ITicketCategoryProps] as number;
          const cmpHfr = hfrA < hfrB ? -1 : hfrA > hfrB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpHfr : cmpHfr;
        case "HORAS PARA PRIMEIRA RESPOSTA EM SEGUNDOS":
          const hfrisAtA = a["hoursToFirstResponseInSeconds" as keyof ITicketCategoryProps] as number;
          const hfrisAtB = b["hoursToFirstResponseInSeconds" as keyof ITicketCategoryProps] as number;
          const cmpHfrisAt = hfrisAtA < hfrisAtB ? -1 : hfrisAtA > hfrisAtB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpHfrisAt : cmpHfrisAt;
        case "CRIADO EM":
          const createdAtA = a["createdAt" as keyof ITicketCategoryProps] as number;
          const createdAtB = b["createdAt" as keyof ITicketCategoryProps] as number;
          const cmpCreatedAt = createdAtA < createdAtB ? -1 : createdAtA > createdAtB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpCreatedAt : cmpCreatedAt;
        case "ATUALIZADO EM":
          const updatedAtA = a["updatedAt" as keyof ITicketCategoryProps] as number;
          const updatedAtB = b["updatedAt" as keyof ITicketCategoryProps] as number;
          const cmpUpdatedAt = updatedAtA < updatedAtB ? -1 : updatedAtA > updatedAtB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpUpdatedAt : cmpUpdatedAt;
      }
    });

    return attendantsToSort;
  }, [sortDescriptor, items]);

  async function loadUserData() {
    try {
      setLoadingCategories(true);

      const categoriesData = await getTicketCategoriesList();

      setCategories(categoriesData);

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'Lista de categorias atualizada',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });

      setLoadingCategories(false);
    } catch (error) {
      setLoadingCategories(false);
        
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
      <ModalCreateTicketCategory
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        categories={categories}
        setCategories={setCategories}
        key={'createTicketCategory'}
      />
      <Table
        isStriped
        isCompact
        topContent={
          <div className="flex flex-col gap-4">
            <h1>Lista de Categorias de Chamados</h1>
            <div className="flex justify-between items-center">
              <Input
                startContent={
                  <SearchIcon />
                }
                placeholder="Buscar categoria..."
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
                <Tooltip content="Atualizar lista de usuários">
                  <Button isIconOnly variant="light" onPress={() => loadUserData()}><FiRefreshCcw /></Button>
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
          <TableColumn key={'id'}>ID</TableColumn>
          <TableColumn key={'name'}>NOME</TableColumn>
          <TableColumn key={'desc'}>DESCRIÇÃO</TableColumn>
        </TableHeader>
        <TableBody
          items={loadingCategories ? [] : items}
          emptyContent={
            <div className="flex flex-col gap-4 items-center justify-center">
              <SearchIcon />
              <span>Nenhuma categoria de chamados encontrada</span>
            </div>
          }
          isLoading={loadingCategories}
          loadingContent={<Spinner size="md" />}
        >
          {(ticketCategory) => (
            <TableRow>
              <TableCell>
                <span>{ticketCategory.id}</span>
              </TableCell>
              <TableCell>
                <span>{ticketCategory.categoryName}</span>
              </TableCell>
              <TableCell>
                <span>{ticketCategory.categoryDesc}</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}