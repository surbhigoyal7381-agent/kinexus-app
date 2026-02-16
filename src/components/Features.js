import React from 'react';
import { FiZap, FiShield, FiTrendingUp, FiCode } from 'react-icons/fi';

export default function Features() {
  const features = [
    {
      icon: <FiZap className="w-8 h-8" />,
      title: 'Lightning Fast',
      description: 'Optimized performance with modern React patterns and lazy loading.'
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with best practices and regular updates.'
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: 'Scalable Architecture',
      description: 'Grows with your business without compromising performance.'
    },
    {
      icon: <FiCode className="w-8 h-8" />,
      title: 'Developer Friendly',
      description: 'Clean code, excellent documentation, and easy-to-use APIs.'
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
          Powerful Features
        </h2>
        <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
          Everything you need to build modern, scalable web applications
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="text-primary mb-4 transform hover:scale-110 transition">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
