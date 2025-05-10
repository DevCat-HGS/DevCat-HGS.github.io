export interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  readTime: string;
}

const blogData: BlogPost[] = [
  {
    title: 'The Future of Web Development: Trends to Watch in 2025',
    excerpt: 'Exploring emerging technologies and methodologies that are shaping the future of web development.',
    date: 'June 15, 2025',
    image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    readTime: '6 min read'
  },
  {
    title: 'Building Scalable Microservices with Node.js',
    excerpt: 'A practical guide to architecting and deploying microservices using Node.js and containers.',
    date: 'May 28, 2025',
    image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    readTime: '8 min read'
  },
  {
    title: 'Optimizing React Performance for Enterprise Applications',
    excerpt: 'Advanced techniques for improving the performance of large-scale React applications.',
    date: 'April 12, 2025',
    image: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    readTime: '10 min read'
  },
  {
    title: 'The Rise of AI in Software Development',
    excerpt: 'How artificial intelligence is transforming code generation, testing, and software maintenance.',
    date: 'March 5, 2025',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    readTime: '7 min read'
  },
  {
    title: 'Security Best Practices for Modern Web Applications',
    excerpt: 'Essential security measures to protect your applications from common vulnerabilities and threats.',
    date: 'February 20, 2025',
    image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    readTime: '9 min read'
  },
  {
    title: 'Mastering TypeScript: Advanced Patterns and Techniques',
    excerpt: 'Deep dive into advanced TypeScript features that can enhance your development experience.',
    date: 'January 8, 2025',
    image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    readTime: '11 min read'
  }
];

export default blogData;