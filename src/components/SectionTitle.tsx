import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  align = 'center',
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };

  return (
    <div className={`max-w-2xl mb-12 ${alignmentClasses[align]}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-3">
        {title}
      </h2>
      
      {subtitle && (
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          {subtitle}
        </p>
      )}
      
      <div className={`h-1 w-24 bg-teal-600 dark:bg-teal-400 mt-4 ${align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : ''}`}></div>
    </div>
  );
};

export default SectionTitle;