import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number; // 0 to 5
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
    size?: number;
    className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
    rating,
    onRatingChange,
    readonly = false,
    size = 20,
    className = ""
}) => {
    // Handling click for 0.5 increments
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>, starIndex: number) => {
        if (readonly || !onRatingChange) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;

        // If click is on the left half (less than 50%), set X.5
        // If click is on the right half, set X.0
        const isHalf = x < width / 2;
        const newRating = isHalf ? starIndex + 0.5 : starIndex + 1;

        onRatingChange(newRating);
    };

    return (
        <div className={`flex items-center gap-0.5 ${className}`}>
            {[0, 1, 2, 3, 4].map((index) => {
                const full = index + 1 <= rating;
                const half = index + 0.5 === rating;

                return (
                    <button
                        key={index}
                        type="button"
                        onClick={(e) => handleClick(e, index)}
                        className={`relative ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}`}
                        disabled={readonly}
                        title={`${index + 1} Stars`}
                    >
                        {/* Render based on state */}
                        {full ? (
                            <Star size={size} className="fill-yellow-400 text-yellow-400" />
                        ) : half ? (
                            <div className="relative">
                                <Star size={size} className="text-slate-200 fill-slate-200" />
                                <div className="absolute top-0 left-0 w-[50%] overflow-hidden">
                                    <Star size={size} className="fill-yellow-400 text-yellow-400" />
                                </div>
                            </div>
                        ) : (
                            <Star size={size} className="text-slate-200 fill-slate-200" />
                        )}
                    </button>
                );
            })}
            {!readonly && (
                <span className="ml-2 text-sm font-medium text-slate-500 w-8">{rating}</span>
            )}
        </div>
    );
};
