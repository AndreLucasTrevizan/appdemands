'use client';

import {
  addToast,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  Spinner,
  User
} from '@heroui/react';
import { deleteCookie } from 'cookies-next';
import { IUserSignedProps, useAuthContext } from '../_contexts/AuthContext';
import { ThemeSwitch } from '@/components/theme-switch';
import { useEffect, useState } from 'react';
import { gettingSigned } from './actions';
import ErrorHandler from '../_utils/errorHandler';
import Link from 'next/link';

export default function Navbar() {
  const [loading, setLoading] = useState<boolean>(false);
  const [userSigned, setUserSigned] = useState<IUserSignedProps | null>(null);

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

  return (
    <HeroUINavbar isBordered>
      <NavbarContent>
        <NavbarBrand>
          <Link href="/"><h1>Demands</h1></Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify='end'>
      {loading && (
        <NavbarContent justify='end'>
          <Spinner size='sm' variant='dots' />
        </NavbarContent>
      )}
      {userSigned && (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <User
              as="button"
              avatarProps={{
                isBordered: true,
                src: userSigned.avatar,
              }}
              className="transition-transform"
              description={`@${userSigned?.email}`}
              name={`${userSigned?.userName}`}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Logado como</p>
              <p className="font-semibold">{userSigned.userName}</p>
            </DropdownItem>
            <DropdownItem key="theme" endContent={<ThemeSwitch />}>Mudar tema</DropdownItem>
            <DropdownItem as={'a'} href='/settings' key="settings">Configurações</DropdownItem>
            <DropdownItem key="logout" color="danger" onPress={() => handleLogout()}>
              Sair
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
      </NavbarContent>
    </HeroUINavbar>
  );
}