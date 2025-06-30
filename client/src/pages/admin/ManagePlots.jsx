import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaHome, FaTrash, FaSpinner } from 'react-icons/fa';

export default function ManagePlots() {
  const [search, setSearch] = useState('');
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    setLoading(true);
    setError('');
    axios.get('http://localhost:5000/api/plots', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPlots(res.data))
      .catch(() => setError('Failed to fetch plots.'))
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = plots.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.location?.toLowerCase().includes(search.toLowerCase()) ||
    p.price?.toString().includes(search) ||
    (p.seller?.username?.toLowerCase().includes(search.toLowerCase()) || p.seller?.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this plot?')) return;
    setDeleting(id);
    try {
      await axios.delete(`http://localhost:5000/api/plots/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlots(plots.filter(p => p._id !== id));
    } catch {
      alert('Failed to delete plot.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-2">
      <div className="w-full max-w-5xl bg-white/90 rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-green-100 backdrop-blur-md">
        <h2 className="text-2xl md:text-3xl font-extrabold text-green-800 mb-8 drop-shadow flex items-center gap-2"><FaHome className="text-green-600" /> Manage Plots</h2>
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex-1 flex items-center bg-green-50 rounded-xl px-4 py-2 shadow">
            <FaSearch className="text-green-400 mr-2" />
            <input
              type="text"
              placeholder="Search by title, location, price, or seller..."
              className="bg-transparent outline-none w-full text-lg"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12"><FaSpinner className="animate-spin text-2xl text-green-600 mr-2" /> Loading plots...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : (
            <table className="w-full text-left border-collapse rounded-xl overflow-hidden shadow">
              <thead>
                <tr className="bg-green-50">
                  <th className="p-4 font-semibold text-green-700">Title</th>
                  <th className="p-4 font-semibold text-green-700">Location</th>
                  <th className="p-4 font-semibold text-green-700">Price</th>
                  <th className="p-4 font-semibold text-green-700">Seller</th>
                  <th className="p-4 font-semibold text-green-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p._id} className="border-b hover:bg-green-50 transition">
                    <td className="p-4 font-semibold text-green-900">{p.title}</td>
                    <td className="p-4 text-gray-700">{p.location}</td>
                    <td className="p-4 text-green-700">₹{p.price?.toLocaleString()}</td>
                    <td className="p-4 text-green-700">{p.seller?.username || p.seller?.email || 'N/A'}</td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id} className="bg-red-100 text-red-700 px-3 py-1 rounded font-semibold text-sm hover:bg-red-200 transition flex items-center gap-1">
                        {deleting === p._id ? <FaSpinner className="animate-spin" /> : <FaTrash />} Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="p-6 text-center text-gray-400">No plots found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
} 