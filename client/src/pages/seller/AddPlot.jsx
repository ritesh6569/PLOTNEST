import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUpload, FaImage, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

export default function AddPlot() {
  const [form, setForm] = useState({ 
    title: '', 
    price: '', 
    location: '', 
    description: '', 
    contactInfo: '',
    image: null 
  });
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const token = localStorage.getItem('userToken');

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm(f => ({ ...f, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    setSuccess('');
    setError('');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setForm(f => ({ ...f, image: e.dataTransfer.files[0] }));
      setPreview(URL.createObjectURL(e.dataTransfer.files[0]));
    }
  };

  const handleImageClick = () => fileInputRef.current.click();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('price', form.price);
      formData.append('location', form.location);
      formData.append('description', form.description);
      formData.append('contactInfo', form.contactInfo);
      if (form.image) {
        formData.append('image', form.image);
      }

      const response = await axios.post('https://plotnest.onrender.com/api/plots/seller', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Plot listed successfully! Redirecting to dashboard...');
      
      // Set flag to refresh dashboard
      sessionStorage.setItem('refreshSellerDashboard', 'true');
      
      // Reset form
      setForm({ title: '', price: '', location: '', description: '', contactInfo: '', image: null });
      setPreview(null);
      
      // Redirect to dashboard after 1 second (reduced from 2 seconds)
      setTimeout(() => {
        navigate('/seller/dashboard?refresh=true');
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add plot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-white py-12 px-2">
      <div className="w-full max-w-lg bg-white/90 rounded-3xl shadow-2xl border border-green-100 p-8 flex flex-col items-center backdrop-blur-md">
        <button onClick={() => navigate('/seller/dashboard')} className="self-start mb-4 text-green-700 hover:underline flex items-center gap-2 text-base font-medium"><FaArrowLeft /> Back to Dashboard</button>
        <div className="flex flex-col items-center mb-2">
          <span className="bg-green-100 p-3 rounded-full mb-2 shadow"><FaImage className="text-3xl text-green-600" /></span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-green-700 mb-2 text-center drop-shadow">Add New Plot</h2>
        </div>
        <form onSubmit={handleSubmit} className="w-full space-y-5 mt-2">
          <input 
            name="title" 
            className="border border-green-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-400 text-lg transition" 
            placeholder="Plot Title" 
            value={form.title} 
            onChange={handleChange} 
            required 
          />
          <input 
            name="price" 
            type="number" 
            className="border border-green-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-400 text-lg transition" 
            placeholder="Price (INR)" 
            value={form.price} 
            onChange={handleChange} 
            required 
          />
          <input 
            name="location" 
            className="border border-green-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-400 text-lg transition" 
            placeholder="Location" 
            value={form.location} 
            onChange={handleChange} 
            required 
          />
          <textarea 
            name="description" 
            className="border border-green-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-400 text-lg transition" 
            placeholder="Description" 
            value={form.description} 
            onChange={handleChange} 
            rows={3} 
            required 
          />
          <input 
            name="contactInfo" 
            className="border border-green-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-400 text-lg transition" 
            placeholder="Contact Information (Phone/Email)" 
            value={form.contactInfo} 
            onChange={handleChange} 
            required 
          />
          <div className="w-full">
            <label className="block mb-1 font-semibold text-green-700">Image (Optional)</label>
            <div
              className={`w-full h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition ${dragActive ? 'border-green-500 bg-green-50' : 'border-green-200 bg-green-50/50'} hover:border-green-400`}
              onClick={handleImageClick}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="rounded-xl shadow w-full h-36 object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-green-600">
                  <FaUpload className="text-3xl mb-2" />
                  <span className="font-medium">Drag & drop or click to upload</span>
                  <span className="text-xs text-gray-400">(JPG, PNG, max 5MB)</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                name="image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition text-lg shadow flex items-center justify-center gap-2 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Adding Plot...
              </>
            ) : (
              <>
                <FaUpload />
                List Plot
              </>
            )}
          </button>
        </form>
        {success && (
          <div className="text-green-600 font-semibold mt-4 text-center w-full animate-fade-in bg-green-50 p-3 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="text-red-600 font-semibold mt-4 text-center w-full animate-fade-in bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </section>
  );
} 