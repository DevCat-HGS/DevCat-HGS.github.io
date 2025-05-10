import React from 'react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  isMobile?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick, isMobile }) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`font-medium transition-colors duration-300 hover:text-teal-600 dark:hover:text-teal-400
        ${isMobile 
          ? 'text-slate-700 dark:text-slate-200 block py-2' 
          : 'text-slate-700 dark:text-slate-200'
        }`}
    >
      {children}
    </a>
  );
};

export default NavLink;