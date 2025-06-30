import React from 'react';

const services = [
  { title: 'Architectural Design', icon: '🏛️', desc: 'Creative and practical building design for residential and commercial projects.' },
  { title: 'Plot Purchase and Sale', icon: '📋', desc: 'Expert guidance for buying or selling plots with full legal support.' },
  { title: 'Construction Cost Estimation', icon: '💰', desc: 'Transparent and accurate cost estimates for your construction projects.' },
  { title: 'House Planning', icon: '🏠', desc: 'Personalized house plans tailored to your needs and budget.' },
  { title: 'Contractor Services', icon: '👷', desc: 'Labour and material contracting for hassle-free construction.' },
];

export default function Services() {
  return (
    <section className="bg-white flex flex-col flex-1 py-12">
      <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">Our Services</h2>
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        {services.map((s) => (
          <div key={s.title} className="bg-white rounded shadow p-8 text-center border border-blue-100">
            <div className="text-5xl mb-4">{s.icon}</div>
            <h3 className="text-lg font-bold text-blue-700 mb-2">{s.title}</h3>
            <p className="text-gray-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
} 