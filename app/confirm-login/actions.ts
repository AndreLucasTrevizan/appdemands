'use server';

import { api } from "../_api/api";
import ErrorHandler from "../_utils/errorHandler";

export const sendingConfirmationLoginCode = async ({
  email,
  code
}: {
  email: string,
  code: string,
}) => {
  try {
    const response = await api.post('/confirmation-login', { email, code });

    return response.data;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}
