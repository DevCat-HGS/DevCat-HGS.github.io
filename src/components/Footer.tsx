import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-6 md:mb-0">
            <a href="#hero" className="text-2xl font-bold text-teal-500">
              DevCat-HGS
            </a>
            <p className="mt-2 text-slate-400 max-w-md">
              Creating innovative software solutions that solve real-world problems and exceed client expectations.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-white">Navigate</h3>
              <ul className="space-y-2">
                <li><a href="#hero" className="text-slate-400 hover:text-teal-400 transition-colors">Home</a></li>
                <li><a href="#about" className="text-slate-400 hover:text-teal-400 transition-colors">About</a></li>
                <li><a href="#skills" className="text-slate-400 hover:text-teal-400 transition-colors">Skills</a></li>
                <li><a href="#projects" className="text-slate-400 hover:text-teal-400 transition-colors">Projects</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-white">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#blog" className="text-slate-400 hover:text-teal-400 transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-teal-400 transition-colors">Newsletter</a></li>
                <li><a href="#" className="text-slate-400 hover:text-teal-400 transition-colors">Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-white">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-teal-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-teal-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} DevCat-HGS. All rights reserved.
          </p>
          
          <div className="flex space-x-4">
            <a 
              href="https://github.com/DevCat-HGS" 
              className="text-slate-500 hover:text-teal-400 transition-colors"
              aria-label="GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            
            <a 
              href="#" 
              className="text-slate-500 hover:text-teal-400 transition-colors"
              aria-label="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            
            <a 
              href="#" 
              className="text-slate-500 hover:text-teal-400 transition-colors"
              aria-label="Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;