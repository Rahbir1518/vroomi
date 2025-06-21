import { useUser, UserButton } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../image/logo1.png"
import rahbir from "../image/rahbir.jpg";
import faraz from "../image/Faraz.jpg";
import hamza from "../image/hamzap.jpg";
import reymond from "../image/reymond.jpg";

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

                {/* Team Section */}
<div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built by passionate students who understand the daily struggles of campus transportation 🚗💨
            </p>
          </div>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
    {[
      { name: "Md Rahbir Mahdi", role: "Cs @ YorkU", img: rahbir, github: "https://github.com/Rahbir1518", linkedin: "https://www.linkedin.com/in/rahbirmahdi/" },
      { name: "Mohammed Faraz Kabbo ", role: "Cs @ YorkU", img: faraz, github: "https://github.com/farazkabbo", linkedin: "https://www.linkedin.com/in/mohammed-faraz-kabbo/" },
      { name: "Reymond Shen", role: "ECE @ UBC", img: reymond, github: "https://github.com/rayleishen", linkedin: "https://www.linkedin.com/in/rayleishen/"},
      { name: "Hamza Panwala", role: "Cs @ YorkU", img: hamza, github: "https://github.com/Hamzap01", linkedin: "https://www.linkedin.com/in/hamza-panwala-1bbaba288/" },
    ].map((member, idx) => (
      <div key={idx} className="text-center group">
                <div className="relative mb-4">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-32 h-32 mx-auto rounded-full object-cover shadow-lg group-hover:shadow-xl transition-shadow border-4 border-white"
                    
                  />
                  <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-3">
                      <a 
                        href={member.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                      <a 
                        href={member.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div> 
                <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            ))}
          </div> 
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 italic">
              "Late nights, lots of coffee, and a shared vision of making campus life better! 🎓✨"
            </p>
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