export type Theme = 'light' | 'dark';

export const getInitialTheme = (): Theme => {
  // Check localStorage
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  if (savedTheme) return savedTheme;
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  // Default to light
  return 'light';
};

export const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Save to localStorage
  localStorage.setItem('theme', theme);
};

export const toggleTheme = (currentTheme: Theme): Theme => {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
  return newTheme;
};