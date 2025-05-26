'use client';

import { ReactNode, useEffect, useState } from "react";
import { IUserSignedProps } from "../_contexts/AuthContext";
import { gettingSigned } from "./actions";
import ErrorHandler from "../_utils/errorHandler";
import {
  addToast,
  Avatar,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  useDisclosure,
  User,
} from "@heroui/react";
import {
  FaTeamspeak,
  FaUsers,
  FaGear,
  FaHouse,
  FaListCheck,
  FaArrowLeft
} from "react-icons/fa6";
import { RiUserSettingsLine } from "react-icons/ri";
import Link from "next/link";
import { deleteCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import { ThemeSwitch } from "@/components/theme-switch";
import { FiMenu } from "react-icons/fi";
import { useTheme } from "next-themes";

interface IMenuItem {
  route: string,
  name: string,
  icon: ReactNode
}

export default function Nav() {
  const { theme } = useTheme();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
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
          description: errorHandler.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: 'warning',
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
      <Navbar isBordered>
          <NavbarBrand>
            <Button
              isIconOnly
              variant="light"
              onPress={() => onOpen()}
            >
              <FiMenu size={25} />
            </Button>
          </NavbarBrand>
          <NavbarContent justify="end">
            <User
              avatarProps={{
                name: userSigned?.userName,
                showFallback: true,
                src: `${process.env.baseUrl}/avatar/${userSigned?.id}/${userSigned?.avatar}`
              }}
              name={`${userSigned?.userName}`}
              description={`@${userSigned?.email}`}
            />
          </NavbarContent>
          <Drawer
            placement="left"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
          >
            <DrawerContent>
              <DrawerBody>
                <div className="flex flex-col items-center gap-4 p-4">
                  <Avatar
                    name={userSigned?.userName}
                    isBordered
                    src={`${process.env.baseUrl}/avatar/${userSigned?.id}/${userSigned?.avatar}`}
                    showFallback
                  />
                  <span>{userSigned?.userName}</span>
                  <ThemeSwitch />
                </div>
                <Divider />
                {menuItems.map((item) => (
                  <Link key={item.name} href={item.route}>
                    <Button
                      className="w-full"
                      variant="light"
                      startContent={item.icon}
                    >{item.name}</Button>
                  </Link>
                ))}
                <Button
                  onPress={() => handleLogout()}
                  color="danger"
                  startContent={<FaArrowLeft />}
                >Sair</Button>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
      </Navbar>
    );
  }
}