import React from 'react';
import { Layout } from '../components/Layout';
import { Github, Linkedin, Mail, Globe } from 'lucide-react';

export function About() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-sky-900 dark:text-sky-100 mb-4">
            About AISurfer Blog
          </h1>
          <div className="w-20 h-1 bg-sky-500 mx-auto"></div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-sky-800 dark:text-sky-200">About Me</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Hi, I'm Minhaz, a passionate Full Stack Developer with expertise in MERN Stack development. 
              I specialize in creating robust web applications using modern technologies like React, Node.js, 
              and various cloud platforms. With a strong foundation in both frontend and backend development, 
              I strive to build scalable and user-friendly applications.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-sky-800 dark:text-sky-200">Vision for AISurfer Blog</h2>
            <p className="text-slate-700 dark:text-slate-300">
              AISurfer Blog is my platform to share insights and experiences in the world of Artificial Intelligence, 
              Machine Learning, and modern web development. My vision is to create a space where both beginners and 
              experienced developers can learn about the latest trends in AI technology, practical implementations, 
              and real-world applications.
            </p>
            <p className="text-slate-700 dark:text-slate-300 mt-4">
              Through this blog, I aim to:
            </p>
            <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300">
              <li>Share in-depth tutorials and guides on AI and ML technologies</li>
              <li>Discuss practical applications of AI in web development</li>
              <li>Explore emerging trends in technology</li>
              <li>Build a community of tech enthusiasts and developers</li>
            </ul>
          </div>

          <div className="bg-sky-50 dark:bg-slate-800 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-sky-800 dark:text-sky-200 mb-6">Connect With Me</h2>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://minnhazportfolio.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 rounded-lg text-sky-600 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-slate-600 transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span>Portfolio</span>
              </a>
              <a
                href="https://github.com/minhaulmahmud"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 rounded-lg text-sky-600 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-slate-600 transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/minhazulmahmud/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 rounded-lg text-sky-600 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-slate-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
              <a
                href="mailto:minhaz.oj@gmail.com"
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 rounded-lg text-sky-600 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-slate-600 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>Email</span>
              </a>
            </div>
          </div>

          <div className="bg-cream-50 dark:bg-slate-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-sky-800 dark:text-sky-200 mb-4">Technical Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-sky-700 dark:text-sky-300 mb-3">Frontend</h3>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300">
                  <li>React.js</li>
                  <li>Next.js</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                  <li>Material UI</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-sky-700 dark:text-sky-300 mb-3">Backend</h3>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300">
                  <li>Node.js</li>
                  <li>Express.js</li>
                  <li>MongoDB</li>
                  <li>PostgreSQL</li>
                  <li>RESTful APIs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}