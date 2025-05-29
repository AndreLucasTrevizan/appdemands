'use client';

import { IAttendantsReport, IUsersReport } from "@/types";
import {
  addToast,
  Avatar,
  Button,
  Chip,
  Input,
  Link,
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
import { useEffect, useMemo, useState } from "react";
import { SearchIcon } from "./searchIcon";
import { PlusIcon } from "./plusIcon";
import ErrorHandler from "../_utils/errorHandler";
import { FiRefreshCcw } from "react-icons/fi";
import ModalCreateAttendant from "./modalCreateAttendant";
import { listAttendants } from "../attendants/actions";

export default function AttendantsTable() {
  const { isOpen, onClose, onOpenChange, onOpen } = useDisclosure();
  const [filterValue, setFilterValue] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(5);
  const [attendants, setAttendants] = useState<IAttendantsReport[]>([]);
  const [loadingAttendants, setLoadingAttendants] = useState<boolean>(false);

  const pages = Math.ceil(attendants.length / rows);

  useEffect(() => {
    async function loadAttendantsData() {
      try {
        setLoadingAttendants(true);

        const attendantsData = await listAttendants();

        setAttendants(attendantsData);

        setLoadingAttendants(false);
      } catch (error) {
        setLoadingAttendants(false);
        
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

    loadAttendantsData();
  }, []);

  const filteredItems = useMemo(() => {
    let filteredAttendants = [...attendants];

    filteredAttendants = attendants.filter((attendant) => attendant.userName.toLowerCase().includes(filterValue.toLowerCase()));
    
    return filteredAttendants;
  }, [ attendants, filterValue ]);

  const items = useMemo(() => {
    const start = (page - 1) * rows;
    const end = start + rows;

    return filteredItems.slice(start, end);
  }, [ page, rows, filteredItems ]);

  async function loadAttendantsData() {
    try {
      setLoadingAttendants(true);

      const attendantsData = await listAttendants();

      setAttendants(attendantsData);

      addToast({
        color: 'success',
        title: 'Sucesso',
        description: 'Lista de atendentes atualizada',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });

      setLoadingAttendants(false);
    } catch (error) {
      setLoadingAttendants(false);
      
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
      <ModalCreateAttendant
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        attendants={attendants}
        setAttendants={setAttendants}
        key={'createAttendants'}
      />
      <Table
        isStriped
        isCompact
        topContent={
          <div className="flex flex-col gap-4">
            <h1>Lista de Usuários Atendentes</h1>
            <div className="flex justify-between flex-wrap items-center">
              <Input
                startContent={
                  <SearchIcon />
                }
                placeholder="Buscar usuário..."
                type="search"
                className="sm:max-w-[40%]"
                onChange={(e) => setFilterValue(e.target.value)}
              />
              <div className="flex gap-2 items-center">
                <span>Linhas por página</span>
                <select onChange={(e) => setRows(Number(e.target.value))}>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="100">100</option>
                </select>
                <Tooltip content="Atualizar lista de atendentes">
                  <Button isIconOnly variant="light" onPress={() => loadAttendantsData()}><FiRefreshCcw /></Button>
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
          <TableColumn key={'userName'}>Nome</TableColumn>
          <TableColumn key={'email'}>E-mail</TableColumn>
          <TableColumn key={'status'}>Status</TableColumn>
          <TableColumn key={'emailVerified'}>E-mail Verificado</TableColumn>
          <TableColumn key={'positionName'}>Função</TableColumn>
          <TableColumn key={'teamName'}>Equipe</TableColumn>
        </TableHeader>
        <TableBody
          items={loadingAttendants ? [] : items}
          emptyContent={
            <div className="flex flex-col gap-4 items-center justify-center">
              <SearchIcon />
              <span>Nenhum usuário encontrado</span>
            </div>
          }
          isLoading={loadingAttendants}
          loadingContent={<Spinner size="md" />}
        >
          {(user) => (
            <TableRow>
              <TableCell className="flex gap-2 items-center">
                <User
                  avatarProps={{
                    showFallback: true,
                    name: `${user.userName}`,
                    src: `${process.env.baseUrl}/avatar/${user.userSlug}/${user.avatar}`
                  }}
                  name={user.userName}
                  description={user.userSlug}
                />
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
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}