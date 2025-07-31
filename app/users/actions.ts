'use server';

import { redirect } from "next/navigation";
import { gettingSigned } from "../_components/actions";
import { api } from "../_api/api";
import ErrorHandler from "../_utils/errorHandler";

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
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
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
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export const createUser = async ({
  isAttendant,
  userName,
  email,
  authProfileId
}: {
  isAttendant: string,
  userName: string,
  email: string,
  authProfileId: number,
}) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    if (isAttendant == "true") {
      const response = await api.post(`/users`, {
          isAttendant,
          userName,
          email,
          authProfileId
        }, {
        headers: {
          Authorization: `Bearer ${signedData.token}`,
        }
      });

      return response.data.newAttendant[0];
    } else {
      const response = await api.post(`/users`, {
          isAttendant,
          userName,
          email,
          authProfileId
        }, {
        headers: {
          Authorization: `Bearer ${signedData.token}`,
        }
      });

      return response.data.newUser[0];
    }
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}


