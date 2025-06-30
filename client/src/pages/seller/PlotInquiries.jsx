import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const dummyInquiries = [
  { id: 1, name: 'Amit Sharma', email: 'amit@example.com', message: 'Is this plot still available?', date: '2024-06-01' },
  { id: 2, name: 'Priya Singh', email: 'priya@example.com', message: 'Can I schedule a site visit?', date: '2024-06-02' },
];

export default function PlotInquiries() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-2">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <button onClick={() => navigate(-1)} className="self-start mb-4 text-green-700 hover:underline flex items-center gap-2"><FaArrowLeft /> Back</button>
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Inquiries for Plot #{id}</h2>
        <div className="w-full space-y-4">
          {dummyInquiries.map(inq => (
            <div key={inq.id} className="bg-green-50 rounded-lg p-4 shadow flex flex-col">
              <div className="font-bold text-green-800">{inq.name} <span className="text-xs text-gray-500">({inq.email})</span></div>
              <div className="text-gray-700 mb-2">{inq.message}</div>
              <div className="text-xs text-gray-500">{inq.date}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 