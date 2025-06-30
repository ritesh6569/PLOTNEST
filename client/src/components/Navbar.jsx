import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/plots', label: 'Plot Market' },
  { to: '/why-choose-us', label: 'Why Choose Us' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur sticky top-0 z-50 shadow-md font-sans transition-all duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 text-2xl font-extrabold tracking-tight text-brand-blue">
          <span className="inline-block w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center text-brand-blue font-black shadow-lg text-2xl transition-transform hover:scale-110">PN</span>
          <span className="hidden sm:inline tracking-widest uppercase font-bold text-brand-blue">PlotNest</span>
        </Link>
        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-2 items-center ml-8">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-lg text-base font-semibold transition-all duration-200 uppercase tracking-wide
                ${isActive ? 'text-brand-blue' : 'text-brand-blue hover:text-brand-green'} focus:outline-none`
              }
            >
              <span className="relative z-10">
              {link.label}
                <span className={`absolute left-0 -bottom-1 w-full h-0.5 rounded bg-brand-blue transition-all duration-300 ${window.location.pathname === link.to ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></span>
              </span>
            </NavLink>
          ))}
          <NavLink to="/user/login" className="ml-2 px-4 py-2 rounded-lg bg-brand-blue text-white font-bold hover:bg-brand-green transition-all duration-200 shadow focus:ring-2 focus:ring-brand-blue focus:outline-none">Login</NavLink>
          <NavLink to="/user/register" className="ml-2 px-4 py-2 rounded-lg bg-brand-green text-white font-bold hover:bg-brand-blue transition-all duration-200 shadow focus:ring-2 focus:ring-brand-green focus:outline-none">Register</NavLink>
        </div>
        {/* Hamburger for Mobile */}
        <button className="md:hidden p-2 rounded-lg bg-brand-blue text-white hover:bg-brand-green transition-all duration-200 focus:ring-2 focus:ring-brand-blue focus:outline-none" onClick={() => setMenuOpen(m => !m)}>
          {menuOpen ? <FaTimes className="w-7 h-7 transition-transform duration-300 rotate-90" /> : <FaBars className="w-7 h-7 transition-transform duration-300" />}
        </button>
      </div>
      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 shadow px-4 pb-4 pt-2 rounded-b-xl animate-fade-in-down">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-base font-semibold transition-all duration-200 uppercase tracking-wide mb-1
                ${isActive ? 'bg-brand-blue text-white shadow' : 'text-brand-blue hover:bg-brand-blue/10 hover:text-brand-green'} focus:outline-none`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/user/login" className="block mt-2 px-4 py-2 rounded-lg bg-brand-blue text-white font-bold hover:bg-brand-green transition-all duration-200 shadow focus:ring-2 focus:ring-brand-blue focus:outline-none" onClick={() => setMenuOpen(false)}>Login</NavLink>
          <NavLink to="/user/register" className="block mt-2 px-4 py-2 rounded-lg bg-brand-green text-white font-bold hover:bg-brand-blue transition-all duration-200 shadow focus:ring-2 focus:ring-brand-green focus:outline-none" onClick={() => setMenuOpen(false)}>Register</NavLink>
        </div>
      )}
    </nav>
  );
} 