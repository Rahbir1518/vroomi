import { useNavigate } from 'react-router-dom'

import { useUser, UserButton } from "@clerk/clerk-react";

export default function Welcome() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome!
          </h1>
          <UserButton afterSignOutUrl="/login" />
        </div>
        
        {user && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-lg text-gray-900">{user.fullName || "Not provided"}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg text-gray-900">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Member since</p>
              <p className="text-lg text-gray-900">
                {user.createdAt?.toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}