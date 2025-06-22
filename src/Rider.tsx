import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { Car, MapPin, Clock, DollarSign, Users, Search, CheckCircle, AlertCircle, Route, User } from "lucide-react";
import L from "leaflet";

// Fix Leaflet default markers - Modern approach
const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom icons for different students
const createNumberedIcon = (number: number, color: string) => {
  return L.divIcon({
    html: `<div style="background: ${color}; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${number}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
    className: 'custom-numbered-icon'
  });
};

L.Marker.prototype.options.icon = DefaultIcon;

interface Student {
  id: number;
  name: string;
  address: string;
  coordinates: [number, number];
  pickupOrder: number;
  estimatedTime: string;
}

interface Driver {
  name: string;
  vehicle: string;
  rating: number;
  trips: number;
  departure: string;
  students: Student[];
  totalDistance: number;
  routeCoordinates: [number, number][];
}

export default function Rider() {
  const { user } = useUser();

  const [departureTime, setDepartureTime] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [matchedDriver, setMatchedDriver] = useState<Driver | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const yorkCoords: [number, number] = [43.7735, -79.5019]; // York University

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Calculate optimal route using nearest neighbor algorithm
  const calculateOptimalRoute = (studentCoords: [number, number][], startPoint: [number, number]) => {
    const unvisited = [...studentCoords];
    const route = [startPoint];
    let currentPoint = startPoint;
    let totalDistance = 0;

    while (unvisited.length > 0) {
      let nearestIndex = 0;
      let nearestDistance = getDistance(currentPoint, unvisited[0]);

      for (let i = 1; i < unvisited.length; i++) {
        const distance = getDistance(currentPoint, unvisited[i]);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }

      currentPoint = unvisited[nearestIndex];
      route.push(currentPoint);
      totalDistance += nearestDistance;
      unvisited.splice(nearestIndex, 1);
    }

    // Add final distance to York University
    totalDistance += getDistance(currentPoint, yorkCoords);
    route.push(yorkCoords);

    return { route, totalDistance };
  };

  const getDistance = (point1: [number, number], point2: [number, number]) => {
    const R = 6371; // km
    const dLat = ((point2[0] - point1[0]) * Math.PI) / 180;
    const dLon = ((point2[1] - point1[1]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((point1[0] * Math.PI) / 180) *
        Math.cos((point2[0] * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const generateMockStudents = (userCoords: [number, number]) => {
    // Generate 3 other students in Toronto area
    const mockAddresses = [
      { name: "Alex Kim", address: "2300 Yonge St, Toronto", coords: [43.7090, -79.3958] as [number, number] },
      { name: "Maria Santos", address: "1500 Keele St, Toronto", coords: [43.7280, -79.4770] as [number, number] },
      { name: "David Chen", address: "3000 Dufferin St, Toronto", coords: [43.7489, -79.4402] as [number, number] }
    ];

    const userName = user?.firstName || "You";
    const allStudents = [
      { id: 1, name: userName, address: "Your Address", coordinates: userCoords },
      ...mockAddresses.map((addr, index) => ({
        id: index + 2,
        name: addr.name,
        address: addr.address,
        coordinates: addr.coords
      }))
    ];

    return allStudents;
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
      // Use OpenStreetMap Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          homeAddress + ", Toronto, Ontario"
        )}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        const userCoords: [number, number] = [lat, lon];
        setCoordinates(userCoords);

        // Simulate matching delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Generate students and calculate optimal route
        const allStudents = generateMockStudents(userCoords);
        const studentCoords = allStudents.map(s => s.coordinates);
        
        // Calculate optimal route starting from a central point
        const centralPoint: [number, number] = [43.7280, -79.4500]; // Central Toronto
        const { route, totalDistance } = calculateOptimalRoute(studentCoords, centralPoint);

        // Assign pickup order based on optimal route
        const studentsWithOrder = allStudents.map(student => {
          const orderIndex = route.findIndex(point => 
            Math.abs(point[0] - student.coordinates[0]) < 0.001 && 
            Math.abs(point[1] - student.coordinates[1]) < 0.001
          );
          
          const baseTime = new Date(`2024-01-01 ${departureTime}`);
          const pickupTime = new Date(baseTime.getTime() + (orderIndex * 8 * 60000)); // 8 minutes between pickups
          
          return {
            ...student,
            pickupOrder: orderIndex,
            estimatedTime: pickupTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit', 
              hour12: false 
            })
          };
        }).sort((a, b) => a.pickupOrder - b.pickupOrder);

        // Mock driver data
        const drivers = [
          { name: "Sarah Chen", vehicle: "Honda Odyssey 2023", rating: 4.9, trips: 127 },
          { name: "Michael Rodriguez", vehicle: "Toyota Sienna 2022", rating: 4.8, trips: 89 },
          { name: "Emily Zhang", vehicle: "Hyundai Palisade 2024", rating: 5.0, trips: 64 },
        ];

        const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];
        setMatchedDriver({
          ...randomDriver,
          departure: departureTime,
          students: studentsWithOrder,
          totalDistance,
          routeCoordinates: route
        });

        // Calculate cost (split among 4 students)
        const totalCost = totalDistance * 0.35 + 5.0; // Base fee + per km
        const costPerStudent = totalCost / 4;
        setEstimatedCost(parseFloat(costPerStudent.toFixed(2)));
        setShowSuccess(true);
      } else {
        setError("Could not find your address. Please try a more specific address.");
      }
    } catch (err) {
      setError("Failed to find location. Please check your internet connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCoordinates(null);
    setMatchedDriver(null);
    setEstimatedCost(null);
    setError("");
    setShowSuccess(false);
  };

  // Prepare personalized SMS message
  const userName = user?.firstName || user?.fullName || "I";
  const smsMessage = `Hi, my name is ${userName}, I am interested in carpooling with you for the ${departureTime} departure!`;

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        {/* Success Animation */}
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 transform transition-all duration-500 ease-out animate-bounce">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">4-student carpool matched!</span>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 transform transition-all duration-700 ease-out">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 transform hover:scale-110 transition-transform duration-300">
              <Car className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Vroomi</h1>
            <p className="text-gray-600">Smart 4-student carpooling with optimized routes</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="bg-white shadow-xl rounded-xl p-8 transform transition-all duration-500 hover:shadow-2xl">
              <div className="flex items-center space-x-2 mb-6">
                <Users className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-800">Join a 4-Student Carpool</h2>
              </div>

              <div className="space-y-6">
                <div className="transform transition-all duration-300 hover:scale-105">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>Departure Time</span>
                  </label>
                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                </div>

                <div className="transform transition-all duration-300 hover:scale-105">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>Home Address</span>
                  </label>
                  <input
                    type="text"
                    value={homeAddress}
                    onChange={(e) => {
                      setHomeAddress(e.target.value);
                      setError("");
                    }}
                    placeholder="123 Main St, Toronto, ON"
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                </div>

                {error && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 animate-pulse">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={handleMatch}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold transform transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Finding optimal route...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Find Carpool Group</span>
                      </>
                    )}
                  </button>

                  {matchedDriver && (
                    <button
                      onClick={resetForm}
                      className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Match Results */}
              {matchedDriver && coordinates && (
                <div className="mt-8 space-y-6">
                  {/* Driver Info */}
                  <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 transform transition-all duration-700 ease-out">
                    <div className="flex items-center space-x-2 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h3 className="text-xl font-semibold text-gray-800">Carpool Group Matched!</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-600">Driver:</span>
                          <span className="font-semibold">{matchedDriver.name}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Car className="w-4 h-4 text-purple-500" />
                          <span className="text-sm text-gray-600">Vehicle:</span>
                          <span className="font-semibold">{matchedDriver.vehicle}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-gray-600">Departure:</span>
                          <span className="font-semibold">{matchedDriver.departure}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">Your Cost:</span>
                          <span className="font-semibold text-green-600">${estimatedCost?.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-600">Rating:</span>
                        <div className="flex text-yellow-400">
                          {"★".repeat(Math.floor(matchedDriver.rating))}
                        </div>
                        <span className="text-sm font-semibold">{matchedDriver.rating}</span>
                        <span className="text-xs text-gray-500">({matchedDriver.trips} trips)</span>
                      </div>

                      <a
                        href={`sms:+16473283451?body=${encodeURIComponent(smsMessage)}`}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 hover:scale-105"
                      >
                        Text Driver
                      </a>
                    </div>
                  </div>

                  {/* Students List */}
                  <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <Route className="w-5 h-5 text-blue-600" />
                      <h4 className="text-lg font-semibold text-gray-800">Pickup Schedule</h4>
                      <span className="text-sm text-gray-500">({matchedDriver.totalDistance.toFixed(1)} km total)</span>
                    </div>

                    <div className="space-y-3">
                      {matchedDriver.students.map((student, index) => (
                        <div key={student.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800">{student.name}</div>
                            <div className="text-sm text-gray-600">{student.address}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-blue-600">{student.estimatedTime}</div>
                            <div className="text-xs text-gray-500">Pickup #{student.pickupOrder + 1}</div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                          🎓
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">York University</div>
                          <div className="text-sm text-gray-600">Final Destination</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-blue-600">
                            {(() => {
                              const lastPickup = new Date(`2024-01-01 ${matchedDriver.students[matchedDriver.students.length - 1]?.estimatedTime}`);
                              const arrivalTime = new Date(lastPickup.getTime() + (25 * 60000)); // 25 min to campus
                              return arrivalTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                            })()}
                          </div>
                          <div className="text-xs text-gray-500">Est. Arrival</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Map Section */}
            <div className="bg-white shadow-xl rounded-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
              <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center space-x-2">
                  <Route className="w-6 h-6" />
                  <h3 className="text-xl font-semibold">Optimized Route Map</h3>
                </div>
                {matchedDriver && (
                  <p className="text-sm opacity-90 mt-1">
                    Showing efficient pickup order for all 4 students
                  </p>
                )}
              </div>

              <div className="h-96">
                {matchedDriver && coordinates ? (
                  <MapContainer
                    center={yorkCoords}
                    zoom={10}
                    style={{ height: "100%", width: "100%" }}
                    className="z-0"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    {/* Student markers */}
                    {matchedDriver.students.map((student, index) => (
                      <Marker 
                        key={student.id} 
                        position={student.coordinates}
                        icon={createNumberedIcon(index + 1, 
                          index === 0 ? '#3B82F6' : index === 1 ? '#10B981' : index === 2 ? '#8B5CF6' : '#F59E0B'
                        )}
                      >
                        <Popup>
                          <div className="text-center">
                            <strong>Pickup #{index + 1}</strong><br/>
                            <strong>{student.name}</strong><br/>
                            <span className="text-sm text-gray-600">{student.estimatedTime}</span>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                    
                    {/* York University marker */}
                    <Marker position={yorkCoords}>
                      <Popup>
                        <div className="text-center">
                          <div className="text-lg mb-1">🎓</div>
                          <strong>York University</strong><br/>
                          <span className="text-sm text-gray-600">Final Destination</span>
                        </div>
                      </Popup>
                    </Marker>
                    
                    {/* Optimal route polyline */}
                    <Polyline
                      positions={matchedDriver.routeCoordinates}
                      color="#3B82F6"
                      weight={4}
                      opacity={0.8}
                      dashArray="5, 10"
                    />
                  </MapContainer>
                ) : coordinates ? (
                  <MapContainer
                    center={yorkCoords}
                    zoom={11}
                    style={{ height: "100%", width: "100%" }}
                    className="z-0"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={coordinates}>
                      <Popup>
                        <div className="text-center">
                          <MapPin className="w-4 h-4 text-red-500 mx-auto mb-1" />
                          <strong>Your Home</strong>
                        </div>
                      </Popup>
                    </Marker>
                    <Marker position={yorkCoords}>
                      <Popup>
                        <div className="text-center">
                          <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-1"></div>
                          <strong>York University</strong>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-50">
                    <div className="text-center text-gray-500">
                      <Route className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Enter your address to see the optimal route</p>
                      <p className="text-sm">We'll show you how 4 students share an efficient ride</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Stats Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "Active Students", value: "2,847", color: "text-blue-500" },
              { icon: Car, title: "4-Student Rides", value: "3,906", color: "text-green-500" },
              { icon: DollarSign, title: "Avg. Cost/Student", value: "$8.50", color: "text-purple-500" },
              { icon: Route, title: "Avg. Route Time", value: "35 min", color: "text-orange-500" }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-full bg-gray-100`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}