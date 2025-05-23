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

export const getUserDetails = async (slug: string) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const response = await api.get(`/user/${slug}/details`, {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.user;
  } catch (error) {
    throw error;
  }
}

export const createUser = async ({
  userName,
  email,
  positionId
}: {
  userName: string,
  email: string,
  positionId: number,
}) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const response = await api.post(`/users`, {
        userName,
        email,
        positionId
      }, {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.newUser[0];
  } catch (error) {
    throw error;
  }
}

