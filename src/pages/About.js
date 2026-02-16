import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Kinexus</h1>
        <p className="text-lg text-gray-600 mb-8">Learn more about our mission and values</p>

        {/* About Content */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            At Kinexus, we believe in empowering developers to build amazing applications. Our platform combines modern technologies with an intuitive interface to make web development faster, easier, and more enjoyable.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Our Values</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-primary font-bold mr-3">✓</span>
              <span><strong>Innovation:</strong> We continuously push the boundaries of what's possible</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-3">✓</span>
              <span><strong>Quality:</strong> We maintain the highest standards in everything we do</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-3">✓</span>
              <span><strong>Community:</strong> We support and learn from our vibrant community</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-3">✓</span>
              <span><strong>Transparency:</strong> We believe in open communication and honesty</span>
            </li>
          </ul>
        </div>

        {/* Team Section */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((member) => (
              <div key={member} className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4"></div>
                <h3 className="font-bold text-gray-900">Team Member {member}</h3>
                <p className="text-gray-600">Founder & Developer</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
