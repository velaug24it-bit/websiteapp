import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-3xl p-4 border border-jaggery-100 flex flex-col justify-between animate-pulse">
    <div className="rounded-2xl bg-cream-300 aspect-square w-full"></div>
    <div className="pt-4 space-y-2.5">
      <div className="h-4 bg-cream-300 rounded w-1/3"></div>
      <div className="h-5 bg-cream-300 rounded w-3/4"></div>
      <div className="h-3 bg-cream-300 rounded w-full"></div>
      <div className="h-8 bg-cream-300 rounded-xl mt-4"></div>
    </div>
  </div>
);

export const TableRowSkeleton = ({ cols = 6 }) => (
  <tr className="animate-pulse border-b border-jaggery-100">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="py-4 px-4">
        <div className="h-4 bg-cream-300 rounded w-full"></div>
      </td>
    ))}
  </tr>
);
