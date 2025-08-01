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
  queueName: string
  queueSlug: string
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

export interface IQueueAttendant {
  id: number
  userName: string
  slug: string
  email: string
  avatar: string
  queueId: number
  queueSlug: string
}

export interface ITicketWorklogProps {
  id: number
  worklogDesc: string
  createdAt: string
  updatedAt: string
  userName: string | undefined
  userSlug: string | undefined
  userAvatar: string | undefined
  attendantName: string | undefined
  attendantSlug: string | undefined
  attendantAvatar: string | undefined
}

export interface ITicketReportProps {
  id: number
  ticketTitle: string
  ticketDescription: string
  timeWithDispatcher: number
  timeInAttendance: number
  timeWithUser: number
  serviceCatalogId: number
  ticketCategory: string
  ticketPriority: string
  queueId: number
  queueName: string
  queueSlug: string
  ticketSLA: number
  ticketStatus: string
  createdAt: string
  updatedAt: string
  avatar: string
  userName: string
  userSlug: string
  userPhoneNumber: string
  userWhatsNumber: string
  attendantAvatar: string
  attendantName: string
  attendantSlug: string
  attendantEmail: string
  attendantPhoneNumber: string
  attendantWhatsNumber: string
  email: string
  teamName: string
  teamSlug: string
  subTeamName: string
  subTeamSlug: string
}

export interface ITicketProps {
  id: number
  ticketTitle: string
  ticketDescription: string
  timeWithDispatcher: number
  timeInAttendance: number
  timeWithUser: number
  serviceCatalogId: number
  ticketCategory: string
  ticketPriority: string
  queueId: number
  queueName: string
  queueSlug: string
  ticketSLA: number
  ticketStatus: string
  createdAt: string
  updatedAt: string
  avatar: string
  userName: string
  userSlug: string
  userPhoneNumber: string
  userWhatsNumber: string
  attendantAvatar: string
  attendantName: string
  attendantSlug: string
  attendantEmail: string
  attendantPhoneNumber: string
  attendantWhatsNumber: string
  email: string
  teamName: string
  teamSlug: string
  subTeamName: string
  subTeamSlug: string
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
  userStatus: string,
  phoneNumber: string | undefined,
  whatsNumber: string | undefined,
  emailVerified: number ,
  isOnTeam: number,
  authProfile: string,
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
  userStatus: string,
  phoneNumber: string | undefined,
  whatsNumber: string | undefined,
  emailVerified: number ,
  isOnTeam: number,
  isAttendant: number,
  authProfile: string,
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

export interface IUserProfileProps {
  id: number;
  userName: string;
  email: string;
  avatar: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAvatarResponse {
  avatar: string;
}

export interface IUserProfileAuthorizations {
  canOpenTicket: boolean
  canCreateQueue: boolean
  canEditQueue: boolean
  canBlockQueue: boolean
  canRemoveQueue: boolean
  canSeeTeamTickets: boolean
  canSeeTeam: boolean
  canCreateTeam: boolean
  canEditTeam: boolean
  canRemoveTeam: boolean
  canCreateSubTeam: boolean
  canSeeSubTeam: boolean
  canEditSubTeam: boolean
  canRemoveSubTeam: boolean
  canAddSubTeamMember: boolean
  canRemoveSubTeamMember: boolean
  canCreateServiceCatalog: boolean
  canSeeServiceCatalog: boolean
  canEditServiceCatalog: boolean
  canRemoveServiceCatalog: boolean
  canSeeSLA: boolean
  canCreateSLA: boolean
  canEditSLA: boolean
  canRemoveSLA: boolean
  canSeePriority: boolean
  canCreatePriority: boolean
  canEditPriority: boolean
  canRemovePriority: boolean
  canSeeStatus: boolean
  canCreateStatus: boolean
  canEditStatus: boolean
  canRemoveStatus: boolean
  canSeeCategory: boolean
  canCreateCategory: boolean
  canEditCategory: boolean
  canRemoveCategory: boolean
  canEditUser: boolean
  canBlockUser: boolean
  canCreateUser: boolean
  canSeeUser: boolean
  canCreateAuthProfile: boolean
  canSeeAuthProfile: boolean
  canRemoveAuthProfile: boolean
  canEditAuthProfile: boolean
}

export interface IAuthProfiles {
  id: number
  label: string
  slug: string
  createdAt: Date;
  updatedAt: Date;
}
