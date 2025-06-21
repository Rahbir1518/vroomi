import { useUser, UserButton } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../image/logo1.png"

export default function Home() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tertiary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-tertiary/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="">
                <img
                src={logo} alt="Vroomi" 
                className="w-35 md:w-37 h-15 rounded-full object-cover"
                />
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                Campus
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-600 hidden sm:block">
                    {user.firstName || "Student"}
                  </span>
                  <UserButton afterSignOutUrl="/welcome" />
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-tertiary hover:text-tertiary/70 hover:cursor-pointer font-medium transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-4 py-2 bg-tertiary text-white rounded-lg hover:bg-tertiary/70 hover:cursor-pointer font-medium transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Smart Campus <span className="text-secondary">Ride-Sharing</span>
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Connect with verified university students, split travel costs, and reduce your carbon footprint 
            with our intelligent pairing algorithm.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500 mb-8">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              University Verified
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Cost Splitting
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Eco-Friendly
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Cost Splitting */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Split Costs Fairly</h3>
            <p className="text-gray-600 mb-4">
              Automatically calculate and split gas, parking, and maintenance costs based on distance and passengers.
            </p>
            <div className="text-sm text-green-600 font-medium">
              Save up to 70% on travel costs
            </div>
          </div>

          {/* Smart Pairing */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Algorithm</h3>
            <p className="text-gray-600 mb-4">
              Our AI matches you with the best travel companions based on route optimization, schedules, and preferences.
            </p>
            <div className="text-sm text-blue-600 font-medium">
              Optimal route matching
            </div>
          </div>

          {/* Safety & Trust */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Safe & Verified</h3>
            <p className="text-gray-600 mb-4">
              University email verification and reputation system ensure you travel with trusted fellow students.
            </p>
            <div className="text-sm text-purple-600 font-medium">
              Campus-only community
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="bg-gradient-to-r from-secondary to-tertiary/50 rounded-2xl p-8 text-white text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Reduce Your Carbon Footprint</h2>
          <p className="text-lg mb-6 opacity-90">
            Every shared ride helps reduce campus emissions and traffic congestion
          </p>
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold">50%</div>
              <div className="text-sm opacity-80">Less Emissions</div>
            </div>
            <div>
              <div className="text-3xl font-bold">75%</div>
              <div className="text-sm opacity-80">Cost Savings</div>
            </div>
            <div>
              <div className="text-3xl font-bold">90%</div>
              <div className="text-sm opacity-80">Student Satisfaction</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Ready to Start Sharing?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link 
                  to="/welcome" 
                  className="inline-flex items-center px-8 py-4 bg-tertiary text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Get Started Now
                </Link>
                <Link 
                  to="/welcome" 
                  className="inline-flex items-center px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  View Profile
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center px-8 py-4 bg-tertiary hover:bg-tertiary/70 hover:cursor-pointer text-white font-semibold rounded-lg transition-colors shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Get Started - Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center px-8 py-4 bg-gray-100 hover:cursor-pointer text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}