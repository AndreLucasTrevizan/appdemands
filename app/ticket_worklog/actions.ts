'use server';

import { redirect } from "next/navigation";
import { gettingSigned } from "../_components/actions";
import ErrorHandler from "../_utils/errorHandler";
import { api } from "../_api/api";

export const handleRegisterTicketWorklog = async (
  description: string,
  ticketId: number,
  files?: File[]
) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const formData = new FormData();

    formData.append('description', description);
    formData.append('ticketId', String(ticketId));

    const response = await api.post('/ticket_worklog', formData, {
      headers: {
        Authorization: `Bearer ${signedData.token}`
      }
    });

    if (files != undefined) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      await api.post('/files', formData, {
        params: {
          ticketWorklogId: response.data.ticketWorklog.id,
        },
        headers: {
          Authorization: `Bearer ${signedData.token}`,
        }
      });
    }

    return response.data;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}
