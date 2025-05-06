'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';

import { getCookie } from 'cookies-next';
import { gettingSigned } from '../_components/actions';
import { IAvatarResponse } from '@/types';

export interface IUserSignedProps {
  id: number;
  userName: string;
  email: string;
  slug: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  token: string;
}

interface IAuthContextProps {
  signed: boolean,
  userSigned: IUserSignedProps | null,
  settingUserSigned: (data: IUserSignedProps) => void;
  settingUserAvatar: (response: IAvatarResponse) => void;
}

export const AuthContext = createContext({} as IAuthContextProps);

export const useAuthContext = () => {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: {children: ReactNode}) {
  const [signed, setSigned] = useState<boolean>(false);
  const [userSigned, setUserSigned] = useState<IUserSignedProps | null>(null);

  useEffect(() => {
    async function loadData() {
      const signedData = await gettingSigned();

      setUserSigned(signedData);
      setSigned(true);
    }

    loadData();
  }, []);

  const settingUserSigned = (data: IUserSignedProps) => {
    setUserSigned(data);
  }

  const settingUserAvatar = (response: IAvatarResponse) => {
    if (userSigned) {
      const data = userSigned;
      data.avatar = response.avatar;
      setUserSigned(data);
    }
  }

  return (
    <AuthContext.Provider value={{
      signed,
      userSigned,
      settingUserSigned,
      settingUserAvatar
    }}>
      {children}
    </AuthContext.Provider>
  );
}
