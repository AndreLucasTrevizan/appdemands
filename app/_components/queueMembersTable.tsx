'use client';

import { IQueueMember } from "@/types";
import { useEffect, useMemo, useState } from "react";
import ErrorHandler from "../_utils/errorHandler";
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
  useDisclosure,
  User
} from "@heroui/react";
import { SearchIcon } from "./searchIcon";
import { FiRefreshCcw } from "react-icons/fi";
import { PlusIcon } from "./plusIcon";
import ModalAddQueueMembers from "./modalAddQueueMembers";
import { getQueueMembers } from "../queues/actions";
import { FaTrash } from "react-icons/fa6";

export default function QueueMembersTable({
  slug
}: {
  slug: string,
}) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [members, setMembers] = useState<IQueueMember[]>([]);
  const [loadingUpdateMemberList, setLoadingUpdateMemberList] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<string>('');
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(5);

  const pages = Math.ceil(members.length / rows);

  useEffect(() => {
    async function loadMembersData() {
      try {
        setLoadingUpdateMemberList(true);

        const data = await getQueueMembers(slug);

        setMembers(data);

        setLoadingUpdateMemberList(false);
      } catch (error) {
        setLoadingUpdateMemberList(false);

        const errorHandler = new ErrorHandler(error);
        
        addToast({
          title: 'Aviso',
          description: errorHandler.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true
        });
      }
    }

    loadMembersData();
  }, []);

  async function handleUpdateMemberList() {
    try {
      setLoadingUpdateMemberList(true);

      const data = await getQueueMembers(slug);

      setMembers(data);

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'A lista de membros foi atualizada',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });

      setLoadingUpdateMemberList(false);
    } catch (error) {
      setLoadingUpdateMemberList(false);

      const errorHandler = new ErrorHandler(error);
      
      addToast({
        title: 'Aviso',
        description: errorHandler.message,
        timeout: 3000,
        shouldShowTimeoutProgress: true
      });
    }
  }

  const filteredItems = useMemo(() => {
    let filteredMembers = [...members];

    filteredMembers = members.filter((member) => member.userName?.toLowerCase().includes(filterValue.toLowerCase()));
    
    return filteredMembers;
  }, [ members, filterValue ]);

  const items = useMemo(() => {
    const start = (page - 1) * rows;
    const end = start + rows;

    return filteredItems.slice(start, end);
  }, [ page, rows, filteredItems ]);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <h1>Membros da Fila de Atendimento</h1>
        <div className="flex justify-between items-center">
          <Input
            startContent={
              <SearchIcon />
            }
            placeholder="Buscar membro..."
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
            <Tooltip content="Atualizar lista de membros">
              <Button isIconOnly variant="light" onPress={() => handleUpdateMemberList()}><FiRefreshCcw /></Button>
            </Tooltip>
            <Button
              color="primary"
              startContent={<PlusIcon size={20} width={20} height={20} />}
              onPress={() => onOpenChange()}
            >Adicionar Membros</Button>
          </div>
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
    <div className="p-4">
      <ModalAddQueueMembers
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        slug={slug}
      />
      <Table
        topContent={topContent}
        bottomContent={bottomContent}
        isCompact
        isStriped
      >
        <TableHeader>
          <TableColumn>MEMBRO</TableColumn>
          <TableColumn>E-MAIL</TableColumn>
          <TableColumn>AÇÕES</TableColumn>
        </TableHeader>
        <TableBody
          items={items}
          isLoading={loadingUpdateMemberList}
          loadingContent={<Spinner size="md" />}
          emptyContent={
            <div className="flex flex-col gap-4 items-center">
              <SearchIcon />
              <span>Nenhum membro encontrado...</span>
            </div>
          }
        >
          {(item) => (
            <TableRow key={item.slug}>
              <TableCell>
                <User
                  avatarProps={{
                    showFallback: true,
                    name: `${item.userName}`,
                    src: `${process.env.baseUrl}/avatar/${item.slug}/${item.avatar}`
                  }}
                  name={item.userName}
                  description={item.slug}
                />
              </TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>
                <Tooltip content="Remover da fila de atendimentos">
                  <Button
                    isIconOnly
                    variant="light"
                    color="danger"
                  >
                    <FaTrash />
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
