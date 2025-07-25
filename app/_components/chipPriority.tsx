'use client';

import { Chip } from "@heroui/react";

export default function ChipPriority({name, time}: {name: string, time: number}) {
  switch(name) {
    case 'Baixa':
      return (
        <Chip color="success">{name} - {time}h</Chip>
      );
    case 'Media':
      return (
        <Chip color="primary">{name} - {time}h</Chip>
      );
    case 'Alta':
      return (
        <Chip color="warning">{name} - {time}h</Chip>
      );
    case 'Emergencia':
      return (
        <Chip color="danger">{name} - {time}h</Chip>
      );
  }
}
