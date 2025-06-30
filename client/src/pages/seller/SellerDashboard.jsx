import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaPlus, FaClipboardList, FaEnvelope, FaEdit, FaTrash, FaSpinner, FaRedo } from 'react-icons/fa';
import axios from 'axios';
import DealChat from '../../components/DealChat';

export default function SellerDashboard() {
  const [plots, setPlots] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showDealModal, setShowDealModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  const token = localStorage.getItem('userToken');
  const user = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    fetchData();
  }, []);

  // Refresh data when coming from add-plot page
  useEffect(() => {
    const shouldRefresh = sessionStorage.getItem('refreshSellerDashboard');
    const urlRefresh = new URLSearchParams(location.search).get('refresh');
    
    if (shouldRefresh === 'true' || urlRefresh === 'true') {
      console.log('SellerDashboard: Refreshing data after plot addition');
      sessionStorage.removeItem('refreshSellerDashboard');
      setSuccess('New plot added successfully! 🎉');
      fetchData();
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess('');
      }, 5000);
      
      // Clean up URL parameter
      if (urlRefresh === 'true') {
        navigate('/seller/dashboard', { replace: true });
      }
    }
  }, [location.pathname, location.search]);

  // Also check for refresh flag on component mount
  useEffect(() => {
    const shouldRefresh = sessionStorage.getItem('refreshSellerDashboard');
    const urlRefresh = new URLSearchParams(location.search).get('refresh');
    
    if (shouldRefresh === 'true' || urlRefresh === 'true') {
      console.log('SellerDashboard: Component mount - refreshing data after plot addition');
      sessionStorage.removeItem('refreshSellerDashboard');
      setSuccess('New plot added successfully! 🎉');
      fetchData();
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess('');
      }, 5000);
      
      // Clean up URL parameter
      if (urlRefresh === 'true') {
        navigate('/seller/dashboard', { replace: true });
      }
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [plotsRes, inquiriesRes] = await Promise.all([
        axios.get('https://plotnest.onrender.com/api/plots/seller/my-plots', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://plotnest.onrender.com/api/inquiries/seller', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] })) // If inquiries endpoint doesn't exist, use empty array
      ]);

      console.log('SellerDashboard: Plots fetched:', plotsRes.data);
      console.log('SellerDashboard: Inquiries fetched:', inquiriesRes.data);

      setPlots(plotsRes.data);
      setInquiries(inquiriesRes.data);

    } catch (err) {
      console.error('SellerDashboard: Error fetching data:', err);
      setError('Failed to load dashboard data. Please try again.');
      // Set empty arrays as fallback
      setPlots([]);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleDeletePlot = async (plotId) => {
    if (!window.confirm('Are you sure you want to delete this plot?')) return;
    
    try {
      await axios.delete(`https://plotnest.onrender.com/api/plots/seller/${plotId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove the plot from state
      setPlots(plots.filter(plot => plot._id !== plotId));
      
    } catch (err) {
      console.error('Error deleting plot:', err);
      alert('Failed to delete plot. Please try again.');
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center py-12 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-2xl font-bold text-green-700 animate-pulse flex items-center gap-2">
          <FaSpinner className="animate-spin" />
          Loading your dashboard...
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-12 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-3xl font-extrabold text-green-700 mb-2 drop-shadow">
            Welcome, {user?.username || 'Seller'}!
          </h2>
          <div className="text-gray-500 text-center">
            Manage your plots and inquiries from your dashboard.
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-700 font-semibold">{error}</div>
            <button 
              onClick={handleRefresh}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="w-full mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-green-700 font-semibold">{success}</div>
          </div>
        )}

        {/* Debug Info (temporary) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="w-full mb-4 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs">
            <div className="text-gray-600">
              <strong>Debug Info:</strong> Plots: {plots.length} | 
              SessionStorage: {sessionStorage.getItem('refreshSellerDashboard')} | 
              URL Refresh: {new URLSearchParams(location.search).get('refresh')}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-8">
          <div className="bg-green-50 rounded-xl p-4 flex flex-col items-center shadow">
            <FaClipboardList className="text-2xl text-green-600 mb-1" />
            <div className="text-lg font-bold text-green-800">{plots.length}</div>
            <div className="text-gray-600 text-sm">Total Listings</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center shadow">
            <FaEnvelope className="text-2xl text-blue-600 mb-1" />
            <div className="text-lg font-bold text-blue-800">{inquiries.length}</div>
            <div className="text-gray-600 text-sm">Total Inquiries</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => navigate('/seller/add-plot')} 
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow hover:bg-green-700 transition"
          >
            <FaPlus /> Add New Plot
          </button>
          <button 
            onClick={() => navigate('/seller/manage-listings')} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow hover:bg-blue-700 transition"
          >
            <FaClipboardList /> Manage Listings
          </button>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow hover:bg-gray-700 transition disabled:opacity-50"
          >
            <FaRedo className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Recent Listings */}
        <div className="w-full">
          <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center justify-between">
            Recent Listings
            <span className="text-sm text-gray-500">({plots.length} plots)</span>
          </h3>
          
          {plots.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <FaClipboardList className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No plots listed yet.</p>
              <button 
                onClick={() => navigate('/seller/add-plot')}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition"
              >
                Add Your First Plot
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plots.slice(0, 6).map(plot => {
                const isNew = new Date(plot.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000);
                return (
                  <div key={plot._id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center border-t-4 border-green-400 relative">
                    {isNew && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        NEW
                      </div>
                    )}
                    <img 
                      src={plot.image && plot.image.startsWith('/uploads/') ? `https://plotnest.onrender.com${plot.image}` : (plot.image || 'https://via.placeholder.com/300x200?text=No+Image')} 
                      alt={plot.title} 
                      className="w-full h-32 object-cover rounded mb-3" 
                    />
                    <div className="font-bold text-green-800 text-lg mb-1">{plot.title}</div>
                    <div className="text-gray-600 text-sm mb-1">{plot.location}</div>
                    <div className="text-green-700 font-semibold mb-2">₹{plot.price?.toLocaleString()}</div>
                    <div className="flex gap-2 mb-2">
                      <button 
                        onClick={() => navigate(`/seller/edit-plot/${plot._id}`)}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded flex items-center gap-1 text-sm font-semibold hover:bg-blue-200"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button 
                        onClick={() => handleDeletePlot(plot._id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded flex items-center gap-1 text-sm font-semibold hover:bg-red-200"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                    <button 
                      onClick={() => navigate(`/seller/plot-inquiries/${plot._id}`)} 
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Inquiries (0)
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Deal Details Modal for Seller */}
        {showDealModal && selectedDeal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-green-700 mb-4">Deal Details</h3>
              <div className="space-y-2 mb-4">
                <p><strong>Plot:</strong> {selectedDeal.plot}</p>
                <p><strong>Status:</strong> {selectedDeal.status}</p>
                <p><strong>Date:</strong> {selectedDeal.date}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowDealModal(false)}
                  className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 