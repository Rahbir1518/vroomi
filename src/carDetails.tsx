import { useState } from "react";
import { Car, Calendar, Hash, Sparkles, CheckCircle, ArrowRight, User } from "lucide-react";
import { useUser, UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function CarDetail() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [make, setMake]       = useState("");
  const [model, setModel]     = useState("");
  const [year, setYear]       = useState("");
  const [license, setLicense] = useState("");
  const [seats, setSeats]     = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // now require seats as well
  const isFormValid = make && model && year && license && seats;

  const handleSave = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    // TODO: persist data
    alert("Car details saved successfully!");
    setIsSubmitting(false);
    navigate("/driver");
  };

  // progress out of 5 fields
  const filledCount = [make, model, year, license, seats].filter(Boolean).length;
  const progress = Math.round((filledCount / 5) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center relative overflow-hidden">
      {/* Animated BG omitted for brevity */}

      <header className="w-full bg-white/10 backdrop-blur-md border-b border-white/20 relative z-10">
        <div className="max-w-4xl mx-auto p-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
              <Car className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Add Your Vehicle
            </h1>
          </div>
          <UserButton afterSignOutUrl="/login" appearance={{ elements: { avatarBox: "w-10 h-10" } }} />
        </div>
      </header>

      <main className="flex-1 w-full max-w-lg relative z-10 p-6">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 mt-8 transform hover:scale-[1.02] transition-all duration-300">
          {/* Greeting */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="text-white/80 text-sm">Let's get started</span>
            </div>
            <p className="text-white/90 text-lg">
              Hello,&nbsp;
              <span className="font-semibold text-purple-300">
                {user?.firstName ?? user?.fullName ?? "Student"}
              </span>
              ! Tell us about your amazing ride:
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Make */}
            <div className="group">
              <label className="flex items-center space-x-2 mb-3">
                <Car className="w-4 h-4 text-purple-400" />
                <span className="text-white/80 font-medium">Make</span>
              </label>
              <div className="relative">
                <input
                  value={make}
                  onChange={e => setMake(e.target.value)}
                  placeholder="e.g. Tesla, BMW, Toyota"
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                />
                {make && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400 animate-scale-in" />}
              </div>
            </div>

            {/* Model */}
            <div className="group">
              <label className="flex items-center space-x-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-white/80 font-medium">Model</span>
              </label>
              <div className="relative">
                <input
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  placeholder="e.g. Model S, X5, Corolla"
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                />
                {model && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400 animate-scale-in" />}
              </div>
            </div>

            {/* Year */}
            <div className="group">
              <label className="flex items-center space-x-2 mb-3">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-white/80 font-medium">Year</span>
              </label>
              <div className="relative">
                <input
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  type="number" min="1900" max={new Date().getFullYear()}
                  placeholder="e.g. 2023"
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                />
                {year && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400 animate-scale-in" />}
              </div>
            </div>

            {/* License */}
            <div className="group">
              <label className="flex items-center space-x-2 mb-3">
                <Hash className="w-4 h-4 text-purple-400" />
                <span className="text-white/80 font-medium">License Plate</span>
              </label>
              <div className="relative">
                <input
                  value={license}
                  onChange={e => setLicense(e.target.value)}
                  placeholder="e.g. ABC-1234"
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                />
                {license && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400 animate-scale-in" />}
              </div>
            </div>

            {/* Number of Seats */}
            <div className="group">
              <label className="flex items-center space-x-2 mb-3">
                <User className="w-4 h-4 text-purple-400" />
                <span className="text-white/80 font-medium">Seats</span>
              </label>
              <div className="relative">
                <input
                  value={seats}
                  onChange={e => setSeats(e.target.value.replace(/\D/, ""))}
                  type="text"
                  placeholder="e.g. 4"
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                />
                {seats && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400 animate-scale-in" />}
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSave}
            disabled={!isFormValid || isSubmitting}
            className={`w-full mt-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 transform ${
              isFormValid && !isSubmitting
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 shadow-lg"
                : "bg-gray-600 cursor-not-allowed opacity-50"
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

          {/* Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-white/60 mb-2">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
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
  );
}
