import { ReactNode } from "react";

export default function DefaultLayout({
  children
}: {
  children: ReactNode
}) {
  return (
    <section className="m-auto container h-screen">
      {children}
    </section>
  );
}