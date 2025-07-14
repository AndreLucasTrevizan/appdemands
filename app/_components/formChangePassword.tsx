'use client';

import {
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Form,
  Input,
  Link,
  Spinner
} from "@heroui/react";
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useState } from "react";
import ErrorHandler from "../_utils/errorHandler";
import { FiLock, FiMail } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { changingPassword } from "../change-password/actions";
import { deleteCookie, useGetCookie } from "cookies-next";

export default function FormChangePassword() {
  const router = useRouter();
  const getCookie = useGetCookie();
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const toggleVisiblePassword = () => setIsVisiblePassword(!isVisiblePassword);
  const toggleVisibleConfirmPassword = () => setIsVisibleConfirmPassword(!isVisibleConfirmPassword);

  const handleChangePassword = async () => {
    setErrors([]);

    if (password.length < 8) {
      setErrors(prevArray => [...prevArray, "A senha precisa ter pelo menos 8 caracteres"]);
    }
  
    if ((password.match(/[A-Z]/g) || []).length < 1) {
      setErrors(prevArray => [...prevArray, "A senha precisa ter pelo menos uma letra maiúscula"]);
    }

    if ((password.match(/[^a-z0-9]/gi) || []).length < 1) {
      setErrors(prevArray => [...prevArray, "A senha precisa ter pelo menos um caractere especial"]);
    }

    if (errors.length > 0) {
      return;
    }

    try {
      setLoading(true);

      if (password != confirmPassword) {
        setLoading(false);
        addToast({
          color: 'warning',
          title: 'Aviso',
          description: 'As senhas não são identicas',
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      } else {
        await changingPassword({
          email: getCookie('email')!,
          password,
          confirmPassword,
        });

        addToast({
          color: 'success',
          title: 'Sucesso',
          description: 'Senha alterada com sucesso',
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });

        deleteCookie('email');

        router.push('/sign_in');
      }
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
            <h1 className="font-bold">Reset de Senha</h1>
            <h1>Portal de Chamados da T.I</h1>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex flex-col gap-4">
            <Input
              isRequired
              errorMessage={() => (
                <ul>
                  {errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              )}
              autoComplete="off"
              isInvalid={errors.length > 0}
              label="Nova Senha"
              labelPlacement="outside"
              name="password"
              placeholder="Entre com a senha..."
              type={isVisiblePassword ? "text" : "password"}
              onValueChange={setPassword}
              value={password}
              startContent={<FiLock />}
              endContent={
                <button
                  type="button"
                  onClick={() => toggleVisiblePassword()}
                >
                  {isVisiblePassword ? <FaRegEyeSlash /> : <FaRegEye /> }
                </button>
              }
            />

            <Input
              isRequired
              errorMessage="Repita a senha"
              label="Confirme a Senha"
              labelPlacement="outside"
              name="password"
              placeholder="Confirmação de senha"
              autoComplete="off"
              type={isVisibleConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              startContent={<FiLock />}
              endContent={
                <button
                  type="button"
                  onClick={() => toggleVisibleConfirmPassword()}
                >
                  {isVisibleConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye /> }
                </button>
              }
            />
          </div>
        </CardBody>
        <Divider />
        <CardFooter>
          <div className="w-full flex gap-4 justify-end">
            <Button
              color="danger"
              onPress={() => router.push('/sign_in')}
            >Cancelar</Button>
            <Button
              color="primary"
              onPress={() => handleChangePassword()}
            >Resetar Senha</Button>
          </div>
        </CardFooter>
      </Card>
    );
  }
}
