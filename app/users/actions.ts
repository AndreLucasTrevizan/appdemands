'use server';

import { redirect } from "next/navigation";
import { gettingSigned } from "../_components/actions";
import { api } from "../_api/api";

export const listUsers = async () => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const response = await api.get('/users', {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.users;
  } catch (error) {
    throw error;
  }
}
