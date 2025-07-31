'use server';

import { api } from "@/app/_api/api";
import { gettingSigned } from "@/app/_components/actions";
import ErrorHandler from "@/app/_utils/errorHandler";

export const fetchAllAuthProfiles = async () => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      throw "Você não está autenticado";
    }

    const response = await api.get('/auth_profiles', {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.authProfiles;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}