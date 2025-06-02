'use client';

import { ReactNode } from "react";
import { useAuthContext } from "../_contexts/AuthContext";
import {
  Avatar,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  Navbar,
  NavbarBrand,
  NavbarContent,
  Spinner,
  useDisclosure,
  User,
} from "@heroui/react";
import {
  FaTeamspeak,
  FaUsers,
  FaGear,
  FaHouse,
  FaArrowLeft
} from "react-icons/fa6";
import { RiUserSettingsLine } from "react-icons/ri";
import Link from "next/link";
import { deleteCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import { ThemeSwitch } from "@/components/theme-switch";
import { FiMenu } from "react-icons/fi";

interface IMenuItem {
  route: string,
  name: string,
  icon: ReactNode
}

export default function Nav() {
  const { userSigned } = useAuthContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const pathname = usePathname();

  const menuAdminItems: IMenuItem[] = [
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

  const menuItems: IMenuItem[] = [
    {
      route: '/',
      name: 'Home',
      icon: <FaHouse />
    },
    {
      route: '/settings',
      name: 'Configurações',
      icon: <FaGear />
    },
  ];

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
            {!userSigned ? (
              <Spinner variant="dots" size="sm" />
            ) : (
              <User
                avatarProps={{
                  name: userSigned.userName,
                  showFallback: true,
                  src: `${process.env.baseUrl}/avatar/${userSigned.slug}/${userSigned.avatar}`
                }}
                name={`${userSigned.userName}`}
                description={`@${userSigned.email}`}
              />
            )}
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
                    src={`${process.env.baseUrl}/avatar/${userSigned?.slug}/${userSigned?.avatar}`}
                    showFallback
                  />
                  <span>{userSigned?.userName}</span>
                  <ThemeSwitch />
                </div>
                <Divider />
                {userSigned?.isAttendant || userSigned?.position.slug == "administrador" ? (
                  menuAdminItems.map((item) => (
                    <Link key={item.name} href={item.route}>
                      <Button
                        className="w-full"
                        variant="light"
                        startContent={item.icon}
                      >{item.name}</Button>
                    </Link>
                  ))
                ) : (
                  menuItems.map((item) => (
                    <Link key={item.name} href={item.route}>
                      <Button
                        className="w-full"
                        variant="light"
                        startContent={item.icon}
                      >{item.name}</Button>
                    </Link>
                  ))
                )}
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