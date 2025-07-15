'use client';

import { ITicketCategoryProps, ITicketSLASProps } from "@/types";
import {
  addToast,
  Button,
  Input,
  Pagination,
  Select,
  SelectItem,
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
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { SearchIcon } from "./searchIcon";
import { PlusIcon } from "./plusIcon";
import ErrorHandler from "../_utils/errorHandler";
import { FiRefreshCcw } from "react-icons/fi";
import { getTicketCategoriesList, getTicketSLASList } from "../tickets/actions";
import ModalCreateTicketSLAS from "./modalCreateTicketSLA";

export default function TicketSLASTable() {
  const { isOpen, onClose, onOpenChange, onOpen } = useDisclosure();
  const [filterValue, setFilterValue] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(5);
  const [categories, setCategories] = useState<ITicketCategoryProps[]>([]);
  const [slas, setSlas] = useState<ITicketSLASProps[]>([]);
  const [categorySelected, setCategorySelected] = useState<ITicketCategoryProps>();

  const pages = Math.ceil(slas.length / rows);

  const [loadingSLAS, setLoadingSLAS] = useState<boolean>(false);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(false);

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
  
  const selectCategory = (e: ChangeEvent<HTMLSelectElement>) => {
    let category = categories.find((category) => `${category.id}` == e.target.value);
    setCategorySelected(category);
  }

  const hasCategoryFilter = Boolean(categorySelected);
  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredSlas = [...slas];

    if (hasSearchFilter) {
      filteredSlas = slas.filter((sla) => sla.slaTime == Number(filterValue));
    } 
    
    if (hasCategoryFilter) {
      filteredSlas = slas.filter((sla) => sla.ticketCategoryId == categorySelected!.id);
    }
  
    return filteredSlas;
  }, [ slas, filterValue, categorySelected ]);

  const items = useMemo(() => {
    const start = (page - 1) * rows;
    const end = start + rows;

    return filteredItems.slice(start, end);
  }, [ page, rows, filteredItems ]);

  async function loadTicketSLASData() {
    try {
      setLoadingSLAS(true);

      const slasData = await getTicketSLASList({
        ticketCategoryId: categorySelected ? String(categorySelected.id) : ""
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
        topContent={
          <div className="flex flex-col gap-4">
            <h1>Lista de SLAs de Chamados</h1>
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
              {loadingCategories ? (
                <Spinner size="md" />
              ) : (
                <Select size="sm" items={categories} className="flex-1 max-w-[30%]" label="Categoria" onChange={(e) => selectCategory(e)}>
                  {(category) => <SelectItem key={category.id}>{category.categoryName}</SelectItem>}
                </Select>
              )}
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
          <TableColumn key={'priorityName'}>PRIORIDADE</TableColumn>
          <TableColumn key={'sla'}>SLA</TableColumn>
          <TableColumn key={'hourToFirstAnswer'}>PRIMEIRA RESPOSTA</TableColumn>
        </TableHeader>
        <TableBody
          items={loadingSLAS ? [] : items}
          emptyContent={
            <div className="flex flex-col gap-4 items-center justify-center">
              <SearchIcon />
              <span>Nenhum SLA de chamados encontrado</span>
            </div>
          }
          isLoading={loadingSLAS}
          loadingContent={<Spinner size="md" />}
        >
          {(ticketSla) => (
            <TableRow>
              <TableCell>
                <span>{ticketSla.id}</span>
              </TableCell>
              <TableCell>
                <span>{ticketSla.priorityName}</span>
              </TableCell>
              <TableCell>
                <span>{ticketSla.slaTime}h</span>
              </TableCell>
              <TableCell>
                <span>{ticketSla.hoursToFirstResponse}h</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}