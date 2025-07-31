'use client';

import { ReactNode } from "react";
import { IUserSignedProps, useAuthContext } from "../_contexts/AuthContext";
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
import { HiQueueList } from "react-icons/hi2";

interface IMenuItem {
  route: string,
  name: string,
  icon: ReactNode
}

export default function Nav() {
  const { userSigned, userProfileAuths } = useAuthContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const pathname = usePathname();

  const menuAdminItems: IMenuItem[] = [
    {
      route: '/settings',
      name: 'Configurações',
      icon: <FaGear />
    },
    {
      route: '/queues',
      name: 'Filas de Atendimento',
      icon: <HiQueueList />
    }
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
                  name: (userSigned as IUserSignedProps)?.userName,
                  showFallback: true,
                  src: `${process.env.baseUrl}/avatar/${(userSigned as IUserSignedProps)?.userSlug}/${(userSigned as IUserSignedProps)?.avatar}`
                }}
                name={`${(userSigned as IUserSignedProps)?.userName}`}
                description={`@${(userSigned as IUserSignedProps)?.email}`}
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
                    name={(userSigned as IUserSignedProps)?.userName}
                    isBordered
                    src={`${process.env.baseUrl}/avatar/${(userSigned as IUserSignedProps)?.userSlug}/${(userSigned as IUserSignedProps)?.avatar}`}
                    showFallback
                  />
                  <span>{(userSigned as IUserSignedProps)?.userName}</span>
                  <ThemeSwitch />
                </div>
                <Divider />
                <Link href='/'>
                  <Button
                    className="w-full"
                    variant="light"
                    startContent={<FaHouse />}
                  >Home</Button>
                </Link>
                <Link href='/settings'>
                  <Button
                    className="w-full"
                    variant="light"
                    startContent={<FaGear />}
                  >Configurações</Button>
                </Link>
                {userProfileAuths?.canSeeTeam && (
                  <Link href='/teams'>
                    <Button
                      className="w-full"
                      variant="light"
                      startContent={<FaTeamspeak />}
                    >Equipes</Button>
                  </Link>
                )}
                {userProfileAuths?.canSeeUser && (
                  <Link href='/users'>
                    <Button
                      className="w-full"
                      variant="light"
                      startContent={<FaUsers />}
                    >Usuários</Button>
                  </Link>
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