import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import SignOutButton from './SignOutButton';

const Header = () => {
  const { isLoggedIn } = useAppContext();
  return (
    <div className='bg-black'>
      <div className='container mx-auto my-4 flex justify-between'>
        <span className='text-3xl text-white font-bold tracking-tight'>
          <Link to="/">SleepEasy.com</Link>
        </span>
        <span className='flex space-x-2'>
          {isLoggedIn ? (
            <>
              <Link
                to="/my-bookings"
                className='flex items-center text-white px-3 font-bold hover:bg-gray-800'>
                My Bookings
              </Link>
              <Link
                to="/my-hotels"
                className='flex items-center text-white px-3 font-bold hover:bg-gray-800'>
                My Hotels
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className='flex bg-white items-center text-black px-3 font-bold hover:bg-gray-300'>
              Sign In
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;
