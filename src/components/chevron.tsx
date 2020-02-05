import React from 'react';

type Direction = 'up' | 'down' | 'left' | 'right';

interface ChevronProps {
  direction: Direction;
}

const rotate = (direction: Direction) => {
  switch (direction) {
    case 'left':
      return '90';
    case 'up':
      return '180';
    case 'right':
      return '270';
    case 'down':
      return 0;
    default:
      throw new Error('`rotate` must receive direction parameter');
  }
};

export const Chevron = ({ direction }: ChevronProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 16 16"
    transform={`rotate(${rotate(direction)})`}
  >
    <path fill="#C1C3CC" d="M4.7 7.367l3.3 3.3 3.3-3.3-.943-.943L8 8.78 5.643 6.424l-.943.943z"></path>
  </svg>
);
