import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaEnvelope, FaTrash, FaSpinner } from 'react-icons/fa';

export default function ManageInquiries() {
  const [search, setSearch] = useState('');
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    setLoading(true);
    setError('');
    axios.get('http://localhost:5000/api/inquiries', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setInquiries(res.data))
      .catch(() => setError('Failed to fetch inquiries.'))
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = inquiries.filter(i =>
    i.name?.toLowerCase().includes(search.toLowerCase()) ||
    i.email?.toLowerCase().includes(search.toLowerCase()) ||
    i.message?.toLowerCase().includes(search.toLowerCase()) ||
    i.plotTitle?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    setDeleting(id);
    try {
      await axios.delete(`http://localhost:5000/api/inquiries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(inquiries.filter(i => i._id !== id));
    } catch {
      alert('Failed to delete inquiry.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-blue-50 py-12 px-2">
      <div className="w-full max-w-5xl bg-white/90 rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-yellow-100 backdrop-blur-md">
        <h2 className="text-2xl md:text-3xl font-extrabold text-yellow-700 mb-8 drop-shadow flex items-center gap-2"><FaEnvelope className="text-yellow-500" /> Manage Inquiries</h2>
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex-1 flex items-center bg-yellow-50 rounded-xl px-4 py-2 shadow">
            <FaSearch className="text-yellow-400 mr-2" />
            <input
              type="text"
              placeholder="Search by name, email, message, or plot..."
              className="bg-transparent outline-none w-full text-lg"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12"><FaSpinner className="animate-spin text-2xl text-yellow-600 mr-2" /> Loading inquiries...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : (
            <table className="w-full text-left border-collapse rounded-xl overflow-hidden shadow">
              <thead>
                <tr className="bg-yellow-50">
                  <th className="p-4 font-semibold text-yellow-700">Name</th>
                  <th className="p-4 font-semibold text-yellow-700">Email</th>
                  <th className="p-4 font-semibold text-yellow-700">Message</th>
                  <th className="p-4 font-semibold text-yellow-700">Plot</th>
                  <th className="p-4 font-semibold text-yellow-700">Date</th>
                  <th className="p-4 font-semibold text-yellow-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(i => (
                  <tr key={i._id} className="border-b hover:bg-yellow-50 transition">
                    <td className="p-4 font-semibold text-yellow-900">{i.name}</td>
                    <td className="p-4 text-gray-700">{i.email}</td>
                    <td className="p-4 text-yellow-700 max-w-xs truncate" title={i.message}>{i.message}</td>
                    <td className="p-4 text-yellow-700">{i.plotTitle || i.plot || 'N/A'}</td>
                    <td className="p-4 text-yellow-700">{i.date ? new Date(i.date).toLocaleDateString() : ''}</td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => handleDelete(i._id)} disabled={deleting === i._id} className="bg-red-100 text-red-700 px-3 py-1 rounded font-semibold text-sm hover:bg-red-200 transition flex items-center gap-1">
                        {deleting === i._id ? <FaSpinner className="animate-spin" /> : <FaTrash />} Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="p-6 text-center text-gray-400">No inquiries found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
} 