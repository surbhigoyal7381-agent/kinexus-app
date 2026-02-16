import React, { useState } from 'react';

export default function Dashboard() {
  const [stats] = useState([
    { label: 'Total Users', value: '12,543', change: '+12.5%' },
    { label: 'Active Sessions', value: '3,842', change: '+8.2%' },
    { label: 'Revenue', value: '$45,231', change: '+23.1%' },
    { label: 'Conversion Rate', value: '3.24%', change: '+0.8%' }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome back! Here's your performance overview.</p>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary">
              <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-green-600 text-sm font-medium">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart Area */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Performance Metrics</h2>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8 text-center">
              <p className="text-gray-600">Chart visualization will be displayed here</p>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start gap-4 pb-4 border-b border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-primary/20"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Activity Item {item}</p>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
