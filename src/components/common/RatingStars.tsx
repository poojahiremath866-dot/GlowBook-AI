import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewCount?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  max = 5,
  size = 'sm',
  showNumber = true,
  reviewCount,
}) => {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4;

  return (
    <div className="inline-flex items-center space-x-1">
      <div className="flex items-center text-amber-500">
        {[...Array(max)].map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} className={`${iconSize} fill-amber-400 text-amber-400`} />;
          }
          if (i === fullStars && hasHalfStar) {
            return <StarHalf key={i} className={`${iconSize} fill-amber-400 text-amber-400`} />;
          }
          return <Star key={i} className={`${iconSize} text-stone-300`} />;
        })}
      </div>
      {showNumber && (
        <span className={`font-semibold text-stone-900 ${size === 'sm' ? 'text-xs' : 'text-sm'} ml-1`}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={`text-stone-500 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
