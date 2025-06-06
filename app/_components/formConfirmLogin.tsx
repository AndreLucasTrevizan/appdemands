'use client';

import { addToast, Button, Card, CardBody, CardFooter, CardHeader, Divider, InputOtp, Spinner } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { confirmingCode } from "../confirm-code/actions";
import ErrorHandler from "../_utils/errorHandler";

export default function FormConfirmLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  async function handleConfirmCode() {
    try {
      setLoading(true);

      const account = await confirmingCode(code.toUpperCase());
      
      router.push(`/change-password?email=${account.email}`);
    } catch (error) {
      setLoading(false);

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

  return (
    <Card className="w-96">
      <CardHeader>
        <h1>Confirmação do Login</h1>
      </CardHeader>
      <Divider />
      <CardBody>
        {loading ? (
          <div
            className="flex py-10 flex-col gap-4 items-center"
          >
            <Spinner size="md" />
          </div>
        ) : (
          <div
            className="flex flex-col gap-4 items-center"
          >
            <small className="text-center">Notamos que é o seu primeiro login em nosso sistema</small>
            <small
              className="text-center"
            >Insira o código de confirmação que foi enviado no seu e-mail, essa informação é fundamental para nossa futura comunicação com você. Confirmando seu e-mail, nós saberemos que você será notificado a cada alteração que acontecer em seu chamado.</small>
            <InputOtp
              length={6}
              value={code.toUpperCase()}
              onValueChange={setCode}
              allowedKeys='^[A-Za-z0-9]*$'
            />
          </div>
        )}
      </CardBody>
      <Divider />
      <CardFooter>
        <div className="w-full flex gap-4 justify-end">
          <Button
            color="danger"
            onPress={() => router.back()}
          >Cancelar</Button>
          <Button
            color="primary"
            onPress={() => handleConfirmCode()}
          >Confirmar Código</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
