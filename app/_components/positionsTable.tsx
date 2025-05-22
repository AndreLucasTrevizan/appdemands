'use client';

import { addToast, Button, Input, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure } from "@heroui/react";
import ModalCreatePosition from "./modalCreatePosition";
import { SearchIcon } from "./searchIcon";
import { PlusIcon } from "./plusIcon";
import { FiRefreshCcw } from "react-icons/fi";
import { useEffect, useMemo, useState } from "react";
import { IPositionProps } from "@/types";
import ErrorHandler from "../_utils/errorHandler";
import { listPositions } from "../positions/actions";

export default function PositionsTable() {
  const { isOpen, onOpen, onClose, onOpenChange  } = useDisclosure();
  const [filterValue, setFilterValue] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(5);
  const [loadingPositions, setLoadingPositions] = useState<boolean>(false);
  const [positions, setPositions] = useState<IPositionProps[]>([]);

  const pages = Math.ceil(positions.length / rows);

  useEffect(() => {
    async function loadPositionsData() {
      try {
        setLoadingPositions(true);

        const data = await listPositions();

        setPositions(data);

        setLoadingPositions(false);
      } catch (error) {
        setLoadingPositions(false);

        const errorHandler = new ErrorHandler(error);

        addToast({
          color: 'warning',
          title: 'Aviso',
          description: errorHandler.error.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      }
    }

    loadPositionsData();
  }, []);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...positions];

    filteredUsers = positions.filter((position) => position.positionName.toLowerCase().includes(filterValue.toLowerCase()));
    
    return filteredUsers;
  }, [ positions, filterValue ]);

  const items = useMemo(() => {
    const start = (page - 1) * rows;
    const end = start + rows;

    return filteredItems.slice(start, end);
  }, [ page, rows, filteredItems ]);

  async function updatePositionsList() {
    try {
      setLoadingPositions(true);

      const data = await listPositions();

      setPositions(data);

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'Lista de funções atualizadas',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });

      setLoadingPositions(false);
    } catch (error) {
      setLoadingPositions(false);

      const errorHandler = new ErrorHandler(error);

      addToast({
        color: 'warning',
        title: 'Aviso',
        description: errorHandler.error.message,
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    }
  }
  
  const topContent = useMemo(() => {
    return (
      <div className="flex justify-between items-center">
        <Input
          startContent={
            <SearchIcon />
          }
          placeholder="Buscar função..."
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
          <Tooltip content="Atualizar lista de funções">
            <Button isIconOnly variant="light" onPress={() => updatePositionsList()}><FiRefreshCcw /></Button>
          </Tooltip>
          <Button
            color="primary"
            startContent={<PlusIcon size={20} width={20} height={20} />}
            onPress={() => onOpenChange()}
          >Criar</Button>
        </div>
      </div>
    );
  }, []);

  const bottomContent = useMemo(() => {
    return (
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
    );
  }, []);

  return (
    <div>
      <ModalCreatePosition
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        positions={positions}
        setPositions={setPositions}
      />
      <Table
        isStriped
        isCompact
        topContent={topContent}
        bottomContent={bottomContent}
      >
        <TableHeader>
          <TableColumn key={'id'}>ID</TableColumn>
          <TableColumn key={'name'}>NOME</TableColumn>
          <TableColumn key={'slug'}>SLUG</TableColumn>
          <TableColumn key={'createdAt'}>CRIADO EM</TableColumn>
          <TableColumn key={'updatedAt'}>ATUALIZADO EM</TableColumn>
        </TableHeader>
        <TableBody
          items={filteredItems}
          emptyContent={
            <div className="flex flex-col gap-4 items-center justify-center">
              <SearchIcon />
              <span>Nenhuma função encontrada</span>
            </div>
          }
          isLoading={loadingPositions}
          loadingContent={<Spinner size="md" />}
        >
          {(position) => (
            <TableRow>
              <TableCell>
                <span>{position.id}</span>    
              </TableCell>
              <TableCell>
                <span>{position.positionName}</span>    
              </TableCell>
              <TableCell>
                <span>{position.slug}</span>    
              </TableCell>
              <TableCell>
                <span>{new Date(position.createdAt).toLocaleDateString('pt-br')}</span>    
              </TableCell>
              <TableCell>
                <span>{new Date(position.updatedAt).toLocaleDateString('pt-br')}</span>    
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
