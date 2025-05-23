'use client';

import { ITeamMember } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { listTeamMembers } from "../teams/actions";
import ErrorHandler from "../_utils/errorHandler";
import { addToast, Button, Input, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, User } from "@heroui/react";
import { SearchIcon } from "./searchIcon";
import { FiRefreshCcw } from "react-icons/fi";
import { PlusIcon } from "./plusIcon";

export default function MembersTable({
  params
}: {
  params: Promise<{slug: string}>
}) {
  const [members, setMembers] = useState<ITeamMember[]>([]);
  const [loadingUpdateMemberList, setLoadingUpdateMemberList] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<string>('');
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(5);

  const pages = Math.ceil(members.length / rows);

  useEffect(() => {
    async function loadMembersData() {
      try {
        setLoadingUpdateMemberList(true);

        let { slug } = await params;

        const data = await listTeamMembers(slug);

        setMembers(data);

        setLoadingUpdateMemberList(false);
      } catch (error) {
        setLoadingUpdateMemberList(false);

        const errorHandler = new ErrorHandler(error);
        
        addToast({
          title: 'Aviso',
          description: errorHandler.error.message,
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

      let { slug } = await params;

      const data = await listTeamMembers(slug);

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
        description: errorHandler.error.message,
        timeout: 3000,
        shouldShowTimeoutProgress: true
      });
    }
  }

  const filteredItems = useMemo(() => {
    let filteredMembers = [...members];

    filteredMembers = members.filter((member) => member.userName.toLowerCase().includes(filterValue.toLowerCase()));
    
    return filteredMembers;
  }, [ members, filterValue ]);

  const items = useMemo(() => {
    const start = (page - 1) * rows;
    const end = start + rows;

    return filteredItems.slice(start, end);
  }, [ page, rows, filteredItems ]);

  const topContent = useMemo(() => {
    return (
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
      <Table
        topContent={topContent}
        bottomContent={bottomContent}
        isCompact
        isStriped
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>NOME</TableColumn>
          <TableColumn>EQUIPE</TableColumn>
          <TableColumn>SUB-EQUIPE</TableColumn>
        </TableHeader>
        <TableBody
          items={items}
          isLoading={loadingUpdateMemberList}
          loadingContent={<Spinner size="md" />}
        >
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>
                <User
                  name={item.userName}
                  description={`@${item.email}`}
                  avatarProps={{
                    name: item.userName,
                    src: `${process.env.baseUrl}/avatar/${item.id}/${item.avatar}`,
                    showFallback: true,
                  }}
                />
              </TableCell>
              <TableCell>{item.teamName}</TableCell>
              <TableCell>{item.subTeamName}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
