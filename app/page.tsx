'use client';

import { Button, Input, Spacer } from "@heroui/react";
import Navbar from "./_components/navbar";
import { useAuthContext } from "./_contexts/AuthContext";
import { SearchIcon } from "@/components/icons";
import { FaPlus } from "react-icons/fa";
import DemandsTable from "./_components/demandsTable";

export default function Home() {
  const { userSigned } = useAuthContext();
  
  return (
    <div>
      <Navbar />
      <Spacer y={8} />
      <section className="container m-auto">
        <h1>Demandas</h1>
        <Spacer y={8} />
        <DemandsTable topContent={<TopContent />} />
      </section>
    </div>
  );
}

const TopContent = () => {
  return (
    <div
      className="flex justify-between"
    >
      <Input
        isClearable
        className="w-full sm:max-w-[44%]"
        placeholder="Procurar demanda..."
        startContent={<SearchIcon />}
        value={''}
        onClear={() => {}}
        onValueChange={() => {}}
      />
      <Button color="primary" endContent={<FaPlus />}>
        Criar Demanda
      </Button>
    </div>
  );
}
