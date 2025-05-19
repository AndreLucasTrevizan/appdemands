'use server';

import { api } from "../_api/api";
import { gettingSigned } from "../_components/actions";
import { ISubTeam } from "../subteams/actions";

export interface ITeams {
  id: number;
  name: string;
  slug: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  subTeams: ISubTeam[];
}

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

export const listPersonalTeams = async () => {
  try {
    const signedData = await gettingSigned();
    
    if (!signedData) {
      throw "Você não está autenticado";
    }

    const response = await api.get('/mine/teams', {
      headers: {
        Authorization: `Bearer ${signedData.token}`
      }
    });

    return response.data.teams;
  } catch (error) {
    throw error;
  }
}

export const listUsersAvailable = async () => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      throw "Você não está autenticado";
    }

    const response = await api.get('/users', {
      params: {
        isOnTeam: 'false',
      },
      headers: {
        Authorization: `Bearer ${signedData.token}`
      }
    });

    return response.data.users;
  } catch (error) {
    throw error;
  }
}
