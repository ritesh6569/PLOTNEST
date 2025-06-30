import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserShield } from 'react-icons/fa';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(' https://plotnest.onrender.com/api/admin/register', { username, password });
      setMessage('Admin registered! You can now log in.');
      setTimeout(() => navigate('/admin/login'), 1500);
    } catch (err) {
      setMessage('Registration failed: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-2">
      <div className="bg-white/90 rounded-3xl shadow-2xl p-10 max-w-md w-full border border-blue-100 flex flex-col items-center backdrop-blur-md">
        <span className="bg-blue-100 p-3 rounded-full mb-2 shadow"><FaUserShield className="text-3xl text-blue-600" /></span>
        <h2 className="text-3xl font-black text-blue-800 mb-8 text-center drop-shadow">Admin Register</h2>
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          {message && <div className={`mb-4 text-center font-semibold ${message.startsWith('Admin registered') ? 'text-green-400' : 'text-red-400'}`}>{message}</div>}
          <div>
            <label className="block mb-1 font-semibold text-blue-800">Username</label>
            <input type="text" className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-blue-300" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-blue-800">Password</label>
            <input type="password" className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-blue-300" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="w-full bg-blue-800 text-white py-2 rounded font-bold hover:bg-blue-900 transition">Register</button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-blue-800">Already have an account? </span>
          <Link to="/admin/login" className="text-blue-600 hover:underline font-semibold">Login</Link>
        </div>
      </div>
    </section>
  );
} 