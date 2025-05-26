'use client';

import { ITicketReportProps } from "@/types";
import { addToast, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { useEffect, useState } from "react";
import { listTickets } from "../ticket/actions";
import ErrorHandler from "../_utils/errorHandler";
import { SearchIcon } from "./searchIcon";

export default function TicketsTable() {
  const [loadingTickets, setLoadingTickets] = useState<boolean>(false);
  const [tickets, setTickets] = useState<ITicketReportProps[]>([]);

  useEffect(() => {
    async function loadTickets() {
      try {
        setLoadingTickets(true);

        const ticketsData = await listTickets();

        setTickets(ticketsData);

        setLoadingTickets(false);
      } catch (error) {
        setLoadingTickets(false);

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

    loadTickets();
  }, []);

  const topContent = () => {
    return (
      <div className="flex flex-col gap-4">
        <h1>Meus chamados</h1>
        <div className="flex w-full flex-row justify-between">

        </div>
      </div>
    );
  }

  return (
    <Table
      isCompact
      isStriped
      topContent={topContent()}
    >
      <TableHeader>
        <TableColumn>ID</TableColumn>
        <TableColumn>TITULO</TableColumn>
        <TableColumn>STATUS</TableColumn>
        <TableColumn>PRIORIDADE</TableColumn>
      </TableHeader>
      <TableBody
        items={tickets}
        isLoading={loadingTickets}
        loadingContent={<Spinner size="md" />}
        emptyContent={
          <div className="flex flex-col items-center gap-4">
            <SearchIcon />
            <span>Nenhum chamado encontrado</span>
          </div>
        }
      >
        {(item) => (
          <TableRow key={item.id}>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.ticketTitle}</TableCell>
            <TableCell>{item.ticketStatus}</TableCell>
            <TableCell>{item.ticketPriority}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
