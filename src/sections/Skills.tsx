import React from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';
import { Code, Database, Server, Brain, File as Mobile, Cloud, TowerControl as GameController, PenTool as Tool } from 'lucide-react';

const Skills: React.FC = () => {
  const skillCategories = [
    {
      title: "Frontend Development",
      skills: ["HTML", "CSS", "SASS", "Tailwind", "Material UI", "Bootstrap", "React", "Vue", "Next.js"],
      icon: <Code size={24} />,
      level: 5
    },
    {
      title: "Backend Development",
      skills: ["Node.js", "Express", "Django", "FastAPI", "PHP", "Flask", "Go"],
      icon: <Server size={24} />,
      level: 4
    },
    {
      title: "Database & Cloud",
      skills: ["MongoDB", "MySQL", "PostgreSQL", "SQLite", "Cassandra", "Supabase", "Firebase"],
      icon: <Database size={24} />,
      level: 4
    },
    {
      title: "DevOps & Tools",
      skills: ["Git", "Docker", "GitHub Actions", "Vercel", "Heroku", "Netlify", "Railway"],
      icon: <Cloud size={24} />,
      level: 4
    },
    {
      title: "AI & Machine Learning",
      skills: ["TensorFlow", "Python", "PyTorch", "OpenCV", "Anaconda"],
      icon: <Brain size={24} />,
      level: 4
    },
    {
      title: "Game Development",
      skills: ["Unity", "C++", "C#", "Three.js", "Blender"],
      icon: <GameController size={24} />,
      level: 3
    },
    {
      title: "Mobile Development",
      skills: ["Flutter", "Dart", "Android Studio", "Kotlin"],
      icon: <Mobile size={24} />,
      level: 3
    },
    {
      title: "Development Tools",
      skills: ["VS Code", "Visual Studio", "PowerShell", "Linux", "Windows"],
      icon: <Tool size={24} />,
      level: 5
    }
  ];

  return (
    <section id="skills" className="py-20 bg-slate-50 dark:bg-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle 
          title="Skills & Expertise" 
          subtitle="A comprehensive overview of my technical capabilities"
        />
        
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md"
            >
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                {category.icon}
                <span className="ml-2">{category.title}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skillIndex}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3, delay: skillIndex * 0.05 }}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer transition-colors"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;