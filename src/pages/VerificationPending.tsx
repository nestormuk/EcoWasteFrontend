import React from 'react';
import { Clock } from 'lucide-react';

export const VerificationPending = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <Clock className="mx-auto h-12 w-12 text-green-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Verification Pending</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your account is currently under review. Our admin team will verify your details shortly.
              You'll receive an email once your account is verified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}