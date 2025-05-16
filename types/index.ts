import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface IUserProps {
  id: number,
  userName: string,
  email: string,
  slug: string,
  avatar: string,
  status: string,
  emailVerified: boolean,
  createdAt: Date,
  updatedAt: Date,
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

export interface IPositionProps {
  id: number;
  positionName: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProfileProps {
  id: number;
  userName: string;
  email: string;
  avatar: string;
  slug: string;
  position: IPositionProps;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAvatarResponse {
  avatar: string;
}
