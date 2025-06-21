import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { Car, MapPin, Clock, DollarSign, Users, Search, CheckCircle, AlertCircle, Star, Phone, MessageCircle, Navigation } from "lucide-react";
import L from "leaflet";
import { createClient } from '@supabase/supabase-js';

// Supabase client setup
const supabaseUrl = 'https://vgifmkixezmzxjraprjn.supabase.co';
const supabaseAnonKey = 'pk_test_cGxlYXNpbmctYmVldGxlLTU5LmNsZXJrLmFjY291bnRzLmRldiQ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fix Leaflet default markers
const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  home_address: string;
  car_make: string;
  car_model: string;
  car_year: number;
  license_plate: string;
  available_seats: number;
  departure_time: string;
  price_per_seat: number;
  rating: number;
  total_trips: number;
  latitude: number;
  longitude: number;
}

interface Booking {
  id?: string;
  rider_clerk_id: string;
  rider_home_address: string;
  rider_latitude: number;
  rider_longitude: number;
  driver_id: string;
  seats_booked: number;
  total_cost: number;
  departure_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export default function VroomiRider() {
  const [departureTime, setDepartureTime] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [passengerCount, setPassengerCount] = useState(1);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [matchedDriver, setMatchedDriver] = useState<Driver | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState<'search' | 'matched' | 'booked'>('search');
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  // Mock user ID - replace with actual Clerk auth
  const currentUserId = "user_current_rider";
  const yorkCoords: [number, number] = [43.7735, -79.5019];

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const findDriverMatch = async (riderLat: number, riderLon: number, departureTime: string) => {
    try {
      const { data, error } = await supabase.rpc('find_driver_match', {
        rider_lat: riderLat,
        rider_lon: riderLon,
        departure_time: departureTime
      });

      if (error) {
        console.error('Error finding driver match:', error);
        return null;
      }

      return data && data.length > 0 ? data[0] : null;
    } catch (err) {
      console.error('Error calling find_driver_match:', err);
      return null;
    }
  };

  const handleMatch = async () => {
    if (!homeAddress.trim()) {
      setError("Please enter your home address");
      return;
    }

    if (!departureTime) {
      setError("Please select a departure time");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Geocode address
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(homeAddress + ", Toronto, Ontario")}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setCoordinates([lat, lon]);

        // Find driver match using Supabase function
        const driver = await findDriverMatch(lat, lon, departureTime);

        if (driver) {
          setMatchedDriver(driver);
          
          const calculatedDistance = calculateDistance(lat, lon, yorkCoords[0], yorkCoords[1]);
          const totalCost = driver.price_per_seat * passengerCount;
          
          setDistance(calculatedDistance);
          setEstimatedCost(totalCost);
          setShowSuccess(true);
          setStep('matched');
        } else {
          setError("No drivers found for your departure time and location. Try adjusting your time or check back later.");
        }
      } else {
        setError("Could not find your address. Please try a more specific address in the Toronto area.");
      }
    } catch (err) {
      console.error('Error in handleMatch:', err);
      setError("Failed to find location. Please check your internet connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!matchedDriver || !coordinates || !estimatedCost) {
      setError("Missing booking information");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const bookingData: Omit<Booking, 'id'> = {
        rider_clerk_id: currentUserId,
        rider_home_address: homeAddress,
        rider_latitude: coordinates[0],
        rider_longitude: coordinates[1],
        driver_id: matchedDriver.id,
        seats_booked: passengerCount,
        total_cost: estimatedCost,
        departure_time: departureTime,
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) {
        console.error('Booking error:', error);
        setError("Failed to create booking. Please try again.");
        return;
      }

      // Update driver's available seats
      const { error: updateError } = await supabase
        .from('drivers')
        .update({ 
          available_seats: matchedDriver.available_seats - passengerCount 
        })
        .eq('id', matchedDriver.id);

      if (updateError) {
        console.error('Error updating driver seats:', updateError);
      }

      setCurrentBooking(data);
      setStep('booked');
      setShowSuccess(true);
    } catch (err) {
      console.error('Error creating booking:', err);
      setError("Failed to create booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCoordinates(null);
    setMatchedDriver(null);
    setEstimatedCost(null);
    setDistance(null);
    setCurrentBooking(null);
    setError("");
    setShowSuccess(false);
    setStep('search');
    setHomeAddress("");
    setDepartureTime("");
    setPassengerCount(1);
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = Math.ceil(now.getMinutes() / 15) * 15;
    const roundedMinutes = (minutes === 60 ? 0 : minutes).toString().padStart(2, '0');
    const adjustedHours = minutes === 60 ? (now.getHours() + 1).toString().padStart(2, '0') : hours;
    return `${adjustedHours}:${roundedMinutes}`;
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        {/* Success Notification */}
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 animate-bounce">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">
                {step === 'matched' ? 'Perfect match found!' : 'Booking confirmed!'}
              </span>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
              <Car className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Vroomi
            </h1>
            <p className="text-xl text-gray-600">Connect with peers for affordable rides to York University</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center space-x-3">
                  <Search className="w-6 h-6" />
                  <h3 className="text-2xl font-bold">
                    {step === 'search' ? 'Find Your Ride' : step === 'matched' ? 'Driver Match' : 'Booking Confirmed'}
                  </h3>
                </div>
              </div>

              <div className="p-8">
                {step === 'search' ? (
                  <div className="space-y-6">
                    {/* Home Address */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Home Address
                      </label>
                      <input
                        type="text"
                        value={homeAddress}
                        onChange={(e) => setHomeAddress(e.target.value)}
                        placeholder="123 Main St, Toronto, ON"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      />
                    </div>

                    {/* Departure Time */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Departure Time
                      </label>
                      <input
                        type="time"
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
                        min={getCurrentTime()}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      />
                    </div>

                    {/* Passenger Count */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Users className="w-4 h-4 inline mr-2" />
                        Number of Passengers
                      </label>
                      <select
                        value={passengerCount}
                        onChange={(e) => setPassengerCount(parseInt(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      >
                        <option value={1}>1 passenger</option>
                        <option value={2}>2 passengers</option>
                        <option value={3}>3 passengers</option>
                        <option value={4}>4 passengers</option>
                      </select>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 mr-2" />
                          <span>{error}</span>
                        </div>
                      </div>
                    )}

                    {/* Search Button */}
                    <button
                      onClick={handleMatch}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Finding your perfect match...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Search className="w-5 h-5 mr-2" />
                          Find Ride
                        </div>
                      )}
                    </button>
                  </div>
                ) : step === 'matched' ? (
                  /* Driver Match Results */
                  <div className="space-y-6">
                    <div className="text-center">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Match Found!</h3>
                      <p className="text-gray-600">Here's your driver for today</p>
                    </div>

                    {matchedDriver && (
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border-2 border-green-200">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            {matchedDriver.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-800">{matchedDriver.name}</h4>
                            <p className="text-gray-600">{matchedDriver.car_make} {matchedDriver.car_model} {matchedDriver.car_year}</p>
                            <p className="text-sm text-gray-500">{matchedDriver.license_plate}</p>
                            <div className="flex items-center mt-1">
                              <Star className="w-4 h-4 text-yellow-500 mr-1" />
                              <span className="text-sm font-medium">{matchedDriver.rating}</span>
                              <span className="text-sm text-gray-500 ml-2">({matchedDriver.total_trips} trips)</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-white p-3 rounded-lg">
                            <Clock className="w-5 h-5 text-gray-500 mb-1" />
                            <p className="text-sm text-gray-500">Departure</p>
                            <p className="font-semibold">{formatTime(matchedDriver.departure_time)}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg">
                            <DollarSign className="w-5 h-5 text-green-500 mb-1" />
                            <p className="text-sm text-gray-500">Total Cost</p>
                            <p className="font-semibold text-green-600">${estimatedCost}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-white p-3 rounded-lg">
                            <Users className="w-5 h-5 text-blue-500 mb-1" />
                            <p className="text-sm text-gray-500">Available Seats</p>
                            <p className="font-semibold">{matchedDriver.available_seats}</p>
                          </div>
                          {distance && (
                            <div className="bg-white p-3 rounded-lg">
                              <Navigation className="w-5 h-5 text-blue-500 mb-1" />
                              <p className="text-sm text-gray-500">Distance to York</p>
                              <p className="font-semibold">{distance.toFixed(1)} km</p>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <a 
                            href={`tel:${matchedDriver.phone}`}
                            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </a>
                          <a 
                            href={`sms:${matchedDriver.phone}`}
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Text
                          </a>
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 mr-2" />
                          <span>{error}</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleBooking}
                        disabled={isLoading}
                        className="bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Booking...
                          </div>
                        ) : (
                          'Book Ride'
                        )}
                      </button>
                      <button
                        onClick={resetForm}
                        className="bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                      >
                        Search Again
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Booking Confirmed */
                  <div className="space-y-6">
                    <div className="text-center">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
                      <p className="text-gray-600">Your ride has been booked successfully</p>
                    </div>

                    {currentBooking && matchedDriver && (
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border-2 border-green-200">
                        <div className="text-center mb-4">
                          <p className="text-sm text-gray-500">Booking ID</p>
                          <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{currentBooking.id}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white p-3 rounded-lg text-center">
                            <Clock className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                            <p className="text-sm text-gray-500">Departure Time</p>
                            <p className="font-semibold">{formatTime(departureTime)}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg text-center">
                            <DollarSign className="w-5 h-5 text-green-500 mx-auto mb-1" />
                            <p className="text-sm text-gray-500">Total Paid</p>
                            <p className="font-semibold text-green-600">${currentBooking.total_cost}</p>
                          </div>
                        </div>

                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800 mb-2">
                            <strong>Driver:</strong> {matchedDriver.name}
                          </p>
                          <p className="text-sm text-blue-800 mb-2">
                            <strong>Vehicle:</strong> {matchedDriver.car_make} {matchedDriver.car_model} ({matchedDriver.license_plate})
                          </p>
                          <p className="text-sm text-blue-800">
                            <strong>Contact:</strong> {matchedDriver.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={resetForm}
                      className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                    >
                      Book Another Ride
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6" />
                  <h3 className="text-2xl font-bold">Route Preview</h3>
                </div>
              </div>

              <div className="h-96">
                {coordinates ? (
                  <MapContainer
                    center={coordinates}
                    zoom={11}
                    style={{ height: "100%", width: "100%" }}
                    className="rounded-b-2xl"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={coordinates}>
                      <Popup>
                        <div className="text-center">
                          <strong>📍 Your Home</strong>
                          <br />
                          <span className="text-sm text-gray-600">{homeAddress}</span>
                        </div>
                      </Popup>
                    </Marker>
                    <Marker position={yorkCoords}>
                      <Popup>
                        <div className="text-center">
                          <strong>🎓 York University</strong>
                          <br />
                          <span className="text-sm text-gray-600">Destination</span>
                        </div>
                      </Popup>
                    </Marker>
                    <Polyline
                      positions={[coordinates, yorkCoords]}
                      color="#3B82F6"
                      weight={4}
                      dashArray="10, 5"
                      opacity={0.8}
                    />
                  </MapContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                    <MapPin className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-lg font-medium">Route Preview</p>
                    <p className="text-sm">Your route will appear here after finding a match</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Save Money</h4>
              <p className="text-sm text-gray-600">Split costs with fellow students and save up to 70% on transportation</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Meet People</h4>
              <p className="text-sm text-gray-600">Connect with other York students and build lasting friendships</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Reliable Rides</h4>
              <p className="text-sm text-gray-600">Verified drivers with high ratings ensure safe, punctual transportation</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}