import React from 'react';
import SectionTitle from '../components/SectionTitle';
import { Calendar, MapPin, BookOpen } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle 
          title="About Me" 
          subtitle="Get to know more about my professional background and experience"
        />
        
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="md:w-2/5 mb-8 md:mb-0">
            <div className="rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
              <img
                src="https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Professional headshot"
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <div className="md:w-3/5">
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
              With over 8 years of experience in software development and analysis, I specialize in creating 
              robust, scalable applications that drive business growth and enhance user experience. My approach 
              combines technical expertise with strategic thinking to deliver solutions that exceed expectations.
            </p>
            
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
              I'm passionate about staying at the forefront of technology trends and continuously expanding my 
              skill set. Whether working independently or as part of a team, I bring dedication, creativity, and 
              a strong problem-solving mindset to every project.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <div className="mr-3 text-teal-600 dark:text-teal-400">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">Experience</h3>
                  <p className="text-slate-600 dark:text-slate-400">8+ Years</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="mr-3 text-teal-600 dark:text-teal-400">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">Location</h3>
                  <p className="text-slate-600 dark:text-slate-400">Remote / Worldwide</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="mr-3 text-teal-600 dark:text-teal-400">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">Education</h3>
                  <p className="text-slate-600 dark:text-slate-400">MSc in Computer Science</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="mr-3 text-teal-600 dark:text-teal-400">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">Projects</h3>
                  <p className="text-slate-600 dark:text-slate-400">50+ Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;