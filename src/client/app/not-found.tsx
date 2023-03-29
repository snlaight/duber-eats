import Link from 'next/link';

const NotFound = () => (
  <div className='h-screen flex flex-col items-center justify-center'>
    <h2 className='font-semibold text-2xl mb-3'>Page not found</h2>
    <h4 className='font-medium text-base mb-5'>
      The page you&apos;re looking for does not exist or has moved.
    </h4>
    <Link href='/' className='hover:underline text-lime-600'>
      Go back home &rarr;
    </Link>
  </div>
);

export default NotFound;
