import React, { useRef, useEffect } from 'react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  boxId?: string | number;
  reportReason: string;
  setReportReason: (reason: string) => void;
  reportDescription: string;
  setReportDescription: (description: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  reportReason,
  setReportReason,
  reportDescription,
  setReportDescription,
  onSubmit,
  isSubmitting
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Report This Box</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={onSubmit}>
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">
                What's wrong with this box?
              </label>
              <div className="space-y-2">
                {[
                  { id: 'misleading', label: 'Misleading information' },
                  { id: 'inappropriate', label: 'Inappropriate content' },
                  { id: 'not-described', label: 'Box not as described' },
                  { id: 'quality', label: 'Quality issues' },
                  { id: 'expired', label: 'Expired food/items' },
                  { id: 'business', label: 'Business misconduct' },
                  { id: 'other', label: 'Other' }
                ].map((reason) => (
                  <div key={reason.id} className="flex items-center">
                    <input
                      id={`reason-${reason.id}`}
                      type="radio"
                      name="reportReason"
                      value={reason.id}
                      checked={reportReason === reason.id}
                      onChange={() => setReportReason(reason.id)}
                      className="h-4 w-4 text-[#02615E] focus:ring-[#02615E] border-gray-300"
                    />
                    <label htmlFor={`reason-${reason.id}`} className="ml-2 block text-gray-700">
                      {reason.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-5">
              <label htmlFor="report-description" className="block text-gray-700 font-medium mb-2">
                Provide additional details (optional)
              </label>
              <textarea
                id="report-description"
                rows={4}
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Please describe the issue in more detail..."
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#02615E]"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#02615E] text-white font-medium rounded-lg hover:bg-[#024e4b] disabled:bg-[#02615E]/70 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Report'
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="bg-[#F9F3F0] p-4 rounded-b-2xl">
          <div className="flex items-start">
            <div className="flex-shrink-0 text-[#02615E]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-2 text-sm text-gray-600">
              Your report will be reviewed by our team and we'll take appropriate action if necessary. Thank you for helping us maintain quality standards!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;