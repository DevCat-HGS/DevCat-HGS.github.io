import React from 'react';
import Button from './Button';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  image,
  tags,
  liveUrl,
  repoUrl,
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
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
          {title}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex gap-3 mt-4">
          {liveUrl && (
            <Button variant="primary" size="sm">
              Live Demo
            </Button>
          )}
          
          {repoUrl && (
            <Button variant="outline" size="sm">
              Source Code
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;