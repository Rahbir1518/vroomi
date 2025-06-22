import { useUser, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../image/logo1.png";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Car {
  id: string;
  user_id: string;
  username?: string;
  make: string;
  model: string;
  year: number;
  license: string;
  seats: number;
}

interface Ride {
  id: string;
  date: string;
  time: string;
  from: string;
  to: string;
  passengers: number;
  maxPassengers: number;
  price: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  distance: string;
  duration: string;
  passengerNames: string[];
  earnings: number;
  rating?: number;
}

export default function Driver() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rides' | 'edit'>('dashboard');
  const [cars, setCars] = useState<Car[]>([]);
  const [rideView, setRideView] = useState<'upcoming' | 'completed'>('upcoming');

  // Mock rides data
  const [rides] = useState<Ride[]>([
    {
      id: '1',
      date: '2025-06-23',
      time: '08:30 AM',
      from: 'Downtown Campus',
      to: 'North Campus Library',
      passengers: 3,
      maxPassengers: 4,
      price: 8,
      status: 'upcoming',
      distance: '4.2 miles',
      duration: '15 min',
      passengerNames: ['Sarah Chen', 'Mike Johnson', 'Emma Davis'],
      earnings: 24
    },
    {
      id: '2',
      date: '2025-06-21',
      time: '05:45 PM',
      from: 'Engineering Building',
      to: 'Metro Station',
      passengers: 2,
      maxPassengers: 4,
      price: 6,
      status: 'completed',
      rating: 5,
      distance: '2.8 miles',
      duration: '12 min',
      passengerNames: ['David Park', 'Lisa Wong'],
      earnings: 12
    },
    {
      id: '3',
      date: '2025-06-21',
      time: '02:15 PM',
      from: 'Student Center',
      to: 'Off-Campus Housing',
      passengers: 4,
      maxPassengers: 4,
      price: 10,
      status: 'completed',
      rating: 4.8,
      distance: '6.1 miles',
      duration: '22 min',
      passengerNames: ['Ryan Miller', 'Jessica Kim', 'Tom Wilson', 'Amy Zhang'],
      earnings: 40
    },
    {
      id: '4',
      date: '2025-06-20',
      time: '11:00 AM',
      from: 'Main Library',
      to: 'Sports Complex',
      passengers: 1,
      maxPassengers: 4,
      price: 4,
      status: 'completed',
      rating: 5,
      distance: '1.5 miles',
      duration: '8 min',
      passengerNames: ['Alex Rodriguez'],
      earnings: 4
    },
    {
      id: '5',
      date: '2025-06-23',
      time: '07:00 AM',
      from: 'Parking Lot C',
      to: 'Medical Center',
      passengers: 2,
      maxPassengers: 4,
      price: 7,
      status: 'upcoming',
      distance: '3.4 miles',
      duration: '18 min',
      passengerNames: ['Maria Garcia', 'John Smith'],
      earnings: 14
    }
  ]);

  const upcomingRides = rides.filter(ride => ride.status === 'upcoming');
  const completedRides = rides.filter(ride => ride.status === 'completed');

  useEffect(() => {
    const syncUsernames = async () => {
      if (!user?.id) return;

      const usernameToWrite =
        user.username
        || user.fullName
        || user.primaryEmailAddress?.emailAddress
        || 'Unknown';

      const { error } = await supabase
        .from("cars")
        .update({ username: usernameToWrite })
        .eq("user_id", user.id);

      if (error) console.error("🔴 Failed to sync cars.username:", error);
      else        console.log("✅ Synced cars.username for user", user.id);
    };

    syncUsernames();
  }, [user]);

  useEffect(() => {
    const fetchCars = async () => {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching cars:", error);
      } else {
        setCars(data as Car[]);
      }
    };

    fetchCars();
  }, [user]);

  const handleInputChange = (
    index: number,
    field: keyof Car,
    value: string | number
  ) => {
    const updatedCars = [...cars];
    updatedCars[index][field] = value as never;
    setCars(updatedCars);
  };

  const handleUpdate = async (index: number) => {
    const car = cars[index];

    const usernameToWrite =
      user?.username
      || user?.fullName
      || user?.primaryEmailAddress?.emailAddress
      || 'Unknown';

    const { error } = await supabase
      .from("cars")
      .update({
        make:     car.make,
        model:    car.model,
        year:     car.year,
        license:  car.license,
        seats:    car.seats,
        username: usernameToWrite,  
      })
      .eq("id", car.id);

    if (error) {
      alert("Failed to update car.");
      console.error(error);
    } else {
      alert("Car updated successfully.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/">
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
          {/* Card 1 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">$127</p>
                <p className="text-xs text-green-600">Cost savings earned</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rides Shared</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
                <p className="text-xs text-blue-600">Happy passengers</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Your Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.9</p>
                <p className="text-xs text-yellow-600">⭐⭐⭐⭐⭐</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">CO₂ Saved</p>
                <p className="text-2xl font-bold text-gray-900">142</p>
                <p className="text-xs text-green-600">lbs this month</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l-2 2m0 0l2 2m-2-2h13M13 5h6M13 5v4m0-4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Section */}
        <div>
          <nav className="mb-4 border-b">
            <ul className="flex space-x-6">
              <li>
                <button
                  className={`pb-2 cursor-pointer ${activeTab === 'dashboard' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  className={`pb-2 cursor-pointer ${activeTab === 'rides' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('rides')}
                >
                  My Rides
                </button>
              </li>
              <li>
                <button
                  className={`pb-2 cursor-pointer ${activeTab === 'edit' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('edit')}
                >
                  Edit
                </button>
              </li>
            </ul>
          </nav>

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Recent Activity Section */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {rides.slice(0, 3).map((ride) => (
                    <div key={ride.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          ride.status === 'completed' ? 'bg-green-500' : 
                          ride.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-400'
                        }`}></div>
                        <div>
                          <p className="font-medium text-gray-900">{ride.from} → {ride.to}</p>
                          <p className="text-sm text-gray-500">{ride.date} at {ride.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">${ride.earnings}</p>
                        <p className="text-xs text-gray-500 capitalize">{ride.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Weekly Performance */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week's Performance</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Rides Completed</span>
                      <span className="font-semibold">8</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Earnings</span>
                      <span className="font-semibold text-green-600">$96</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Rating</span>
                      <span className="font-semibold">4.9 ⭐</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Distance Covered</span>
                      <span className="font-semibold">47.2 miles</span>
                    </div>
                  </div>
                </div>

                {/* Upcoming Schedule */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Schedule</h3>
                  <div className="space-y-3">
                    {upcomingRides.slice(0, 3).map((ride) => (
                      <div key={ride.id} className="flex items-center space-x-3 p-2 border-l-4 border-blue-500 bg-blue-50 rounded">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{ride.from}</p>
                          <p className="text-xs text-gray-500">{ride.date} • {ride.time}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-blue-600">{ride.passengers}/{ride.maxPassengers}</p>
                          <p className="text-xs text-gray-500">passengers</p>
                        </div>
                      </div>
                    ))}
                    {upcomingRides.length === 0 && (
                      <p className="text-gray-500 text-sm italic">No upcoming rides scheduled</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Monthly Progress */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Progress</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Earnings Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Earnings Goal</span>
                      <span className="text-sm font-medium">$127 / $200</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '63.5%'}}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">63.5% of monthly goal</p>
                  </div>

                  {/* Rides Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Rides Goal</span>
                      <span className="text-sm font-medium">23 / 30</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '76.7%'}}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">76.7% of monthly goal</p>
                  </div>

                  {/* Environmental Impact */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">CO₂ Reduction</span>
                      <span className="text-sm font-medium">142 / 200 lbs</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '71%'}}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">71% of monthly goal</p>
                  </div>
                </div>
              </div>


              {/* Driver Tips */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">💡 Driver Tip of the Day</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Keep your car clean and well-maintained to maintain high ratings. Passengers appreciate a comfortable, 
                      clean ride environment. Consider offering phone chargers or water bottles for longer trips!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rides' && (
            <div className="space-y-6">
              {/* Rides Filter Tabs */}
              <div className="flex space-x-4 border-b pb-4">
                <button
                  className={`px-4 py-2 rounded-lg font-medium ${
                    rideView === 'upcoming' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setRideView('upcoming')}
                >
                  Upcoming Rides ({upcomingRides.length})
                </button>
                <button
                  className={`px-4 py-2 rounded-lg font-medium ${
                    rideView === 'completed' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setRideView('completed')}
                >
                  Completed Rides ({completedRides.length})
                </button>
              </div>

              {/* Upcoming Rides */}
              {rideView === 'upcoming' && (
                <div className="space-y-4">
                  {upcomingRides.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4M8 7H3a1 1 0 00-1 1v10a1 1 0 001 1h18a1 1 0 001-1V8a1 1 0 00-1-1h-5M8 7h8" />
                      </svg>
                      <p>No upcoming rides scheduled</p>
                    </div>
                  ) : (
                    upcomingRides.map((ride) => (
                      <div key={ride.id} className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                {ride.status.toUpperCase()}
                              </span>
                              <span className="text-sm text-gray-500">{ride.date} at {ride.time}</span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="font-medium">{ride.from}</span>
                              </div>
                              <div className="ml-1.5 border-l-2 border-gray-200 h-4"></div>
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span className="font-medium">{ride.to}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">${ride.earnings}</div>
                            <div className="text-sm text-gray-500">Total earnings</div>
                            <div className="text-sm text-gray-500 mt-1">
                              {ride.distance} • {ride.duration}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span className="text-sm text-gray-600">
                                {ride.passengers}/{ride.maxPassengers} passengers
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              ${ride.price} per person
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                              Edit
                            </button>
                            <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200">
                              Cancel
                            </button>
                          </div>
                        </div>
                        
                        {ride.passengerNames.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm font-medium text-gray-700 mb-2">Passengers:</p>
                            <div className="flex flex-wrap gap-2">
                              {ride.passengerNames.map((name, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  {name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Completed Rides */}
              {rideView === 'completed' && (
                <div className="space-y-4">
                  {completedRides.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p>No completed rides yet</p>
                    </div>
                  ) : (
                    completedRides.map((ride) => (
                      <div key={ride.id} className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                COMPLETED
                              </span>
                              <span className="text-sm text-gray-500">{ride.date} at {ride.time}</span>
                              {ride.rating && (
                                <div className="flex items-center space-x-1">
                                  {renderStars(Math.floor(ride.rating))}
                                  <span className="text-sm text-gray-600 ml-1">{ride.rating}</span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="font-medium">{ride.from}</span>
                              </div>
                              <div className="ml-1.5 border-l-2 border-gray-200 h-4"></div>
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span className="font-medium">{ride.to}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">${ride.earnings}</div>
                            <div className="text-sm text-gray-500">Earned</div>
                            <div className="text-sm text-gray-500 mt-1">
                              {ride.distance} • {ride.duration}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span className="text-sm text-gray-600">
                                {ride.passengers}/{ride.maxPassengers} passengers
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              ${ride.price} per person
                            </div>
                          </div>
                        </div>
                        
                        {ride.passengerNames.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm font-medium text-gray-700 mb-2">Passengers:</p>
                            <div className="flex flex-wrap gap-2">
                              {ride.passengerNames.map((name, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  {name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'edit' && (
            <div className="space-y-6">
              {cars.map((car, index) => (
                <div key={car.id} className="bg-white p-4 shadow-sm rounded-lg border space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      className="border p-2 rounded"
                      placeholder="Make"
                      value={car.make || ''}
                      onChange={(e) => handleInputChange(index, 'make', e.target.value)}
                    />
                    <input
                      className="border p-2 rounded"
                      placeholder="Model"
                      value={car.model || ''}
                      onChange={(e) => handleInputChange(index, 'model', e.target.value)}
                    />
                    <input
                      className="border p-2 rounded"
                      placeholder="Year"
                      type="number"
                      value={car.year || ''}
                      onChange={(e) => handleInputChange(index, 'year', parseInt(e.target.value) || 0)}
                    />
                    <input
                      className="border p-2 rounded"
                      placeholder="License"
                      value={car.license || ''}
                      onChange={(e) => handleInputChange(index, 'license', e.target.value)}
                    />
                    <input
                      className="border p-2 rounded"
                      placeholder="Seats"
                      type="number"
                      value={car.seats || ''}
                      onChange={(e) => handleInputChange(index, 'seats', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      className="group relative px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                   onClick={() => handleUpdate(index)}
                    >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-200"></div>
                     </button>
                    <button
                       className="group relative p-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:from-rose-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
                        onClick={() => handleDelete(index)}
                      title="Delete car"
                    >
                      <svg 
                        className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H9a1 1 0 00-1 1v3M4 7h16" 
                        />
                      </svg>
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-200"></div>
                              </button>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}