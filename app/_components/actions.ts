'use server';

import { cookies } from "next/headers";
import { IDemandProps } from "@/types";
import { api } from "../_api/api";
import { IUserSignedProps } from "../_contexts/AuthContext";
import ErrorHandler from "../_utils/errorHandler";

export async function loadDemands(): Promise<IDemandProps[]> {
  try {
    const serverCookies = await cookies();

    let signedDataJSON: IUserSignedProps | null = null;

    if (serverCookies.get('demands_signed_data')) {
      signedDataJSON = JSON.parse(String(serverCookies.get('demands_signed_data')?.value)) as IUserSignedProps;
    }

    const response = await api.get('/demands', {
      headers: {
        Authorization: `Bearer ${signedDataJSON?.token}`
      }
    });

    return response.data.demands;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

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

export async function gettingSigned() {
  try {
    const serverCookies = await cookies();

    return JSON.parse(String(serverCookies.get('demands_signed_data')?.value)) as IUserSignedProps;      
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}
