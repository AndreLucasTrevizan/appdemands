import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface ITicketReportProps {
  id: number,
  ticketTitle: string,
  ticketDescription: string,
  ticketCategory: string,
  ticketPriority: string,
  ticketPriorityTime: number,
  ticketStatus: string,
  createdAt: string,
  updatedAt: string,
  avatar: string,
  userName: string,
  userSlug: string,
  email: string,
  teamName: string,
  teamSlug: string,
  subTeamName: string,
  subTeamSlug: string,
}

export interface ITicketProps {
  id: number;
  title: string;
  description: string;
  team: string;
  priority: string;
  category: string;
  status: string;
  user: IUserProps;
  createdAt: Date,
  updatedAt: Date
}

export interface ITicketPriorityProps {
  id: number,
  name: string,
  slug: string,
  hours: number,
  createdAt: Date,
  updatedAt: Date
}

export interface ITicketStatusProps {
  id: number,
  name: string,
  slug: string,
  createdAt: Date,
  updatedAt: Date
}

export interface ITicketCategoryProps {
  id: number,
  name: string,
  slug: string,
  createdAt: Date,
  updatedAt: Date
}

export interface IUsersReport {
  id: number,
  avatar: string,
  userName: string,
  userSlug: string,
  email: string,
  status: string,
  emailVerified: boolean,
  isOnTeam: boolean,
  isAttendant: boolean,
  positionName: string,
  positionSlug: string,
  teamName: string | null,
  teamSlug: string | null,
  subTeamName: string | null,
  subTeamSlug: string | null,
  createdAt: Date,
  updatedAt: Date
}

export interface IAttendantsReport {
  id: number,
  avatar: string,
  userName: string,
  userSlug: string,
  email: string,
  status: string,
  emailVerified: boolean,
  isOnTeam: boolean,
  isAttendant: boolean,
  positionName: string,
  positionSlug: string,
  teamName: string | null,
  teamSlug: string | null,
  subTeamName: string | null,
  subTeamSlug: string | null,
  createdAt: Date,
  updatedAt: Date
}

export interface ITeamMember {
  id: number,
  avatar: string,
  email: string,
  userName: string,
  userSlug: string,
  teamName: string | null,
  teamSlug: string | null,
  subTeamName: string | null,
  subTeamSlug: string | null,
}

export interface IUserProps {
  id: number,
  userName: string,
  email: string,
  slug: string,
  avatar: string,
  status: string,
  emailVerified: boolean,
  isOnTeam: boolean,
  isAttendant: boolean,
  position: IPositionProps,
  createdAt: Date,
  updatedAt: Date,
}

export interface IAttendantProps {
  id: number,
  userName: string,
  email: string,
  slug: string,
  avatar: string,
  status: string,
  emailVerified: boolean,
  isOnTeam: boolean,
  isAttendant: boolean,
  position: IPositionProps,
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
