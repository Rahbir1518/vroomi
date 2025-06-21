import { useNavigate } from 'react-router-dom'
import { useUser, UserButton } from "@clerk/clerk-react";
import Logo from "../image/York_Logo.png"
import Background from "../image/background3.png"

export default function Welcome() {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4"
      style={{ backgroundImage: `url(${Background})` }}
    >
      {/* Header with User Info */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-3">
        {user && (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-white font-medium text-sm">
                {user.firstName || user.fullName || "Student"}
              </span>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="mt-22 z-20 text-center animate-fade-in">
        <h1 className="text-6xl md:text-8xl font-extrabold text-white drop-shadow-2xl mb-4 animate-slide-up">
          Welcome to York
        </h1>
        <p className="text-lg md:text-2xl text-white/90 italic mt-2 animate-slide-up animation-delay-200">
          Share rides. Save costs. Connect with your community.
        </p>
      </div>

      {/* Main Content Section */}
      <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8 z-20 w-full max-w-6xl animate-fade-in animation-delay-400">
        {/* Logo Section */}
        <div className="flex-1 flex justify-center">
          <img 
            src={Logo} 
            alt="York Logo" 
            className="w-48 md:w-64 animate-float drop-shadow-xl" 
          />
        </div>

        {/* Info Cards */}
        <div className="flex-1 space-y-6 w-full max-w-md">
          {/* Portal Card */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-xl shadow-xl text-white transform hover:scale-105 transition-all duration-300 animate-slide-up animation-delay-600">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold">Discover Your Portal</h2>
            </div>
            <ul className="space-y-3 text-sm mb-6">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-300 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Find rides with fellow students & staff
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-300 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Split costs and reduce your carbon footprint
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-300 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Plan trips easily across campus or the city
              </li>
            </ul>
            <button
              onClick={() => navigate('/choose')}
              className="w-full bg-[#c21422] hover:bg-[#E31837] py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center group"
            >
              <span>Proceed</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          {/* User Profile Card */}
          {user && (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-xl shadow-xl text-white transform hover:scale-105 transition-all duration-300 animate-slide-up animation-delay-800">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold">Your Profile</h2>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-blue-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-white/70">Name:</span>
                  <span className="ml-2 font-medium">{user.fullName || "Not provided"}</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-white/70">Email:</span>
                  <span className="ml-2 font-medium text-xs">{user.primaryEmailAddress?.emailAddress}</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-purple-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-6 0h6m-6 0v4a1 1 0 01-1 1H7a1 1 0 01-1-1V7m0 0H4a1 1 0 00-1 1v9a1 1 0 001 1h2M8 21h8a2 2 0 002-2V9a2 2 0 00-2-2H8a2 2 0 00-2 2v10A2 2 0 008 21z" />
                  </svg>
                  <span className="text-white/70">Member since:</span>
                  <span className="ml-2 font-medium">{user.createdAt?.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {/* Footer */}
      <footer className="m-12 text-white/80 text-xs z-20 flex items-center justify-center animate-fade-in animation-delay-1000">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        &copy; {new Date().getFullYear()} York University Hackathon Team
      </footer>


      {/* Enhanced Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/60 z-0" />
      
      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )
}