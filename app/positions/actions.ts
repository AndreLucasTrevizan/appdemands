'use server';

import { api } from "../_api/api";
import { gettingSigned } from "../_components/actions";

export const listPositions = async () => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      throw "Você não está autenticado";
    }

    const response = await api.get('/positions', {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.positions;
  } catch (error) {
    throw error;
  }
}

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
    throw error;
  }
}
