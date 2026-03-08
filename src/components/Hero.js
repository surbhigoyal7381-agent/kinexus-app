import React from 'react';
import { FiArrowRight } from 'react-icons/fi';

export default function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center text-white px-4 sm:px-0">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Welcome to <span className="text-yellow-300">Kinexus</span>
        </h1>
        <p className="text-lg md:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto">
          Build amazing applications with modern React, Tailwind CSS, and cutting-edge web technologies.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center px-2">
          <button className="px-6 sm:px-8 py-3 bg-white text-primary font-bold rounded-lg hover:shadow-2xl transition transform hover:scale-105 w-full sm:w-auto">
            Get Started Now
          </button>
          <button className="px-6 sm:px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-primary transition flex items-center justify-center gap-2 w-full sm:w-auto">
            Learn More <FiArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}
