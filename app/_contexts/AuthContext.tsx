'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';

import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { gettingSigned } from '../_components/actions';
import { IAvatarResponse, IPositionProps } from '@/types';

export interface IUserSignedProps {
  id: number;
  userName: string;
  email: string;
  slug: string;
  avatar: string;
  isOnTeam: boolean;
  teamSlug: string;
  isAttendant: boolean;
  position: IPositionProps,
  createdAt: Date;
  updatedAt: Date;
  token: string;
}

interface IAuthContextProps {
  signed: boolean,
  userSigned: IUserSignedProps | undefined,
  updateSignedAvatar: (value: string) => void,
  settingUserSigned: (data: IUserSignedProps) => void;
  settingUserAvatar: (response: IAvatarResponse) => void;
}

export const AuthContext = createContext({} as IAuthContextProps);

export const useAuthContext = () => {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: {children: ReactNode}) {
  const [signed, setSigned] = useState<boolean>(false);
  const [userSigned, setUserSigned] = useState<IUserSignedProps | undefined>(undefined);

  useEffect(() => {
    async function loadData() {
      const signedData = await gettingSigned();

      console.log(signedData);

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
      (data as IUserSignedProps).avatar = response.avatar;
      setUserSigned(data);
    }
  }

  function updateSignedAvatar(value: string) {
    let signed = userSigned;

    (signed as IUserSignedProps).avatar = value;

    let hasCookie = getCookie('demands_signed_data');

    if (hasCookie) {
      setCookie("demands_signed_data", JSON.stringify(signed)); 
    } else {
      deleteCookie('demands_signed_data');
      setCookie("demands_signed_data", JSON.stringify(signed)); 
    }
    setUserSigned(signed);
  }

  return (
    <AuthContext.Provider value={{
      signed,
      userSigned,
      updateSignedAvatar,
      settingUserSigned,
      settingUserAvatar
    }}>
      {children}
    </AuthContext.Provider>
  );
}
