'use client';

import { addToast, Button, Card, CardBody, CardFooter, CardHeader, Divider, Form, Input, ModalFooter, Spinner } from "@heroui/react";
import { useSetCookie } from 'cookies-next';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useState } from "react";

import ErrorHandler from "../_utils/errorHandler";
import { useAuthContext } from "../_contexts/AuthContext";
import { useRouter } from "next/navigation";
import { handleLogin } from "./actions";

export default function FormSignIn() {
  const router = useRouter();
  const { settingUserSigned } = useAuthContext();
  const setCookie = useSetCookie();
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const toggleVisible = () => setIsVisible(!isVisible);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      
      const data = await handleLogin({ email, password });

      addToast({
        title: 'Bem-vindo',
        description: `Bem-vindo, ${data.userName}`,
        timeout: 3000,
        shouldShowTimeoutProgress: true,
        color: 'primary',
      });

      setCookie("demands_signed_data", JSON.stringify(data));

      settingUserSigned(data);

      window.location.reload();
    } catch (error) {
      const errorHandler = new ErrorHandler(error);

      addToast({
        title: 'Aviso',
        description: errorHandler.message,
        timeout: 3000,
        shouldShowTimeoutProgress: true,
        color: 'warning',
      });

      setLoading(false);
    }
  }

  if (loading) {
    return <Spinner size="md" />;
  } else {
    return (
      <Card
        className="w-96"
      >
        <CardHeader>
          <div className="w-full flex flex-col items-center gap-2">
            <h1 className="font-bold">LOGIN</h1>
            <h1>Portal de Chamados da T.I</h1>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <Form
            className="w-full flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();

              handleSignIn();
            }}
          >
            <Input
              isRequired
              errorMessage="Entre com um e-mail valido"
              label="E-mail"
              labelPlacement="outside"
              name="email"
              placeholder="Entre com seu e-mail"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />

            <Input
              isRequired
              errorMessage="Entre com uma senha valida"
              label="Senha"
              labelPlacement="outside"
              name="password"
              placeholder="Entre com sua senha"
              type={isVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endContent={
                <button
                  type="button"
                  onClick={() => toggleVisible()}
                >
                  {isVisible ? <FaRegEyeSlash /> : <FaRegEye /> }
                </button>
              }
            />
            <div className="flex gap-2">
              <Button color="primary" type="submit">
                Entrar
              </Button>
            </div>
          </Form>
        </CardBody>
        <Divider />
        <CardFooter>
          <div className="w-full flex flex-col items-center justify-center gap-4">
            <span
              className="text-[#006FEE] hover:cursor-pointer"
            >Esqueci minha senha</span>
          </div>
        </CardFooter>
      </Card>
    );
  }
}
