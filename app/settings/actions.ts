'use server';

import { ICreateService } from "@/types";
import { api } from "../_api/api";
import { cookies } from "next/headers";
import { IUserSignedProps } from "../_contexts/AuthContext";
import ErrorHandler from "../_utils/errorHandler";
import { gettingSigned } from "../_components/actions";

export async function createCatalogsService(data: ICreateService) {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      throw "Você não está autenticado";
    }

    const response = await api.post('/service_catalog', data, {
      headers: {
        Authorization: `Bearer ${signedData.token}`
      }
    });

    return response.data.service;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export async function gettingUserProfile() {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      throw "Você não está autenticado";
    }

    const response = await api.get('/user/profile', {
      headers: {
        Authorization: `Bearer ${signedData.token}`
      }
    });

    return response.data.user[0];
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export async function changingAvatar(data: FormData) {
  try {
    const serverCookies = await cookies();
    
    const signedDataJSON = JSON.parse(String(serverCookies.get('demands_signed_data')?.value)) as IUserSignedProps;

    const response = await api.patch('/users/avatar', data, {
      headers: {
        Authorization: `Bearer ${signedDataJSON.token}`
      }
    });

    return response.data.avatar;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}
