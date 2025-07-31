'use server';

import { cookies } from "next/headers";
import { api } from "../_api/api";
import { IUserSignedProps } from "../_contexts/AuthContext";
import ErrorHandler from "../_utils/errorHandler";

export async function handleLogin(data: {
  email: string,
  password: string
}) {
  try {
    const response = await api.post('/users/login', data, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    return response.data;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export async function fetchUserAuthProfilePermissions() {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      throw "Você não está autenticado";
    }

    const response = await api.get('/user/auth_profiles/permissions', {
      headers: {
        Authorization: `Bearer ${signedData.token}`
      }
    });

    return response.data.authProfilesPermissions;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export async function gettingSigned() {
  try {
    const serverCookies = await cookies();

    if (serverCookies.get("demands_signed_data")?.value != undefined) {
      return JSON.parse(String(serverCookies.get('demands_signed_data')!.value)) as IUserSignedProps;      
    } else {
      return undefined;
    }
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}
