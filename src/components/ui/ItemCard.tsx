import React from 'react';
import { Star, Trash2, ExternalLink } from 'lucide-react';
import type { HobbyItem } from '../types';

interface ItemCardProps {
    item: HobbyItem;
    onDelete: (id: string) => void;
}

// Define categoryStyles and Icon as they are used in the provided snippet
// Assuming a default icon if not provided, or that these will be defined elsewhere
// For now, let's use a placeholder for Icon and define categoryStyles
const categoryStyles: { [key: string]: string } = {
    book: 'bg-blue-100 text-blue-800',
    movie: 'bg-red-100 text-red-800',
    youtube: 'bg-green-100 text-green-800',
    // Add other categories as needed
    default: 'bg-slate-100 text-slate-800',
};

// Placeholder for Icon, assuming it would be a component or a specific icon based on category
const Icon = <Star size={20} className="text-slate-500" />; // Using Star as a generic placeholder

export const ItemCard: React.FC<ItemCardProps> = ({ item, onDelete }) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative overflow-hidden">
            {item.coverUrl && (
                <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-20 rotate-12 group-hover:opacity-40 transition-opacity">
                    <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover rounded-full" />
                </div>
            )}

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex-1 min-w-0">
                    <div className={`p-3 rounded-2xl ${categoryStyles[item.category] || categoryStyles.default}`}>
                        {item.coverUrl ? (
                            <div className="w-6 h-6 rounded-md overflow-hidden">
                                <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            Icon
                        )}
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 truncate pr-2 mt-2">{item.title}</h3>
                    {item.category === 'book' && item.status && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${item.status === 'reading' ? 'bg-blue-50 text-blue-700' :
                            item.status === 'completed' ? 'bg-green-50 text-green-700' :
                                'bg-slate-100 text-slate-600'
                            }`}>
                            {item.status.replace('_', ' ')}
                        </span>
                    )}
                    {item.category === 'youtube' && item.channelName && (
                        <span className="text-sm text-slate-500 block truncate">{item.channelName}</span>
                    )}
                </div>
                {item.rating && (
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star size={14} className="text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="font-bold text-sm text-yellow-700">{item.rating}</span>
                    </div>
                )}
            </div>

            <div className="flex-1">
                {item.memo && (
                    <p className="text-slate-600 text-sm line-clamp-3 mb-4">{item.memo}</p>
                )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                <div className="flex gap-2">
                    {item.url && (
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Open Link"
                        >
                            <ExternalLink size={18} />
                        </a>
                    )}
                </div>
                <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};
