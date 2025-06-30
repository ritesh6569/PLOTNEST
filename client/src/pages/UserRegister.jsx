import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaUser, FaUserTie, FaUserShield, FaUserCog, FaArrowLeft, FaClipboardList, FaEdit, FaTrash } from 'react-icons/fa';

const roles = [
  { value: 'buyer', label: 'Buyer', icon: <FaUser className="text-3xl text-blue-600 mb-1" /> },
  { value: 'seller', label: 'Seller', icon: <FaUserTie className="text-3xl text-green-600 mb-1" /> },
  { value: 'dealer', label: 'Dealer', icon: <FaUserShield className="text-3xl text-yellow-600 mb-1" /> },
  { value: 'admin', label: 'Admin', icon: <FaUserCog className="text-3xl text-purple-600 mb-1" /> },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function UserRegister() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', role: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const query = useQuery();
  const preselectedRole = query.get('role');
  const selectedRole = preselectedRole || form.role;
  const selectedRoleObj = roles.find(r => r.value === selectedRole);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.username || !form.email || !form.password || !form.confirmPassword || !(preselectedRole || form.role)) {
      setError('Please fill all required fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('https://plotnest.onrender.com/api/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password,
        role: preselectedRole || form.role,
        phone: form.phone,
      });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate(`/user/login?role=${preselectedRole || form.role}`), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRoleObj) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 py-12 px-2">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
          <div className="text-xl font-bold text-blue-700 mb-4 text-center">Please choose your role to register.</div>
          <Link to="/choose-role" className="bg-blue-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-800 transition flex items-center gap-2"><FaArrowLeft /> Choose Role</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-2">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <div className="flex flex-col items-center mb-2">
          {selectedRoleObj.icon}
          <div className="text-lg font-bold text-blue-800 mb-2">{selectedRoleObj.label} Registration</div>
        </div>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <input name="username" className="border border-green-200 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Username" value={form.username} onChange={handleChange} required />
          <input name="email" type="email" className="border border-green-200 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="phone" className="border border-green-200 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Phone (optional)" value={form.phone} onChange={handleChange} />
          <input name="password" type="password" className="border border-green-200 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Password" value={form.password} onChange={handleChange} required />
          <input name="confirmPassword" type="password" className="border border-green-200 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
          {!preselectedRole && (
            <div className="flex gap-4 items-center justify-center">
              <span className="font-semibold text-gray-700">Role:</span>
              {roles.map(r => (
                <label key={r.value} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer border-2 transition-all ${form.role === r.value ? 'border-green-500 bg-green-50' : 'border-green-200 bg-white'}`}>
                  <input type="radio" name="role" value={r.value} checked={form.role === r.value} onChange={handleChange} className="accent-green-600" required />
                  <span className="font-medium text-green-700">{r.label}</span>
                </label>
              ))}
            </div>
          )}
          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition text-lg shadow" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        {error && <div className="text-red-600 font-semibold mt-4 text-center w-full">{error}</div>}
        {success && <div className="text-green-600 font-semibold mt-4 text-center w-full">{success}</div>}
        <div className="mt-6 text-center text-sm text-gray-600 w-full">
          Already have an account?{' '}
          <Link to={`/user/login?role=${selectedRoleObj.value}`} className="text-green-700 hover:underline font-semibold">Login as {selectedRoleObj.label}</Link>
        </div>
      </div>
    </section>
  );
} 