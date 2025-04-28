import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ 
  isOpen, 
  onClose, 
  errorMessage 
}) => {
  const navigate = useNavigate();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-fadeIn">
        <div className="p-6 text-center">
          <div className="w-20 h-20 bg-red-100 mx-auto rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Reservation Failed</h2>
          
          <p className="text-gray-600 mb-8">
            {errorMessage}
          </p>
          
          <div className="bg-[#FFF5F5] rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-2">What to do next:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {errorMessage.includes('already have a reservation') && (
                <>
                  <li>Check your existing reservations</li>
                  <li>Only one reservation is allowed per box</li>
                </>
              )}
              {errorMessage.includes('no longer available') && (
                <>
                  <li>This box has sold out</li>
                  <li>Try browsing similar options</li>
                </>
              )}
              {errorMessage.includes('log in') && (
                <>
                  <li>Please log in to your account</li>
                  <li>You need to be logged in to make reservations</li>
                </>
              )}
              {!errorMessage.includes('already have') && 
               !errorMessage.includes('no longer available') && 
               !errorMessage.includes('log in') && (
                <>
                  <li>Try again in a few moments</li>
                  <li>Contact customer support if the issue persists</li>
                </>
              )}
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Close
            </button>
            {errorMessage.includes('log in') ? (
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go to Login
              </button>
            ) : (
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Browse More Boxes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;