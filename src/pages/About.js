import React from 'react';
import { Sparkles, Globe, Users, CheckCircle2, ArrowRight } from 'lucide-react';

export default function About({ navigate }) {
  return (
    <div className="min-h-screen bg-white pt-24 pb-24 animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#212121] leading-tight mb-4">We build autonomous AI that makes teams exponentially more productive</h1>
            <p className="text-lg text-gray-600 mb-6">Kinexus creates deployable agentic workflows that automate tedious operational work — from scheduling to compliance — so humans can focus on high-value decisions.</p>
            <div className="flex space-x-4">
              <button onClick={() => navigate('contact')} className="inline-flex items-center bg-[#2EC5CE] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#25a8b0]">Contact Us <ArrowRight className="w-4 h-4 ml-3" /></button>
              <button onClick={() => navigate('useCases')} className="inline-flex items-center border-2 border-[#5856D6] text-[#5856D6] px-5 py-3 rounded-xl font-semibold hover:bg-[#E8E7FF]">Explore Use Cases</button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-6 border rounded-2xl shadow-sm">
              <div className="p-3 bg-[#E8FDFB] rounded-lg text-[#2EC5CE]"><Sparkles className="w-6 h-6" /></div>
              <div>
                <h3 className="font-bold text-lg">Our Mission</h3>
                <p className="text-gray-600">Deliver practical autonomy: systems that do the work, not just insights.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-6 border rounded-2xl shadow-sm">
              <div className="p-3 bg-[#F3E8FF] rounded-lg text-[#5856D6]"><Globe className="w-6 h-6" /></div>
              <div>
                <h3 className="font-bold text-lg">Global Impact</h3>
                <p className="text-gray-600">Trusted by operations teams across manufacturing, logistics, pharma and more.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#F8FAFF] p-10 rounded-3xl mb-12">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-extrabold text-[#212121]">40%</div>
              <div className="text-sm text-gray-600">Avg downtime reduction</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#212121]">25%</div>
              <div className="text-sm text-gray-600">Typical OEE uplift</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#212121]"><span className="text-[#2EC5CE]">Real</span> ROI</div>
              <div className="text-sm text-gray-600">Measured in reduced hours and increased throughput</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <div className="flex items-center space-x-3 mb-4"><Users className="w-6 h-6 text-[#5856D6]" /><h4 className="font-bold">People First</h4></div>
            <p className="text-gray-600">We design agents that augment human teams, not replace them.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <div className="flex items-center space-x-3 mb-4"><CheckCircle2 className="w-6 h-6 text-[#2EC5CE]" /><h4 className="font-bold">Proven Outcomes</h4></div>
            <p className="text-gray-600">Deployable, auditable workflows built for enterprise constraints.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <div className="flex items-center space-x-3 mb-4"><Globe className="w-6 h-6 text-[#5856D6]" /><h4 className="font-bold">Domain Expertise</h4></div>
            <p className="text-gray-600">Industry patterns encoded from years of ops experience.</p>
          </div>
        </div>

        <div className="bg-white p-10 rounded-3xl">
          <h3 className="text-2xl font-bold mb-6">Meet the Team</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{
              name: 'Asha Verma', role: 'CEO', bio: 'Operator-turned-founder focused on applied ML for operations.'
            },{
              name: 'Liam Chen', role: 'CTO', bio: 'Builds reliable, scalable agent infrastructure.'
            },{
              name: 'Sofia Ruiz', role: 'Head of Solutions', bio: 'Bridges customer problems to deployable agents.'
            },{
              name: 'Marco Silva', role: 'Product', bio: 'Designs human-centered automation experiences.'
            }].map((m) => (
              <div key={m.name} className="p-4 text-center border rounded-2xl">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E8E7FF] to-[#F0FBFF] mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-[#5856D6]">{m.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                <div className="font-semibold">{m.name}</div>
                <div className="text-sm text-gray-500 mb-2">{m.role}</div>
                <div className="text-sm text-gray-600">{m.bio}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
