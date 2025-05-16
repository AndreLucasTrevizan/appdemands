'use server';

import { IUserProps } from "@/types";
import { api } from "../_api/api";
import { gettingSigned } from "../_components/actions";

export interface ITeams {
  id: number;
  name: string;
  slug: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  subTeams: ISubTeam[];
}

export interface ISubTeam {
  id: number;
  name: string;
  slug: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  user: IUserProps[]
}

export interface IUserTeamsAndSubTeams {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  teamId: number;
  userId: number;
  subTeamId: number;
  subTeams: ISubTeam[]
}

export const listTeams = async () => {
  try {
    const signedData = await gettingSigned();
    
    if (signedData) {
      const response = await api.get('/teams', {
        headers: {
          Authorization: `Bearer ${signedData.token}`
        }
      });

      return response.data.teams;
    }
  } catch (error) {
    throw error;
  }
}
