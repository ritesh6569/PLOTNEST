import React from 'react';

const features = [
  { icon: '🗣️', title: 'Detailed Consultation', desc: 'We listen to your requirements and provide tailored solutions.' },
  { icon: '👨‍💼', title: 'Experienced Engineers', desc: 'Our team consists of highly qualified and experienced engineers.' },
  { icon: '⚡', title: 'Fast & Transparent', desc: 'We deliver projects quickly with full transparency at every step.' },
  { icon: '📊', title: 'Planning & Budgeting', desc: 'Get expert advice on planning and budgeting for your project.' },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white flex flex-col flex-1 py-12">
      <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">Why Choose Us</h2>
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8">
        {features.map((f) => (
          <div key={f.title} className="bg-white rounded shadow p-8 flex items-center border border-blue-100">
            <div className="text-4xl mr-6">{f.icon}</div>
            <div>
              <h3 className="text-lg font-bold text-blue-700 mb-1">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 