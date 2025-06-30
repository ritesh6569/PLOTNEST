import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserTie, FaUserShield, FaUserCog } from 'react-icons/fa';

const roles = [
  {
    key: 'buyer',
    label: 'Buyer',
    icon: <FaUser className="text-4xl text-blue-600 mb-2" />,
    desc: 'Browse and book plots, save favorites, and manage your inquiries.'
  },
  {
    key: 'seller',
    label: 'Seller',
    icon: <FaUserTie className="text-4xl text-green-600 mb-2" />,
    desc: 'List your plots, manage your listings, and respond to inquiries.'
  },
  {
    key: 'dealer',
    label: 'Dealer',
    icon: <FaUserShield className="text-4xl text-yellow-600 mb-2" />,
    desc: 'Connect buyers and sellers, manage deals, and view all plots.'
  },
  {
    key: 'admin',
    label: 'Admin',
    icon: <FaUserCog className="text-4xl text-purple-600 mb-2" />,
    desc: 'Platform management, user and plot approvals, analytics.'
  }
];

export default function ChooseRole() {
  const navigate = useNavigate();
  
  const handleRoleSelect = (roleKey) => {
    if (roleKey === 'admin') {
      navigate('/admin/login');
    } else {
      navigate(`/user/login?role=${roleKey}`);
    }
  };
  
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 py-12 px-2">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Choose Your Role</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {roles.map(role => (
            <button
              key={role.key}
              onClick={() => handleRoleSelect(role.key)}
              className="bg-gradient-to-br from-blue-100 to-green-100 hover:from-blue-200 hover:to-green-200 transition rounded-xl shadow p-6 flex flex-col items-center border-2 border-transparent hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {role.icon}
              <span className="text-xl font-bold mb-1 text-blue-900">{role.label}</span>
              <span className="text-gray-600 text-center">{role.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
} 