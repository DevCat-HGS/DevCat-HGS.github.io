import React from 'react';

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  readTime: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  title,
  excerpt,
  date,
  image,
  readTime,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
      <div className="h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-2">
          <span>{date}</span>
          <span className="mx-2">•</span>
          <span>{readTime}</span>
        </div>
        
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
          {title}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-400 mb-3">
          {excerpt}
        </p>
        
        <a
          href="#"
          className="inline-block text-teal-600 dark:text-teal-400 font-medium hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
        >
          Read More →
        </a>
      </div>
    </div>
  );
};

export default BlogCard;