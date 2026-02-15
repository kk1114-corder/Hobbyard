import { useState } from 'react';
import { Calendar, Trash2, Film, Check, Pencil, X } from 'lucide-react';
import type { HobbyItem } from '../../types';
import { clsx } from 'clsx';
import { StarRating } from '../../components/ui/StarRating';
import { FilterBar, type SortOption } from '../../components/ui/FilterBar';

interface MovieTheaterProps {
    items: HobbyItem[];
    onUpdateStatus?: (id: string, status: 'watched' | 'want_to_watch', rating?: number) => void;
    onDelete: (id: string) => void;
    onEdit?: (item: HobbyItem) => void;
}

export function MovieTheater({ items, onUpdateStatus, onDelete, onEdit }: MovieTheaterProps) {
    const [activeTab, setActiveTab] = useState<'watched' | 'want_to_watch'>('watched');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<SortOption>('date_desc');


    // Calculate Popular Tags
    const allTags = items.flatMap(item => item.tags || []);
    const tagCounts = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const popularTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([tag]) => tag);

    // Filter & Sort Logic
    const filteredItems = items
        .filter(item => {
            // Tab Filter
            if (activeTab === 'want_to_watch' && item.status !== 'want_to_watch' && item.status) return false;
            if (activeTab === 'watched' && item.status !== 'watched') return false;

            // Tag Filter
            if (selectedTag && !item.tags?.includes(selectedTag)) return false;

            // Search Filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchTitle = item.title.toLowerCase().includes(query);
                const matchMemo = item.memo?.toLowerCase().includes(query);
                const matchTags = item.tags?.some(tag => tag.toLowerCase().includes(query));
                if (!matchTitle && !matchMemo && !matchTags) return false;
            }
            return true;
        })
        .sort((a, b) => {
            switch (sortOption) {
                case 'date_desc':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'date_asc':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'rating_desc':
                    return (b.rating || 0) - (a.rating || 0);
                case 'rating_asc':
                    return (a.rating || 0) - (b.rating || 0);
                case 'title_asc':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

    const handleTagClick = (tag: string) => {
        setSelectedTag(prev => prev === tag ? null : tag);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-neutral-900/60 p-8 text-white shadow-2xl backdrop-blur-md border border-white/10 ring-1 ring-white/5 transition-all hover:shadow-red-900/10">
                {/* Red ambient glow */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-red-900/20 blur-3xl pointer-events-none"></div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h2 className="text-4xl font-black tracking-tighter font-display italic text-red-600 drop-shadow-sm">MOVIE COLLECTION</h2>
                            <p className="mt-2 text-neutral-400 font-medium tracking-wide">
                                {items.length} TITLES
                            </p>
                        </div>

                        {/* Popular Tags Cloud */}
                        {popularTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 max-w-md justify-start md:justify-end">
                                {popularTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => handleTagClick(tag)}
                                        className={clsx(
                                            "text-xs px-2.5 py-1 rounded-full border transition-all duration-300",
                                            selectedTag === tag
                                                ? "bg-red-600 text-white border-red-600 shadow-md shadow-red-900/30"
                                                : "bg-black/40 text-neutral-400 border-white/5 hover:border-red-500/50 hover:text-red-400 hover:bg-neutral-800"
                                        )}
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                {/* Tabs */}
                <div className="flex gap-2 p-1 bg-black/40 rounded-2xl w-full sm:w-fit backdrop-blur-sm border border-white/5 mx-auto md:mx-0 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('want_to_watch')}
                        className={clsx(
                            "flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap",
                            activeTab === 'want_to_watch'
                                ? "bg-red-600 text-white shadow-lg shadow-red-900/30 scale-105"
                                : "text-neutral-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        見たい映画
                    </button>
                    <button
                        onClick={() => setActiveTab('watched')}
                        className={clsx(
                            "flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap",
                            activeTab === 'watched'
                                ? "bg-white text-black shadow-lg scale-105"
                                : "text-neutral-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        視聴済み
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center">
                    {/* Active Tag Indicator */}
                    {selectedTag && (
                        <div className="flex items-center gap-2 bg-red-900/20 text-red-400 px-4 py-2 rounded-xl border border-red-500/20 text-sm font-medium animate-in fade-in slide-in-from-right-4">
                            <span>#{selectedTag}</span>
                            <button
                                onClick={() => setSelectedTag(null)}
                                className="hover:bg-red-500/20 p-0.5 rounded-full transition-colors"
                            >
                                <X size={14} className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}

                    {/* Filter Bar */}
                    <FilterBar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        sortOption={sortOption}
                        onSortChange={setSortOption}
                        className="w-full sm:w-auto mb-0"
                        variant="dark"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredItems.length === 0 ? (
                    <div className="col-span-full py-32 text-center border border-dashed border-neutral-800 rounded-3xl bg-black/20">
                        <Film size={48} className="mx-auto text-neutral-700 mb-4" />
                        <p className="text-neutral-500 font-medium">
                            {selectedTag ? `タグ #${selectedTag} の映画はありません。` : 'リストに映画がありません。'}
                        </p>
                        {selectedTag && (
                            <button
                                onClick={() => setSelectedTag(null)}
                                className="mt-4 text-red-500 hover:underline text-sm font-medium"
                            >
                                フィルターを解除
                            </button>
                        )}
                    </div>
                ) : (
                    filteredItems.map((movie) => (
                        <div
                            key={movie.id}
                            className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-neutral-900 border border-white/10 shadow-lg shadow-black/50 transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:shadow-red-900/20 hover:z-10 hover:border-white/20"
                        >
                            {/* Edit Button (Visible on Hover) */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onEdit?.(movie);
                                }}
                                className="absolute top-2 right-2 z-20 p-2 bg-black/50 text-white/50 hover:bg-indigo-600 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm delay-75"
                                title="編集"
                            >
                                <Pencil size={16} />
                            </button>

                            {/* Delete Button (Visible on Hover) */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (window.confirm('本当に削除しますか？')) {
                                        onDelete(movie.id);
                                    }
                                }}
                                className="absolute top-2 left-2 z-20 p-2 bg-black/50 text-white/50 hover:bg-red-600 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                                title="削除"
                            >
                                <Trash2 size={16} />
                            </button>

                            <img
                                src={movie.coverUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop'}
                                alt={movie.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

                            {/* Status Badge */}
                            <div className="absolute top-3 right-3 pointer-events-none">
                                {movie.status === 'want_to_watch' && <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-lg shadow-red-900/50">見たい</span>}
                                {movie.status === 'watched' && <span className="px-2 py-0.5 bg-neutral-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-lg">済み</span>}
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                                <h3 className="font-bold text-white text-lg leading-tight line-clamp-2 mb-1 drop-shadow-md">
                                    {movie.title}
                                </h3>

                                {movie.rating && movie.status === 'watched' && (
                                    <div className="mb-2">
                                        <StarRating rating={movie.rating} readonly size={14} />
                                    </div>
                                )}

                                {movie.tags && movie.tags.length > 0 ? (
                                    <div className="flex flex-wrap gap-1 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {movie.tags.slice(0, 3).map(tag => (
                                            <button
                                                key={tag}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleTagClick(tag);
                                                }}
                                                className={clsx(
                                                    "text-[10px] px-1.5 py-0.5 rounded-sm border transition-colors",
                                                    selectedTag === tag
                                                        ? "bg-red-600 text-white border-red-600"
                                                        : "bg-neutral-800 text-neutral-300 border-neutral-700/50 hover:bg-neutral-700 hover:text-white"
                                                )}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mb-2 h-6" /> /* Spacer to prevent layout shift */
                                )}

                                <div className="space-y-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pb-1">
                                    {movie.dateWatched && (
                                        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                                            <Calendar size={12} />
                                            <span>視聴日: {new Date(movie.dateWatched).toLocaleDateString()}</span>
                                        </div>
                                    )}

                                    {movie.memo && (
                                        <div
                                            className="text-xs text-neutral-300 line-clamp-3"
                                        >
                                            {movie.memo}
                                        </div>
                                    )}

                                    <div className="flex gap-2 pt-2">
                                        {activeTab === 'want_to_watch' && (
                                            <button
                                                onClick={() => onUpdateStatus?.(movie.id, 'watched', 0)}
                                                className="flex-1 flex items-center justify-center gap-1.5 bg-white text-black py-2 rounded font-bold text-xs hover:bg-neutral-200 transition-colors"
                                            >
                                                <Check size={14} /> 視聴完了
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
