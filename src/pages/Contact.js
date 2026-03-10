import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-6 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Get In Touch</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">We'd love to hear from you. Send us a message!</p>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                placeholder="John Doe"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                placeholder="john@example.com"
              />
            </div>

            {/* Message Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                placeholder="Your message here..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Other Ways to Reach Us</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 mb-1"><strong>Email:</strong></p>
                <p className="text-primary font-semibold">contact@kinexus.com</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1"><strong>Phone:</strong></p>
                <p className="text-primary font-semibold">+1 (555) 123-4567</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1"><strong>Address:</strong></p>
                <p className="text-primary font-semibold">123 Tech Street, San Francisco, CA</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1"><strong>Hours:</strong></p>
                <p className="text-primary font-semibold">Mon - Fri, 9AM - 6PM PST</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
