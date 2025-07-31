'use server';

import { api } from "../_api/api";
import { gettingSigned } from "../_components/actions";
import ErrorHandler from "../_utils/errorHandler";

export const createPositions = async ({
  positionName
}: {
  positionName: string,
}) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      throw "Você não está autenticado";
    }

    const response = await api.post('/positions', { positionName }, {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.position;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}
