'use client';

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar as HeroUINavbar,
  NavbarContent,
  User
} from '@heroui/react';
import { deleteCookie } from 'cookies-next';
import { useAuthContext } from '../_contexts/AuthContext';
import { ThemeSwitch } from '@/components/theme-switch';

export default function Navbar() {
  const {
    userSigned
  } = useAuthContext();

  const handleLogout = async () => {
    await deleteCookie('demands_signed_data');

    window.location.reload();
  };

  return (
    <HeroUINavbar isBordered>
      <NavbarContent justify='end'>
      <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <User
              as="button"
              avatarProps={{
                isBordered: true,
                src: `${process.env.baseUrl}/avatar/${userSigned?.id}/${userSigned?.avatar}`,
              }}
              className="transition-transform"
              description={`@${userSigned?.email}`}
              name={`${userSigned?.userName}`}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Logado como</p>
              <p className="font-semibold">{userSigned?.userName}</p>
            </DropdownItem>
            <DropdownItem key="theme" endContent={<ThemeSwitch />}>Mudar tema</DropdownItem>
            <DropdownItem key="settings">Configurações</DropdownItem>
            <DropdownItem key="logout" color="danger" onPress={() => handleLogout()}>
              Sair
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </HeroUINavbar>
  );
}