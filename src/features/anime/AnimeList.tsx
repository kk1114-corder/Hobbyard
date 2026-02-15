import { useState } from 'react';
import { Play, Check, MonitorPlay, Calendar, Trash2, Pencil, X } from 'lucide-react';
import type { HobbyItem } from '../../types';
import { clsx } from 'clsx';
import { StarRating } from '../../components/ui/StarRating';
import { FilterBar, type SortOption } from '../../components/ui/FilterBar';

interface AnimeListProps {
    items: HobbyItem[];
    onUpdateStatus: (id: string, status: 'want_to_watch' | 'watching' | 'watched', rating?: number) => void;
    onDelete: (id: string) => void;
    onEdit?: (item: HobbyItem) => void;
}

export function AnimeList({ items, onUpdateStatus, onDelete, onEdit }: AnimeListProps) {
    const [activeTab, setActiveTab] = useState<'watching' | 'want_to_watch' | 'watched'>('watching');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<SortOption>('date_desc');


    const getTabLabel = (tab: string) => {
        switch (tab) {
            case 'watching': return '視聴中';
            case 'want_to_watch': return '見たい';
            case 'watched': return '視聴済み';
            default: return tab;
        }
    };

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
            if (activeTab === 'watching' && item.status !== 'watching') return false;
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
            {/* Anime Stats / Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-8 text-white shadow-2xl shadow-fuchsia-500/20 transition-all hover:shadow-fuchsia-500/30">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h2 className="text-xl md:text-3xl font-black tracking-tight font-display italic">ANIME COLLECTION</h2>
                            <p className="mt-2 text-fuchsia-100 font-medium tracking-wide">
                                {items.length} TITLES TRACKED
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
                                                ? "bg-white text-fuchsia-600 border-white shadow-md shadow-black/20"
                                                : "bg-white/10 text-white/90 border-white/20 hover:bg-white hover:text-fuchsia-600"
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
                {/* Pop Tabs */}
                <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-full sm:w-fit backdrop-blur-sm border border-white/10 overflow-x-auto">
                    {(['watching', 'want_to_watch', 'watched'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={clsx(
                                "flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap",
                                activeTab === tab
                                    ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/25 scale-105"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {getTabLabel(tab)}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center">
                    {/* Active Tag Indicator */}
                    {selectedTag && (
                        <div className="flex items-center gap-2 bg-fuchsia-500/10 text-fuchsia-300 px-4 py-2 rounded-xl border border-fuchsia-500/20 text-sm font-medium animate-in fade-in slide-in-from-right-4">
                            <span>#{selectedTag}</span>
                            <button
                                onClick={() => setSelectedTag(null)}
                                className="hover:bg-fuchsia-500/20 p-0.5 rounded-full transition-colors"
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
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-white/10 rounded-3xl">
                        <MonitorPlay size={48} className="mx-auto text-white/20 mb-4" />
                        <p className="text-white/40 font-medium">
                            {selectedTag ? `タグ #${selectedTag} のアニメはありません。` : 'リストにアニメがありません。'}
                        </p>
                        {selectedTag && (
                            <button
                                onClick={() => setSelectedTag(null)}
                                className="mt-4 text-fuchsia-400 hover:underline text-sm font-medium"
                            >
                                フィルターを解除
                            </button>
                        )}
                    </div>
                ) : (
                    filteredItems.map((anime) => (
                        <div
                            key={anime.id}
                            className="group relative aspect-[2/3] rounded-2xl overflow-hidden bg-slate-900 border border-white/5 shadow-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-fuchsia-500/10 hover:border-fuchsia-500/50"
                        >
                            {/* Edit Button (Visible on Hover) */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onEdit?.(anime);
                                }}
                                className="absolute top-2 right-2 z-20 p-2 bg-black/50 text-white/50 hover:bg-indigo-600 hover:text-white rounded-full md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm delay-75"
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
                                        onDelete(anime.id);
                                    }
                                }}
                                className="absolute top-2 left-2 z-20 p-2 bg-black/50 text-white/50 hover:bg-red-600 hover:text-white rounded-full md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                                title="削除"
                            >
                                <Trash2 size={16} />
                            </button>

                            <img
                                src={anime.coverUrl || 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1000&auto=format&fit=crop'}
                                alt={anime.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90 md:opacity-60 transition-opacity duration-300 md:group-hover:opacity-90" />

                            {/* Status Badge */}
                            <div className="absolute top-3 right-3 pointer-events-none">
                                {anime.status === 'watching' && <span className="px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-lg shadow-emerald-500/40">視聴中</span>}
                                {anime.status === 'want_to_watch' && <span className="px-2 py-1 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-lg shadow-blue-500/40">見たい</span>}
                                {anime.status === 'watched' && <span className="px-2 py-1 bg-fuchsia-500 text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-lg shadow-fuchsia-500/40">視聴済み</span>}
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                                <h3 className="font-bold text-white text-lg leading-tight line-clamp-2 mb-1 drop-shadow-md">
                                    {anime.title}
                                </h3>

                                {/* Rating Stars */}
                                {anime.rating && anime.status === 'watched' && (
                                    <div className="mb-2">
                                        <StarRating rating={anime.rating} readonly size={14} />
                                    </div>
                                )}

                                {/* Tags */}
                                {anime.tags && anime.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        {anime.tags.slice(0, 3).map(tag => (
                                            <button
                                                key={tag}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleTagClick(tag);
                                                }}
                                                className={clsx(
                                                    "text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm border transition-colors",
                                                    selectedTag === tag
                                                        ? "bg-fuchsia-500 text-white border-fuchsia-500 shadow-sm"
                                                        : "bg-white/10 text-white/80 border-white/10 hover:bg-white/20"
                                                )}
                                            >
                                                #{tag}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Hover Actions / Details */}
                                <div className="space-y-3 md:opacity-0 transition-opacity duration-300 md:group-hover:opacity-100 pb-2">
                                    {anime.dateWatched && (
                                        <div className="flex items-center gap-1.5 text-xs text-white/60">
                                            <Calendar size={12} />
                                            <span>{activeTab === 'watching' ? '開始:' : '完了:'} {new Date(anime.dateWatched).toLocaleDateString()}</span>
                                        </div>
                                    )}

                                    {anime.memo && (
                                        <div
                                            className="text-xs text-slate-300 line-clamp-3"
                                        >
                                            {anime.memo}
                                        </div>
                                    )}

                                    <div className="flex gap-2 pt-2">
                                        {activeTab !== 'watched' && (
                                            <button
                                                onClick={() => onUpdateStatus(anime.id, 'watched', 5)}
                                                className="flex-1 flex items-center justify-center gap-1.5 bg-white text-slate-900 py-1.5 rounded-lg text-xs font-bold hover:bg-fuchsia-50 transition-colors"
                                            >
                                                <Check size={14} /> 完了
                                            </button>
                                        )}
                                        {activeTab === 'want_to_watch' && (
                                            <button
                                                onClick={() => onUpdateStatus(anime.id, 'watching')}
                                                className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 text-white border border-white/10 py-1.5 rounded-lg text-xs font-bold hover:bg-white/20 transition-colors"
                                            >
                                                <Play size={14} /> 視聴
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
