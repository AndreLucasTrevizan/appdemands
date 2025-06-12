'use server';

import { redirect } from "next/navigation";
import { gettingSigned } from "../_components/actions";
import { api } from "../_api/api";
import ErrorHandler from "../_utils/errorHandler";

export const listAvailableAttendants = async () => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const response = await api.get('/attendants', {
      params: {
        isAvailable: true
      },
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

export const listAttendants = async () => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const response = await api.get('/attendants', {
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