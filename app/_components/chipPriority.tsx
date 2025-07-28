'use client';

import { Chip } from "@heroui/react";

export default function ChipPriority({name, time}: {name: string, time?: number}) {
  switch(name) {
    case 'Baixa':
      return (
        <Chip color="success">{name} {time ? `- ${time}h` : null}</Chip>
      );
    case 'Media':
      return (
        <Chip color="primary">{name} {time ? `- ${time}h` : null}</Chip>
      );
    case 'Alta':
      return (
        <Chip color="warning">{name} {time ? `- ${time}h` : null}</Chip>
      );
    case 'Emergencia':
      return (
        <Chip color="danger">{name} {time ? `- ${time}h` : null}</Chip>
      );
  }
}
