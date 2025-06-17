'use server';

import { gettingSigned } from "@/app/_components/actions";
import { ITeams } from "../../actions";
import { api } from "@/app/_api/api";
import ErrorHandler from "@/app/_utils/errorHandler";

interface ICreateSubTeamFormProps {
  teamSlug: string,
  name: string,
}

export interface ISubTeam {
  id: number;
  subTeamName: string;
  slug: string;
  subTeamStatus: string;
  subTeamCategory: ISubTeamCategory;
  createdAt: Date;
  updatedAt: Date;
  teamId: number;
  team: ITeams;
}

export interface ISubTeamMine {
  id: number;
  subTeamName: string;
  slug: string;
  subTeamStatus: string;
  subTeamCategoryId: number;
  createdAt: Date;
  updatedAt: Date;
  teamId: number;
  teamSlug: string;
}

export interface ISubTeamCategory {
  id: number;
  name: string;
  slug: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
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
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
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
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export interface IAddSubTeamClientMembersFormProps {
  slug: string;
  userList: string;
}

export interface IAddSubTeamServiceMembersFormProps {
  slug: string;
  attendantsList: string;
}

export const addingMembersOnClientSubTeam = async (data: IAddSubTeamClientMembersFormProps) => {
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
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export const addingMembersOnServiceSubTeam = async (data: IAddSubTeamServiceMembersFormProps) => {
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
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
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
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export const listUserSubTeams = async () => {
  try {
    const signedData = await gettingSigned();
    
    if (signedData) {
      const response = await api.get(`/mine/subteams`, {
        headers: {
          Authorization: `Bearer ${signedData.token}`
        }
      });

      return response.data.subTeams;
    }
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}
