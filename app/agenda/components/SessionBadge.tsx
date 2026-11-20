import React from 'react';
import { HallSession } from '../AgendaData';
import { SESSION_TYPE_STYLES, SESSION_TYPE_LABEL } from './agendaConstants';

type Props = {
  type: HallSession['type'];
};

export default function SessionBadge({ type }: Readonly<Props>) {
  const style = SESSION_TYPE_STYLES[type] ?? 'bg-gray-100 text-gray-700';
  const label = SESSION_TYPE_LABEL[type] ?? type;

  return (
    <span
      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-2xl mb-1 ${style}`}
    >
      {label}
    </span>
  );
}
