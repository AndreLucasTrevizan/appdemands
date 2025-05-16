import { ReactNode } from "react";

export default function DefaultLayout({
  children
}: {
  children: ReactNode
}) {
  return (
    <section className="flex flex-col flex-1 gap-4 p-4">
      {children}
    </section>
  );
}