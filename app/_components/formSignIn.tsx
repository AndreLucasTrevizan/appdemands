'use client';

import { addToast, Button, Form, Input, Spinner } from "@heroui/react";
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useActionState, useState } from "react";

import { signInAction } from "../sign_in/actions";

const initialState = {
  error: false,
  message: '',
};

export default function FormSignIn() {
  const [isVisible, setIsVisible] = useState(false);
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  const toggleVisible = () => setIsVisible(!isVisible);

  if (pending) {
    return <Spinner size="md" />;
  } else {
    return (
      <Form action={formAction} className="w-full max-w-xs flex flex-col gap-4">
        <Input
          isRequired
          errorMessage="Entre com um e-mail valido"
          label="E-mail"
          labelPlacement="outside"
          name="email"
          placeholder="Entre com seu e-mail"
          type="email"
        />

        <Input
          isRequired
          errorMessage="Entre com uma senha valida"
          label="Senha"
          labelPlacement="outside"
          name="password"
          placeholder="Entre com sua senha"
          type={isVisible ? "text" : "password"}
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
