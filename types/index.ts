import { ISubTeam } from "@/app/teams/[teamSlug]/subteams/actions";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface IServiceCatalogFieldData {
  label: string;
}

export interface IServiceCatalogField {
  id: number;
  label: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateService {
  service: string
  serviceDescription: string
  fields: string
  ticketCategoryId: number
  ticketPriorityId: number
}

export interface IServiceCatalogProps {
  desc: string,
  key: string
}

export interface IServiceCatalog {
  id: number
  service: string
  fields: string
  serviceDescription: string,
  slug: string
  isActive: boolean
  ticketCategoryId: number
  categoryName: string
  categoryDesc: string
  categorySlug: string
  ticketPriorityId: number
  priorityName: string
  prioritySlug: string
  slaTime: number
  hoursToFirstResponse: number
  createdAt: Date
  updatedAt: Date
}

export interface IQueuesProps {
  id: number,
  queueName: string,
  queueStatus: string,
  slug: string,
  createdAt: Date,
  updatedAt: Date,
}

export interface ITicketReportProps {
  id: number,
  ticketTitle: string,
  ticketDescription: string,
  ticketCategory: string,
  ticketPriority: string,
  ticketSLA: number,
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

export interface ITicketSLASProps {
  id: number;
  slaTime: number;
  slaInSeconds: number;
  priorityName: string;
  ticketCategoryId: number;
  hoursToFirstResponse: number;
  hoursToFirstResponseInSeconds: number;
  ticketPriorityId: number;
  ticketPriority: ITicketPriorityProps;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITicketPriorityProps {
  id: number,
  priorityName: string,
  prioritySlug: string,
  ticketCategoryId: number;
  categoryName: string;
  createdAt: Date,
  updatedAt: Date
}

export interface ITicketProcessProps {
  id: number;
  processName: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITicketStatusProps {
  id: number,
  statusName: string,
  slug: string,
  createdAt: Date,
  updatedAt: Date
}

export interface ITicketCategoryProps {
  id: number,
  categoryName: string,
  categoryDesc: string,
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
  phoneNumber: string | undefined,
  whatsNumber: string | undefined,
  emailVerified: number ,
  isOnTeam: number,
  isAttendant: number,
  positionName: string,
  positionSlug: string,
  teamName: string | undefined,
  teamSlug: string | undefined,
  subTeamName: string | undefined,
  subTeamSlug: string | undefined,
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
  phoneNumber: string | undefined,
  whatsNumber: string | undefined,
  emailVerified: number ,
  isOnTeam: number,
  isAttendant: number,
  positionName: string,
  positionSlug: string,
  teamName: string | undefined,
  teamSlug: string | undefined,
  subTeamName: string | undefined,
  subTeamSlug: string | undefined,
  createdAt: Date,
  updatedAt: Date
}

export interface IQueueMember {
  id: number,
  userName: string,
  slug: string,
  email: string,
  avatar: string,
}

export interface ITeamMember {
  id: number,
  avatar: string,
  email: string,
  userName: string,
  userSlug: string,
  teamName: string | null,
  teamSlug: string | null,
  subTeams: ISubTeam[]
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
