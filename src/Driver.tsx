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
  username?: string;   // ← new
  make: string;
  model: string;
  year: number;
  license: string;
  seats: number;
}

export default function Driver() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rides' | 'edit'>('dashboard');
  const [cars, setCars] = useState<Car[]>([]);

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

  const handleDelete = async (index: number) => {
    const car = cars[index];

    const { error } = await supabase
      .from("cars")
      .delete()
      .eq("id", car.id);
    
    if (error) {
      alert("Failed to delete the car.");
      console.error(error);
    } else {
      alert("Car deleted successfully.");
      setCars(cars.filter((_, i) => i !== index));
    }
  }

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674�" />
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l-2 2m0 0l2 2m-2-2h13M13 5h6M13 5v4m0-4�" />
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
            <div>
              <p className="text-gray-700">This is the main dashboard view. Add charts or recent activity here.</p>
            </div>
          )}

          {activeTab === 'rides' && (
            <div>
              <p className="text-gray-700">Here you can list your past rides or upcoming ride schedules.</p>
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
                  <div className="flex items-center gap-4">
                    <button
                      className="mt-2 px-4 mr-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 hover:cursor-pointer"
                      onClick={() => handleUpdate(index)}
                    >
                      Save Changes
                    </button>
                    <button
                      className="mt-2 p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200 flex items-center justify-center hover:cursor-pointer"
                      onClick={() => handleDelete(index)}
                      title="Delete car"
                    >
                      <svg 
                        className="w-5 h-5" 
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
