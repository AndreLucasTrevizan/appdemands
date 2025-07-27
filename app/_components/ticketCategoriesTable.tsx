'use client';

import { ITicketCategoryProps } from "@/types";
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
  {name: 'CATEGORIA', uid: 'CATEGORIA', sortable: true},
  {name: 'SLUG', uid: 'SLUG', sortable: true},
  {name: 'DESCRIÇÃO', uid: 'DESCRIÇÃO', sortable: true},
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
        case "CATEGORIA":
          const slaA = a["categoryName" as keyof ITicketCategoryProps] as number;
          const slaB = b["categoryName" as keyof ITicketCategoryProps] as number;
          const cmpSla = slaA < slaB ? -1 : slaA > slaB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpSla : cmpSla; 
        case "SLUG":
          const slaInSecondsA = a["slug" as keyof ITicketCategoryProps] as number;
          const slaInSecondsB = b["slug" as keyof ITicketCategoryProps] as number;
          const cmpSlaInSeconds = slaInSecondsA < slaInSecondsB ? -1 : slaInSecondsA > slaInSecondsB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpSlaInSeconds : cmpSlaInSeconds;
        case "DESCRIÇÃO":
          const priorityA = a["categoryDesc" as keyof ITicketCategoryProps] as number;
          const priorityB = b["categoryDesc" as keyof ITicketCategoryProps] as number;
          const cmpPriority = priorityA < priorityB ? -1 : priorityA > priorityB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpPriority : cmpPriority;
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

  async function loadTicketCategoriesData() {
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

  const renderCell = useCallback((category: ITicketCategoryProps, columnKey: string) => {
    const cellValue = category[columnKey];

    switch (columnKey) {
      case "ID":
        return (
          <span>{category.id}</span>
        );
      case "CATEGORIA":
        return (
          <span>{category.categoryName}</span>
        );
      case "SLUG":
        return (
          <span>{category.slug}</span>
        );
      case "DESCRIÇÃO":
        return (
          <span>{category.categoryDesc}</span>
        );
      case "CRIADO EM":
        return (
          <span>{new Date(category.createdAt).toLocaleDateString('pt-br')}</span>
        );
      case "ATUALIZADO EM":
        return (
          <span>{new Date(category.updatedAt).toLocaleDateString('pt-br')}</span>
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
    categories.length,
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
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        topContent={
          <div className="flex flex-col gap-4">
            <h1>Lista de Categorias</h1>
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
                  <Button isIconOnly variant="light" onPress={() => loadTicketCategoriesData()}><FiRefreshCcw /></Button>
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
          items={loadingCategories ? [] : sortedItems}
          emptyContent={
            <div className="flex flex-col gap-4 items-center justify-center">
              <SearchIcon />
              <span>Nenhum SLA encontrado</span>
            </div>
          }
          isLoading={loadingCategories}
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