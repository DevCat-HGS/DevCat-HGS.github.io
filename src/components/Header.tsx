import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import NavLink from './NavLink';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <a
          href="#hero"
          className="text-2xl font-bold text-teal-600 dark:text-teal-400 transition-colors duration-300"
        >
          DevCat-HGS
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink href="#about">About</NavLink>
          <NavLink href="#skills">Skills</NavLink>
          <NavLink href="#projects">Projects</NavLink>
          <NavLink href="#blog">Blog</NavLink>
          <NavLink href="#contact">Contact</NavLink>
          <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center md:hidden">
          <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="ml-4 text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <NavLink
              href="#about"
              onClick={() => setIsMenuOpen(false)}
              isMobile
            >
              About
            </NavLink>
            <NavLink
              href="#skills"
              onClick={() => setIsMenuOpen(false)}
              isMobile
            >
              Skills
            </NavLink>
            <NavLink
              href="#projects"
              onClick={() => setIsMenuOpen(false)}
              isMobile
            >
              Projects
            </NavLink>
            <NavLink
              href="#blog"
              onClick={() => setIsMenuOpen(false)}
              isMobile
            >
              Blog
            </NavLink>
            <NavLink
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              isMobile
            >
              Contact
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;