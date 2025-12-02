import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const NotFoundPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Page Not Found - Greenmarket.com.ng</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Head>
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-gray-900">404</h1>
            <h2 className="text-2xl font-semibold text-gray-900">Page Not Found</h2>
            <p className="text-gray-600">
              The page you are looking for does not exist or is under development.
            </p>
          </div>
          <div className="space-y-4">
            <Link href="/" className="block w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
              Go Home
            </Link>
            <Link href="/faq" className="block w-full py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
              View FAQ
            </Link>
          </div>
      
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;