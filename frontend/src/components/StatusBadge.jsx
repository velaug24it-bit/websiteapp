import React from 'react';
import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from '../utils/constants';

export const OrderStatusBadge = ({ status }) => {
  const style = ORDER_STATUS_COLORS[status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${style.bg} ${style.text} ${style.border} shadow-2xs`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {status}
    </span>
  );
};

export const PaymentStatusBadge = ({ status }) => {
  const style = PAYMENT_STATUS_COLORS[status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${style.bg} ${style.text} ${style.border}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {status}
    </span>
  );
};
