'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';

import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { fetchUserAuthProfilePermissions, gettingSigned } from '../_components/actions';
import { IAvatarResponse, IUserProfileAuthorizations } from '@/types';

export interface IUserSignedProps {
  id: number
  avatar?: string
  userName: string
  userSlug: string
  email: string
  userStatus: string
  emailVerified: boolean
  phoneNumber: string
  whatsNumber: string
  isFirstLogin: boolean,
  isOnTeam: boolean,
  isAttendant: boolean,
  authProfile: string
  teamName?: string
  teamSlug?: string
  subTeamName?: string 
  subTeamSlug?: string
  createdAt: Date
  updatedAt: Date
  token: string
}

interface IAuthContextProps {
  signed: boolean,
  userSigned: IUserSignedProps | undefined,
  userProfileAuths: IUserProfileAuthorizations | undefined,
  updateSignedAvatar: (value: string) => void,
  settingUserSigned: (data: IUserSignedProps) => void;
  settingUserProfileAuths: (data: IUserProfileAuthorizations) => void;
  settingUserAvatar: (response: IAvatarResponse) => void;
}

export const AuthContext = createContext({} as IAuthContextProps);

export const useAuthContext = () => {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: {children: ReactNode}) {
  const [signed, setSigned] = useState<boolean>(false);
  const [userSigned, setUserSigned] = useState<IUserSignedProps>();
  const [userProfileAuths, setUserProfileAuths] = useState<IUserProfileAuthorizations>();

  useEffect(() => {
    async function loadData() {
      const signedData = await getCookie('demands_signed_data');
      const permission = await fetchUserAuthProfilePermissions();

      setUserSigned(JSON.parse(signedData as string));
      setUserProfileAuths(permission);
      setSigned(true);
    }

    loadData();
  }, []);

  const settingUserSigned = (data: IUserSignedProps) => {
    setUserSigned(data);
  }
  
  const settingUserProfileAuths = (data: IUserProfileAuthorizations) => {
    setUserProfileAuths(data);
  }

  const settingUserAvatar = (response: IAvatarResponse) => {
    if (userSigned) {
      const data = userSigned;
      data.avatar = response.avatar;
      setUserSigned(data);
    }
  }

  function updateSignedAvatar(value: string) {
    if (userSigned) {
      userSigned.avatar = value;

      let hasCookie = getCookie('demands_signed_data');

      if (hasCookie) {
        setCookie("demands_signed_data", JSON.stringify(userSigned)); 
      } else {
        deleteCookie('demands_signed_data');
        setCookie("demands_signed_data", JSON.stringify(userSigned)); 
      }

      setUserSigned(userSigned);
    }
  }

  return (
    <AuthContext.Provider value={{
      signed,
      userSigned,
      updateSignedAvatar,
      settingUserSigned,
      settingUserAvatar,
      userProfileAuths,
      settingUserProfileAuths
    }}>
      {children}
    </AuthContext.Provider>
  );
}
