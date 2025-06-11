'use server';

import { api } from "../_api/api";
import ErrorHandler from "../_utils/errorHandler";

export const sendingCode = async (email: string) => {
  try {
    const response = await api.post('/confirmation-code', { email });

    return response.data;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}
  