import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaEnvelope, FaSpinner, FaRedo } from 'react-icons/fa';
import axios from 'axios';

export default function ManageListings() {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('userToken');

  useEffect(() => {
    fetchPlots();
  }, []);

  const fetchPlots = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('http://localhost:5000/api/plots/seller/my-plots', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('ManageListings: Plots fetched:', response.data);
      setPlots(response.data);

    } catch (err) {
      console.error('ManageListings: Error fetching plots:', err);
      setError('Failed to load plots. Please try again.');
      setPlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPlots();
    setRefreshing(false);
  };

  const handleDelete = async (plotId) => {
    if (!window.confirm('Are you sure you want to delete this plot?')) return;
    
    setDeleting(plotId);
    try {
      await axios.delete(`http://localhost:5000/api/plots/seller/${plotId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove the plot from state
      setPlots(plots.filter(plot => plot._id !== plotId));
      
    } catch (err) {
      console.error('Error deleting plot:', err);
      alert('Failed to delete plot. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-2">
        <div className="text-2xl font-bold text-green-700 animate-pulse flex items-center gap-2">
          <FaSpinner className="animate-spin" />
          Loading your listings...
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-2">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/seller/dashboard')} className="text-green-700 hover:underline flex items-center gap-2 text-base font-medium">
            <FaArrowLeft /> Back to Dashboard
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

        <h2 className="text-3xl font-extrabold text-green-700 mb-6 text-center">Manage Your Listings</h2>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-700 font-semibold">{error}</div>
            <button 
              onClick={handleRefresh}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          {plots.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <FaEnvelope className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No plots listed yet.</p>
              <button 
                onClick={() => navigate('/seller/add-plot')}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition"
              >
                Add Your First Plot
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse rounded-xl overflow-hidden shadow">
              <thead>
                <tr className="bg-green-50">
                  <th className="p-4 font-semibold text-green-700">Title</th>
                  <th className="p-4 font-semibold text-green-700">Location</th>
                  <th className="p-4 font-semibold text-green-700">Price</th>
                  <th className="p-4 font-semibold text-green-700">Listed On</th>
                  <th className="p-4 font-semibold text-green-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plots.map(plot => {
                  const isNew = new Date(plot.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000);
                  return (
                    <tr key={plot._id} className="border-b hover:bg-green-50 transition">
                      <td className="p-4 font-semibold text-green-800">
                        <div className="flex items-center gap-2">
                          {plot.title}
                          {isNew && (
                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              NEW
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">{plot.location}</td>
                      <td className="p-4 text-green-700">₹{plot.price?.toLocaleString()}</td>
                      <td className="p-4 text-gray-600">
                        {new Date(plot.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 flex gap-2">
                        <button 
                          onClick={() => navigate(`/seller/edit-plot/${plot._id}`)}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded flex items-center gap-1 text-sm font-semibold hover:bg-blue-200"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(plot._id)}
                          disabled={deleting === plot._id}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded flex items-center gap-1 text-sm font-semibold hover:bg-red-200 disabled:opacity-50"
                        >
                          {deleting === plot._id ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <FaTrash />
                              Delete
                            </>
                          )}
                        </button>
                        <button 
                          onClick={() => navigate(`/seller/plot-inquiries/${plot._id}`)} 
                          className="bg-green-100 text-green-700 px-3 py-1 rounded flex items-center gap-1 text-sm font-semibold hover:bg-green-200"
                        >
                          <FaEnvelope /> Inquiries
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
} 