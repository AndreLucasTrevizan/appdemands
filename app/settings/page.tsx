'use client';

import {
  addToast,
  Avatar,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Form,
  Input,
  Spacer,
  Spinner,
  User
} from "@heroui/react";
import DefaultLayout from "../_components/defaultLayout";
import Navbar from "../_components/navbar";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import ErrorHandler from "../_utils/errorHandler";
import { changingAvatar, gettingUserProfile } from "./actions";
import { IUserProfileProps } from "@/types";
import { FaCamera, FaSave } from "react-icons/fa";
import { useAuthContext } from "../_contexts/AuthContext";
import Nav from "../_components/nav";

export default function SettingsPage() {
  const inputFile = useRef<HTMLInputElement>(null);
  const {
    settingUserAvatar
  } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAvatar, setLoadingAvatar] = useState<boolean>(false);
  const [user, setUser] = useState<IUserProfileProps>();
  const [file, setFile] = useState<File | null>(null);
  const [fileUrlPreview, setFileUrlPreview] = useState<string>('');
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
          description: `${errorHandler.error.message}`,
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

        settingUserAvatar(data);
        setConfirmAvatar(!confirmAvatar);
        addToast({
          title: 'Sucesso',
          description: `Sua foto de perfil foi atualizada`,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      } catch (error) {
        const errorHandler = new ErrorHandler(error);

        addToast({
          title: 'Aviso',
          description: `${errorHandler.error.message}`,
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
          <BreadcrumbItem>Configurações</BreadcrumbItem>
        </Breadcrumbs>
        <Divider />
        <Card>
          <CardBody>
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
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center gap-4">
                        <Avatar
                          name={user.userName}
                          showFallback
                          className="w-20 h-20 text-large"
                          src={file ? `${fileUrlPreview}` : `${process.env.baseUrl}/avatar/${user.id}/${user.avatar}`}
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
                      <Divider orientation="vertical" />
                      <div className="p-2">
                        <h1>{user.userName}</h1>
                        <Spacer y={4} />
                        <p>{user.position.positionName} do sistema</p>
                        <Spacer y={4} />
                        <small>Criado em {new Date(user.createdAt).toLocaleDateString()}</small>
                        <Spacer y={4} />
                        <small>Modificado em {new Date(user.updatedAt).toLocaleDateString()}</small>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p>Nada encontrado</p>
            )
          )}
          </CardBody>
        </Card>
      </div>
    </DefaultLayout>
  );
}
