import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationId: number;
  boxTitle: string;
  businessName: string;
  imageUrl: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  reservationId,
  boxTitle,
  businessName,
  imageUrl
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hoveredStar, setHoveredStar] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await api.post('/review', {
        reservation_id: reservationId,
        rating,
        comment: comment.trim() || null
      });
      
      if (response.data.success) {
        toast.success('Thank you for your review!');
        onClose();
      } else {
        toast.error(response.data.message || 'Failed to submit review');
      }
    } catch (error: any) {
      console.error('Review submission error:', error);
      toast.error(error.response?.data?.message || 'An error occurred while submitting your review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <div className="h-40 overflow-hidden">
            <img 
              src={imageUrl} 
              alt={boxTitle} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 p-2 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="font-bold text-xl">{boxTitle}</h3>
            <p className="text-sm opacity-90">{businessName}</p>
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Rate Your Experience</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">Your Rating</label>
              <div className="flex items-center justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setRating(star)}
                    className="text-3xl focus:outline-none transition-transform hover:scale-110"
                  >
                    {star <= (hoveredStar || rating) ? (
                      <span className="text-yellow-400">★</span>
                    ) : (
                      <span className="text-gray-300">★</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="text-center mt-2 text-sm text-gray-600">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">Your Comments (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02615E] focus:border-transparent resize-none"
                placeholder="Tell us about your experience..."
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 mr-3"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#02615E] text-white font-medium hover:bg-[#024e4b] disabled:opacity-70 flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;