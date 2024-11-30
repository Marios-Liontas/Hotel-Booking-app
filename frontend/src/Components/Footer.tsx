import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="bg-black py-10">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">SleepEasy.com</Link>
        </span>
        <span className="text-white font-bold flex space-x-4">
          <Link
            to="/privacy-policy"
            className="text-white font-bold hover:text-gray-400 cursor-pointer"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-of-service"
            className="text-white font-bold hover:text-gray-400 cursor-pointer"
          >
            Terms of Service
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Footer;
