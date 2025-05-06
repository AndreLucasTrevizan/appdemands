'use client';

import {
  addToast,
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Spacer,
  Spinner,
  User
} from "@heroui/react";
import DefaultLayout from "../_components/defaultLayout";
import Navbar from "../_components/navbar";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import ErrorHandler from "../_utils/errorHandler";
import { gettingUserProfile } from "./actions";
import { IUserProfileProps } from "@/types";
import { FaCamera } from "react-icons/fa";

export default function SettingsPage() {
  const inputFile = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<IUserProfileProps>();
  const [file, setFile] = useState<File | null>(null);
  const [fileUrlPreview, setFileUrlPreview] = useState<string>('');
  
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

    loadData()
  }, []);

  const changeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setFileUrlPreview(URL.createObjectURL(e.target.files[0]));
    } else {
      setFile(null);
      setFileUrlPreview('');
    }
  }

  return (
    <DefaultLayout>
      <Navbar />
      <Spacer y={8} />
      <Card>
        <CardHeader>
          <h1>Configurações</h1>
        </CardHeader>
        <CardBody>
        {loading ? (
          <Spinner className="py-4" variant="dots" size="md" />
        ) : (
          user ? (
            <div
              className="px-4"
            >
              <div className="flex items-center gap-4">
                <Avatar
                  name={user.userName}
                  showFallback
                  className="w-20 h-20 text-large"
                  src={file ? `${fileUrlPreview}` : `${process.env.baseUrl}/avatar/${user.id}/${user.avatar}`}
                />
                <div className="flex flex-col">
                  <Button
                    startContent={
                      <FaCamera />
                    }
                    type="button"
                    variant="light"
                    onPress={() => {
                      inputFile.current?.click();
                    }}
                  >Trocar avatar</Button>
                  <Input ref={inputFile} id="inputFile" type='file' className="hidden" onChange={(e) => changeFile(e)} />
                </div>
              </div>
              <Spacer y={4} />
              <h1>{user.userName}</h1>
              <Spacer y={4} />
              <p>{user.position.positionName} do sistema</p>
              <Spacer y={4} />
              <small>Criado em {new Date(user.createdAt).toLocaleDateString()}</small>
              <Spacer y={4} />
              <small>Modificado em {new Date(user.updatedAt).toLocaleDateString()}</small>
            </div>
          ) : (
            <p>Nada encontrado</p>
          )
        )}
        </CardBody>
      </Card>
    </DefaultLayout>
  );
}
