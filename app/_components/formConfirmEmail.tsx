'use client';

import { addToast, Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Spinner } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiMail } from "react-icons/fi";
import ErrorHandler from "../_utils/errorHandler";
import { sendingCode } from "../confirm-email/actions";

export default function FormConfirmEmail() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSendCode() {
    try {
      setLoading(true);

      await sendingCode(email);

      router.push(`/confirm-code?email=${email}`);
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
        <h1>Confirme seu e-mail</h1>
      </CardHeader>
      <Divider />
      <CardBody>
        {loading ? (
          <div
            className="flex py-10 flex-col gap-4 items-center justify-center"
          >
            <Spinner size="md" />
          </div>
        ) : (
          <div
            className="flex flex-col gap-4 items-center"
          >
            <small className="text-center">Enviaremos um código de confirmação no e-mail informado</small>
            <Input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="E-mail"
              labelPlacement="outside"
              startContent={<FiMail />}
            />
          </div>
        )}
      </CardBody>
      <CardFooter>
        <div className="w-full flex gap-4 justify-end">
          <Button
            color="danger"
            onPress={() => router.back()}
          >Cancelar</Button>
          <Button
            color="primary"
            onPress={() => handleSendCode()}
          >Enviar</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
