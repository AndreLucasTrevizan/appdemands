'use server';

import { api } from "../_api/api";
import { gettingSigned } from "../_components/actions";
import ErrorHandler from "../_utils/errorHandler";
import { ISubTeam } from "./[teamSlug]/subteams/actions";

export interface ITeams {
  id: number;
  teamName: string;
  slug: string;
  teamStatus: string;
  createdAt: Date;
  updatedAt: Date;
  subTeams: ISubTeam[];
}

export const listSingleTeamInfo = async (slug: string) => {
  try {
    const signedData = await gettingSigned();
    
    const response = await api.get(`/teams/${slug}`, {
      headers: {
        Authorization: `Bearer ${signedData.token}`
      }
    });

    return response.data.team;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
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
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
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
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export const listUsersAvailable = async () => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      throw "Você não está autenticado";
    }

    const response = await api.get('/users', {
      headers: {
        Authorization: `Bearer ${signedData.token}`
      }
    });

    return response.data.users;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export const listTeamMembers = async (slug: string) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      throw "Você não está autenticado";
    }

    const response = await api.get(`/teams/${slug}/members`, {
      headers: {
        Authorization: `Bearer ${signedData.token}`
      }
    });

    return response.data.members;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export const listSubTeamMembers = async (slug: string) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      throw "Você não está autenticado";
    }

    const response = await api.get(`/subteams/${slug}/members`, {
      headers: {
        Authorization: `Bearer ${signedData.token}`
      }
    });

    return response.data.members;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export const createTeam = async (name: string) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      throw "Você não está autenticado";
    }

    const response = await api.post('/teams', { name }, {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.team;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}
