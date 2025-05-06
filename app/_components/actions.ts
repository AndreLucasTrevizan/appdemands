'use server';

import { cookies } from "next/headers";
import { IDemandProps } from "@/types";
import { api } from "../_api/api";
import { IUserSignedProps } from "../_contexts/AuthContext";

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
    throw error;
  }
}

export async function handleLogin(data: {
  email: string,
  password: string
}): Promise<IUserSignedProps> {
  try {
    const response = await api.post('/users/login', data);

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function gettingSigned(): Promise<IUserSignedProps | null> {
  try {
    const serverCookies = await cookies();

    let signedDataJSON: IUserSignedProps | null = null;

    if (serverCookies.get('demands_signed_data')) {
      signedDataJSON = JSON.parse(String(serverCookies.get('demands_signed_data')?.value)) as IUserSignedProps;      
    }

    return signedDataJSON;
  } catch (error) {
    throw error;
  }
}
