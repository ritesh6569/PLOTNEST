import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaUserShield } from 'react-icons/fa';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { username, password });
      
      // Store admin token and info
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('userInfo', JSON.stringify(res.data.admin));
      
      // Redirect to admin dashboard
      navigate('/admin');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-2">
      <div className="bg-white/90 rounded-3xl shadow-2xl p-10 max-w-md w-full border border-blue-100 flex flex-col items-center backdrop-blur-md">
        <span className="bg-blue-100 p-3 rounded-full mb-2 shadow">
          <FaUserShield className="text-3xl text-blue-600" />
        </span>
        <h2 className="text-3xl font-black text-blue-800 mb-8 text-center drop-shadow">Admin Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          {error && (
            <div className="mb-4 p-3 text-center text-red-600 bg-red-50 rounded-lg font-semibold">
              {error}
            </div>
          )}
          
          <div>
            <label className="block mb-1 font-semibold text-blue-800">Username</label>
            <input 
              type="text" 
              className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-blue-300" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block mb-1 font-semibold text-blue-800">Password</label>
            <input 
              type="password" 
              className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-blue-300" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className={`w-full py-2 rounded font-bold transition ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-800 text-white hover:bg-blue-900'
            }`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-blue-600 hover:underline text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
} 