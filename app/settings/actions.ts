'use server';

import { IAvatarResponse, IUserProfileProps } from "@/types";
import { api } from "../_api/api";
import { cookies, headers } from "next/headers";
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

export async function changingAvatar(data: FormData): Promise<IAvatarResponse> {
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
    throw error;
  }
}
