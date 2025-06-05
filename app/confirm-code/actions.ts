'use server';

import { api } from "../_api/api";
import { gettingSigned } from "../_components/actions";
import ErrorHandler from "../_utils/errorHandler";

export const confirmingCode = async (code: string) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      throw "Você não está autenticado";
    }

    console.log(code);

    const response = await api.post('/confirm-code', { code });

    return response.data.account;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}
