import { useNavigate } from 'react-router-dom';
import logo from '../../img/twitter-logo.png';
import gnews from '../../img/google-news.jpg';
import gimg from '../../img/gimg.jpeg';
import { FaApple } from 'react-icons/fa';
import { IoIosSettings } from 'react-icons/io';
import { Logout } from './Logout.jsx';

export const Front = () => {
  const navigate = useNavigate();
  const login = () => navigate('/login');
  const signup = () => navigate('/signup');

  return (
    <>
      <div className="flex flex-col md:flex-row md:ml-2 max-w-screen-xl mx-auto p-4">
        {/* Left Logo Column */}
        <div className="md:w-1/5 w-full flex justify-center md:justify-start mb-4 md:mb-0">
          <img className="w-10 mt-4" src={logo} alt="Twitter Logo" />
        </div>

        {/* Middle News & Trending */}
        <div className="shadow md:w-2/5 w-full p-2">
          <div>
            <div className="flex justify-between">
              <p className="text-2xl font-bold">Explore</p>
              <IoIosSettings className="m-2 transition-transform duration-200 hover:rotate-45 cursor-pointer text-2xl" />
            </div>
            <p className="font-bold border-b-4 border-blue-700 mb-2 w-20">For You</p>
            <div className="relative">
              <img src={gnews} alt="Google News" className="w-full" />
              <div className="absolute bottom-4 left-4 text-white">
                <p>Google I/O 2025</p>
                <span>LIVE</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="scale-90">
              <p className="text-sm text-gray-400">Trending in India</p>
              <p className="text-lg">Unknown</p>
              <p className="text-sm text-gray-400">70.2K posts</p>
            </div>
            <div className="mt-2 scale-90">
              <span className="text-sm text-gray-400">Trending in India</span>
              <p className="text-lg">Virat Kohli</p>
            </div>
            <div className="mt-2 scale-90">
              <span className="text-sm text-gray-400">Entertainment Trending</span>
              <p className="text-lg">#HeraPheri3</p>
              <span className="text-sm text-gray-400">3,892</span>
            </div>
          </div>
        </div>

        {/* Right Signup Column */}
        <div className="md:w-2/5 w-full mt-6 md:mt-2 md:ml-10">
          <p className="font-bold text-xl">New To X?</p>
          <span className="text-sm">
            Sign up now to get your own personalized timeline!
          </span>

          <div className="flex gap-2 border-2 cursor-pointer transition-transform hover:scale-105 mt-6 border-gray-200 h-14 rounded-2xl w-full items-center px-3">
            <span className="bg-black text-white h-6 w-6 flex items-center justify-center rounded-full text-sm">
              M
            </span>
            <div className="flex flex-col">
              <span className="text-sm">Sign in as Mani</span>
              <span className="text-xs text-gray-500">manikandan11223@gmail.com</span>
            </div>
            <img src={gimg} className="w-6 h-6 rounded-full ml-auto" alt="User profile" />
          </div>

          <p className="border-2 flex justify-center items-center gap-2 mt-3 border-gray-200 h-10 rounded-2xl w-full cursor-pointer hover:scale-105 transition-transform">
            <FaApple />
            Sign up with Apple
          </p>

          <p className="border-2 flex justify-center items-center mt-3 border-gray-200 h-10 rounded-2xl w-full cursor-pointer hover:scale-105 transition-transform">
            Create account
          </p>

          <span className="text-xs text-gray-500 block mt-2">
            By signing up, you agree to the{' '}
            <span className="text-blue-600">Terms of service</span> and{' '}
            <span className="text-blue-600">Privacy Policy</span>
          </span>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="bg-blue-500 flex flex-col md:flex-row justify-between items-center px-6 py-4 mt-6">
        <div className="text-white mb-4 md:mb-0">
          <h1 className="text-2xl md:text-4xl font-bold">Don't Miss What's Happening</h1>
          <p>People on X are the first to know</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={login}
            className="border-2 px-4 py-2 border-white text-white hover:border-black hover:text-black hover:scale-105 transition-transform rounded-3xl"
          >
            Log in
          </button>
          <button
            onClick={signup}
            className="bg-black px-4 py-2 text-white hover:text-black hover:bg-white transition-transform hover:scale-105 rounded-3xl"
          >
            Sign up
          </button>
        </div>
      </div>
    </>
  );
};
