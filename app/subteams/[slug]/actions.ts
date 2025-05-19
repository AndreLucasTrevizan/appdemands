'use server';

import { IUserProps } from "@/types";

export interface ISubTeam {
  id: number;
  name: string;
  slug: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  teamId: number;
  user: IUserProps[];
}
