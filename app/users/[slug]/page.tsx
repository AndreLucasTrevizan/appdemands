'use client';

import DefaultLayout from "@/app/_components/defaultLayout";
import ErrorHandler from "@/app/_utils/errorHandler";
import { IUserProps } from "@/types";
import { addToast, BreadcrumbItem, Breadcrumbs, Divider, Navbar, NavbarContent } from "@heroui/react";
import { useEffect, useState } from "react";
import { getUserDetails } from "../actions";
import Nav from "@/app/_components/nav";

export default function UserDetailsPage({
  params
}: {
  params: Promise<{slug: string}>
}) {
  const [loadingUserData, setLoadingUserData] = useState<boolean>(false);
  const [user, setUser] = useState<IUserProps>();

  useEffect(() => {
    async function loadUserData() {
      try {
        const { slug } = await params;

        setLoadingUserData(true);

        const userData = await getUserDetails(slug);
        
        setUser(userData);

        setLoadingUserData(false);
      } catch (error) {
        setLoadingUserData(false);

        const errorHandler = new ErrorHandler(error);

        addToast({
          color: 'warning',
          title: 'Aviso',
          description: errorHandler.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      }
    }

    loadUserData();
  }, []);

  return (
    <DefaultLayout>
      <Nav />
      <div className="flex flex-col gap-4 px-4 pb-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/users">Usuários</BreadcrumbItem>
          <BreadcrumbItem>Usuário {user?.userName}</BreadcrumbItem>
        </Breadcrumbs>
        <Divider />
      </div>
    </DefaultLayout>
  );
}