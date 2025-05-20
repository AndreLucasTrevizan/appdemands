'use server';

import { api } from "../_api/api";
import { gettingSigned } from "../_components/actions";
import { ITeams } from "../teams/actions";

interface ICreateSubTeamFormProps {
  teamSlug: string,
  name: string,
}

export interface ISubTeam {
  id: number;
  name: string;
  slug: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  teamId: number;
  team: ITeams;
}

export const gettingAllMembersFromSubTeam = async (slug: string) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      throw "Você não está autenticado";
    }

    const response = await api.get(`/subteams/${slug}/members`, {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.members;
  } catch (error) {
    throw error;
  }
}

export const createSubTeam = async (data: ICreateSubTeamFormProps) => {
  try {
    const signedData = await gettingSigned();
    
    if (!signedData) {
      throw "Você não está autenticado";
    }

    const response = await api.post(`/subteams`, data, {
      headers: {
        Authorization: `Bearer ${signedData.token}`
      }
    });

    return response.data.subTeam;
  } catch (error) {
    throw error;
  }
}

export interface IAddSubTeamMembersFormProps {
  slug: string;
  userList: string;
}

export const addingMembersOnSubTeam = async (data: IAddSubTeamMembersFormProps) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      throw "Você não está autenticado";
    }

    const response = await api.post("/subteams/members", data, {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export const listSingleSubTeamInfo = async (slug: string) => {
  try {
    const signedData = await gettingSigned();
    
    if (signedData) {
      const response = await api.get(`/subteams/${slug}`, {
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
