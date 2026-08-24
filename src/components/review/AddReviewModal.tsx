import React, { useState } from 'react';
import { Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import { Appointment, Review } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onReviewSubmitted?: (review: Review) => void;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onReviewSubmitted,
}) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!appointment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showNotification('error', 'Comment Required', 'Please share details about your salon experience.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.createReview({
        userId: user?.id || appointment.userId,
        userName: user?.name || appointment.userName,
        parlorId: appointment.parlorId,
        serviceName: appointment.serviceName,
        beauticianName: appointment.beauticianName,
        rating,
        comment,
        appointmentId: appointment.id
      });

      if (res.success && res.review) {
        showNotification('success', 'Review Published! ⭐', 'Thank you for supporting our beauticians.');
        if (onReviewSubmitted) onReviewSubmitted(res.review);
        onClose();
      }
    } catch (err: any) {
      showNotification('error', 'Review Error', err.message || 'Could not submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white">
            <Star className="w-4 h-4 fill-white" />
          </div>
          <div>
            <h3 className="text-lg font-serif-luxury font-bold text-stone-900 leading-tight">
              Rate Your Experience
            </h3>
            <p className="text-xs text-stone-500">
              {appointment.parlorName} • {appointment.serviceName}
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
        {/* Star Selection */}
        <div className="text-center space-y-2 py-2 bg-[#FCFAF8] rounded-2xl border border-stone-200/80 p-4">
          <p className="font-bold text-stone-700 uppercase tracking-wider text-[11px]">
            Overall Rating
          </p>
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-125 cursor-pointer"
              >
                <Star
                  className={`w-7 h-7 ${
                    (hoverRating || rating) >= star
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-stone-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-xs font-semibold text-stone-600">
            {rating === 5 ? 'Exceptional Luxury Experience (5/5)' : `${rating} out of 5 Stars`}
          </p>
        </div>

        {/* Comment */}
        <div>
          <label className="block font-bold text-stone-700 uppercase mb-1.5">
            Your Honest Feedback
          </label>
          <textarea
            rows={4}
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was the hygiene, punctuality, product quality, and stylist expertise?"
            className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-500/20 text-xs leading-relaxed"
          />
        </div>

        <div className="bg-stone-50 rounded-xl p-3 text-[11px] text-stone-500 space-y-1">
          <p className="font-semibold text-stone-700">Verified Booking Details:</p>
          <p>Stylist: <strong>{appointment.beauticianName}</strong> • Date: {appointment.date}</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-stone-900 hover:bg-rose-600 text-white font-bold rounded-xl transition cursor-pointer text-xs shadow-md"
        >
          {loading ? 'Publishing Review...' : 'Submit Verified Review'}
        </button>
      </form>
    </Modal>
  );
};
