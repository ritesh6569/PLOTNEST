import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUpload, FaHandshake, FaShieldAlt, FaUserTie } from 'react-icons/fa';

const heroImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb';

export default function Home() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-green-50 min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 py-16 px-4">
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4 leading-tight drop-shadow">Find Your Perfect Plot or List Your Property</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl">Connecting buyers, sellers, and dealers for a seamless real estate experience. Discover, book, or list plots with trust and ease.</p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center md:justify-start">
            <Link to="/buyer/plots" className="bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-lg shadow hover:bg-blue-800 transition flex items-center gap-2 justify-center"><FaSearch /> Browse Plots</Link>
            <Link to="/user/register" className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold text-lg shadow hover:bg-green-700 transition flex items-center gap-2 justify-center"><FaUpload /> List Your Plot</Link>
          </div>
        </div>
        <div className="flex-1 w-full flex justify-center">
          <img src={heroImage} alt="Construction site" className="rounded-2xl shadow-2xl w-full max-w-md object-cover h-80 md:h-96" />
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full bg-gradient-to-r from-brand-blue/5 to-brand-green/5 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-brand-blue mb-10 drop-shadow">Why Choose Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border-t-4 border-brand-blue hover:scale-105 hover:shadow-2xl transition-transform duration-300 group">
              <span className="bg-brand-blue/10 p-4 rounded-full mb-4"><FaShieldAlt className="text-4xl text-brand-blue group-hover:text-brand-green transition" /></span>
              <h3 className="font-bold text-lg text-brand-blue mb-2">Verified Dealers</h3>
              <p className="text-gray-600">All sellers and dealers are verified for your safety and trust.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border-t-4 border-brand-green hover:scale-105 hover:shadow-2xl transition-transform duration-300 group">
              <span className="bg-brand-green/10 p-4 rounded-full mb-4"><FaUpload className="text-4xl text-brand-green group-hover:text-brand-blue transition" /></span>
              <h3 className="font-bold text-lg text-brand-green mb-2">Easy Listing</h3>
              <p className="text-gray-600">List your plot in minutes with our simple, guided form and image upload.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border-t-4 border-brand-yellow hover:scale-105 hover:shadow-2xl transition-transform duration-300 group">
              <span className="bg-brand-yellow/10 p-4 rounded-full mb-4"><FaHandshake className="text-4xl text-brand-yellow group-hover:text-brand-blue transition" /></span>
              <h3 className="font-bold text-lg text-brand-yellow mb-2">Seamless Booking</h3>
              <p className="text-gray-600">Book or inquire about plots instantly, with transparent communication.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border-t-4 border-purple-400 hover:scale-105 hover:shadow-2xl transition-transform duration-300 group">
              <span className="bg-purple-100 p-4 rounded-full mb-4"><FaUserTie className="text-4xl text-purple-600 group-hover:text-brand-blue transition" /></span>
              <h3 className="font-bold text-lg text-purple-700 mb-2">Expert Support</h3>
              <p className="text-gray-600">Our team is here to help you at every step of your real estate journey.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-800 mb-8">How It Works</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center w-full md:w-1/3">
            <span className="text-4xl font-bold text-blue-700 mb-2">1</span>
            <h4 className="font-bold text-blue-700 mb-2">Register or Login</h4>
            <p className="text-gray-600">Create your account as a buyer, seller, or dealer to get started.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center w-full md:w-1/3">
            <span className="text-4xl font-bold text-green-700 mb-2">2</span>
            <h4 className="font-bold text-green-700 mb-2">Browse or List Plots</h4>
            <p className="text-gray-600">Buyers can browse and filter plots, sellers can list their property with details and images.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center w-full md:w-1/3">
            <span className="text-4xl font-bold text-yellow-700 mb-2">3</span>
            <h4 className="font-bold text-yellow-700 mb-2">Book, Inquire, or Connect</h4>
            <p className="text-gray-600">Book a plot, send an inquiry, or connect with dealers and sellers directly.</p>
          </div>
        </div>
      </div>
    </section>
  );
} 