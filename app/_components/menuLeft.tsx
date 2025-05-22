'use client';

import { ReactNode, useEffect, useState } from "react";
import { IUserSignedProps } from "../_contexts/AuthContext";
import { gettingSigned } from "./actions";
import ErrorHandler from "../_utils/errorHandler";
import {
  addToast,
  Avatar,
  Button,
} from "@heroui/react";
import {
  FaArrowLeft,
  FaTeamspeak,
  FaUsers,
  FaGear,
  FaHouse,
  FaListCheck
} from "react-icons/fa6";
import { RiUserSettingsLine } from "react-icons/ri";
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
    },
    {
      route: '/positions',
      name: 'Funções de Usuário',
      icon: <RiUserSettingsLine />
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
      <nav className="sticky top-0 self-start h-screen border-r-1">
        <div className="flex flex-col items-center gap-2 p-4">
          <Avatar
            showFallback
            isBordered
            src={`${process.env.baseUrl}/avatar/${userSigned?.id}/${userSigned?.avatar}`}
          />
          <p>{userSigned?.userName}</p>
          <ThemeSwitch />
        </div>
        <div className="flex flex-col">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.route}>
              <Button
                radius="none"
                variant="light"
                startContent={item.icon}
                className="flex items-center justify-start w-full"
              >
                {item.name}
              </Button>
            </Link>
          ))}
          <Button
            radius="none"
            variant="light"
            key={'logout'}
            startContent={<FaArrowLeft />}
            className="flex items-center justify-start"
            onPress={() => handleLogout()}
            color="danger"
          >
            Sair
          </Button>
        </div>
      </nav>
    );
  }
}