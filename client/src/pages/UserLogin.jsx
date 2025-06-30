import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaUser, FaUserTie, FaUserShield, FaUserCog, FaArrowLeft } from 'react-icons/fa';

const roleIcons = {
  buyer: <FaUser className="text-3xl text-blue-600 mb-1" />,
  seller: <FaUserTie className="text-3xl text-green-600 mb-1" />,
  dealer: <FaUserShield className="text-3xl text-yellow-600 mb-1" />,
  admin: <FaUserCog className="text-3xl text-purple-600 mb-1" />,
};

const roleLabels = {
  buyer: 'Buyer',
  seller: 'Seller',
  dealer: 'Dealer',
  admin: 'Admin',
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function UserLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const query = useQuery();
  const role = query.get('role');

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please fill all fields.');
      return;
    }
    
    // If role is admin, redirect to admin login
    if (role === 'admin') {
      navigate('/admin/login');
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('userToken', res.data.token);
      localStorage.setItem('userInfo', JSON.stringify(res.data.user));
      if (res.data.user.role === 'buyer') {
        navigate('/buyer/dashboard');
      } else if (res.data.user.role === 'seller') {
        navigate('/seller/dashboard');
      } else if (res.data.user.role === 'dealer') {
        navigate('/dealer/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!role || !roleLabels[role]) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 py-12 px-2">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
          <div className="text-xl font-bold text-blue-700 mb-4 text-center">Please choose your role to login.</div>
          <Link to="/choose-role" className="bg-blue-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-800 transition flex items-center gap-2"><FaArrowLeft /> Choose Role</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 py-12 px-2">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <div className="flex flex-col items-center mb-2">
          {roleIcons[role]}
          <div className="text-lg font-bold text-blue-800 mb-2">{roleLabels[role]} Login</div>
        </div>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <input name="email" type="email" className="border border-blue-200 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="password" type="password" className="border border-blue-200 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Password" value={form.password} onChange={handleChange} required />
          <button type="submit" className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition text-lg shadow" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && <div className="text-red-600 font-semibold mt-4 text-center w-full">{error}</div>}
        <div className="mt-6 text-center text-sm text-gray-600 w-full">
          Don't have an account?{' '}
          <Link to={`/user/register?role=${role}`} className="text-blue-700 hover:underline font-semibold">Register as {roleLabels[role]}</Link>
        </div>
      </div>
    </section>
  );
} 