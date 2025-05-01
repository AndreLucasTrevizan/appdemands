'use server';

import { cookies } from "next/headers";
import { api } from "../_api/api";
import { ErrorHandler } from "../_utils/errorHandler";
import { redirect } from "next/navigation";

interface IPrevState {
  error: boolean,
  message: string,
}

export const signInAction = async (prevState: IPrevState, formData: FormData) => {
  const serverCookies = await cookies();
  
  try {
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    const response = await api.post('/users/login', data);

    serverCookies.set('demands_signed_data', JSON.stringify(response.data));
  } catch (error) {
    const errors = new ErrorHandler(error);
    return {
      error: true,
      message: 'Teste'
    };
  }

  redirect("/");
}
