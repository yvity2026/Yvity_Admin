"use client";

export default function InitPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Please set your security token
        </h1>
        <p className="text-gray-600 mb-6">
          It appears you don't have a valid security token set up. 
          Please contact your administrator to get authenticated.
        </p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
