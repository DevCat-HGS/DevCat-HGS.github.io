import React from 'react';
import SectionTitle from '../components/SectionTitle';
import BlogCard from '../components/BlogCard';
import Button from '../components/Button';

const Blog: React.FC = () => {
  const blogs = [
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
    }
  ];

  return (
    <section id="blog" className="py-20 bg-slate-50 dark:bg-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle 
          title="Latest Articles" 
          subtitle="Insights and tutorials on software development and technology trends"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {blogs.map((blog, index) => (
            <BlogCard 
              key={index}
              {...blog}
            />
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="primary">
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Blog;