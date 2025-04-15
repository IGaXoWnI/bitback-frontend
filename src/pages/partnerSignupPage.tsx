import { useState } from 'react';
import { Link } from 'react-router-dom';

function PartnerSignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [formData, setFormData] = useState({
    // Business Info
    businessName: '',
    businessType: '',
    businessAddress: '',
    city: '',
    postalCode: '',

    // Contact Info
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    // Account Info
    password: '',
    confirmPassword: '',
    // Additional Info
    numberOfLocations: '1',
    estimatedSurplusUnits: '',
    heardAboutUs: '',
    agreeToTerms: false
  });

  const businessTypes = [
    'Restaurant',
    'Cafe',
    'Bakery',
    'Grocery Store',
    'Supermarket',
    'Hotel',
    'Food Producer',
    'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (currentStep < totalSteps) {
      nextStep();
      return;
    }
    
    // Form validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    if (!formData.agreeToTerms) {
      alert("You must agree to the terms and conditions");
      return;
    }
    
    try {
      // Prepare data for your API
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: 'Business', // Changed from 'merchant' to 'Business' to match your allowed roles
        
        // Include business data for backend detection
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessAddress: formData.businessAddress,
        city: formData.city,
        postalCode: formData.postalCode,
        numberOfLocations: formData.numberOfLocations,
        estimatedSurplusUnits: formData.estimatedSurplusUnits,
        heardAboutUs: formData.heardAboutUs,
      };
      
      // Send to your existing register endpoint
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Save token to localStorage for authentication
        if (data.autorisations && data.autorisations.token) {
          localStorage.setItem('token', data.autorisations.token);
        }
        
        alert('Registration successful!');
        window.location.href = '/merchant/dashboard';
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error registering merchant:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const getProgressWidth = () => {
    return `${(currentStep / totalSteps) * 100}%`;
  };

  return (
    <div className="min-h-screen bg-[#F9F3F0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6">
            <span className="text-3xl font-extrabold text-[#02615E]">BitBack</span>
          </Link>
          <h1 className="text-3xl font-bold text-[#02615E]">Partner with BitBack</h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Join our mission to reduce food waste. Fill out the form below to start your journey as a BitBack partner.
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Progress indicator */}
            <div className="mb-10">
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-full bg-[#02615E] rounded-full transition-all duration-300 ease-in-out" 
                     style={{ width: getProgressWidth() }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span className={currentStep >= 1 ? 'text-[#02615E] font-medium' : ''}>Business Info</span>
                <span className={currentStep >= 2 ? 'text-[#02615E] font-medium' : ''}>Contact Info</span>
                <span className={currentStep >= 3 ? 'text-[#02615E] font-medium' : ''}>Account</span>
                <span className={currentStep >= 4 ? 'text-[#02615E] font-medium' : ''}>Confirmation</span>
              </div>
            </div>

            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-semibold text-[#02615E] mb-6 pb-2 border-b border-gray-200">
                  Business Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name*
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#02615E] focus:border-[#02615E]"
                      value={formData.businessName}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Type*
                    </label>
                    <select
                      id="businessType"
                      name="businessType"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#02615E] focus:border-[#02615E]"
                      value={formData.businessType}
                      onChange={handleChange}
                    >
                      <option value="">Select business type</option>
                      {businessTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Address*
                    </label>
                    <input
                      type="text"
                      id="businessAddress"
                      name="businessAddress"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#02615E] focus:border-[#02615E]"
                      value={formData.businessAddress}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City*
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#02615E] focus:border-[#02615E]"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code*
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#02615E] focus:border-[#02615E]"
                      value={formData.postalCode}
                      onChange={handleChange}
                    />
                  </div>
                  
                  
                  
                  
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-semibold text-[#02615E] mb-6 pb-2 border-b border-gray-200">
                  Contact Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name*
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#02615E] focus:border-[#02615E]"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name*
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#02615E] focus:border-[#02615E]"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#02615E] focus:border-[#02615E]"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#02615E] focus:border-[#02615E]"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Account Information */}
            {currentStep === 3 && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-semibold text-[#02615E] mb-6 pb-2 border-b border-gray-200">
                  Account Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password*
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#02615E] focus:border-[#02615E]"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Must be at least 8 characters with letters, numbers, and special characters
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password*
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#02615E] focus:border-[#02615E]"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium text-[#02615E] mb-4">Additional Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="numberOfLocations" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Locations
                      </label>
                      <select
                        id="numberOfLocations"
                        name="numberOfLocations"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#02615E] focus:border-[#02615E]"
                        value={formData.numberOfLocations}
                        onChange={handleChange}
                      >
                        <option value="1">1</option>
                        <option value="2-5">2-5</option>
                        <option value="6-10">6-10</option>
                        <option value="11-50">11-50</option>
                        <option value="50+">50+</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="estimatedSurplusUnits" className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated Surplus Units Per Week
                      </label>
                      <select
                        id="estimatedSurplusUnits"
                        name="estimatedSurplusUnits"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#02615E] focus:border-[#02615E]"
                        value={formData.estimatedSurplusUnits}
                        onChange={handleChange}
                      >
                        <option value="">Select an option</option>
                        <option value="1-5">1-5</option>
                        <option value="6-20">6-20</option>
                        <option value="21-50">21-50</option>
                        <option value="50+">50+</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="heardAboutUs" className="block text-sm font-medium text-gray-700 mb-1">
                      How did you hear about BitBack?
                    </label>
                    <select
                      id="heardAboutUs"
                      name="heardAboutUs"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#02615E] focus:border-[#02615E]"
                      value={formData.heardAboutUs}
                      onChange={handleChange}
                    >
                      <option value="">Select an option</option>
                      <option value="Search Engine">Search Engine</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Recommendation">Recommendation</option>
                      <option value="News/Press">News/Press</option>
                      <option value="Email">Email</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review and Confirm */}
            {currentStep === 4 && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-semibold text-[#02615E] mb-6 pb-2 border-b border-gray-200">
                  Review and Confirm
                </h2>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Business Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div><span className="font-medium">Business Name:</span> {formData.businessName}</div>
                    <div><span className="font-medium">Business Type:</span> {formData.businessType}</div>
                    <div className="md:col-span-2"><span className="font-medium">Business Address:</span> {formData.businessAddress}</div>
                    <div><span className="font-medium">City:</span> {formData.city}</div>
                    <div><span className="font-medium">Postal Code:</span> {formData.postalCode}</div>
  
                    
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</div>
                    <div><span className="font-medium">Email:</span> {formData.email}</div>
                    <div><span className="font-medium">Phone:</span> {formData.phoneNumber}</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div><span className="font-medium">Number of Locations:</span> {formData.numberOfLocations}</div>
                    <div><span className="font-medium">Estimated Surplus Units/Week:</span> {formData.estimatedSurplusUnits || 'Not provided'}</div>
                    <div><span className="font-medium">How you heard about us:</span> {formData.heardAboutUs || 'Not provided'}</div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="mb-8">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="agreeToTerms"
                        name="agreeToTerms"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-[#02615E] border-gray-300 rounded focus:ring-[#02615E]"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="agreeToTerms" className="text-gray-700">
                        I agree to the <a href="#" className="text-[#02615E] hover:underline">Terms of Service</a> and <a href="#" className="text-[#02615E] hover:underline">Privacy Policy</a>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-10">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2.5 border border-[#02615E] text-[#02615E] font-medium rounded-lg hover:bg-[#e9e3e0] transition-all"
                >
                  Previous
                </button>
              ) : (
                <div></div> // Empty div for spacing
              )}
              <button
                type={currentStep === totalSteps ? "submit" : "button"}
                onClick={currentStep < totalSteps ? nextStep : undefined}
                className="px-8 py-3 bg-[#02615E] text-white font-medium rounded-lg shadow-md hover:bg-[#037d78] transition-all"
              >
                {currentStep < totalSteps ? 'Next' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>Already registered? <Link to="/login" className="text-[#02615E] hover:underline">Log in</Link></p>
        </div>
      </div>
    </div>
  );
}

export default PartnerSignupPage;