import React from 'react';

export default function Contact() {
  return (
    <section className="bg-white flex flex-col flex-1 items-center justify-center py-12">
      <div className="bg-white rounded shadow p-8 max-w-lg w-full border border-blue-100">
        <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">Contact Us</h2>
        <div className="mb-4">
          <span className="font-semibold text-blue-700">Mobile:</span> <a href="tel:+1234567890" className="text-blue-700 hover:underline">+1 234 567 890</a>
        </div>
        <div className="mb-4">
          <span className="font-semibold text-blue-700">Email:</span> <a href="mailto:info@constructionco.com" className="text-blue-700 hover:underline">info@constructionco.com</a>
        </div>
        <div className="mb-4">
          <span className="font-semibold text-blue-700">Office Location:</span> <a href="https://goo.gl/maps/yourmaplink" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">View on Google Maps</a>
        </div>
        <div className="mb-6">
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
            <button className="bg-blue-700 text-white px-6 py-2 rounded font-bold hover:bg-blue-800 transition">WhatsApp Us</button>
          </a>
        </div>
      </div>
    </section>
  );
} 