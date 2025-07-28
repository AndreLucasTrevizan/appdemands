'use server';

import { api } from "../_api/api";
import { gettingSigned } from "../_components/actions";
import ErrorHandler from "../_utils/errorHandler";

interface ICreateQueueProps {
  queueName: string,
}

export const createNewQueue = async (data: ICreateQueueProps) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      throw "Você não está autenticado";
    }

    const response = await api.post('/queues', data, {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.queue;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export const listQueues = async () => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      throw "Você não está autenticado";
    }

    const response = await api.get('/queues', {
      params: {
        status: 'ativo'
      },
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.queues;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export const getQueueDetails = async (slug: string) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      throw "Você não está autenticado";
    }

    const response = await api.get(`/queues/${slug}`, {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.queue;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export const getQueueMembers = async (slug: string) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      throw "Você não está autenticado";
    }

    const response = await api.get(`/queues/${slug}/members`, {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.attendants;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export interface IAddQueueMemberProps {
  slug: string,
  attendantsList: string,
}

export const addAttendantsOnQueue = async (data: IAddQueueMemberProps) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      throw "Você não está autenticado";
    }

    const response = await api.post("/queues/members", data, {
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
