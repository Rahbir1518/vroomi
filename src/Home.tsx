import { useUser, UserButton } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../image/logo1.png"
import rahbir from "../image/rahbir.jpg";
import faraz from "../image/Faraz.jpg";
import hamza from "../image/hamzap.jpg";
import reymond from "../image/reymond.jpg";

export default function Home() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-tertiary/20">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-tertiary/20"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-tertiary absolute top-0 left-0 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-secondary to-tertiary opacity-20 animate-ping"></div>
        </div>
      </div>
    );
  }

  const featureCards = [
    {
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      title: "Split Costs Fairly",
      description: "Automatically calculate and split gas, parking, and maintenance costs based on distance and passengers.",
      highlight: "Save up to 70% on travel costs",
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Smart Algorithm",
      description: "Our AI matches you with the best travel companions based on route optimization, schedules, and preferences.",
      highlight: "Optimal route matching",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Safe & Verified",
      description: "University email verification and reputation system ensure you travel with trusted fellow students.",
      highlight: "Campus-only community",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    }
  ];

  const teamMembers = [
    { name: "Md Rahbir Mahdi", role: "Cs @ YorkU", img: rahbir, github: "https://github.com/Rahbir1518", linkedin: "https://www.linkedin.com/in/rahbirmahdi/" },
    { name: "Mohammed Faraz Kabbo ", role: "Cs @ YorkU", img: faraz, github: "https://github.com/farazkabbo", linkedin: "https://www.linkedin.com/in/mohammed-faraz-kabbo/" },
    { name: "Reymond Shen", role: "ECE @ UBC", img: reymond, github: "https://github.com/rayleishen", linkedin: "https://www.linkedin.com/in/rayleishen/"},
    { name: "Hamza Panwala", role: "Cs @ YorkU", img: hamza, github: "https://github.com/Hamzap01", linkedin: "https://www.linkedin.com/in/hamza-panwala-1bbaba288/" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-tertiary/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-secondary to-tertiary rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-tertiary to-secondary rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-green-400 to-tertiary rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-white/20">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2 group">
              <div className="transform transition-transform duration-300 group-hover:scale-110">
                <img
                src={logo} alt="Vroomi" 
                className="w-35 md:w-37 h-15 rounded-full object-cover shadow-lg"
                />
              </div>
              <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-green-600 text-white text-sm font-medium rounded-full shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Campus
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4 animate-fade-in">
                  <span className="text-sm text-gray-600 hidden sm:block transform transition-all duration-300 hover:text-gray-800">
                    {user.firstName || "Student"}
                  </span>
                  <div className="transform transition-transform duration-300 hover:scale-105">
                    <UserButton afterSignOutUrl="/welcome" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 animate-fade-in">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-tertiary hover:text-tertiary/70 font-medium transition-all duration-300 transform hover:scale-105 hover:bg-tertiary/10 rounded-lg"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-4 py-2 bg-tertiary text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:bg-tertiary/70"
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
      <main className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <div className={`text-center mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-tertiary/80 to-secondary bg-clip-text text-transparent animate-gradient-x">
            Smart Campus <span className="bg-gradient-to-r from-secondary to-tertiary bg-clip-text text-transparent">Ride-Sharing</span>
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto transform transition-all duration-1000 delay-500 hover:text-gray-800">
            Connect with verified university students, split travel costs, and reduce your carbon footprint 
            with our intelligent pairing algorithm.
          </p>
          <div className={`flex justify-center space-x-8 text-sm text-gray-500 mb-8 transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            {[
              { color: "bg-green-500", text: "University Verified" },
              { color: "bg-blue-500", text: "Cost Splitting" },
              { color: "bg-purple-500", text: "Eco-Friendly" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center group transform transition-all duration-300 hover:scale-110">
                <div className={`w-2 h-2 ${item.color} rounded-full mr-2 animate-pulse group-hover:animate-bounce`}></div>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className={`grid md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {featureCards.map((card, idx) => (
            <div 
              key={idx}
              className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:bg-white/90 ${
                hoveredCard === idx ? 'animate-bounce-gentle' : ''
              }`}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ animationDelay: `${idx * 200}ms` }}
            >
              <div className={`w-16 h-16 ${card.bgColor} rounded-xl flex items-center justify-center mb-6 transform transition-all duration-300 hover:rotate-12 hover:scale-110 shadow-lg`}>
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 transition-colors duration-300 hover:text-tertiary">{card.title}</h3>
              <p className="text-gray-600 mb-4 transition-colors duration-300 hover:text-gray-800">
                {card.description}
              </p>
              <div className={`text-sm ${card.textColor} font-medium transition-all duration-300 hover:scale-105`}>
                {card.highlight}
              </div>
            </div>
          ))}
        </div>

        {/* Environmental Impact */}
        <div className={`bg-gradient-to-r from-secondary to-tertiary/50 rounded-2xl p-8 text-white text-center mb-16 shadow-2xl transform transition-all duration-1000 delay-700 hover:scale-105 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} relative overflow-hidden`}>
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-secondary to-tertiary opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-10 transform -skew-x-12 animate-shimmer"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4 animate-fade-in-up">Reduce Your Carbon Footprint</h2>
            <p className="text-lg mb-6 opacity-90 animate-fade-in-up animation-delay-200">
              Every shared ride helps reduce campus emissions and traffic congestion
            </p>
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              {[
                { value: "50%", label: "Less Emissions" },
                { value: "75%", label: "Cost Savings" },
                { value: "90%", label: "Student Satisfaction" }
              ].map((stat, idx) => (
                <div key={idx} className="transform transition-all duration-500 hover:scale-110 animate-fade-in-up" style={{ animationDelay: `${400 + idx * 200}ms` }}>
                  <div className="text-3xl font-bold animate-count-up">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className={`mb-16 transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-tertiary bg-clip-text text-transparent">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built by passionate students who understand the daily struggles of campus transportation 🚗💨
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="text-center group transform transition-all duration-500 hover:scale-105 animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
                <div className="relative mb-4">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-32 h-32 mx-auto rounded-full object-cover shadow-lg group-hover:shadow-2xl transition-all duration-300 border-4 border-white group-hover:border-tertiary/30 transform group-hover:rotate-3"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-tertiary/20 to-transparent opacity-0 group-hover:opacity-100 rounded-full transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex space-x-3">
                      <a 
                        href={member.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
                      >
                        <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                      <a 
                        href={member.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
                      >
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div> 
                <h3 className="font-semibold text-gray-900 text-lg group-hover:text-tertiary transition-colors duration-300">{member.name}</h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{member.role}</p>
              </div>
            ))}
          </div> 
          
          <div className="text-center mt-8 animate-fade-in-up animation-delay-1000">
            <p className="text-sm text-gray-500 italic transform transition-all duration-300 hover:text-gray-700 hover:scale-105">
              "Late nights, lots of coffee, and a shared vision of making campus life better! 🎓✨"
            </p>
          </div> 
        </div> 

        {/* CTA Section */}
        <div className={`text-center transition-all duration-1000 delay-1100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-gray-900 to-tertiary bg-clip-text text-transparent">Ready to Start Sharing?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link 
                  to="/welcome" 
                  className="inline-flex items-center px-8 py-4 bg-tertiary text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:bg-tertiary/70 group"
                >
                  <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Get Started Now
                </Link>
                <Link 
                  to="/welcome" 
                  className="inline-flex items-center px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-gray-200 hover:shadow-lg"
                >
                  View Profile
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center px-8 py-4 bg-tertiary text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:bg-tertiary/70 group"
                >
                  <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Get Started - Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center px-8 py-4 bg-gray-100/80 backdrop-blur-sm text-gray-700 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-gray-200 hover:shadow-lg"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
      </main>

      <style>
        {`
        @keyframes gradient-x {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.02); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes count-up {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-gradient-x { animation: gradient-x 3s ease infinite; }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out; }
        .animate-count-up { animation: count-up 1s ease-out; }
        
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }
        .animation-delay-4000 { animation-delay: 4000ms; }
        `}
      </style>
    </div>
  );
}