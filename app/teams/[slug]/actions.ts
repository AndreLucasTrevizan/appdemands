'use server';

import { api } from "@/app/_api/api";
import { gettingSigned } from "@/app/_components/actions";

export interface ITeams {
  id: number;
  name: string;
  slug: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export const listSingleTeamInfo = async (slug: string) => {
  try {
    const signedData = await gettingSigned();
    
    if (signedData) {
      const response = await api.get(`/teams/${slug}`, {
        headers: {
          Authorization: `Bearer ${signedData.token}`
        }
      });

      return response.data.team;
    }
  } catch (error) {
    throw error;
  }
}

export const listUsersAvailable = async () => {
  try {
    const signedData = await gettingSigned();
    
    if (signedData) {
      const response = await api.get(`/users/available`, {
        headers: {
          Authorization: `Bearer ${signedData.token}`
        }
      });

      return response.data.users;
    }
  } catch (error) {
    throw error;
  }
}

interface ICreateSubTeamFormProps {
  teamSlug: string,
  name: string,
}

export const createSubTeam = async (data: ICreateSubTeamFormProps) => {
  try {
    const signedData = await gettingSigned();
    
    if (signedData) {
      const response = await api.post(`/subteams`, data, {
        headers: {
          Authorization: `Bearer ${signedData.token}`
        }
      });

      return response.data.subTeam;
    }
  } catch (error) {
    throw error;
  }
}
