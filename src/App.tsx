import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Blog from './sections/Blog';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import { Theme, getInitialTheme, applyTheme, toggleTheme as toggleThemeUtil } from './utils/theming';

function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  useEffect(() => {
    const theme = getInitialTheme();
    setIsDarkMode(theme === 'dark');
    applyTheme(theme);
  }, []);
  
  const toggleTheme = () => {
    const currentTheme: Theme = isDarkMode ? 'dark' : 'light';
    const newTheme = toggleThemeUtil(currentTheme);
    setIsDarkMode(newTheme === 'dark');
  };

  return (
    <>
      <LoadingScreen />
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 transition-colors">
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Blog />
        <Contact />
        <Footer />
      </div>
    </>
  );
}

export default App;