'use client';

import { addToast, Button, Card, CardBody, CardFooter, CardHeader, Divider, InputOtp, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { confirmingCode } from "../confirm-code/actions";
import ErrorHandler from "../_utils/errorHandler";
import { useGetCookie } from "cookies-next";

export default function FormConfirmCode() {
  const router = useRouter();
  const getCookie = useGetCookie();
  const [code, setCode] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState<boolean>(false);
  
  async function handleConfirmCode() {
    try {
      setLoading(true);

     await confirmingCode(code.toUpperCase());
      
      router.push(`/change-password`);
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

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft - 1 > 0) {
        setTimeLeft(timeLeft - 1);
      } else {
        setTimeLeft(60);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <Card className="w-96">
      <CardHeader>
        <h1>Confirmação do Código</h1>
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
            <small
              className="text-center"
            >Insira o código de confirmação que foi enviado no e-mail informado {getCookie('email')}</small>
            <InputOtp
              length={6}
              value={code.toUpperCase()}
              onValueChange={setCode}
              allowedKeys='^[A-Za-z0-9]*$'
            />
            <small>Podendo ser reenviado em {timeLeft} segundos</small>
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
