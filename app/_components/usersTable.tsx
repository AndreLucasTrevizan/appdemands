'use client';

import { IUserProps, IUsersReport } from "@/types";
import { addToast, Avatar, Button, Chip, Input, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure } from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SearchIcon } from "./searchIcon";
import { PlusIcon } from "./plusIcon";
import { listUsers } from "../users/actions";
import ErrorHandler from "../_utils/errorHandler";
import { FiRefreshCcw } from "react-icons/fi";
import ModalCreateUser from "./modalCreateUser";

export default function UsersTable() {
  const { isOpen, onClose, onOpenChange, onOpen } = useDisclosure();
  const [filterValue, setFilterValue] = useState<string>('');
  const [users, setUsers] = useState<IUsersReport[]>([]);
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(5);
  const [loadingUpdateUserList, setLoadingUpdateUserList] = useState<boolean>(false);
  const [userCreated, setUserCreated] = useState<boolean>(false);
  const [updateUsers, setUpdatedUsers] = useState<boolean>(false);

  const pages = Math.ceil(users.length / rows);

  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

  useEffect(() => {
    async function loadUsersData() {
      try {
        setLoadingUsers(true);

        const usersData = await listUsers();

        setUsers(usersData);

        setLoadingUsers(false);
      } catch (error) {
        setLoadingUsers(false);
        
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

    loadUsersData();
  }, []);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...users];

    filteredUsers = users.filter((user) => user.userName.toLowerCase().includes(filterValue.toLowerCase()));
    
    return filteredUsers;
  }, [ users, filterValue ]);

  const items = useMemo(() => {
    const start = (page - 1) * rows;
    const end = start + rows;

    return filteredItems.slice(start, end);
  }, [ page, rows, filteredItems ]);

  async function loadUserData() {
    try {
      setLoadingUsers(true);

      const usersData = await listUsers();

      setUsers(usersData);

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'Lista de usuários atualizadas',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });

      setLoadingUsers(false);
    } catch (error) {
      setLoadingUsers(false);
        
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

  return (
    <div>
      <ModalCreateUser
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        setUserCreated={setUserCreated}
        userCreated
        key={'createUsers'}
      />
      <Table
        isStriped
        isCompact
        topContent={
          <div className="flex justify-between items-center">
            <Input
              startContent={
                <SearchIcon />
              }
              placeholder="Buscar usuário..."
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
          <TableColumn key={'userName'}>Nome</TableColumn>
          <TableColumn key={'email'}>E-mail</TableColumn>
          <TableColumn key={'status'}>Status</TableColumn>
          <TableColumn key={'emailVerified'}>E-mail Verificado</TableColumn>
          <TableColumn key={'positionName'}>Função</TableColumn>
          <TableColumn key={'teamName'}>Equipe</TableColumn>
          <TableColumn key={'createdAt'}>Data de criação</TableColumn>
          <TableColumn key={'createdTime'}>Hora de criação</TableColumn>
          <TableColumn key={'updatedAt'}>Data de modificação</TableColumn>
          <TableColumn key={'updatedTime'}>Hora de modificação</TableColumn>
        </TableHeader>
        <TableBody
          items={loadingUsers ? [] : items}
          emptyContent={
            <div className="flex flex-col gap-4 items-center justify-center">
              <SearchIcon />
              <span>Nenhum usuário encontrado</span>
            </div>
          }
          isLoading={loadingUsers}
          loadingContent={<Spinner size="md" />}
        >
          {(user) => (
            <TableRow>
              <TableCell className="flex gap-2 items-center">
                <Avatar
                  showFallback
                  size="sm"
                  src={`${process.env.baseUrl}/avatar/${user.id}/${user.avatar}`}
                />
                <span>{user.userName}</span>
              </TableCell>
              <TableCell>
                <span>{user.email}</span>
              </TableCell>
              <TableCell>
                <Chip
                  className="text-white"
                  color={user.status == 'ativo' ? 'success' : 'danger'}
                >{user.status == 'ativo' ? 'Ativo' : 'Desativado'}</Chip>
              </TableCell>
              <TableCell>
                <Chip
                  className="text-white"
                  color={user.emailVerified ? 'success' : 'danger'}
                >{user.emailVerified ? 'Sim' : 'Não'}</Chip>
              </TableCell>
              <TableCell>{user.positionName}</TableCell>
              <TableCell>{user.teamName ? user.teamName : (<Chip color="warning">Sem equipe</Chip>)}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleDateString('pt-br')}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleTimeString('pt-br')}</TableCell>
              <TableCell>{new Date(user.updatedAt).toLocaleDateString('pt-br')}</TableCell>
              <TableCell>{new Date(user.updatedAt).toLocaleTimeString('pt-br')}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}