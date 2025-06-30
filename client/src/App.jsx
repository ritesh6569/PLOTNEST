import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import PlotMarket from './pages/PlotMarket';
import WhyChooseUs from './pages/WhyChooseUs';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Register from './pages/admin/Register';
import UserRegister from './pages/UserRegister';
import UserLogin from './pages/UserLogin';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import BuyerDashboard from './pages/BuyerDashboard';
import SellerDashboard from './pages/SellerDashboard';
import BrowsePlots from './pages/BrowsePlots';
import PlotDetails from './pages/PlotDetails';
import BuyerInquiries from './pages/BuyerInquiries';
import ChooseRole from './pages/ChooseRole';
import AddPlot from './pages/seller/AddPlot';
import ManageListings from './pages/seller/ManageListings';
import PlotInquiries from './pages/seller/PlotInquiries';
import ManageUsers from './pages/admin/ManageUsers';
import ManagePlots from './pages/admin/ManagePlots';
import ManageInquiries from './pages/admin/ManageInquiries';
import DealerDashboard from './pages/dealer/DealerDashboard';
import DealerInquiries from './pages/dealer/DealerInquiries';
import DealerBrowsePlots from './pages/dealer/DealerBrowsePlots';
import DealerMatchmaking from './pages/dealer/DealerMatchmaking';
import ManageBookings from './pages/admin/ManageBookings';

function AppRoutes() {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/plots" element={<PlotMarket />} />
      <Route path="/why-choose-us" element={<WhyChooseUs />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
      <Route path="/seller/dashboard" element={<SellerDashboard />} />
      <Route path="/seller/add-plot" element={<AddPlot />} />
      <Route path="/seller/manage-listings" element={<ManageListings />} />
      <Route path="/seller/plot-inquiries/:id" element={<PlotInquiries />} />
      <Route path="/buyer/plots" element={<BrowsePlots />} />
      <Route path="/buyer/plots/:id" element={<PlotDetails />} />
      <Route path="/buyer/inquiries" element={<BuyerInquiries />} />
      <Route path="/choose-role" element={<ChooseRole />} />
      <Route path="/admin/users" element={<ManageUsers />} />
      <Route path="/admin/plots" element={<ManagePlots />} />
      <Route path="/admin/inquiries" element={<ManageInquiries />} />
      <Route path="/dealer/dashboard" element={<DealerDashboard />} />
      <Route path="/dealer/inquiries" element={<DealerInquiries />} />
      <Route path="/dealer/browse-plots" element={<DealerBrowsePlots />} />
      <Route path="/dealer/matchmaking" element={<DealerMatchmaking />} />
      <Route path="/admin/bookings" element={<ManageBookings />} />
    </Routes>
  );
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
} 