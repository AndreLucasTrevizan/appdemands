'use server';

import { api } from "../_api/api";
import ErrorHandler from "../_utils/errorHandler";

export const changingPassword = async ({
  email,
  password,
  confirmPassword
}: {
  email: string,
  password: string,
  confirmPassword: string
}) => {
  try {
    const response = await api.post('/reset-password', {
      email,
      password,
      confirmPassword
    });

    return response.data;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}
