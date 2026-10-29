import React, { useState, useEffect } from 'react';
import { 
  partnerApi, 
  getAuthToken, 
  getAuthUser, 
  removeAuthToken, 
  removeAuthUser 
} from './services/api';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import RoomsAllotment from './pages/RoomsAllotment';
import BookingsList from './pages/BookingsList';
import Settlements from './pages/Settlements';
import PropertyProfile from './pages/PropertyProfile';
import Login from './pages/Login';
import CheckInModal from './components/CheckInModal';
import AddRoomModal from './components/AddRoomModal';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data states
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [settlements, setSettlements] = useState([]);

  // Modals
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);

  // Initialize Auth
  useEffect(() => {
    const token = getAuthToken();
    const storedUser = getAuthUser();
    if (token && storedUser) {
      setUser(storedUser);
      loadAllData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // 1. Dashboard stats
      const dashRes = await partnerApi.getDashboard().catch(() => null);
      if (dashRes?.data) setDashboardStats(dashRes.data);

      // 2. Partner Hotels & Rooms
      const hotelsRes = await partnerApi.getHotels().catch(() => null);
      if (hotelsRes?.data && hotelsRes.data.length > 0) {
        const primaryHotel = hotelsRes.data[0];
        setHotel(primaryHotel);
        setRooms(primaryHotel.rooms || []);
      }

      // 3. Bookings
      const bookingsRes = await partnerApi.getBookings().catch(() => null);
      if (bookingsRes?.data) setBookings(bookingsRes.data);

      // 4. Settlements
      const settlementsRes = await partnerApi.getSettlements().catch(() => null);
      if (settlementsRes?.data) setSettlements(settlementsRes.data);
    } catch (err) {
      console.error('Failed to load partner data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    loadAllData();
  };

  const handleLogout = () => {
    removeAuthToken();
    removeAuthUser();
    setUser(null);
    setHotel(null);
    setRooms([]);
    setDashboardStats(null);
  };

  if (!user && !loading) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        user={user}
        hotel={hotel}
        onOpenCheckIn={() => setIsCheckInOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenCheckIn={() => setIsCheckInOpen(true)}
        />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
              <span className="text-xs font-semibold">Synchronizing with Hotels Central API...</span>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  stats={dashboardStats}
                  hotel={hotel}
                  onOpenCheckIn={() => setIsCheckInOpen(true)}
                  onNavigate={setActiveTab}
                />
              )}

              {activeTab === 'rooms' && (
                <RoomsAllotment
                  hotel={hotel}
                  rooms={rooms}
                  onRefresh={loadAllData}
                  onOpenAddRoom={() => setIsAddRoomOpen(true)}
                />
              )}

              {activeTab === 'bookings' && (
                <BookingsList
                  bookings={bookings}
                  hotel={hotel}
                  onOpenCheckIn={() => setIsCheckInOpen(true)}
                  onRefresh={loadAllData}
                />
              )}

              {activeTab === 'settlements' && (
                <Settlements
                  settlements={settlements}
                  hotel={hotel}
                />
              )}

              {activeTab === 'profile' && (
                <PropertyProfile
                  hotel={hotel}
                  onRefresh={loadAllData}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onCheckInSuccess={loadAllData}
      />

      <AddRoomModal
        isOpen={isAddRoomOpen}
        onClose={() => setIsAddRoomOpen(false)}
        hotelId={hotel?.id}
        onRoomAdded={loadAllData}
      />
    </div>
  );
}
