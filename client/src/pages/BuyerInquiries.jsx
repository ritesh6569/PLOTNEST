import React, { useEffect, useState } from 'react';
import { FaClipboardList, FaSearch, FaClock } from 'react-icons/fa';

const dummyInquiries = [
  { _id: '1', plot: 'Sunshine Residency', date: '2024-06-01', status: 'Pending', message: 'Is this plot available?' },
  { _id: '2', plot: 'Green Valley', date: '2024-06-02', status: 'Replied', message: 'Can I visit the site?' },
  { _id: '3', plot: 'Urban Heights', date: '2024-06-03', status: 'Pending', message: 'What is the final price?' },
];

export default function BuyerInquiries() {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('userToken');
    if (!token) {
      setInquiries(dummyInquiries);
      setLoading(false);
      return;
    }
    fetch('https://plotnest.onrender.com/api/inquiries', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setInquiries(data.filter(b => b.email === user?.email));
        } else {
          setInquiries(dummyInquiries);
        }
      })
      .catch(() => {
        setInquiries(dummyInquiries);
        setError('Failed to load real inquiries. Showing demo data.');
      })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-2">
      <div className="w-full max-w-3xl bg-white/90 rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-blue-100 backdrop-blur-md">
        <h2 className="text-2xl md:text-3xl font-extrabold text-blue-800 mb-8 drop-shadow flex items-center gap-2"><FaClipboardList className="text-blue-600" /> My Inquiries</h2>
        <div className="w-full mb-6 flex items-center bg-blue-50 rounded-xl px-4 py-2 shadow">
          <FaSearch className="text-blue-400 mr-2" />
          <input type="text" placeholder="Search by plot or message..." className="bg-transparent outline-none w-full text-lg" />
        </div>
        <div className="w-full overflow-x-auto">
          {/* Sample Inquiries always visible for demo */}
          <div className="mb-10 w-full">
            <h3 className="text-lg font-bold text-blue-700 mb-4">Sample Inquiries</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dummyInquiries.map(i => (
                <div key={i._id} className="bg-blue-50 rounded-xl p-4 shadow flex flex-col">
                  <div className="font-bold text-blue-900 mb-1">{i.plot}</div>
                  <div className="text-gray-700 mb-1">{i.message}</div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-blue-700 font-semibold">{i.status}</span>
                    <span className="text-gray-400 ml-auto">{i.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-12"><FaClock className="animate-spin text-2xl text-blue-600 mr-2" /> Loading inquiries...</div>
          ) : error && inquiries.length === 0 ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : (
            <table className="w-full text-left border-collapse rounded-xl overflow-hidden shadow">
              <thead>
                <tr className="bg-blue-50">
                  <th className="p-4 font-semibold text-blue-700">Plot</th>
                  <th className="p-4 font-semibold text-blue-700">Message</th>
                  <th className="p-4 font-semibold text-blue-700">Status</th>
                  <th className="p-4 font-semibold text-blue-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map(i => (
                  <tr key={i._id} className="border-b hover:bg-blue-50 transition">
                    <td className="p-4 font-semibold text-blue-900">{i.plot}</td>
                    <td className="p-4 text-gray-700">{i.message}</td>
                    <td className="p-4 text-blue-700 capitalize">{i.status}</td>
                    <td className="p-4 text-gray-500">{i.date ? new Date(i.date).toLocaleDateString() : ''}</td>
                  </tr>
                ))}
                {inquiries.length === 0 && (
                  <tr><td colSpan={4} className="p-6 text-center text-gray-400">No inquiries found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
} 