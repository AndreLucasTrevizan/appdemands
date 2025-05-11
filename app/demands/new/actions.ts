'use server';

import { api } from "@/app/_api/api";
import { gettingSigned } from "@/app/_components/actions";

export const creatingDemand = async ({
  title,
  description
}: {
  title: string,
  description: string
}) => {
  try {
    const signedData = await gettingSigned();

    if (signedData) {
      const data = {
        title,
        description
      };
    
      const response = await api.post('/demands', data, {
        headers: {
          Authorization: `Bearer ${signedData.token}`
        }
      });

      return response.data.demand.id;
    }
  } catch (error) {
    throw error;
  }
}

export const addingAttachments = async ({
  demandId,
  files
}: {
  demandId: number,
  files: File[]
}) => {
  try {
    const signedData = await gettingSigned();
    const formData = new FormData();

    if (signedData) {
      files.forEach((file) => {
        formData.append('files', file);
      });

      await api.post('/files', formData, {
        params: {
          demandId,
        },
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${signedData.token}`,
        }
      });

      return 'Arquivos anexados';
    }
  } catch (error) {
    throw error;
  }
}
