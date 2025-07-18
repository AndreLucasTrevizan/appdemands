'use client';

import { ITicketPriorityProps, ITicketPriorityProps } from "@/types";
import {
  addToast,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { SearchIcon } from "./searchIcon";
import { PlusIcon } from "./plusIcon";
import ErrorHandler from "../_utils/errorHandler";
import { FiRefreshCcw } from "react-icons/fi";
import { getTicketPrioritiesList } from "../tickets/actions";
import ModalCreateTicketPriority from "./modalCreateTicketPriority";
import { FaChevronDown, FaHandDots } from "react-icons/fa6";
import { PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import { utils, writeFile } from "xlsx";

interface ITicketPrioritiesTableColumns {
  name: string,
  uid: string,
  sortable: boolean,
}

const tableColumns: ITicketPrioritiesTableColumns[] = [
  {name: 'ID', uid: 'ID', sortable: true},
  {name: 'PRIORIDADE', uid: 'PRIORIDADE', sortable: true},
  {name: 'SLUG', uid: 'SLUG', sortable: true},
  {name: 'ID DA CATEGORIA', uid: 'ID DA CATEGORIA', sortable: true},
  {name: 'CATEGORIA', uid: 'CATEGORIA', sortable: true},
  {name: 'CRIADO EM', uid: 'CRIADO EM', sortable: true},
  {name: 'ATUALIZADO EM', uid: 'ATUALIZADO EM', sortable: true},
  {name: 'ACTIONS', uid: 'ACTIONS', sortable: false},
];

const INITIAL_VISIBLE_COLUMNS = ["ID", "PRIORIDADE", "CATEGORIA", "DESCRIÇÃO", "ACTIONS"];

export default function TicketPrioritiesTable() {
  const { isOpen, onClose, onOpenChange, onOpen } = useDisclosure();
  const [filterValue, setFilterValue] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(5);
  const [priorities, setPriorities] = useState<ITicketPriorityProps[]>([]);
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'PRIORIDADE',
    direction: 'ascending',
  });

  const pages = Math.ceil(priorities.length / rows);

  const headerColumns = useMemo(() => {
    return tableColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const [loadingPriorities, setLoadingPriorities] = useState<boolean>(false);

  const hasSearchFilter = Boolean(filterValue);

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
    let filteredPriorities = [...priorities];

    if (hasSearchFilter) {
      filteredPriorities = filteredPriorities.filter((priorities) =>
        priorities.priorityName.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredPriorities;
  }, [priorities, filterValue ]);

  const items = useMemo(() => {
    const start = (page - 1) * rows;
    const end = start + rows;

    return filteredItems.slice(start, end);
  }, [ page, rows, filteredItems ]);

  const sortedItems = useMemo(() => {
    let attendantsToSort = [...items];

    attendantsToSort = attendantsToSort.sort((a: ITicketPriorityProps, b: ITicketPriorityProps) => {
      switch(sortDescriptor.column) {
        case "ID":
          const idA = a["id" as keyof ITicketPriorityProps] as number;
          const idB = b["id" as keyof ITicketPriorityProps] as number;
          const cmpId = idA < idB ? -1 : idA > idB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpId : cmpId; 
        case "PRIORIDADE":
          const priorityA = a["priorityName" as keyof ITicketPriorityProps] as number;
          const priorityB = b["priorityName" as keyof ITicketPriorityProps] as number;
          const cmpPriority = priorityA < priorityB ? -1 : priorityA > priorityB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpPriority : cmpPriority; 
        case "SLUG":
          const slugA = a["slug" as keyof ITicketPriorityProps] as number;
          const slugB = b["slug" as keyof ITicketPriorityProps] as number;
          const cmpSlug = slugA < slugB ? -1 : slugA > slugB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpSlug : cmpSlug;
        case "ID DA CATEGORIA":
          const categoryIdA = a["ticketCategoryId" as keyof ITicketPriorityProps] as number;
          const categoryIdB = b["ticketCategoryId" as keyof ITicketPriorityProps] as number;
          const cmpCategoryId = categoryIdA < categoryIdB ? -1 : categoryIdA > categoryIdB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpCategoryId : cmpCategoryId;
        case "CATEGORIA":
          const categoryA = a["categoryName" as keyof ITicketPriorityProps] as number;
          const categoryB = b["categoryName" as keyof ITicketPriorityProps] as number;
          const cmpCategory = categoryA < categoryB ? -1 : categoryA > categoryB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpCategory : cmpCategory;
        case "CRIADO EM":
          const createdAtA = a["createdAt" as keyof ITicketPriorityProps] as number;
          const createdAtB = b["createdAt" as keyof ITicketPriorityProps] as number;
          const cmpCreatedAt = createdAtA < createdAtB ? -1 : createdAtA > createdAtB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpCreatedAt : cmpCreatedAt;
        case "ATUALIZADO EM":
          const updatedAtA = a["updatedAt" as keyof ITicketPriorityProps] as number;
          const updatedAtB = b["updatedAt" as keyof ITicketPriorityProps] as number;
          const cmpUpdatedAt = updatedAtA < updatedAtB ? -1 : updatedAtA > updatedAtB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpUpdatedAt : cmpUpdatedAt;
      }
    });

    return attendantsToSort;
  }, [sortDescriptor, items]);

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

  const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRows(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const renderCell = useCallback((priority: ITicketPriorityProps, columnKey: string) => {
    const cellValue = priority[columnKey];

    switch (columnKey) {
      case "ID":
        return (
          <span>{priority.id}</span>
        );
      case "PRIORIDADE":
        return (
          <span>{priority.priorityName}</span>
        );
      case "SLUG":
        return (
          <span>{priority.prioritySlug}</span>
        );
      case "ID DA CATEGORIA":
        return (
          <span>{priority.ticketCategoryId}</span>
        );
      case "CATEGORIA":
        return (
          <span>{priority.categoryName}</span>
        );
      case "CRIADO EM":
        return (
          <span>{new Date(priority.createdAt).toLocaleDateString('pt-br')}</span>
        );
      case "ATUALIZADO EM":
        return (
          <span>{new Date(priority.updatedAt).toLocaleDateString('pt-br')}</span>
        );
      case "ACTIONS":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <FaHandDots className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="view">Visualizar</DropdownItem>
                <DropdownItem key="edit">Editar</DropdownItem>
                <DropdownItem key="delete">Deletar</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    priorities.length,
    hasSearchFilter,
  ]);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "Todos as categorias selecionadas"
            : `${selectedKeys.size} de ${filteredItems.length} selecionados`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Anterior
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Próxima
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const exportExcel = () => {
    const worksheet = utils.json_to_sheet(sortedItems);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Categorias de Chamados");
    let newColumns: string[] = [];
  
    tableColumns.forEach((column) => {
      let columnLowerCase = column.name.toLowerCase();
      let firstCharCapitalized = columnLowerCase.charAt(0).toUpperCase();
      newColumns.push(firstCharCapitalized + columnLowerCase.slice(1));
    });
  
    utils.sheet_add_aoa(worksheet, [newColumns], { origin: "A1" });

    const max_width = sortedItems.reduce((w, r) => Math.max(w, r.categoryName.length), 10);
    worksheet["!cols"] = [ { wch: max_width } ];
    writeFile(workbook, "Categorias de Chamados.xlsx", { compression: true });
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
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        topContent={
          <div className="flex flex-col gap-4">
            <h1>Lista de Prioridades</h1>
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
              <Dropdown>
                <DropdownTrigger className="hidden sm:flex">
                  <Button endContent={<FaChevronDown className="text-small" />} variant="flat">
                    Colunas Visíveis
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Table Columns"
                  closeOnSelect={false}
                  selectedKeys={visibleColumns}
                  selectionMode="multiple"
                  onSelectionChange={setVisibleColumns}
                >
                  {tableColumns.map((column) => (
                    <DropdownItem key={column.uid} className="capitalize">
                      {column.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <div className="flex gap-2 items-center">
                <span>Linhas por página</span>
                <select onChange={(e) => setRows(Number(e.target.value))}>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="100">100</option>
                </select>
                <Tooltip content="Atualizar lista de Prioridades">
                  <Button isIconOnly variant="light" onPress={() => loadPrioritiesData()}><FiRefreshCcw /></Button>
                </Tooltip>
                <Tooltip content="Exportar para Excel">
                  <Button
                    isIconOnly
                    variant="light"
                    startContent={<PiMicrosoftExcelLogoDuotone size={25} className="text-green-700" />}
                    onPress={() => exportExcel()}
                  />
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
        topContentPlacement="outside"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={loadingPriorities ? [] : sortedItems}
          emptyContent={
            <div className="flex flex-col gap-4 items-center justify-center">
              <SearchIcon />
              <span>Nenhuma prioridade encontrada</span>
            </div>
          }
          isLoading={loadingPriorities}
          loadingContent={<Spinner size="md" />}
        >
          {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, String(columnKey))}</TableCell>}
          </TableRow>
        )}
        </TableBody>
      </Table>
    </div>
  );
}