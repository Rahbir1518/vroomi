import { useNavigate } from 'react-router-dom'
import Logo from "../image/York_Logo.png"
import Background from "../image/background3.png"

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4"
      style={{ backgroundImage: `url(${Background})` }}
    >

      <h1 className="text-6xl md:text-8xl font-extrabold text-gray-700 drop-shadow-xl z-20 text-center">
        Welcome to York
      </h1>
      <p className="text-lg md:text-2xl text-gray-600 italic mt-2 z-10 text-center">
        Share rides. Save costs. Connect with your community.
      </p>

      <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8 z-10">
        <img src={Logo} alt="York Logo" className="w-48 md:w-64 animate-pulse" />

        <div className="bg-white/10 backdrop-blur-lg border border-white p-6 rounded-xl shadow-xl text-white max-w-md">
          <h2 className="text-2xl font-semibold mb-3">Discover Your Portal</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Find rides with fellow students & staff</li>
            <li>Split costs and reduce your carbon footprint</li>
            <li>Plan trips easily across campus or the city</li>
          </ul>

          <button
            onClick={() => navigate('/choose')}
            className="mt-6 w-full bg-[#c21422] hover:bg-[#E31837] py-2 px-4 rounded-md text-white font-semibold transition"
          >
            Proceed
          </button>
        </div>
      </div>

      <footer className="absolute bottom-4 text-white text-xs opacity-80 z-10">
        &copy; {new Date().getFullYear()} York University Hackathon Team
      </footer>

      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-0" />
    </div>
  )
}
