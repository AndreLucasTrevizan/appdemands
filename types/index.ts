import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface IUserProps {
  id: number;
  userName: string;
  avatar: string;
  slug: string;
}

export interface IFileProps {
  id: number;
  fileName: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  tramiteId: number | null;
  demandId: number;
  userId: number;
}

export interface IDemandProps {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  files: IFileProps[];
  user: IUserProps;
}
