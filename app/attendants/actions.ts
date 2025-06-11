'use server';

import { redirect } from "next/navigation";
import { gettingSigned } from "../_components/actions";
import { api } from "../_api/api";
import ErrorHandler from "../_utils/errorHandler";

export const listAvailableAttendants = async () => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const response = await api.get('/attendants', {
      params: {
        isAvailable: true
      },
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.attendants;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

export const listAttendants = async () => {
  try {
    const signedData = await gettingSigned();

    if (!signedData) {
      redirect('/sign_in');
    }

    const response = await api.get('/attendants', {
      headers: {
        Authorization: `Bearer ${signedData.token}`,
      }
    });

    return response.data.attendants;
  } catch (error) {
    const errorHandler = new ErrorHandler(error);

    throw errorHandler.message;
  }
}

{
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "type": "AdaptiveCard",
  "version": "1.0",
  "body": [
    {
      "type": "TextBlock",
      "text": "Atualização SEFAZ",
      "id": "Title",
      "spacing": "Medium",
      "horizontalAlignment": "Center",
      "size": "ExtraLarge",
      "weight": "Bolder",
      "color": "Accent"
    },
    {
      "type": "TextBlock",
      "text": "Componente: @{triggerBody()?['maintenance']?['name']}",
      "id": "acInstructions",
      "wrap": true
    },
    {
      "type": "TextBlock",
      "text": "Impacto: @{triggerBody()?['maintenance']?['impact']}",
      "id": "acInstructions1",
      "wrap": true
    },
    {
      "type": "TextBlock",
      "text": "Status: Não iniciada",
      "id": "acInstructions2",
      "wrap": true
    },
    {
      "type": "TextBlock",
      "text": "Inicio: @{formatDateTime(triggerBody()?['maintenance']?['created_at'], 'dd/MM/yyyy HH:mm:ss')
}",
      "id": "acInstructions3",
      "wrap": true
    },
    {
      "type": "TextBlock",
      "text": "Duração da manutenção: @{triggerBody()?['maintenance']?['duration']}",
      "id": "acInstructions4",
      "wrap": true
    },
  ],
  "actions": []
}