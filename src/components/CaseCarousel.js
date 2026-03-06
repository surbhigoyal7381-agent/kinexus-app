import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

export default function CaseCarousel({ items = [], autoplay = true, interval = 6000 }) {
  const [index, setIndex] = useState(0);
  const len = items.length || 1;
  const timer = useRef(null);

  useEffect(() => {
    if (!autoplay) return;
    timer.current = setInterval(() => setIndex(i => (i + 1) % len), interval);
    return () => clearInterval(timer.current);
  }, [autoplay, interval, len]);

  const prev = () => setIndex(i => (i - 1 + len) % len);
  const next = () => setIndex(i => (i + 1) % len);

  return (
    <div className="relative">
      {/* Constrained carousel container so section height equals carousel */}
      <div className="relative overflow-hidden h-72 md:h-80">
        {items.map((c, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-500 flex items-center justify-center px-4 ${i === index ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-6 pointer-events-none z-0'}`}
          >
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-xl transition-all w-full max-w-4xl">
              <div className="text-sm text-gray-500 mb-1">{c.title}</div>
              <h3 className="text-lg md:text-xl font-bold text-[#212121] mb-2">{c.challenge}</h3>
              <p className="text-gray-600 mb-3 text-sm md:text-base">{c.solution}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {c.metrics.map((m, idx) => (
                  <div key={idx} className="px-3 py-1 bg-white border rounded-full text-xs md:text-sm font-semibold">{m}</div>
                ))}
              </div>
              <div className="text-sm text-gray-700 italic">“{c.quote}”</div>
              <div className="mt-3 text-right"><button onClick={() => alert('Open case study placeholder')} className="text-[#5856D6] font-semibold">Read the full story →</button></div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="absolute top-1/2 transform -translate-y-1/2 left-2 md:left-4">
        <button onClick={prev} aria-label="Previous" className="p-2 bg-white/90 backdrop-blur rounded-full shadow hover:shadow-md">
          <ArrowRight className="w-5 h-5 transform -rotate-180 text-[#5856D6]" />
        </button>
      </div>
      <div className="absolute top-1/2 transform -translate-y-1/2 right-2 md:right-4">
        <button onClick={next} aria-label="Next" className="p-2 bg-white/90 backdrop-blur rounded-full shadow hover:shadow-md">
          <ArrowRight className="w-5 h-5 text-[#5856D6]" />
        </button>
      </div>

      {/* Dots */}
      <div className="mt-3 flex items-center justify-center space-x-2">
        {items.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} className={`w-3 h-3 rounded-full ${i === index ? 'bg-[#5856D6]' : 'bg-gray-300'}`}></button>
        ))}
      </div>
    </div>
  );
}
