export interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
}

const projectsData: Project[] = [
  {
    title: 'E-Commerce Platform',
    description: 'A full-featured online store with payment processing, inventory management, and admin dashboard.',
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    liveUrl: '#',
    repoUrl: '#'
  },
  {
    title: 'Project Management Tool',
    description: 'Collaborative task management application with real-time updates, file sharing, and progress tracking.',
    image: 'https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['Vue.js', 'Firebase', 'Tailwind CSS'],
    liveUrl: '#',
    repoUrl: '#'
  },
  {
    title: 'Healthcare Scheduling System',
    description: 'Appointment scheduling platform for healthcare providers with patient management and reminders.',
    image: 'https://images.pexels.com/photos/3985163/pexels-photo-3985163.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['React', 'Django', 'PostgreSQL', 'AWS'],
    liveUrl: '#',
    repoUrl: '#'
  },
  {
    title: 'Financial Analytics Dashboard',
    description: 'Interactive data visualization platform for financial metrics with forecasting capabilities.',
    image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['Angular', 'D3.js', 'Express', 'MySQL'],
    liveUrl: '#',
    repoUrl: '#'
  },
  {
    title: 'Social Media Platform',
    description: 'Feature-rich social networking application with content sharing, messaging, and user authentication.',
    image: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['React Native', 'GraphQL', 'MongoDB'],
    liveUrl: '#',
    repoUrl: '#'
  },
  {
    title: 'AI-Powered Chatbot',
    description: 'Intelligent virtual assistant with natural language processing and integration capabilities.',
    image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['Python', 'TensorFlow', 'Flask', 'NLP'],
    liveUrl: '#',
    repoUrl: '#'
  }
];

export default projectsData;