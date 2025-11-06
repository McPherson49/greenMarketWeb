import Link from 'next/link';

const Custom404 = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bold text-[#39B54A] mb-4">404</h1>
      <h2 className="text-2xl text-gray-600 mb-6">Page Not Found</h2>
      <p className="text-gray-500 mb-8 text-center">The page you are looking for doesn't exist.</p>
      <Link href="/" className="bg-[#39B54A] hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold">
        Go Home
      </Link>
    </div>
  );
};

export default Custom404;