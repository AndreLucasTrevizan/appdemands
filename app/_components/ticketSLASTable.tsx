'use client';

import { ITicketCategoryProps, ITicketSLASProps } from "@/types";
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
  SharedSelection,
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
import { getTicketCategoriesList, getTicketSLASList } from "../tickets/actions";
import ModalCreateTicketSLAS from "./modalCreateTicketSLA";
import { FaChevronDown, FaHandDots } from "react-icons/fa6";
import { PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import { utils, writeFile } from "xlsx";

interface ISLATableColumns {
  name: string,
  uid: string,
  sortable: boolean,
}

const tableColumns: ISLATableColumns[] = [
  {name: 'ID', uid: 'ID', sortable: true},
  {name: 'SLA', uid: 'SLA', sortable: true},
  {name: 'SLA EM SEGUNDOS', uid: 'SLA EM SEGUNDOS', sortable: true},
  {name: 'PRIORIDADE', uid: 'PRIORIDADE', sortable: true},
  {name: 'ID DA CATEGORIA', uid: 'ID DA CATEGORIA', sortable: false},
  {name: 'HORAS PARA PRIMEIRA RESPOSTA', uid: 'HORAS PARA PRIMEIRA RESPOSTA', sortable: true},
  {name: 'HORAS PARA PRIMEIRA RESPOSTA EM SEGUNDOS', uid: 'HORAS PARA PRIMEIRA RESPOSTA EM SEGUNDOS', sortable: true},
  {name: 'CRIADO EM', uid: 'CRIADO EM', sortable: true},
  {name: 'ATUALIZADO EM', uid: 'ATUALIZADO EM', sortable: true},
  {name: 'ACTIONS', uid: 'ACTIONS', sortable: false},
];

const INITIAL_VISIBLE_COLUMNS = ["ID", "PRIORIDADE", "SLA", "HORAS PARA PRIMEIRA RESPOSTA", "ACTIONS"];

export default function TicketSLASTable() {
  const { isOpen, onClose, onOpenChange, onOpen } = useDisclosure();
  const [filterValue, setFilterValue] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(5);
  const [categories, setCategories] = useState<ITicketCategoryProps[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<SharedSelection>();
  const [slas, setSlas] = useState<ITicketSLASProps[]>([]);
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'SLA',
    direction: 'ascending',
  });

  const pages = Math.ceil(slas.length / rows);

  const headerColumns = useMemo(() => {
    return tableColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const [loadingSLAS, setLoadingSLAS] = useState<boolean>(false);
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

    async function loadTicketSLASData() {
      try {
        setLoadingSLAS(true);

        const slasData = await getTicketSLASList({
          ticketCategoryId: ""
        });

        setSlas(slasData);

        setLoadingSLAS(false);
      } catch (error) {
        setLoadingSLAS(false);
        
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
    loadTicketSLASData();
  }, []);

  const filteredItems = useMemo(() => {
    let filteredSlas = [...slas];

    if (hasSearchFilter) {
      filteredSlas = filteredSlas.filter((slas) =>
        slas.slaTime == Number(filterValue),
      );
    }

    return filteredSlas;
  }, [slas, filterValue ]);

  const items = useMemo(() => {
    const start = (page - 1) * rows;
    const end = start + rows;

    return filteredItems.slice(start, end);
  }, [ page, rows, filteredItems ]);

  const sortedItems = useMemo(() => {
    let attendantsToSort = [...items];

    attendantsToSort = attendantsToSort.sort((a: ITicketSLASProps, b: ITicketSLASProps) => {
      switch(sortDescriptor.column) {
        case "ID":
          const idA = a["id" as keyof ITicketSLASProps] as number;
          const idB = b["id" as keyof ITicketSLASProps] as number;
          const cmpId = idA < idB ? -1 : idA > idB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpId : cmpId; 
        case "SLA":
          const slaA = a["slaTime" as keyof ITicketSLASProps] as number;
          const slaB = b["slaTime" as keyof ITicketSLASProps] as number;
          const cmpSla = slaA < slaB ? -1 : slaA > slaB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpSla : cmpSla; 
        case "SLA EM SEGUNDOS":
          const slaInSecondsA = a["slaInSeconds" as keyof ITicketSLASProps] as number;
          const slaInSecondsB = b["slaInSeconds" as keyof ITicketSLASProps] as number;
          const cmpSlaInSeconds = slaInSecondsA < slaInSecondsB ? -1 : slaInSecondsA > slaInSecondsB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpSlaInSeconds : cmpSlaInSeconds;
        case "PRIORIDADE":
          const priorityA = a["priorityName" as keyof ITicketSLASProps] as number;
          const priorityB = b["priorityName" as keyof ITicketSLASProps] as number;
          const cmpPriority = priorityA < priorityB ? -1 : priorityA > priorityB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpPriority : cmpPriority;
        case "HORAS PARA PRIMEIRA RESPOSTA":
          const hfrA = a["hoursToFirstResponse" as keyof ITicketSLASProps] as number;
          const hfrB = b["hoursToFirstResponse" as keyof ITicketSLASProps] as number;
          const cmpHfr = hfrA < hfrB ? -1 : hfrA > hfrB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpHfr : cmpHfr;
        case "HORAS PARA PRIMEIRA RESPOSTA EM SEGUNDOS":
          const hfrisAtA = a["hoursToFirstResponseInSeconds" as keyof ITicketSLASProps] as number;
          const hfrisAtB = b["hoursToFirstResponseInSeconds" as keyof ITicketSLASProps] as number;
          const cmpHfrisAt = hfrisAtA < hfrisAtB ? -1 : hfrisAtA > hfrisAtB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpHfrisAt : cmpHfrisAt;
        case "ATUALIZADO EM":
          const updatedAtA = a["updatedAt" as keyof ITicketSLASProps] as number;
          const updatedAtB = b["updatedAt" as keyof ITicketSLASProps] as number;
          const cmpUpdatedAt = updatedAtA < updatedAtB ? -1 : updatedAtA > updatedAtB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpUpdatedAt : cmpUpdatedAt;
      }
    });

    return attendantsToSort;
  }, [sortDescriptor, items]);

  async function loadTicketSLASData() {
    try {
      setLoadingSLAS(true);

      const slasData = await getTicketSLASList({
        ticketCategoryId: categoryFilter ? String(categoryFilter.currentKey) : ""
      });

      setSlas(slasData);

      addToast({
        title: 'Sucesso',
        description: "Lista de SLAs atualizada",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
        color: 'success',
      });

      setLoadingSLAS(false);
    } catch (error) {
      setLoadingSLAS(false);
      
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

  const renderCell = useCallback((sla: ITicketSLASProps, columnKey: string) => {
    const cellValue = sla[columnKey];

    switch (columnKey) {
      case "ID":
        return (
          <span>{sla.id}</span>
        );
      case "SLA":
        return (
          <span>{sla.slaTime}</span>
        );
      case "SLA EM SEGUNDOS":
        return (
          <span>{sla.slaInSeconds}</span>
        );
      case "PRIORIDADE":
        return (
          <span>{sla.priorityName}</span>
        );
      case "ID DA CATEGORIA":
        return (
          <span>{sla.ticketCategoryId}</span>
        );
      case "HORAS PARA PRIMEIRA RESPOSTA":
        return (
          <span>{sla.hoursToFirstResponse}</span>
        );
      case "HORAS PARA PRIMEIRA RESPOSTA EM SEGUNDOS":
        return (
          <span>{sla.hoursToFirstResponseInSeconds}</span>
        );
      case "CRIADO EM":
        return (
          <span>{new Date(sla.createdAt).toLocaleDateString('pt-br')}</span>
        );
      case "ATUALIZADO EM":
        return (
          <span>{new Date(sla.updatedAt).toLocaleDateString('pt-br')}</span>
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
    slas.length,
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
            ? "Todos os atendentes selecionados"
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
    utils.book_append_sheet(workbook, worksheet, "SLAS");
    let newColumns: string[] = [];
  
    tableColumns.forEach((column) => {
      let columnLowerCase = column.name.toLowerCase();
      let firstCharCapitalized = columnLowerCase.charAt(0).toUpperCase();
      newColumns.push(firstCharCapitalized + columnLowerCase.slice(1));
    });
  
    utils.sheet_add_aoa(worksheet, [newColumns], { origin: "A1" });

    const max_width = sortedItems.reduce((w, r) => Math.max(w, r.priorityName.length), 10);
    worksheet["!cols"] = [ { wch: max_width } ];
    writeFile(workbook, "SLAS.xlsx", { compression: true });
  }

  return (
    <div>
      <ModalCreateTicketSLAS
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        slas={slas}
        setSlas={setSlas}
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
            <h1>Lista de SLAs</h1>
            <div className="flex justify-between items-center">
              <Input
                startContent={
                  <SearchIcon />
                }
                placeholder="Buscar sla..."
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
                <Tooltip content="Atualizar lista de SLAs">
                  <Button isIconOnly variant="light" onPress={() => loadTicketSLASData()}><FiRefreshCcw /></Button>
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
        bottomContent={bottomContent}
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
          items={loadingSLAS ? [] : sortedItems}
          emptyContent={
            <div className="flex flex-col gap-4 items-center justify-center">
              <SearchIcon />
              <span>Nenhum SLA encontrado</span>
            </div>
          }
          isLoading={loadingSLAS}
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