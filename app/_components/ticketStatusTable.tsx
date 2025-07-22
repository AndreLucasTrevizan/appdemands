'use client';

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
import { getTicketPrioritiesList, getTicketStatusList } from "../tickets/actions";
import ModalCreateTicketPriority from "./modalCreateTicketPriority";
import { FaChevronDown, FaHandDots } from "react-icons/fa6";
import { PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import { utils, writeFile } from "xlsx";
import { ITicketStatusProps } from "@/types";
import ModalCreateTicketStatus from "./modalCreateTicketStatus";

interface ITicketPrioritiesTableColumns {
  name: string,
  uid: string,
  sortable: boolean,
}

const tableColumns: ITicketPrioritiesTableColumns[] = [
  {name: 'ID', uid: 'ID', sortable: true},
  {name: 'STATUS', uid: 'STATUS', sortable: true},
  {name: 'SLUG', uid: 'SLUG', sortable: true},
  {name: 'CRIADO EM', uid: 'CRIADO EM', sortable: true},
  {name: 'ATUALIZADO EM', uid: 'ATUALIZADO EM', sortable: true},
  {name: 'ACTIONS', uid: 'ACTIONS', sortable: false},
];

const INITIAL_VISIBLE_COLUMNS = ["ID", "STATUS", "SLUG", "CRIADO EM", "ATUALIZADO EM", "ACTIONS"];

export default function TicketStatusTable() {
  const { isOpen, onClose, onOpenChange, onOpen } = useDisclosure();
  const [filterValue, setFilterValue] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(5);
  const [ticketStatus, setTicketStatus] = useState<ITicketStatusProps[]>([]);
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'STATUS',
    direction: 'ascending',
  });

  const pages = Math.ceil(ticketStatus.length / rows);

  const headerColumns = useMemo(() => {
    return tableColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const [loadingPriorities, setLoadingTicketStatus] = useState<boolean>(false);

  const hasSearchFilter = Boolean(filterValue);

  useEffect(() => {
    async function loadTicketStatusData() {
      try {
        setLoadingTicketStatus(true);

        const ticketStatusData = await getTicketStatusList();

        setTicketStatus(ticketStatusData);

        setLoadingTicketStatus(false);
      } catch (error) {
        setLoadingTicketStatus(false);
        
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

    loadTicketStatusData();
  }, []);

  const filteredItems = useMemo(() => {
    let filteredTicketStatus = [...ticketStatus];

    if (hasSearchFilter) {
      filteredTicketStatus = filteredTicketStatus.filter((status) =>
        status.statusName.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredTicketStatus;
  }, [ticketStatus, filterValue ]);

  const items = useMemo(() => {
    const start = (page - 1) * rows;
    const end = start + rows;

    return filteredItems.slice(start, end);
  }, [ page, rows, filteredItems ]);

  const sortedItems = useMemo(() => {
    let attendantsToSort = [...items];

    attendantsToSort = attendantsToSort.sort((a: ITicketStatusProps, b: ITicketStatusProps) => {
      switch(sortDescriptor.column) {
        case "ID":
          const idA = a["id" as keyof ITicketStatusProps] as number;
          const idB = b["id" as keyof ITicketStatusProps] as number;
          const cmpId = idA < idB ? -1 : idA > idB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpId : cmpId; 
        case "STATUS":
          const statusA = a["statusName" as keyof ITicketStatusProps] as number;
          const statusB = b["statusName" as keyof ITicketStatusProps] as number;
          const cmpStatus = statusA < statusB ? -1 : statusA > statusB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpStatus : cmpStatus; 
        case "SLUG":
          const slugA = a["slug" as keyof ITicketStatusProps] as number;
          const slugB = b["slug" as keyof ITicketStatusProps] as number;
          const cmpSlug = slugA < slugB ? -1 : slugA > slugB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpSlug : cmpSlug;
        case "CRIADO EM":
          const createdAtA = a["createdAt" as keyof ITicketStatusProps] as number;
          const createdAtB = b["createdAt" as keyof ITicketStatusProps] as number;
          const cmpCreatedAt = createdAtA < createdAtB ? -1 : createdAtA > createdAtB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpCreatedAt : cmpCreatedAt;
        case "ATUALIZADO EM":
          const updatedAtA = a["updatedAt" as keyof ITicketStatusProps] as number;
          const updatedAtB = b["updatedAt" as keyof ITicketStatusProps] as number;
          const cmpUpdatedAt = updatedAtA < updatedAtB ? -1 : updatedAtA > updatedAtB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpUpdatedAt : cmpUpdatedAt;
      }
    });

    return attendantsToSort;
  }, [sortDescriptor, items]);

  async function loadPrioritiesData() {
    try {
      setLoadingTicketStatus(true);

      const ticketStatusData = await getTicketStatusList();

      setTicketStatus(ticketStatusData);

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'Lista de status atualizada',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });

      setLoadingTicketStatus(false);
    } catch (error) {
      setLoadingTicketStatus(false);
        
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

  const renderCell = useCallback((status: ITicketStatusProps, columnKey: string) => {
    const cellValue = status[columnKey];

    switch (columnKey) {
      case "ID":
        return (
          <span>{status.id}</span>
        );
      case "STATUS":
        return (
          <span>{status.statusName}</span>
        );
      case "SLUG":
        return (
          <span>{status.slug}</span>
        );
      case "CRIADO EM":
        return (
          <span>{new Date(status.createdAt).toLocaleDateString('pt-br')}</span>
        );
      case "ATUALIZADO EM":
        return (
          <span>{new Date(status.updatedAt).toLocaleDateString('pt-br')}</span>
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
    ticketStatus.length,
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
            ? "Todos os status foram selecionados"
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
    utils.book_append_sheet(workbook, worksheet, "Status de Chamados");
    let newColumns: string[] = [];
  
    tableColumns.forEach((column) => {
      let columnLowerCase = column.name.toLowerCase();
      let firstCharCapitalized = columnLowerCase.charAt(0).toUpperCase();
      newColumns.push(firstCharCapitalized + columnLowerCase.slice(1));
    });
  
    utils.sheet_add_aoa(worksheet, [newColumns], { origin: "A1" });

    const max_width = sortedItems.reduce((w, r) => Math.max(w, r.statusName.length), 10);
    worksheet["!cols"] = [ { wch: max_width } ];
    writeFile(workbook, "Status de Chamados.xlsx", { compression: true });
  }

  return (
    <div>
      <ModalCreateTicketStatus
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        status={ticketStatus}
        setStatus={setTicketStatus}
        key={'createTicketStatus'}
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
            <h1>Lista de Status</h1>
            <div className="flex justify-between items-center">
              <Input
                startContent={
                  <SearchIcon />
                }
                placeholder="Buscar status..."
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
              <span>Nenhum status encontrado</span>
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