import { SignUp } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-tertiary/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-secondary to-tertiary rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-tertiary to-secondary rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-green-400 to-tertiary rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 p-8 relative z-10">
        <div className="text-center">
          <Link 
            to="/" 
            className="text-3xl font-bold bg-gradient-to-r from-secondary to-tertiary bg-clip-text text-transparent mb-6 inline-block hover:scale-105 transition-transform duration-300"
          >
            VROOMI
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 bg-gradient-to-r from-gray-900 via-tertiary/80 to-secondary bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join VROOMI and start your campus ride-sharing journey
          </p>
        </div>
        
        <div className="flex justify-center">
          <SignUp 
            routing="path" 
            path="/register"
            signInUrl="/login"
            afterSignUpUrl="/welcome"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-xl border-0 bg-white/80 backdrop-blur-sm border border-white/20",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white/90 hover:bg-white border border-gray-200 text-gray-700 hover:border-tertiary/30 transition-all duration-300 hover:shadow-lg",
                formButtonPrimary: "bg-gradient-to-r from-secondary to-tertiary hover:from-secondary/90 hover:to-tertiary/90 text-white transition-all duration-300 hover:shadow-lg hover:scale-105",
                footerActionLink: "text-tertiary hover:text-tertiary/70 transition-colors duration-300",
                formFieldInput: "border-gray-200 focus:border-tertiary focus:ring-tertiary/20",
                formFieldLabel: "text-gray-700",
                identityPreviewText: "text-gray-600",
                identityPreviewEditButton: "text-tertiary hover:text-tertiary/70"
              },
              variables: {
                colorPrimary: "#14b8a6", // tertiary color
                colorBackground: "#ffffff",
                colorInputBackground: "#ffffff",
                colorInputText: "#374151",
                colorText: "#374151",
                colorTextSecondary: "#6b7280",
                borderRadius: "0.5rem"
              }
            }}
          />
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-tertiary hover:text-tertiary/70 transition-colors duration-300 font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}