import React from 'react';
import SectionTitle from '../components/SectionTitle';
import ContactForm from '../components/ContactForm';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle 
          title="Get In Touch" 
          subtitle="Ready to start your project? Reach out and let's discuss your ideas"
        />
        
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/3">
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6">
                Contact Information
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mt-1 mr-4 text-teal-600 dark:text-teal-400">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-200">Email</h4>
                    <a 
                      href="mailto:contact@devcat-hgs.com" 
                      className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    >
                      contact@devcat-hgs.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-4 text-teal-600 dark:text-teal-400">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-200">Phone</h4>
                    <a 
                      href="tel:+1234567890" 
                      className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-4 text-teal-600 dark:text-teal-400">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-200">Location</h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      Remote / Available Worldwide
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-4 text-teal-600 dark:text-teal-400">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-200">Working Hours</h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      Monday - Friday: 9 AM - 6 PM (EST)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-4">
                  Connect with me
                </h4>
                <div className="flex space-x-4">
                  <a 
                    href="#" 
                    className="bg-slate-200 dark:bg-slate-700 p-2 rounded-full text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    aria-label="GitHub"
                  >
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
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </a>
                  
                  <a 
                    href="#" 
                    className="bg-slate-200 dark:bg-slate-700 p-2 rounded-full text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    aria-label="LinkedIn"
                  >
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
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  
                  <a 
                    href="#" 
                    className="bg-slate-200 dark:bg-slate-700 p-2 rounded-full text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    aria-label="Twitter"
                  >
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
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6">
                Send me a message
              </h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;