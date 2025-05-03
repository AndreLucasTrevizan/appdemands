'use client';

import { addToast, Button, Form, Input, Spinner } from "@heroui/react";
import { useSetCookie } from 'cookies-next';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useActionState, useState } from "react";

import { signInAction } from "../sign_in/actions";
import { api } from "../_api/api";
import ErrorHandler from "../_utils/errorHandler";
import { useAuthContext } from "../_contexts/AuthContext";
import { useRouter } from "next/navigation";

const initialState = {
  error: false,
  message: '',
};

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
      
      const response = await api.post('/users/login', {
        email,
        password
      });

      addToast({
        title: 'Bem-vindo',
        description: `Bem-vindo, ${response.data.userName}`,
        timeout: 3000,
        shouldShowTimeoutProgress: true,
        color: 'primary',
      });

      setCookie("demands_signed_data", JSON.stringify(response.data));

      settingUserSigned(response.data);

      router.push('/');
    } catch (error) {
      const errorHandler = new ErrorHandler(error);

      addToast({
        title: 'Aviso',
        description: errorHandler.error.message,
        timeout: 3000,
        shouldShowTimeoutProgress: true,
        color: 'warning',
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Spinner size="md" />;
  } else {
    return (
      <Form
        className="w-full max-w-xs flex flex-col gap-4"
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
    );
  }
}
