import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import './index.css'
import App from './App.tsx'
import Login from './Login.tsx'
import Register from './Register.tsx'
import Home from './Home.tsx'
import Welcome from './Welcome.tsx'
import Choose from './Choose.tsx'
import Driver from './Driver.tsx'
import Rider from './Rider.tsx'
import ProtectedRoute from './ProtectedRoute.tsx'
import CarDetails from './carDetails.tsx'
import "leaflet/dist/leaflet.css";

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key - Add VITE_CLERK_PUBLISHABLE_KEY to your .env.local file")
}

// App Router component
function AppRouter() {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading while auth state is being determined
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public home route - accessible to everyone */}
      <Route path="/" element={<Home />} />
      
      {/* Auth routes - redirect to dashboard if already signed in */}
      <Route 
        path="/login" 
        element={isSignedIn ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={isSignedIn ? <Navigate to="/dashboard" replace /> : <Register />} 
      />

      {/* Protected routes - require authentication */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Welcome />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/welcome" 
        element={
          <ProtectedRoute>
            <Welcome />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/choose" 
        element={
          <ProtectedRoute>
            <Choose />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/carDetail" 
        element={
          <ProtectedRoute>
            <CarDetails />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/driver" 
        element={
          <ProtectedRoute>
            <Driver />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/rider" 
        element={
          <ProtectedRoute>
            <Rider />
          </ProtectedRoute>
        } 
      />

      {/* If you want to keep App.tsx accessible, add it as a separate route */}
      <Route 
        path="/app" 
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        } 
      />

      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
)