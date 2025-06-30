import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaUser, FaUserTie, FaUserShield, FaTrash, FaSpinner } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';

const roleIcons = {
  buyer: <FaUser className="text-blue-600" />,
  seller: <FaUserTie className="text-green-600" />,
  admin: <FaUserShield className="text-purple-600" />,
};

export default function ManageUsers() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const token = localStorage.getItem('adminToken');
  const admin = JSON.parse(localStorage.getItem('userInfo'));
  const navigate = useNavigate();
  const [adminExists, setAdminExists] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError('');
    axios.get('http://localhost:5000/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUsers(res.data))
      .catch(() => setError('Failed to fetch users.'))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/exists').then(res => {
      setAdminExists(res.data.exists);
    });
  }, []);

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setDeleting(id);
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u._id !== id));
    } catch {
      alert('Failed to delete user.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-2">
      <div className="w-full max-w-4xl bg-white/90 rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-blue-100 backdrop-blur-md">
        <h2 className="text-2xl md:text-3xl font-extrabold text-blue-800 mb-8 drop-shadow flex items-center gap-2"><FaUserShield className="text-blue-600" /> Manage Users</h2>
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex-1 flex items-center bg-blue-50 rounded-xl px-4 py-2 shadow">
            <FaSearch className="text-blue-400 mr-2" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              className="bg-transparent outline-none w-full text-lg"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12"><FaSpinner className="animate-spin text-2xl text-blue-600 mr-2" /> Loading users...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : (
            <table className="w-full text-left border-collapse rounded-xl overflow-hidden shadow">
              <thead>
                <tr className="bg-blue-50">
                  <th className="p-4 font-semibold text-blue-700">Name</th>
                  <th className="p-4 font-semibold text-blue-700">Email</th>
                  <th className="p-4 font-semibold text-blue-700">Role</th>
                  <th className="p-4 font-semibold text-blue-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u._id} className="border-b hover:bg-blue-50 transition">
                    <td className="p-4 flex items-center gap-2 font-semibold text-blue-900">{roleIcons[u.role]} {u.username}</td>
                    <td className="p-4 text-gray-700">{u.email}</td>
                    <td className="p-4 text-blue-700 capitalize">{u.role}</td>
                    <td className="p-4 flex gap-2">
                      <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded font-semibold text-sm hover:bg-blue-200 transition">View</button>
                      <button onClick={() => handleDelete(u._id)} disabled={deleting === u._id} className="bg-red-100 text-red-700 px-3 py-1 rounded font-semibold text-sm hover:bg-red-200 transition flex items-center gap-1">
                        {deleting === u._id ? <FaSpinner className="animate-spin" /> : <FaTrash />} Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={4} className="p-6 text-center text-gray-400">No users found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
} 