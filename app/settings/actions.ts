'use server';

import { IUserProfileProps } from "@/types";
import { api } from "../_api/api";
import { cookies } from "next/headers";
import { IUserSignedProps } from "../_contexts/AuthContext";

export async function gettingUserProfile(): Promise<IUserProfileProps> {
  try {
    const serverCookies = await cookies();
    
    const signedDataJSON = JSON.parse(String(serverCookies.get('demands_signed_data')?.value)) as IUserSignedProps;

    const response = await api.get('/user/profile', {
      headers: {
        Authorization: `Bearer ${signedDataJSON.token}`
      }
    });

    return response.data.user;
  } catch (error) {
    throw error;
  }
}
