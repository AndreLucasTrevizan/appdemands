'use server';

import { redirect } from "next/navigation";
import { gettingSigned } from "../_components/actions";
import { api } from "../_api/api";
import ErrorHandler from "../_utils/errorHandler";

interface ICreateTicketFormData {
  title: string;
  description: string;
  categoryId: number | undefined;
  priorityId: number | undefined;
  teamSlug: string | undefined | null; 
  subTeamSlug: string | undefined | null;
}

export const listTickets = async () => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const response = await api.get('/tickets', {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.tickets;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export const createTicket = async (data: ICreateTicketFormData) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const response = await api.post('/tickets', data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.ticket;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export const getUserDetailsForTicket = async () => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const response = await api.get(`/user/details/ticket`, {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.user[0];
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}
export const getTicketCategoriesList = async () => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const response = await api.get(`/tickets/categories`, {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.ticketCategories;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}
export const getTicketStatusList = async () => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const response = await api.get(`/tickets/status`, {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.ticketStatus;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}
export const getTicketPrioritiesList = async () => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const response = await api.get(`/tickets/priorities`, {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.ticketPriorities;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}
