'use server';

import { api } from "../_api/api";
import { gettingSigned } from "../_components/actions";
import ErrorHandler from "../_utils/errorHandler";
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
      params: {
        isOnTeam: 'false',
      },
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

export const listMembers = async ({
  isTeam,
  isService,
  endpoint,
}: {
  isTeam: string,
  isService: string,
  endpoint: string,
}) => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      throw "Você não está autenticado";
    }

    if (isTeam == "true") {
      const response = await api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${signedData.token}`
        }
      });

      return response.data.members;
    } else {
      const response = await api.get(endpoint, {
        params: {
          isService,
        },
        headers: {
          Authorization: `Bearer ${signedData.token}`
        }
      });

      return response.data.members;
    }
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}
