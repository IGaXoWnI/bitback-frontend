import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

function WelcomePage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setIsLoggedIn(!!token);
    setUserRole(role);
  }, []);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) { 
          setIsNavbarVisible(false);
        } 
        else if (window.scrollY < lastScrollY || window.scrollY < 10) {
          setIsNavbarVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);

    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    
    setIsLoggedIn(false);
    setUserRole(null);
    
    setIsDropdownOpen(false);
    
    navigate('/login');
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F9F3F0] relative">
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-transparent transition-transform duration-300 ${
        isNavbarVisible ? 'transform translate-y-0' : 'transform -translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-[#02615E]">BitBack</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center">
              {isLoggedIn ? (
                <div className="ml-3 relative">
                  <button
                    id="avatarButton"
                    className="bg-[#02615E] text-white p-2 rounded-full flex items-center justify-center focus:outline-none"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {isDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
                    >
                      {userRole === 'merchant' && (
                        <Link 
                          to="/merchant-dashboard" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Dashboard
                        </Link>
                      )}
                      {userRole === 'customer' && (
                        <Link 
                          to="/orders" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          My Orders
                        </Link>
                      )}
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link 
                        to="/settings" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Settings
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link 
                    to="/login" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#02615E] bg-[#02615E]/10 hover:bg-[#02615E]/20"
                  >
                    Sign in
                  </Link>
                  <Link 
                    to="/register" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#02615E] hover:bg-[#02615E]/90"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white px-2 pt-2 pb-3 shadow-lg">
          </div>
        )}
      </nav>

      <div className="h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-12 lg:px-24">
        <div className="w-full md:w-1/2 md:pr-12 mt-20 md:mt-0 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#02615E] leading-tight">
            <span className="inline-block mb-3">Save Food,</span><br />
            <span className="bg-gradient-to-r from-[#02615E] to-[#038683] bg-clip-text text-transparent">Save Money</span>
          </h1>
          <p className="mt-6 text-lg text-gray-700 max-w-xl mx-auto md:mx-0">
            Join BitBack and discover restaurants & shops offering surplus food at reduced prices. Fight waste, enjoy great food, and save money.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="/home"><button className="px-8 py-4 bg-[#02615E] text-white font-medium rounded-lg shadow-lg hover:bg-[#037d78] transform hover:-translate-y-1 transition-all">
              Find Meals Near You
            </button></a>
            <button className="px-8 py-4 border border-[#02615E] text-[#02615E] font-medium rounded-lg hover:bg-[#e9e3e0] transform hover:-translate-y-1 transition-all">
              How It Works
            </button>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#02615E]">5M+</p>
              <p className="text-sm text-gray-600">Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#02615E]">10K+</p>
              <p className="text-sm text-gray-600">Restaurants</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#02615E]">2M+</p>
              <p className="text-sm text-gray-600">Meals Saved</p>
            </div>
          </div>
        </div>

        <div className="hidden md:block w-1/2 h-4/5 relative">
          <div className="absolute -top-12 -left-12 w-72 h-72 bg-[#02615E]/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-12 -right-12 w-72 h-72 bg-[#038683]/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-32 left-20 w-72 h-72 bg-[#F9F3F0]/80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          
          <div className="relative z-10 h-full w-full flex items-center justify-center">
            <div className="w-[90%] h-[90%] rounded-3xl overflow-hidden bg-white shadow-2xl p-4">
              <div className="w-full h-full rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-tr from-[#F9F3F0] to-white">
                <div className="relative w-full h-full">
                  <img 
                    src="src/assets/bag.webp" 
                    alt="Fresh food surplus from local restaurants available at discount prices" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#02615E]/30 to-transparent opacity-60"></div>
                  
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="text-xl font-semibold drop-shadow-md">Delicious meals, reduced prices</p>
                    <p className="text-sm opacity-90">Save up to 50% at local restaurants</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#02615E] tracking-tight sm:text-5xl">
              OUR BUSINESS SOLUTIONS
            </h2>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
              We offer a range of solutions to empower the world's leading food distributors to avoid good food from going to waste.
            </p>
          </div>

          <div className="mt-16 grid gap-16 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
            <div className="relative rounded-2xl overflow-hidden group">
              <div className="h-96 bg-[#F9F3F0] rounded-2xl p-8 shadow-xl transition-transform duration-300 group-hover:shadow-2xl group-hover:-translate-y-2">
                <div className="h-16 w-16 rounded-full bg-[#02615E]/10 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#02615E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#02615E] mb-4">SURPRISE BAGS</h3>
                <p className="text-gray-700 leading-relaxed">
                  Unlock revenue from surplus food: Sell your unsold food in 'Surprise Bags' through the BitBack app, for users to come collect in-store at a pre-determined time.
                </p>
                <div className="absolute bottom-8 left-8 right-8">
                  <button className="px-6 py-3 bg-white text-[#02615E] font-medium rounded-lg hover:bg-[#02615E] hover:text-white transition-colors duration-300 shadow-md">
                    Learn more
                  </button>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden group">
              <div className="h-96 bg-[#F9F3F0] rounded-2xl p-8 shadow-xl transition-transform duration-300 group-hover:shadow-2xl group-hover:-translate-y-2">
                <div className="h-16 w-16 rounded-full bg-[#02615E]/10 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#02615E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#02615E] mb-4">BITBACK PLATFORM</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your end-to-end surplus food management solution: Modular software that helps retailers seamlessly track, manage and redistribute surplus food.
                </p>
                <div className="absolute bottom-8 left-8 right-8">
                  <button className="px-6 py-3 bg-white text-[#02615E] font-medium rounded-lg hover:bg-[#02615E] hover:text-white transition-colors duration-300 shadow-md">
                    Learn more
                  </button>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden group">
              <div className="h-96 bg-[#F9F3F0] rounded-2xl p-8 shadow-xl transition-transform duration-300 group-hover:shadow-2xl group-hover:-translate-y-2">
                <div className="h-16 w-16 rounded-full bg-[#02615E]/10 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#02615E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#02615E] mb-4">DATE LABELING INITIATIVE</h3>
                <p className="text-gray-700 leading-relaxed">
                  Reduce waste in households: Join a coalition of the world's leading brands with our bespoke 'Look-Smell-Taste' label printed on billions of Best Before products.
                </p>
                <div className="absolute bottom-8 left-8 right-8">
                  <button className="px-6 py-3 bg-white text-[#02615E] font-medium rounded-lg hover:bg-[#02615E] hover:text-white transition-colors duration-300 shadow-md">
                    Learn more
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-24 bg-[#02615E] rounded-2xl p-12 text-center shadow-xl relative">
            <h3 className="text-3xl font-bold text-white mb-6">
              Join the Movement Against Food Waste
            </h3>
            <p className="text-white/80 text-lg max-w-3xl mx-auto mb-10">
              Partner with BitBack to make a real difference. Together, we can create a world where all food produced is food consumed.
            </p>
            <button 
              onClick={() => window.location.href = '/partner-signup'} 
              className="px-8 py-4 bg-white text-[#02615E] font-medium rounded-lg hover:bg-[#F9F3F0] transition-colors duration-300 shadow-md">
              Become a Partner
            </button>

            <div className="absolute left-12 top-12 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-2xl opacity-10"></div>
            <div className="absolute right-12 bottom-12 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-2xl opacity-10"></div>
          </div>

          <div className="mt-24 text-center">
            <p className="text-2xl italic text-gray-600 max-w-4xl mx-auto">
              "The food you waste is the food you could have used to save a life somewhere, sometime."
            </p>
            <p className="mt-6 font-semibold text-[#02615E]">— Mahatma Gandhi</p>
          </div>
         
        </div>
      </div>

      <div className="absolute top-40 left-10 w-24 h-24 bg-[#02615E] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
     
    </div>
  );
}

export default WelcomePage;