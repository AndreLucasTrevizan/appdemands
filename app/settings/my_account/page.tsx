'use client';

import DefaultLayout from "@/app/_components/defaultLayout";
import Nav from "@/app/_components/nav";
import { IUsersReport } from "@/types";
import { addToast, Avatar, BreadcrumbItem, Breadcrumbs, Button, Divider, Input, Spacer, Spinner, Tooltip } from "@heroui/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { changingAvatar, gettingUserProfile } from "../actions";
import ErrorHandler from "@/app/_utils/errorHandler";
import { useAuthContext } from "@/app/_contexts/AuthContext";
import { FaCamera, FaTeamspeak, FaWhatsapp } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
import { FiMail, FiPhone, FiStar, FiUser } from "react-icons/fi";
import { RiUserSettingsLine } from "react-icons/ri";
import { phoneMasked, whatsMasked } from "@/app/_utils/masks";
import { LiaToolsSolid } from "react-icons/lia";

export default function MyAccount() {
  const inputFile = useRef<HTMLInputElement>(null);
  const {
    settingUserAvatar,
    updateSignedAvatar
  } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAvatar, setLoadingAvatar] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrlPreview, setFileUrlPreview] = useState<string>('');
  const [user, setUser] = useState<IUsersReport>();
  const [confirmAvatar, setConfirmAvatar] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const data = await gettingUserProfile();

        setUser(data);
      } catch (error) {
        const errorHandler = new ErrorHandler(error);
        
        addToast({
          title: 'Aviso',
          description: `${errorHandler.message}`,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [  ]);
  
  const changeFile = (e: ChangeEvent<HTMLInputElement>) => {    
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setFileUrlPreview(URL.createObjectURL(e.target.files[0]));
    } else {
      setFile(null);
      setFileUrlPreview('');
    }
  }

  const cancelAvatarChange = () => {
    setFile(null);
    setFileUrlPreview('');
    if (inputFile.current) {
      inputFile.current.value = '';
    }
  }

  const handleChangeAvatar = async () => {
    const formData = new FormData();

    if (file) {
      formData.append('avatar', file);

      try {
        setLoadingAvatar(true);

        const data = await changingAvatar(formData);

        updateSignedAvatar(data);
        setConfirmAvatar(!confirmAvatar);
        addToast({
          color: 'success',
          title: 'Sucesso',
          description: `Sua foto de perfil foi atualizada`,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      } catch (error) {
        const errorHandler = new ErrorHandler(error);

        addToast({
          title: 'Aviso',
          description: `${errorHandler.message}`,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      } finally {
        setLoadingAvatar(false);
      }
    }
  }

  return (
    <DefaultLayout>
      <Nav />
      <div className="flex flex-col gap-4 px-4 pb-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/settings">Configurações</BreadcrumbItem>
          <BreadcrumbItem>Minha Conta</BreadcrumbItem>
        </Breadcrumbs>
        <Divider />
        <div>
          {loading ? (
            <Spinner className="py-4" variant="dots" size="md" />
          ) : (
            user ? (
              <div
                className="px-4"
              >
                <div className="flex items-center gap-4">
                  {loadingAvatar ? (
                    <Spinner size="md" variant="dots" />
                  ) : (
                    <div className="flex gap-4 w-full">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <Avatar
                          name={user.userName}
                          showFallback
                          className="w-20 h-20 text-large"
                          src={file ? `${fileUrlPreview}` : `${process.env.baseUrl}/avatar/${user.userSlug}/${user.avatar}`}
                        />
                        <div className="flex flex-col items-center">
                          <div className="flex flex-col">
                            <label className="flex gap-2 items-center hover:cursor-pointer" htmlFor="inputFile">
                              <FaCamera />
                              <small>Trocar foto de perfil</small>
                            </label>
                            <Input ref={inputFile} id="inputFile" type='file' className="hidden" onChange={(e) => changeFile(e)} />
                          </div>
                          {file && (
                            <>
                              <Spacer y={4} />
                              <div className="flex gap-4">
                                <small className="text-red-500 hover:cursor-pointer" onClick={() => cancelAvatarChange()}>Cancelar</small>
                                <small className="flex gap-2 items-center text-primary hover:cursor-pointer" onClick={() => handleChangeAvatar()}>
                                  <FaSave />
                                  Confirmar avatar
                                </small>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <Divider orientation="vertical" />
                      </div>
                      <div className="flex flex-wrap flex-row gap-4 flex-1">
                        <Input
                          readOnly
                          startContent={<FiUser />}
                          value={user.userName}
                          label="Nome"
                          className="max-w-[430px]"
                        />
                        <Input
                          readOnly
                          startContent={<RiUserSettingsLine />}
                          value={user.positionName}
                          label="Função no Sistema"
                          className="max-w-[430px]"
                        />
                        <Input
                          readOnly
                          startContent={<FiMail />}
                          value={user.email}
                          label="E-mail"
                          className="max-w-[430px]"
                        />
                        <Input
                          readOnly
                          startContent={<FiPhone />}
                          value={phoneMasked(user.phoneNumber)}
                          label="Telefone"
                          className="max-w-[430px]"
                        />
                        <Input
                          readOnly
                          startContent={<FaWhatsapp />}
                          value={whatsMasked(user.whatsNumber)}
                          label="Whatsapp"
                          className="max-w-[430px]"
                        />
                        <Input
                          readOnly
                          startContent={<FaTeamspeak />}
                          value={user.teamName ?? "Não atribuido"}
                          label="Equipe"
                          className="max-w-[430px]"
                        />
                        <Input
                          readOnly
                          startContent={<FaTeamspeak />}
                          value={user.subTeamName ?? "Não atribuido"}
                          label="Sub-Equipe"
                          className="max-w-[430px]"
                        />
                        <Tooltip
                          className="flex gap-2 items-center"
                          content="Criado em"
                        >
                          <Button variant="light" startContent={<FiStar />}>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </Button>
                        </Tooltip>
                        <Tooltip
                          className="flex gap-2 items-center"
                          content="Atualizado em"
                        >
                          <Button variant="light" startContent={<LiaToolsSolid />}>
                            {new Date(user.updatedAt).toLocaleDateString()}
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p>Nada encontrado</p>
            )
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
