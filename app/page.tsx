'use client';

import { Spacer } from "@heroui/react";
import Navbar from "./_components/navbar";
import DemandsTable from "./_components/demandsTable";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Spacer y={8} />
      <section className="container m-auto">
        <h1>Demandas</h1>
        <Spacer y={8} />
        <DemandsTable />
      </section>
    </div>
  );
}
