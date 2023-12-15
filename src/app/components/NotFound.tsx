import Link from 'next/link';
import { HiArrowNarrowLeft } from 'react-icons/hi';

const NotFoundComponent = () => {
  return (
    <>
      <main className=" min-h-screen bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="p-4 sm:p-8 text-center flex-1 mt-10 h-full">
          <h1 className="text-3xl font-semibold text-white">404 - Page Not Found</h1>
          <p className="text-gray-300 my-6">The page you are looking for does not exist.</p>
          <div className="mt-6">
          </div>
        </div>
      </main>
    </>
  );
}

export default NotFoundComponent;
