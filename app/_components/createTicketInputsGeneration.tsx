'use client';

import { IServiceCatalog, IUsersReport } from "@/types";
import CriacaoDeUsuarioDeRede from "./tickets/criacaoDeUsuarioDeRede";
import CriacaoDeUsuarioSAP from "./tickets/criacaoDeUsuarioSAP";
import { IUserSignedProps } from "../_contexts/AuthContext";

export default function CreateTicketInputsGeneration({
  catalog,
  user,
  onClose
}: {
  catalog: IServiceCatalog,
  user?: IUserSignedProps,
  onClose: () => void,
}) {

  switch(catalog?.slug) {
    case "criacao-de-usuario-de-rede":
      return <CriacaoDeUsuarioDeRede catalog={catalog} user={user} onClose={onClose} />
    case "criacao-de-usuario-sap":
      return <CriacaoDeUsuarioSAP catalog={catalog} user={user} onClose={onClose} />
    default:
      return <></>;
  }
}
