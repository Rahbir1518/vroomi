import { useUser, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Car, Calendar, DollarSign, Star, Leaf, Users, MapPin, Clock } from "lucide-react";
import logo from "../image/logo1.png";
import CarDetails from "./carDetails";
import { dbHelpers, setSupabaseSession, clearSupabaseSession, type Driver as DriverType, type Booking } from "./lib/supabase";

export default function Driver() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [driverData, setDriverData] = useState<DriverType | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCarId, setSelectedCarId] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Set up Supabase session when user changes
  useEffect(() => {
    const setupSupabaseSession = async () => {
      if (user) {
        try {
          // Get the Supabase JWT token from Clerk
          const token = await (user as any).getToken?.({ template: 'supabase' });
          if (token) {
            await setSupabaseSession(token);
            setAuthError('');
          } else {
            setAuthError('Unable to get authentication token');
          }
        } catch (error) {
          console.error('Error setting up Supabase session:', error);
          setAuthError('Authentication error. Please try signing out and back in.');
        }
      } else {
        // Clear session when user logs out
        await clearSupabaseSession();
      }
    };

    setupSupabaseSession();
  }, [user]);

  // Load driver data and bookings
  useEffect(() => {
    if (user?.id && !authError) {
      loadDriverData();
    }
  }, [user, authError]);

  const loadDriverData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      // Get or create driver profile
      let driver = await dbHelpers.getDriverByClerkId(user.id);
      
      if (!driver) {
        // Create driver profile if doesn't exist
        const newDriverData = {
          clerk_user_id: user.id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Driver',
          phone: user.phoneNumbers?.[0]?.phoneNumber || '',
          email: user.emailAddresses?.[0]?.emailAddress || '',
          rating: 5.0,
          is_active: true
        };
        driver = await dbHelpers.createDriver(newDriverData);
      }
      
      setDriverData(driver);
      
      // Load bookings for this driver
      if (driver.id) {
        const driverBookings = await dbHelpers.getBookingsByDriver(driver.id);
        setBookings(driverBookings);
      }
    } catch (error) {
      console.error('Error loading driver data:', error);
      setAuthError(`Failed to load driver data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats from bookings
  const stats = {
    monthlyEarnings: bookings
      .filter(booking => {
        const bookingDate = new Date(booking.created_at);
        const currentMonth = new Date();
        return bookingDate.getMonth() === currentMonth.getMonth() && 
               bookingDate.getFullYear() === currentMonth.getFullYear() &&
               booking.status === 'completed';
      })
      .reduce((total, booking) => total + ((booking as any).fare || 0), 0),
    
    totalRides: bookings.filter(booking => booking.status === 'completed').length,
    
    rating: driverData?.rating || 5.0,
    
    co2Saved: Math.round(bookings.filter(booking => booking.status === 'completed').length * 6.2) // Rough estimate
  };

  const handleCarSelect = (car: any) => {
    setSelectedCarId(car?.id || '');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading your dashboard...</span>
      </div>
    );
  }

  // Show authentication error if exists
  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{authError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="">
                <img
                  src={logo} 
                  alt="Vroomi" 
                  className="w-35 md:w-37 h-15 object-cover"
                />
              </Link>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                Driver Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                {user?.firstName || "Driver"}
              </span>
              <UserButton afterSignOutUrl="/login" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}! 🚗
          </h1>
          <p className="text-gray-600">
            Ready to share your ride and help fellow students save money while reducing campus emissions?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* Card 1 - Monthly Earnings */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">${stats.monthlyEarnings.toFixed(2)}</p>
                <p className="text-xs text-green-600">Cost savings earned</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Card 2 - Total Rides */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rides Shared</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRides}</p>
                <p className="text-xs text-blue-600">Happy passengers</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Card 3 - Rating */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Your Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rating.toFixed(1)}</p>
                <p className="text-xs text-yellow-600">
                  {'⭐'.repeat(Math.floor(stats.rating))}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Card 4 - CO2 Saved */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">CO₂ Saved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.co2Saved}</p>
                <p className="text-xs text-green-600">lbs this month</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div>
          <nav className="mb-6 border-b">
            <ul className="flex space-x-6">
              <li>
                <button
                  className={`pb-2 px-1 cursor-pointer transition-colors ${
                    activeTab === 'dashboard' 
                      ? 'border-b-2 border-blue-600 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  className={`pb-2 px-1 cursor-pointer transition-colors ${
                    activeTab === 'rides' 
                      ? 'border-b-2 border-blue-600 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('rides')}
                >
                  My Rides
                </button>
              </li>
              <li>
                <button
                  className={`pb-2 px-1 cursor-pointer transition-colors ${
                    activeTab === 'cars' 
                      ? 'border-b-2 border-blue-600 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('cars')}
                >
                  My Cars
                </button>
              </li>
            </ul>
          </nav>

          {/* Tab Content */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No rides yet. Start by adding your car details!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            booking.status === 'completed' ? 'bg-green-500' :
                            booking.status === 'accepted' ? 'bg-blue-500' :
                            booking.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {(booking as any).pickup_address || 'Unknown'} → {(booking as any).dropoff_address || 'Unknown'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date((booking as any).departure_time || booking.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${((booking as any).fare || 0).toFixed(2)}</p>
                          <p className="text-sm text-gray-600 capitalize">{booking.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'rides' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Rides</h3>
              {bookings.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No rides scheduled yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                            booking.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-red-100 text-red-700'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                          <span className="text-sm text-gray-600">
                            {new Date((booking as any).departure_time || booking.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${((booking as any).fare || 0).toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mt-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <MapPin className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">Pickup</span>
                          </div>
                          <p className="text-sm text-gray-600 ml-6">{(booking as any).pickup_address || 'Unknown location'}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <MapPin className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-gray-700">Drop-off</span>
                          </div>
                          <p className="text-sm text-gray-600 ml-6">{(booking as any).dropoff_address || 'Unknown location'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date((booking as any).departure_time || booking.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{((booking as any).passenger_count || 1)} passenger{((booking as any).passenger_count || 1) > 1 ? 's' : ''}</span>
                          </span>
                        </div>
                        
                        {booking.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                              Accept
                            </button>
                            <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'cars' && (
            <div className="space-y-6">
              {/* Car Management Section */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">My Cars</h3>
                  <button 
                    onClick={() => setSelectedCarId('new')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Car className="w-4 h-4" />
                    <span>Add Car</span>
                  </button>
                </div>
                
                {/* Car Details Component */}
                <CarDetails 
  onCarSelect={handleCarSelect}
  selectedCarId={selectedCarId}
/>

              </div>
              
              {/* Tips Section */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-blue-900 mb-3">💡 Driver Tips</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Keep your car clean and well-maintained for better ratings</li>
                  <li>• Arrive on time for pickups to maintain a high rating</li>
                  <li>• Be friendly and professional with passengers</li>
                  <li>• Update your availability regularly to get more ride requests</li>
                  <li>• Consider eco-friendly driving to maximize CO₂ savings</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
