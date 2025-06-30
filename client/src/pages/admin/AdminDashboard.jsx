import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaHome, 
  FaEnvelope, 
  FaClipboardList, 
  FaUserShield, 
  FaUserTie, 
  FaUserCheck, 
  FaUserPlus,
  FaChartLine,
  FaEye,
  FaTrash,
  FaSignOutAlt,
  FaSearch,
  FaFilter,
  FaCalendar,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaPhone,
  FaGlobe,
  FaCheck,
  FaTimes,
  FaReply
} from 'react-icons/fa';
import DealProgressTracker from "../../components/DealProgressTracker";
import DealChat from '../../components/DealChat';

const dummyStats = {
  users: 42,
  plots: 18,
  inquiries: 7,
  bookings: 5,
};
const dummyRecentUsers = [
  { id: 1, name: 'Amit Sharma', role: 'buyer' },
  { id: 2, name: 'Priya Singh', role: 'seller' },
  { id: 3, name: 'Admin', role: 'admin' },
];
const dummyRecentPlots = [
  { id: 1, title: 'Sunshine Residency', location: 'Noida' },
  { id: 2, title: 'Green Valley', location: 'Lucknow' },
];

const stages = [
  "Inquiry",
  "Dealer Assigned",
  "Site Visit",
  "Negotiation",
  "Finalized"
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    buyers: 0,
    sellers: 0,
    dealers: 0,
    totalPlots: 0,
    totalInquiries: 0,
    totalBookings: 0,
    activeDeals: 0
  });
  
  const [users, setUsers] = useState({
    buyers: [],
    sellers: [],
    dealers: []
  });
  
  const [plots, setPlots] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editUserModal, setEditUserModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [plotDetailsModal, setPlotDetailsModal] = useState(false);
  const [plotDetails, setPlotDetails] = useState(null);
  const [respondInquiryModal, setRespondInquiryModal] = useState(false);
  const [respondInquiry, setRespondInquiry] = useState(null);
  const [respondMessage, setRespondMessage] = useState('');
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);
  
  const token = localStorage.getItem('adminToken');
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
        const [usersRes, plotsRes, inquiriesRes, bookingsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/users', { 
          headers: { Authorization: `Bearer ${token}` } 
        }),
        axios.get('http://localhost:5000/api/plots', { 
          headers: { Authorization: `Bearer ${token}` } 
        }),
        axios.get('http://localhost:5000/api/inquiries', { 
          headers: { Authorization: `Bearer ${token}` } 
        }),
        axios.get('http://localhost:5000/api/bookings', { 
          headers: { Authorization: `Bearer ${token}` } 
        })
      ]);

      const allUsers = usersRes.data;
      const buyers = allUsers.filter(user => user.role === 'buyer');
      const sellers = allUsers.filter(user => user.role === 'seller');
      const dealers = allUsers.filter(user => user.role === 'dealer');

      setUsers({ buyers, sellers, dealers });
      setPlots(plotsRes.data);
      setInquiries(inquiriesRes.data);
      setBookings(bookingsRes.data);

      setStats({
        totalUsers: allUsers.length,
        buyers: buyers.length,
        sellers: sellers.length,
        dealers: dealers.length,
        totalPlots: plotsRes.data.length,
        totalInquiries: inquiriesRes.data.length,
        totalBookings: bookingsRes.data.length,
        activeDeals: inquiriesRes.data.filter(inq => inq.status === 'active').length
      });

    } catch {
      // Set dummy data so dashboard still shows
        setStats({
        totalUsers: 0,
        buyers: 0,
        sellers: 0,
        dealers: 0,
        totalPlots: 0,
        totalInquiries: 0,
        totalBookings: 0,
        activeDeals: 0
      });
      setUsers({ buyers: [], sellers: [], dealers: [] });
      setPlots([]);
      setInquiries([]);
      setBookings([]);
      } finally {
        setLoading(false);
      }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userInfo');
    navigate('/admin/login');
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchAllData(); // Refresh data
      } catch {
        // Handle error
      }
    }
  };

  const filteredUsers = () => {
    let allUsers = [];
    if (filterRole === 'all' || filterRole === 'buyer') allUsers.push(...users.buyers);
    if (filterRole === 'all' || filterRole === 'seller') allUsers.push(...users.sellers);
    if (filterRole === 'all' || filterRole === 'dealer') allUsers.push(...users.dealers);
    
    return allUsers.filter(user => 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setEditUserModal(true);
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${editUser._id}`, editUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditUserModal(false);
      fetchAllData();
    } catch {
      alert('Failed to update user.');
    }
  };

  const deletePlot = async (plotId) => {
    if (!window.confirm('Are you sure you want to delete this plot?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/plots/${plotId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllData();
    } catch {
      alert('Failed to delete plot.');
    }
  };

  const handleViewPlotDetails = async (plotId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/plots/${plotId}`);
      setPlotDetails(res.data);
      setPlotDetailsModal(true);
    } catch {
      alert('Failed to fetch plot details.');
    }
  };

  const handleRespondInquiry = (inquiry) => {
    setRespondInquiry(inquiry);
    setRespondMessage('');
    setRespondInquiryModal(true);
  };

  const handleSendResponse = async (e) => {
    e.preventDefault();
    // Simulate response (replace with real API if available)
    alert(`Response sent: ${respondMessage}`);
    setRespondInquiryModal(false);
  };

  const deleteInquiry = async (inquiryId) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/inquiries/${inquiryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllData();
    } catch {
      alert('Failed to delete inquiry.');
    }
  };

  const confirmBooking = async (bookingId) => {
    setConfirmedBookings(prev => [...prev, bookingId]);
    setCancelledBookings(prev => prev.filter(id => id !== bookingId));
    alert('Booking confirmed! (Simulated notification)');
    // Replace with real API call if available
    // fetchAllData();
  };

  const cancelBooking = async (bookingId) => {
    setCancelledBookings(prev => [...prev, bookingId]);
    setConfirmedBookings(prev => prev.filter(id => id !== bookingId));
    alert('Booking cancelled! (Simulated notification)');
    // Replace with real API call if available
    // fetchAllData();
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-2xl font-bold text-blue-700 animate-pulse">Loading admin dashboard...</div>
      </section>
    );
      }

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-100/90 to-green-100/90 backdrop-blur-md py-4 shadow-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
          <FaUserShield className="text-3xl text-blue-700" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-blue-900">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-blue-800 font-semibold">Welcome, {admin?.username}</span>
            <button 
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white rounded-xl p-2 shadow-lg">
          {[
            { id: 'overview', label: 'Overview', icon: FaChartLine },
            { id: 'users', label: 'Users', icon: FaUsers },
            { id: 'plots', label: 'Plots', icon: FaHome },
            { id: 'inquiries', label: 'Inquiries', icon: FaEnvelope },
            { id: 'bookings', label: 'Bookings', icon: FaClipboardList }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-2xl p-6 shadow-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 font-semibold">Total Users</p>
                    <p className="text-3xl font-bold text-blue-800">{stats.totalUsers}</p>
                  </div>
                  <FaUsers className="text-4xl text-blue-400" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Buyers:</span>
                    <span className="font-semibold">{stats.buyers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Sellers:</span>
                    <span className="font-semibold">{stats.sellers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Dealers:</span>
                    <span className="font-semibold">{stats.dealers}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-6 shadow-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 font-semibold">Total Plots</p>
                    <p className="text-3xl font-bold text-green-800">{stats.totalPlots}</p>
                  </div>
                  <FaHome className="text-4xl text-green-400" />
                </div>
              </div>

              <div className="bg-yellow-50 rounded-2xl p-6 shadow-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 font-semibold">Inquiries</p>
                    <p className="text-3xl font-bold text-yellow-800">{stats.totalInquiries}</p>
                  </div>
                  <FaEnvelope className="text-4xl text-yellow-400" />
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-6 shadow-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 font-semibold">Bookings</p>
                    <p className="text-3xl font-bold text-purple-800">{stats.totalBookings}</p>
                  </div>
                  <FaClipboardList className="text-4xl text-purple-400" />
                </div>
              </div>
          </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUserPlus className="text-blue-600" />
                  Recent Users
                </h3>
                <div className="space-y-3">
                  {[...users.buyers, ...users.sellers, ...users.dealers]
                    .slice(-5)
                    .reverse()
                    .map(user => (
                      <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-800">{user.username}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'buyer' ? 'bg-blue-100 text-blue-700' :
                          user.role === 'seller' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaHome className="text-green-600" />
                  Recent Plots
                </h3>
                <div className="space-y-3">
                  {plots.slice(-5).reverse().map(plot => (
                    <div key={plot._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">{plot.title}</p>
                        <p className="text-sm text-gray-600">{plot.location}</p>
                      </div>
                      <span className="text-lg font-bold text-green-600">₹{plot.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="buyer">Buyers</option>
                  <option value="seller">Sellers</option>
                  <option value="dealer">Dealers</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">User</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Role</th>
                    <th className="text-left py-3 px-4 font-semibold">Joined</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers().map(user => (
                    <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            user.role === 'buyer' ? 'bg-blue-100' :
                            user.role === 'seller' ? 'bg-green-100' :
                            'bg-purple-100'
                          }`}>
                            <FaUsers className={
                              user.role === 'buyer' ? 'text-blue-600' :
                              user.role === 'seller' ? 'text-green-600' :
                              'text-purple-600'
                            } />
                          </div>
                          <span className="font-semibold">{user.username}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'buyer' ? 'bg-blue-100 text-blue-700' :
                          user.role === 'seller' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button onClick={() => viewUserDetails(user)} className="p-2 text-blue-600 hover:bg-blue-100 rounded"><FaEye /></button>
                          <button onClick={() => deleteUser(user._id)} className="p-2 text-red-600 hover:bg-red-100 rounded"><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Plots Tab */}
        {activeTab === 'plots' && (
          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">All Plots</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plots.map(plot => (
                <div key={plot._id} className="border rounded-xl p-4 hover:shadow-lg transition">
                  <h4 className="font-bold text-lg mb-2">{plot.title}</h4>
                  <p className="text-gray-600 mb-2 flex items-center gap-1">
                    <FaMapMarkerAlt className="text-red-500" />
                    {plot.location}
                  </p>
                  <p className="text-green-600 font-bold text-lg flex items-center gap-1">
                    <FaRupeeSign />
                    {plot.price}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">{plot.description}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewPlotDetails(plot._id)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                      View Details
          </button>
                    <button 
                      onClick={() => deletePlot(plot._id)}
                      className="px-3 py-2 text-red-600 hover:bg-red-100 rounded"
                    >
                      <FaTrash />
          </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">All Inquiries</h3>
            <div className="space-y-4">
              {inquiries.map(inquiry => (
                <div key={inquiry._id} className="border rounded-xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold">{inquiry.name}</h4>
                      <p className="text-gray-600 flex items-center gap-1">
                        <FaGlobe className="text-blue-500" />
                        {inquiry.email}
                      </p>
                      {inquiry.phone && (
                        <p className="text-gray-600 flex items-center gap-1">
                          <FaPhone className="text-green-500" />
                          {inquiry.phone}
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      inquiry.status === 'active' ? 'bg-green-100 text-green-700' :
                      inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{inquiry.message}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleRespondInquiry(inquiry)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                    >
                      <FaReply /> Respond
          </button>
                    <button 
                      onClick={() => deleteInquiry(inquiry._id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-100 rounded"
                    >
                      <FaTrash /> Delete
          </button>
        </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">All Bookings</h3>
            <div className="space-y-4">
              {bookings.map(booking => (
                <div key={booking._id} className="border rounded-xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold">{booking.customerName}</h4>
                      <p className="text-gray-600">{booking.plotTitle}</p>
                      <p className="text-gray-600 flex items-center gap-1">
                        <FaCalendar className="text-blue-500" />
                        {new Date(booking.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-green-600 font-bold flex items-center gap-1">
                      <FaRupeeSign />
                      {booking.amount}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => confirmBooking(booking._id)}
                      className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2 ${confirmedBookings.includes(booking._id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={confirmedBookings.includes(booking._id) || cancelledBookings.includes(booking._id)}
                    >
                      {confirmedBookings.includes(booking._id) ? <FaCheck /> : <FaCheck />} Confirm
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
              <button 
                className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700" 
                onClick={() => setShowUserModal(false)}
              >
                ×
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">User Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    selectedUser.role === 'buyer' ? 'bg-blue-100' :
                    selectedUser.role === 'seller' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    <FaUsers className={
                      selectedUser.role === 'buyer' ? 'text-blue-600 text-2xl' :
                      selectedUser.role === 'seller' ? 'text-green-600 text-2xl' :
                      'text-purple-600 text-2xl'
                    } />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedUser.username}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedUser.role === 'buyer' ? 'bg-blue-100 text-blue-700' :
                      selectedUser.role === 'seller' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {selectedUser.role}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Joined:</strong> {new Date(selectedUser.createdAt || Date.now()).toLocaleDateString()}</p>
                  {selectedUser.phone && <p><strong>Phone:</strong> {selectedUser.phone}</p>}
                  {selectedUser.address && <p><strong>Address:</strong> {selectedUser.address}</p>}
        </div>
                
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => {
                      deleteUser(selectedUser._id);
                      setShowUserModal(false);
                    }}
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plot Details Modal */}
        {plotDetailsModal && plotDetails && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
              <button className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700" onClick={() => setPlotDetailsModal(false)}>×</button>
              <h2 className="text-2xl font-bold text-blue-800 mb-4">Plot Details</h2>
              <img src={plotDetails.image && plotDetails.image.startsWith('/uploads/') ? `http://localhost:5000${plotDetails.image}` : (plotDetails.image || 'https://via.placeholder.com/600x400?text=No+Image')} alt={plotDetails.title} className="rounded-lg shadow w-full h-64 object-cover mb-4" />
              <div className="mb-2"><strong>Title:</strong> {plotDetails.title}</div>
              <div className="mb-2"><strong>Location:</strong> {plotDetails.location}</div>
              <div className="mb-2"><strong>Price:</strong> ₹{plotDetails.price?.toLocaleString()}</div>
              <div className="mb-2"><strong>Description:</strong> {plotDetails.description}</div>
              <div className="mb-2"><strong>Contact Info:</strong> {plotDetails.contactInfo}</div>
            </div>
          </div>
        )}

        {/* Respond Inquiry Modal */}
        {respondInquiryModal && respondInquiry && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
              <button className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700" onClick={() => setRespondInquiryModal(false)}>×</button>
              <h2 className="text-2xl font-bold text-blue-800 mb-6">Respond to Inquiry</h2>
              <div className="mb-2"><strong>Name:</strong> {respondInquiry.name}</div>
              <div className="mb-2"><strong>Email:</strong> {respondInquiry.email}</div>
              <div className="mb-2"><strong>Message:</strong> {respondInquiry.message}</div>
              <form onSubmit={handleSendResponse} className="space-y-4 mt-4">
                <textarea className="border p-2 rounded w-full" value={respondMessage} onChange={e => setRespondMessage(e.target.value)} placeholder="Type your response..." required />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">Send Response</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 