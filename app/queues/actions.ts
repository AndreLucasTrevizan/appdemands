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
