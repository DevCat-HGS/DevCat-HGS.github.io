import React from 'react';
import { Github as GitHub, Linkedin, Mail, ArrowDown } from 'lucide-react';
import Button from '../components/Button';

const Hero: React.FC = () => {
  return (
    <section 
      id="hero" 
      className="min-h-screen flex items-center pt-16 pb-16 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="animate-fadeIn">
              <p className="text-teal-600 dark:text-teal-400 font-medium mb-2">
                Hello, I'm
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                <span className="inline-block transform transition-transform hover:translate-x-2">
                  DevCat-HGS
                </span>
              </h1>
              <h2 className="text-2xl md:text-3xl font-medium text-slate-600 dark:text-slate-400 mb-6">
                Software Analyst & Developer
              </h2>
              <p className="text-slate-700 dark:text-slate-300 text-lg mb-8 max-w-xl leading-relaxed">
                I craft clean, efficient, and user-friendly software solutions that solve real-world problems. 
                With expertise in full-stack development and software analysis, I bring your ideas to life.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="lg">
                  View My Work
                </Button>
                <Button variant="outline" size="lg">
                  Contact Me
                </Button>
              </div>
              
              <div className="flex mt-8 space-x-5">
                <a 
                  href="#" 
                  className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  aria-label="GitHub"
                >
                  <GitHub size={24} />
                </a>
                <a 
                  href="#" 
                  className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={24} />
                </a>
                <a 
                  href="mailto:contact@devcat-hgs.com" 
                  className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  aria-label="Email"
                >
                  <Mail size={24} />
                </a>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="w-64 h-64 md:w-80 md:h-80 relative animate-float">
              <div className="absolute inset-0 bg-teal-600 dark:bg-teal-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl md:text-7xl font-bold text-teal-600 dark:text-teal-400">
                  DH
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-16 animate-bounce">
          <a
            href="#about"
            className="text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            aria-label="Scroll down"
          >
            <ArrowDown size={28} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;