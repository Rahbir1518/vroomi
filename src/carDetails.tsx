import { useState } from "react";
import { Car, Calendar, Hash, Leaf, CheckCircle, ArrowRight, User, TreePine } from "lucide-react";
import { useUser, UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { Link } from "react-router-dom";
import logo from "../image/logo1.png"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("Supabase ANON Key:", import.meta.env.VITE_SUPABASE_ANON_KEY);
export default function CarDetail() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [make, setMake]       = useState("");
  const [model, setModel]     = useState("");
  const [year, setYear]       = useState("");
  const [license, setLicense] = useState("");
  const [seats, setSeats]     = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // require all fields
  const isFormValid = Boolean(make && model && year && license && seats);

  const handleSave = async () => {
    if (!isFormValid) return;
    if (!user?.id) {
      alert("User not loaded yet. Please sign in again.");
      return;
    }
    setIsSubmitting(true);

    const payload = {
      user_id: user.id,
      make,
      model,
      year: Number(year),
      license,
      seats: Number(seats),
    };

    console.log("Inserting vehicle:", payload);
    const { data, error } = await supabase.from("cars").insert([payload]);

    if (error) {
      console.error("Supabase insert error:", error);
      alert("Error saving car: " + error.message);
      setIsSubmitting(false);
      return;
    }

    console.log("Insert result:", data);
    alert("Car details saved successfully! 🌱");
    setIsSubmitting(false);
    navigate("/driver");
  };

  // progress out of 5 fields
  const filledCount = [make, model, year, license, seats].filter(Boolean).length;
  const progress = Math.round((filledCount / 5) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Animated background omitted for brevity */}

      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-green-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 ">
            <div className="flex items-center space-x-4">
            <Link to="/" className="">
              <img
                src={logo} alt="Vroomi" 
                className="w-35 md:w-37 h-15 object-cover"
                />
            </Link>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                Campus
              </span> 
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                {user?.firstName || "User"}
              </span>
              <UserButton afterSignOutUrl="/login" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col items-center px-4 py-8">
      <main className="w-full max-w-lg">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-green-200/50 p-8 transform hover:scale-[1.01] transition-all duration-300">
          {/* Greeting */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full px-4 py-2 mb-4 border border-green-200">
              <TreePine className="w-4 h-4 text-green-600" />
              <span className="text-green-600 text-sm font-medium">Sustainable Journey Starts Here</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Add Your Eco Vehicle
              </h2>
            <p className="text-gray-600">
                Hello,&nbsp;
                <span className="font-semibold text-green-600">
                {user?.firstName ?? user?.fullName ?? "Student"}
              </span>
              ! Tell us about your sustainable ride:
            </p>
            <p className="text-green-600/70 text-sm mt-2">
                🌱 Every mile counts towards a greener future
              </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Make */}
            <div className="group">
                <label className="flex items-center space-x-2 mb-3">
                  <Car className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700 font-medium">Make</span>
                </label>
              <div className="relative">
                <input
                  value={make}
                  onChange={e => setMake(e.target.value)}
                  placeholder="e.g. Tesla, BMW, Toyota"
                  className="w-full bg-white/80 border border-green-200 rounded-2xl px-4 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300 backdrop-blur-sm hover:bg-white/90"
                  />
                {make && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400 animate-scale-in" />}
              </div>
            </div>

            {/* Model */}
            <div className="group">
              <label className="flex items-center space-x-2 mb-3">
                <Leaf className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 font-medium">Model</span>
              </label>
              <div className="relative">
                <input
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  placeholder="e.g. Model S, X5, Corolla"
                  className="w-full bg-white/80 border border-green-200 rounded-2xl px-4 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300 backdrop-blur-sm hover:bg-white/90"
                  />
                  {model && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 animate-scale-in" />}
                </div>
              </div>

            {/* Year */}
            <div className="group">
              <label className="flex items-center space-x-2 mb-3">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 font-medium">Year</span>
              </label>
              <div className="relative">
                <input
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  type="number" min="1900" max={new Date().getFullYear()}
                  placeholder="e.g. 2023"
                  className="w-full bg-white/80 border border-green-200 rounded-2xl px-4 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300 backdrop-blur-sm hover:bg-white/90"
                  />
                  {year && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 animate-scale-in" />}
                </div>
              </div>

            {/* License */}
            <div className="group">
              <label className="flex items-center space-x-2 mb-3">
                <Hash className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 font-medium">License Plate</span>
              </label>
              <div className="relative">
                <input
                  value={license}
                  onChange={e => setLicense(e.target.value)}
                  placeholder="e.g. ECO-2025"
                  className="w-full bg-white/80 border border-green-200 rounded-2xl px-4 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300 backdrop-blur-sm hover:bg-white/90"
                  />
                  {license && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 animate-scale-in" />}
                </div>
              </div>

            {/* Seats */}
            <div className="group">
              <label className="flex items-center space-x-2 mb-3">
                <User className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 font-medium">Seats</span>
              </label>
              <div className="relative">
                <input
                  value={seats}
                  onChange={e => setSeats(e.target.value.replace(/\D/, ""))}
                  type="text"
                  placeholder="e.g. 4"
                  className="w-full bg-white/80 border border-green-200 rounded-2xl px-4 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300 backdrop-blur-sm hover:bg-white/90"
                  />
                  {seats && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 animate-scale-in" />}
                </div>
              </div>
            </div>

          {/* Submit Button */}
          <button
            onClick={handleSave}
            disabled={!isFormValid || isSubmitting}
            className={`w-full mt-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 transform ${
              isFormValid && !isSubmitting
                ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-105 shadow-lg hover:shadow-green-500/25"
                : "bg-gray-400 cursor-not-allowed opacity-50"
            } flex items-center justify-center space-x-2`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Saving your ride...</span>
              </>
            ) : (
              <>
                <span>Save My Vehicle</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>Eco Progress</span>
              <span>{progress}% Complete</span>
            </div>
            <div className="w-full bg-green-100 rounded-full h-3 border border-green-200">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-center mt-3">
                <span className="text-xs text-green-600/80">
                  🌱 Building a sustainable future, one ride at a time
                </span>
              </div>
          </div>
           {/* Eco Stats */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-green-50 rounded-xl border border-green-200">
                <div className="text-green-600 text-lg">🌍</div>
                <div className="text-green-700 text-xs mt-1 font-medium">Planet</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl border border-green-200">
                <div className="text-green-600 text-lg">♻️</div>
                <div className="text-green-700 text-xs mt-1 font-medium">Recycle</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl border border-green-200">
                <div className="text-green-600 text-lg">🚗</div>
                <div className="text-green-700 text-xs mt-1 font-medium">Clean</div>
              </div>
            </div>
        </div>
      </main>

      <style>{`
        @keyframes scale-in {
          0% { transform: scale(0) translateY(-50%); opacity: 0; }
          100% { transform: scale(1) translateY(-50%); opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
      `}</style>
    </div>
    </div>
  );
}
