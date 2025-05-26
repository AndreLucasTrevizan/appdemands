'use server';

import { redirect } from "next/navigation";
import { gettingSigned } from "./_components/actions";
import { api } from "./_api/api";
import ErrorHandler from "./_utils/errorHandler";

export const getUserDetailsForTicket = async () => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const response = await api.get(`/user/details/ticket`, {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.user[0];
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}
