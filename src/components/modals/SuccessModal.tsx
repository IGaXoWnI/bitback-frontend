import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName?: string;
  pickupTime?: string;
  address?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  businessName, 
  pickupTime, 
  address 
}) => {
  const navigate = useNavigate();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-fadeIn">
        <div className="p-6 text-center">
          <div className="w-20 h-20 bg-green-100 mx-auto rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Box Reserved Successfully!</h2>
          
          <p className="text-gray-600 mb-8">
            Your box from <span className="font-semibold text-[#02615E]">{businessName || 'the merchant'}</span> has been reserved. 
            Pick it up during the scheduled time window.
          </p>
          
          {(pickupTime || address) && (
            <div className="bg-[#F9F3F0] rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-800 mb-2">Pickup Details:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {pickupTime && (
                  <div>
                    <span className="font-medium text-gray-600">Time:</span>
                    <div className="text-[#02615E]">{pickupTime}</div>
                  </div>
                )}
                {address && (
                  <div>
                    <span className="font-medium text-gray-600">Location:</span>
                    <div className="text-[#02615E]">{address}</div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#02615E] text-white font-medium rounded-lg hover:bg-[#024e4b] transition-colors"
            >
              Great!
            </button>
            <button
              onClick={() => navigate('/my-reservations')}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              View My Reservations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;