'use client';

import { ReactNode, useEffect, useState } from "react";
import { IUserSignedProps } from "../_contexts/AuthContext";
import { gettingSigned } from "./actions";
import ErrorHandler from "../_utils/errorHandler";
import {
  addToast,
  Avatar,
  Listbox,
  ListboxItem,
} from "@heroui/react";
import {
  FaArrowLeft,
  FaTeamspeak,
  FaUsers,
  FaGear,
  FaHouse,
  FaListCheck
} from "react-icons/fa6";
import Link from "next/link";
import { deleteCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import { ThemeSwitch } from "@/components/theme-switch";

interface IMenuItem {
  route: string,
  name: string,
  icon: ReactNode
}

export default function MenuLeft() {
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(false);
  const [userSigned, setUserSigned] = useState<IUserSignedProps | null>(null);

  const menuItems: IMenuItem[] = [
    {
      route: '/',
      name: 'Home',
      icon: <FaHouse />
    },
    {
      route: '/teams',
      name: 'Equipes',
      icon: <FaTeamspeak />
    },
    {
      route: '/users',
      name: 'Usuários',
      icon: <FaUsers />
    },
    {
      route: '/demands',
      name: 'Demandas',
      icon: <FaListCheck />
    },
    {
      route: '/settings',
      name: 'Configurações',
      icon: <FaGear />
    }
  ];

  useEffect(() => {
    async function loadSignedData() {
      try {
        setLoading(true);

        const data = await gettingSigned();

        setUserSigned(data);
      } catch (error) {
        const errorHandler = new ErrorHandler(error);

        addToast({
          title: 'Aviso',
          description: `${errorHandler.error.message}`,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      } finally {
        setLoading(false);
      }
    }

    loadSignedData();
  }, []);

  const handleLogout = async () => {
    await deleteCookie('demands_signed_data');

    window.location.reload();
  };

  if (!pathname.includes('sign_in')) {
    return (
      <div className="flex flex-col">
        <div className="flex flex-col items-center gap-2 p-4 border">
          <Avatar
            isBordered
            src={`${process.env.baseUrl}/avatar/${userSigned?.id}/${userSigned?.avatar}`}
          />
          <p>{userSigned?.userName}</p>
          <ThemeSwitch />
        </div>
        <div className="flex flex-col border h-screen">
          <Listbox>
            {menuItems.map((item) => (
              <ListboxItem key={item.name} startContent={item.icon}>
                <Link href={item.route}>{item.name}</Link>
              </ListboxItem>
            ))}
          </Listbox>
        </div>
        <Listbox>
          <ListboxItem startContent={<FaArrowLeft />} onPress={() => handleLogout()} className="text-danger">Sair</ListboxItem>
        </Listbox>
      </div>
    );
  }
}