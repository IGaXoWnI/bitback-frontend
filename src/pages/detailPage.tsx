import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api';
import { toast } from 'react-toastify';
import SuccessModal from '../components/modals/SuccessModal';
import ErrorModal from '../components/modals/ErrorModal';
import ReportModal from '../components/modals/ReportModal';
import ReviewModal from '../components/modals/ReviewModal';

interface FoodItemDetail {
  id: number;
  title: string;
  description?: string;
  price: {
    original: number;
    discounted: number;
    discount_percentage: number;
  };
  quantity: {
    available: number;
    reserved: number;
  };
  image: string;
  pickup_time: string;
  rating: number;
  business?: {
    id: number;
    name: string;
    address: string;
  };
  category_tags?: string[];
  created_at?: string;
  updated_at?: string;
}

function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<FoodItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorite, setFavorite] = useState(false);
  const [reserving, setReserving] = useState(false);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');

  const [isReserved, setIsReserved] = useState(false);
  const [checkingReservation, setCheckingReservation] = useState(false);
  const [reservationId, setReservationId] = useState<number | null>(null);

  const [canReview, setCanReview] = useState(false);
  const [pickedUpReservationId, setPickedUpReservationId] = useState<number | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [reviews, setReviews] = useState<Array<any>>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);

  const [avgRating, setAvgRating] = useState("0.0");
  const [reviewCount, setReviewCount] = useState(0);

  const reportModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/boxes/${id}`);
        if (response.data?.success && response.data?.data) {
          setItem(response.data.data);
        } else {
          setError("Item not found");
        } 
      } catch (err) {
        console.error("API Error:", err);
        setError("Error loading item");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const checkIfReserved = async () => {
      if (!id || !localStorage.getItem('token')) return;
      setCheckingReservation(true);

      try {
        const isReservedResponse = await api.get(`/isReserved/${id}`);

        if (isReservedResponse.data.success && isReservedResponse.data.is_reserved) {
          setIsReserved(true);

          const reservationsResponse = await api.get('/reservations/user');
          if (reservationsResponse.data.success && reservationsResponse.data.data?.data) {
            const userReservations = reservationsResponse.data.data.data;
            const thisBoxReservation = userReservations.find(
              (res: any) => Number(res.box_id) === Number(id) &&
                res.status !== 'picked_up' &&
                res.status !== 'canceled'
            );

            if (thisBoxReservation) {
              setReservationId(thisBoxReservation.id);
            }
          }
        } else {
          setIsReserved(false);
        }
      } catch (error) {
        console.error('Error checking reservation status:', error);
      } finally {
        setCheckingReservation(false);
      }
    };

    checkIfReserved();
  }, [id]);

  useEffect(() => {
    const checkIfCanReview = async () => {
      if (!id || !localStorage.getItem('token')) return;

      try {
        const response = await api.get('/reservations/user');

        if (response.data.success && response.data.data?.data) {
          const userReservations = response.data.data.data;
          const pickedUpReservation = userReservations.find(
            (res: any) => Number(res.box_id) === Number(id) && res.status === 'picked_up'
          );

          if (pickedUpReservation) {
            setCanReview(true);
            setPickedUpReservationId(pickedUpReservation.id);
          }
        }
      } catch (error) {
        console.error('Error checking review eligibility:', error);
      }
    };

    checkIfCanReview();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;

      setLoadingReviews(true);
      try {
        const response = await api.get(`/review/${id}?page=${reviewsPage}`);

        if (response.data.success && response.data.data) {
          if (reviewsPage === 1) {
            setReviews(response.data.data.data || []);
          } else {
            setReviews(prev => [...prev, ...(response.data.data.data || [])]);
          }

          setHasMoreReviews(
            response.data.data.current_page < response.data.data.last_page
          );
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [id, reviewsPage]);

  useEffect(() => {
    if (!id) return;

    const fetchRating = async () => {
      try {
        const response = await api.get(`/getAvgRating/${id}`);

        if (response.data.success) {
          setAvgRating(parseFloat(response.data.data.average_rating).toFixed(1));
          setReviewCount(response.data.data.reviews_count);
        }
      } catch (error) {
        console.error("Error fetching rating:", error);
      }
    };

    fetchRating();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (reportModalRef.current && !reportModalRef.current.contains(event.target as Node)) {
        setShowReportModal(false);
      }
    };

    if (showReportModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReportModal]);

  const handleReserveClick = async () => {
    if (!id) return;

    setReserving(true);

    try {
      const response = await api.post('/makeReservation', { box_id: id });

      if (response.data.success) {
        setItem(prevItem => {
          if (!prevItem) return null;

          return {
            ...prevItem,
            quantity: {
              available: prevItem.quantity.available - 1,
              reserved: prevItem.quantity.reserved + 1
            }
          };
        });

        setShowSuccessModal(true);
      } else {
        setErrorDetails(response.data.message || 'Failed to reserve box');
        setShowErrorModal(true);
      }
    } catch (error: any) {
      console.error('Reservation error:', error);

      if (error.response) {
        const errorMessage = error.response.data.message || 'An error occurred';

        if (errorMessage.includes('already have a reservation')) {
          setErrorDetails('You already have a reservation for this box');
        } else if (errorMessage.includes('All boxes of this type have been reserved')) {
          setErrorDetails('This box is no longer available');
          setItem(prevItem => {
            if (!prevItem) return null;
            return {
              ...prevItem,
              quantity: {
                available: 0,
                reserved: prevItem.quantity.available + prevItem.quantity.reserved
              }
            };
          });
        } else if (error.response.status === 401) {
          setErrorDetails('Please log in to reserve a box');
        } else {
          setErrorDetails(errorMessage);
        }
        setShowErrorModal(true);
      } else {
        setErrorDetails('Network error. Please check your connection.');
        setShowErrorModal(true);
      }
    } finally {
      setReserving(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportReason) {
      toast.error("Please select a reason for reporting");
      return;
    }

    setIsSubmittingReport(true);

    try {
      await api.post('/reports', {
        box_id: id,
        reason: reportReason,
        description: reportDescription
      });

      toast.success("Thank you for your report. We'll review it shortly.");
      setShowReportModal(false);
      setReportReason('');
      setReportDescription('');
    } catch (error) {
      toast.error("Failed to submit report. Please try again.");
      console.error("Report submission error:", error);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleConfirmPickup = async () => {
    if (!reservationId) {
      toast.error('Unable to find your reservation. Please try again from your reservations page.');
      return;
    }

    try {
      const response = await api.post(`/confirmPickup/${reservationId}`);

      if (response.data.success) {
        toast.success('Pickup confirmed successfully!');
        navigate('/reservations');
      } else {
        toast.error(response.data.message || 'Failed to confirm pickup');
      }
    } catch (error) {
      console.error('Error confirming pickup:', error);
      toast.error('Failed to confirm pickup. Please try again.');
    }
  };

  const loadMoreReviews = () => {
    if (hasMoreReviews && !loadingReviews) {
      setReviewsPage(prev => prev + 1);
    }
  };

  const renderReviewStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  };

  const percentageReserved = item ? Math.min(100, Math.round((item.quantity.reserved / (item.quantity.available + item.quantity.reserved)) * 100)) : 0;

  if (loading || error || !item) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F3F0] to-white">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-[80vh]">
          {loading ? (
            <>
              <div className="w-16 h-16 border-4 border-[#02615E] border-t-transparent rounded-full animate-spin mb-6"></div>
              <p className="text-[#02615E] text-lg font-medium">Loading your food box...</p>
            </>
          ) : (
            <div className="max-w-md p-8 bg-white rounded-2xl shadow-xl text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                {error || "Item not found"}
              </h1>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-[#02615E] text-white font-medium rounded-lg"
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderImageSection = () => (
    <div className="relative h-[350px] md:h-full">
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />

      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover object-center"
        onError={(e) => {
          e.currentTarget.src = 'https://via.placeholder.com/800x600?text=No+Image+Available';
        }}
      />

      <button
        onClick={() => setFavorite(!favorite)}
        className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-md transition-transform hover:scale-105"
      >
        {favorite ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        )}
      </button>

      {item.price.discount_percentage > 0 && (
        <div className="absolute top-4 left-4 z-20 bg-[#02615E] text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
          {item.price.discount_percentage}% OFF
        </div>
      )}
    </div>
  );

  const renderDetailsSection = () => (
    <div className="p-8">
      {item.business && (
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#F9F3F0] text-[#02615E] text-sm font-medium mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {item.business.name}
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-800 mb-2">{item.title}</h1>

      <div className="flex items-center mb-4">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="ml-1 text-gray-700 font-medium">{avgRating}</span>
          {reviewCount > 0 && (
            <span className="ml-1 text-gray-500">({reviewCount})</span>
          )}
        </div>

        <span className="mx-3 text-gray-300">|</span>

        <div className="text-sm font-medium text-gray-600">
          {item.quantity.available} {item.quantity.available === 1 ? 'box' : 'boxes'} left
        </div>
      </div>

      <div className="flex items-center mb-6">
        <span className="text-3xl font-bold text-[#02615E]">
          ${item.price.discounted.toFixed(2)}
        </span>
        <span className="ml-3 text-lg text-gray-400 line-through">
          ${item.price.original.toFixed(2)}
        </span>
      </div>

      <div>
        <p className="text-gray-600 leading-relaxed">{item.description}</p>
      </div>
    </div>
  );

  const renderPickupInfoSection = () => (
    <div className="bg-[#F9F3F0] p-8 flex flex-col justify-center">
      <div className="flex items-start mb-6">
        <div className="mr-3 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#02615E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Pickup Time</h3>
          <p className="text-gray-600">{item.pickup_time}</p>
        </div>
      </div>

      {item.business && (
        <div className="flex items-start">
          <div className="mr-3 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#02615E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Address</h3>
            <p className="text-gray-600">{item.business.address}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderActionsSection = () => (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Availability Status
          </span>
          <span className="text-sm text-gray-500">
            {item.quantity.available} of {item.quantity.available + item.quantity.reserved} left
          </span>
        </div>
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#02615E] transition-all duration-500"
            style={{ width: `${100 - percentageReserved}%` }}
          ></div>
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        <button
          onClick={handleReserveClick}
          disabled={item.quantity.available <= 0 || reserving}
          className={`
            w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center
            ${item.quantity.available <= 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : reserving
                ? 'bg-[#02615E]/80 text-white cursor-wait'
                : 'bg-[#02615E] text-white hover:bg-[#024e4b] shadow-lg hover:shadow-xl'
            }
          `}
        >
          {reserving ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : item.quantity.available <= 0 ? (
            'Sold Out'
          ) : (
            'Reserve This Box'
          )}
        </button>

        <button
          onClick={() => navigate('/')}
          className="py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Back to Explore
        </button>

        {isReserved && (
          <button
            onClick={handleConfirmPickup}
            className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Confirm Pickup
          </button>
        )}

        {canReview && pickedUpReservationId && (
          <button
            onClick={() => setShowReviewModal(true)}
            className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Rate & Review
          </button>
        )}

        <button
          onClick={() => setShowReportModal(true)}
          className="mt-3 py-3 rounded-xl border-2 border-red-200 text-red-600 font-medium hover:bg-red-50 flex items-center justify-center transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Report an Issue
        </button>
      </div>
    </div>
  );

  const renderReviewsSection = () => (
    <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        Reviews
        {reviewCount > 0 && (
          <span className="ml-2 text-sm bg-[#02615E] text-white px-2 py-1 rounded-full">
            {reviewCount}
          </span>
        )}
      </h2>

      {loadingReviews && reviewsPage === 1 ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start">
                <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/6 mb-3"></div>
                  <div className="h-20 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="bg-[#F9F3F0] p-5 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#02615E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reviews Yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Be the first to share your experience with this food box.
          </p>
          {canReview && pickedUpReservationId && (
            <button
              onClick={() => setShowReviewModal(true)}
              className="px-5 py-2.5 bg-[#02615E] text-white rounded-lg font-medium hover:bg-[#024e4b] transition-colors"
            >
              Write a Review
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {reviews.map((review: any) => (
            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start">
                  <div className="h-12 w-12 bg-[#02615E]/10 text-[#02615E] rounded-full flex items-center justify-center font-bold text-xl mr-4">
                    {review.user?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{review.user?.name || 'Anonymous'}</h3>
                    <div className="flex mt-1">
                      {renderReviewStars(review.rating)}
                    </div>
                  </div>
                </div>
                <time className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>
              </div>

              {review.comment && (
                <div className="ml-16 bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              )}
            </div>
          ))}

          {hasMoreReviews && (
            <div className="text-center pt-4">
              <button
                onClick={loadMoreReviews}
                disabled={loadingReviews}
                className="px-6 py-2.5 border border-[#02615E] text-[#02615E] rounded-lg font-medium hover:bg-[#02615E]/5 transition-colors disabled:opacity-50"
              >
                {loadingReviews ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#02615E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  'Load More Reviews'
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderLocationInstructions = () => {
    if (!item.business) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Location</h2>

          <div className="bg-gray-100 h-64 rounded-xl flex items-center justify-center mb-4">
            <p className="text-gray-500">Map location would appear here</p>
          </div>

          <div className="flex items-center p-4 bg-[#F9F3F0] rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#02615E] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-gray-700">{item.business.address}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Pickup Instructions</h2>

          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Reserve Your Box",
                desc: "Click the \"Reserve\" button and complete your reservation."
              },
              {
                step: 2,
                title: "Arrive On Time",
                desc: `Visit the store during the pickup window: ${item.pickup_time}`
              },
              {
                step: 3,
                title: "Show Confirmation",
                desc: "Show your reservation confirmation to the staff to collect your box."
              }
            ].map(instruction => (
              <div key={instruction.step} className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-[#02615E] text-white rounded-full flex items-center justify-center mr-4 font-bold">
                  {instruction.step}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">{instruction.title}</h3>
                  <p className="text-gray-600">{instruction.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F3F0] to-white pb-16">
      <Navbar />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-[#02615E]">Home</button>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-medium truncate max-w-xs">{item.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
          {renderImageSection()}
          {renderDetailsSection()}
          {renderPickupInfoSection()}
          {renderActionsSection()}
        </div>

        {renderLocationInstructions()}
        {renderReviewsSection()}
      </div>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        boxId={id}
        reportReason={reportReason}
        setReportReason={setReportReason}
        reportDescription={reportDescription}
        setReportDescription={setReportDescription}
        onSubmit={handleReportSubmit}
        isSubmitting={isSubmittingReport}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        businessName={item?.business?.name}
        pickupTime={item?.pickup_time}
        address={item?.business?.address}
      />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorMessage={errorDetails}
      />

      {showReviewModal && item && pickedUpReservationId && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          reservationId={pickedUpReservationId}
          boxTitle={item.title}
          businessName={item.business?.name || ''}
          imageUrl={item.image}
        />
      )}
    </div>
  );
}

export default DetailPage;