"use client"
// pages/auth/error.js
import { useRouter } from 'next/navigation';

export default function ErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  let errorMessage = '';

  switch (error) {
    case 'CredentialsSignin':
      errorMessage = 'Invalid email or password. Please try again.';
      break;
    case 'default':
      errorMessage = 'An unknown error occurred. Please try again later.';
      break;
    default:
      errorMessage = 'An unexpected error occurred.';
      break;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">Error</h2>
        <p className="mb-4 text-center text-red-500">{errorMessage}</p>
        <button
          className="w-full p-3 text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700"
          onClick={() => router.push('/auth/signin')}
        >
          Go back to Sign In
        </button>
      </div>
    </div>
  );
}
