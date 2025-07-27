'use server';

import { redirect } from "next/navigation";
import { gettingSigned } from "../_components/actions";
import { api } from "../_api/api";
import ErrorHandler from "../_utils/errorHandler";

interface ICreateTicketFormData {
  serviceCatalogId: number;
  description: string;
}

export const gettingTicketWorklog = async ({
  ticketId
}: {
  ticketId: string
}) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const response = await api.get('/ticket_worklog', {
      params: {
        ticketId,
      },
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.ticketWorklog;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export const getTicketProcessList = async () => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const response = await api.get('/tickets/process', {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.process;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export const createTicketProcess = async ({
  name
}: {
  name: string
}) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const response = await api.post('/tickets/process', { name }, {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.process;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export const listTickets = async ({
  byUser,
  userId,
  byTeam,
  teamSlug,
  bySubTeam,
  subTeamSlug
}: {
  byUser?: string,
  userId?: number,
  byTeam?: string,
  teamSlug?: string,
  bySubTeam?: string,
  subTeamSlug?: string
}) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const response = await api.get('/tickets', {
      params: {
        byUser,
        byTeam,
        userId,
        teamSlug,
        bySubTeam,
        subTeamSlug
      },
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

    return response.data.ticket_categories;
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

export const attachingTicketFiles = async (ticketId: number, files: File[]) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    const response = await api.post('/files', formData, {
      params: {
        ticketId
      },
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export const createTicketCategory = async (categoryName: string, categoryDesc: string) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const response = await api.post(`/tickets/categories`, {
      categoryName,
      categoryDesc
    }, {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.ticket_category;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export const createTicketPriority = async (priorityName: string, ticketCategoryId: string) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const response = await api.post(`/tickets/priorities`, {
      priorityName,
      ticketCategoryId
    }, {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.ticketPriority;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export const createTicketSLA = async (slaTime: string, hoursToFirstResponse: string, ticketPriorityId: number) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const response = await api.post(`/tickets/slas`, {
      slaTime,
      hoursToFirstResponse,
      ticketPriorityId
    }, {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.ticketSla;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export const getTicketSLASList = async ({
  ticketCategoryId
}: {
  ticketCategoryId: string
}) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const response = await api.get(`/tickets/slas`, {
      params: {
        ticketCategoryId
      },
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.ticketSlas;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export const createTicketStatus = async ({
  name
}: {
  name: string
}) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const response = await api.post(`/tickets/status`, {name}, {
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
