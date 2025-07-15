'use client';

import { ITicketCategoryProps } from "@/types";
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
import { getTicketCategoriesList } from "../tickets/actions";
import ModalCreateTicketCategory from "./modalCreateTicketCategory";

export default function TicketCategoriesTable() {
  const { isOpen, onClose, onOpenChange, onOpen } = useDisclosure();
  const [filterValue, setFilterValue] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(5);
  const [categories, setCategories] = useState<ITicketCategoryProps[]>([]);

  const pages = Math.ceil(categories.length / rows);

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

    loadCategoriesData();
  }, []);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...categories];

    filteredUsers = categories.filter((category) => category.categoryName.toLowerCase().includes(filterValue.toLowerCase()));
    
    return filteredUsers;
  }, [ categories, filterValue ]);

  const items = useMemo(() => {
    const start = (page - 1) * rows;
    const end = start + rows;

    return filteredItems.slice(start, end);
  }, [ page, rows, filteredItems ]);

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
          <TableColumn key={'userName'}>ID</TableColumn>
          <TableColumn key={'email'}>NOME</TableColumn>
          <TableColumn key={'status'}>SLUG</TableColumn>
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
              <TableCell className="flex gap-2 items-center">
                <span>{ticketCategory.id}</span>
              </TableCell>
              <TableCell className="flex gap-2 items-center">
                <span>{ticketCategory.categoryName}</span>
              </TableCell>
              <TableCell className="flex gap-2 items-center">
                <span>{ticketCategory.slug}</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}