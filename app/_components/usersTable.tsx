'use client';

import { IUsersReport } from "@/types";
import type {Selection, SortDescriptor} from "@heroui/react";
import { utils, writeFile } from 'xlsx';
import { PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import {
  addToast,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  SharedSelection,
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { SearchIcon } from "./searchIcon";
import { PlusIcon } from "./plusIcon";
import { listUsers } from "../users/actions";
import ErrorHandler from "../_utils/errorHandler";
import { FiRefreshCcw } from "react-icons/fi";
import ModalCreateUser from "./modalCreateUser";
import { FaChevronDown, FaFileExcel, FaHandDots } from "react-icons/fa6";

interface IUserTableColumns {
  name: string,
  uid: string,
  sortable: boolean,
}

const tableColumns: IUserTableColumns[] = [
  {name: 'ID', uid: 'ID', sortable: true},
  {name: 'AVATAR', uid: 'AVATAR', sortable: false},
  {name: 'NOME', uid: 'NOME', sortable: true},
  {name: 'SLUG', uid: 'SLUG', sortable: false},
  {name: 'EMAIL', uid: 'EMAIL', sortable: false},
  {name: 'STATUS', uid: 'STATUS', sortable: true},
  {name: 'TELEFONE', uid: 'TELEFONE', sortable: false},
  {name: 'WHATSAPP', uid: 'WHATSAPP', sortable: false},
  {name: 'EMAIL VERIFICADO', uid: 'EMAIL VERIFICADO', sortable: true},
  {name: 'FUNÇÃO', uid: 'FUNÇÃO', sortable: true},
  {name: 'FUNÇÃO SLUG', uid: 'FUNÇÃO SLUG', sortable: true},
  {name: 'EQUIPE', uid: 'EQUIPE', sortable: true},
  {name: 'EQUIPE SLUG', uid: 'EQUIPE SLUG', sortable: true},
  {name: 'CRIADO EM', uid: 'CRIADO EM', sortable: true},
  {name: 'ATUALIZADO EM', uid: 'ATUALIZADO EM', sortable: true},
  {name: 'ACTIONS', uid: 'ACTIONS', sortable: false},
];

export const statusOptions = [
  {name: "ativo", uid: "ativo"},
  {name: "inativo", uid: "inativo"},
];

const statusColorMap = {
  ativo: "success",
  inativo: "danger",
  vacation: "warning",
};

const statusEmailColorMap = {
  1: "success",
  0: "danger",
};

const INITIAL_VISIBLE_COLUMNS = ["ID", "NOME", "STATUS", "EMAIL VERIFICADO", "FUNÇÃO", "EQUIPE", "ACTIONS"];

export default function UsersTable() {
  const { isOpen, onClose, onOpenChange, onOpen } = useDisclosure();
  const [filterValue, setFilterValue] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(5);
  const [users, setUsers] = useState<IUsersReport[]>([]);
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'NOME',
    direction: 'ascending',
  });

  const headerColumns = useMemo(() => {
    return tableColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const pages = Math.ceil(users.length / rows);

  const hasSearchFilter = Boolean(filterValue);

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
          title: 'Aviso',
          description: errorHandler.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: 'warning',
        });
      }
    }

    loadUsersData();
  }, []);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.userName.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }

    return filteredUsers;
  }, [users, filterValue, statusFilter]);

  const items = useMemo(() => {
    const start = (page - 1) * rows;
    const end = start + rows;

    return filteredItems.slice(start, end);
  }, [ page, rows, filteredItems ]);

  const sortedItems = useMemo(() => {
    let usersToSort = [...items];

    usersToSort = usersToSort.sort((a: IUsersReport, b: IUsersReport) => {
      switch(sortDescriptor.column) {//FUNÇÃO, EQUIPE
        case "ID":
          const idA = a["id" as keyof IUsersReport] as number;
          const idB = b["id" as keyof IUsersReport] as number;
          const cmpId = idA < idB ? -1 : idA > idB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpId : cmpId; 
        case "NOME":
          const userNameA = a["userName" as keyof IUsersReport] as number;
          const userNameB = b["userName" as keyof IUsersReport] as number;
          const cmpUserName = userNameA < userNameB ? -1 : userNameA > userNameB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpUserName : cmpUserName; 
        case "EMAIL VERIFICADO":
          const emailA = a["emailVerified" as keyof IUsersReport] as number;
          const emailB = b["emailVerified" as keyof IUsersReport] as number;
          const cmpEmail = emailA < emailB ? -1 : emailA > emailB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpEmail : cmpEmail;
        case "STATUS":
          const statusA = a["emailVerified" as keyof IUsersReport] as number;
          const statusB = b["emailVerified" as keyof IUsersReport] as number;
          const cmpStatus = statusA < statusB ? -1 : statusA > statusB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpStatus : cmpStatus;
        case "CRIADO EM":
          const createdAtA = a["createdAt" as keyof IUsersReport] as number;
          const createdAtB = b["createdAt" as keyof IUsersReport] as number;
          const cmpCreatedAt = createdAtA < createdAtB ? -1 : createdAtA > createdAtB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpCreatedAt : cmpCreatedAt;
        case "ATUALIZADO EM":
          const updatedAtA = a["updatedAt" as keyof IUsersReport] as number;
          const updatedAtB = b["updatedAt" as keyof IUsersReport] as number;
          const cmpUpdatedAt = updatedAtA < updatedAtB ? -1 : updatedAtA > updatedAtB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpUpdatedAt : cmpUpdatedAt;
        case "FUNÇÃO":
          const positionA = a["positionName" as keyof IUsersReport] as number;
          const positionB = b["positionName" as keyof IUsersReport] as number;
          const cmpPosition = positionA < positionB ? -1 : positionA > positionB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpPosition : cmpPosition;
        case "EQUIPE":
          const teamA = a["teamName" as keyof IUsersReport] as number;
          const teamB = b["team" as keyof IUsersReport] as number;
          const cmpTeam = teamA < teamB ? -1 : teamA > teamB ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmpTeam : cmpTeam;
      }
    });

    return usersToSort;
  }, [sortDescriptor, items]);

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

  const renderCell = useCallback((user: IUsersReport, columnKey: string) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "ID":
        return (
          <span>{user.id}</span>
        );
      case "NOME":
        return (
          <User
            avatarProps={{radius: "lg", showFallback: true, src: `${process.env.baseUrl}/avatar/${user.userSlug}/${user.avatar}`}}
            description={user.email}
            name={user.userName}
          >
            {user.email}
          </User>
        );
      case "AVATAR":
        return (
          <User
            avatarProps={{radius: "lg", showFallback: true, src: `${process.env.baseUrl}/avatar/${user.userSlug}/${user.avatar}`}}
            description=""
            name=""
          />
        );
      case "SLUG":
        return (
          <span>{user.userSlug}</span>
        );
      case "EMAIL":
        return (
          <span>{user.email}</span>
        );
      case "CRIADO EM":
        return (
          <span>{new Date(user.createdAt).toLocaleDateString('pt-br')}</span>
        );
      case "ATUALIZADO EM":
        return (
          <span>{new Date(user.updatedAt).toLocaleDateString('pt-br')}</span>
        );
      case "WHATSAPP":
        return (
          <span>{user.whatsNumber}</span>
        );
      case "TELEFONE":
        return (
          <span>{user.phoneNumber}</span>
        );
      case "STATUS":
        return (
          <Chip className="capitalize" color={statusColorMap[user.status]} size="sm" variant="flat">
            {user.status}
          </Chip>
        );
      case "EMAIL VERIFICADO": 
        return (
          <Chip className="capitalize" color={statusEmailColorMap[user.emailVerified]} size="sm" variant="flat">
            {user.emailVerified == 0 ? "Não" : "Sim"}
          </Chip>
        );
      case "EQUIPE":
        return (
          <span>{user.teamName ? user.teamName : "Sem equipe"}</span>
        )
      case "EQUIPE SLUG":
        return (
          <span>{user.teamSlug ? user.teamSlug : "Sem equipe"}</span>
        )
      case "FUNÇÃO":
        return (
          <span>{user.positionName}</span>
        )
      case "FUNÇÃO SLUG":
        return (
          <span>{user.positionSlug}</span>
        )
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
    users.length,
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
            ? "Todos os usuários selecionados"
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
    utils.book_append_sheet(workbook, worksheet, "Usuários");
    let newColumns: string[] = [];
  
    tableColumns.forEach((column) => {
      let columnLowerCase = column.name.toLowerCase();
      let firstCharCapitalized = columnLowerCase.charAt(0).toUpperCase();
      newColumns.push(firstCharCapitalized + columnLowerCase.slice(1));
    });
  
    utils.sheet_add_aoa(worksheet, [newColumns], { origin: "A1" });

    const max_width = sortedItems.reduce((w, r) => Math.max(w, r.userName.length), 10);
    worksheet["!cols"] = [ { wch: max_width } ];
    writeFile(workbook, "Usuários.xlsx", { compression: true });
  }

  return (
    <div>
      <ModalCreateUser
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        users={users}
        setUsers={setUsers}
        key={'createUsers'}
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
            <h1>Lista de Usuários</h1>
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
              <Dropdown>
                <DropdownTrigger className="hidden sm:flex">
                  <Button endContent={<FaChevronDown className="text-small" />} variant="flat">
                    Status
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Table Columns"
                  closeOnSelect={false}
                  selectedKeys={statusFilter}
                  selectionMode="multiple"
                  onSelectionChange={setStatusFilter}
                >
                  {statusOptions.map((status) => (
                    <DropdownItem key={status.uid} className="capitalize">
                      {status.name.toUpperCase()}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
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
                <Tooltip content="Atualizar lista de usuários">
                  <Button isIconOnly variant="light" onPress={() => loadUserData()}><FiRefreshCcw /></Button>
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
          items={loadingUsers ? [] : sortedItems}
          emptyContent={
            <div className="flex flex-col gap-4 items-center justify-center">
              <SearchIcon />
              <span>Nenhum usuário encontrado</span>
            </div>
          }
          isLoading={loadingUsers}
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