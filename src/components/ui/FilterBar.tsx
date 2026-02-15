import React from 'react';
import { Search, ArrowUpDown } from 'lucide-react';

export type SortOption = 'date_desc' | 'date_asc' | 'rating_desc' | 'rating_asc' | 'title_asc';

interface FilterBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    sortOption: SortOption;
    onSortChange: (option: SortOption) => void;
    placeholder?: string;
    className?: string;
    variant?: 'dark' | 'light';
}

export const FilterBar: React.FC<FilterBarProps> = ({
    searchQuery,
    onSearchChange,
    sortOption,
    onSortChange,
    placeholder = "タイトルで検索...",
    className = "",
    variant = 'dark'
}) => {
    const textColor = variant === 'light' ? 'text-slate-900' : 'text-white';
    const placeholderColor = variant === 'light' ? 'placeholder-slate-500' : 'placeholder-white/50';
    const bgColor = variant === 'light' ? 'bg-white/80 border-slate-200' : 'bg-white/10 border-white/20';
    const ringColor = variant === 'light' ? 'focus:ring-slate-400' : 'focus:ring-white/20';
    const iconColor = variant === 'light' ? 'text-slate-500' : 'text-slate-400';

    return (
        <div className={`flex flex-col sm:flex-row gap-4 mb-6 ${className}`}>
            <div className="relative flex-1">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 transition-all backdrop-blur-sm border ${bgColor} ${textColor} ${placeholderColor} ${ringColor}`}
                />
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconColor} pointer-events-none`} size={18} />
            </div>

            <div className="relative min-w-[200px]">
                <select
                    value={sortOption}
                    onChange={(e) => onSortChange(e.target.value as SortOption)}
                    className={`w-full pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer backdrop-blur-sm border ${bgColor} ${textColor} ${ringColor}`}
                    style={{ backgroundImage: 'none' }}
                >
                    <option value="date_desc" className="text-slate-900">追加日 (新しい順)</option>
                    <option value="date_asc" className="text-slate-900">追加日 (古い順)</option>
                    <option value="rating_desc" className="text-slate-900">評価 (高い順)</option>
                    <option value="rating_asc" className="text-slate-900">評価 (低い順)</option>
                    <option value="title_asc" className="text-slate-900">タイトル順</option>
                </select>
                <ArrowUpDown className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconColor} pointer-events-none`} size={18} />
            </div>
        </div>
    );
};
