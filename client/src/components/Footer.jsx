import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white py-4 w-full border-t border-blue-100">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="text-blue-800">&copy; {new Date().getFullYear()} Construction Co. All rights reserved.</div>
        <div className="space-x-4 mt-2 md:mt-0">
          <Link to="/" className="text-blue-800 hover:text-yellow-500">Home</Link>
          <Link to="/services" className="text-blue-800 hover:text-yellow-500">Services</Link>
          <Link to="/plots" className="text-blue-800 hover:text-yellow-500">Plot Market</Link>
          <Link to="/contact" className="text-blue-800 hover:text-yellow-500">Contact</Link>
        </div>
      </div>
    </footer>
  );
} 