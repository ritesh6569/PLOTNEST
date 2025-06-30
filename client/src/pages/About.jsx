import React from 'react';

export default function About() {
  return (
    <section className="bg-white flex flex-col flex-1 py-12">
      <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">About Us</h2>
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-bold text-blue-700 mb-2">Our Team</h3>
          <div className="bg-white rounded shadow p-6 text-gray-600 border border-blue-100">We are a group of passionate architects, engineers, and real estate professionals dedicated to delivering the best results for our clients. Our combined experience ensures your project is in safe hands.</div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-blue-700 mb-2">Office Information</h3>
          <div className="bg-white rounded shadow p-6 text-gray-600 border border-blue-100">123 Main Street, Your City, Country<br/>Open: Mon-Sat, 9am-6pm</div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <h3 className="text-lg font-bold text-blue-700 mb-2">Testimonials</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded shadow p-6 text-gray-600 border border-blue-100">
            <p className="mb-2">"Excellent service and professional team!"</p>
            <span className="text-blue-700 font-bold">- A. Client</span>
          </div>
          <div className="bg-white rounded shadow p-6 text-gray-600 border border-blue-100">
            <p className="mb-2">"They made our dream home a reality."</p>
            <span className="text-blue-700 font-bold">- B. Client</span>
          </div>
        </div>
      </div>
    </section>
  );
} 