import React from 'react';

type FleetCarIconProps = React.SVGProps<SVGSVGElement>;

export const FleetCarIcon: React.FC<FleetCarIconProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 64 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path
      fill="currentColor"
      d="M15.2 9.7C16.4 6.3 19.5 4 23.1 4h17.8c3.6 0 6.7 2.3 7.9 5.7l3.4 9.6 5.7 2.2c1.3.5 2.1 1.7 2.1 3.1V40c0 2.2-1.8 4-4 4h-3.5a4 4 0 0 1-4-4v-1h-33v1a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V24.6c0-1.4.8-2.6 2.1-3.1l5.7-2.2 3.4-9.6Zm4.1 1.6-2.9 8.1h31.2l-2.9-8.1A4 4 0 0 0 40.9 8H23.1a4 4 0 0 0-3.8 3.3ZM11.5 25a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm41 0a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM21 31.5c0 1.4 1.1 2.5 2.5 2.5h17a2.5 2.5 0 0 0 0-5h-17a2.5 2.5 0 0 0-2.5 2.5Z"
    />
    <path fill="currentColor" d="M8.2 17.3 3 15.6V13h8.1l-2.9 4.3Zm47.6 0L61 15.6V13h-8.1l2.9 4.3Z" />
  </svg>
);
