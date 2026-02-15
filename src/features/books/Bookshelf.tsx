import { useState } from 'react';
import { Check, BookOpen, Calendar, Trash2, Pencil, X } from 'lucide-react';
import type { HobbyItem } from '../../types';
import { clsx } from 'clsx';
import { StarRating } from '../../components/ui/StarRating';
import { FilterBar, type SortOption } from '../../components/ui/FilterBar';

interface BookshelfProps {
    items: HobbyItem[];
    onDelete: (id: string) => void;
    onUpdateStatus?: (id: string, status: 'reading' | 'completed' | 'want_to_read', rating?: number) => void;
    onEdit?: (item: HobbyItem) => void;
}

export function Bookshelf({ items, onDelete, onUpdateStatus, onEdit }: BookshelfProps) {
    const [activeTab, setActiveTab] = useState<'reading' | 'want_to_read' | 'completed'>('reading');
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
            if (activeTab === 'reading' && item.status !== 'reading') return false;
            if (activeTab === 'want_to_read' && item.status !== 'want_to_read' && item.status) return false;
            if (activeTab === 'completed' && item.status !== 'completed') return false;

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

    const readingCount = items.filter(i => i.status === 'reading').length;
    const wantToReadCount = items.filter(i => i.status === 'want_to_read' || !i.status).length;
    const completedCount = items.filter(i => i.status === 'completed').length;

    const handleTagClick = (tag: string) => {
        setSelectedTag(prev => prev === tag ? null : tag);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm border border-slate-200/60 transition-all hover:shadow-md">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h2 className="text-xl md:text-3xl font-bold tracking-tight text-slate-800 font-sans">MY LIBRARY</h2>
                            <p className="mt-2 text-slate-500 font-medium tracking-wide">
                                {items.length} BOOKS
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
                                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                                : "bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600"
                                        )}
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 mt-8">
                        <div className="bg-slate-50 rounded-xl p-3 px-5 border border-slate-100 shadow-sm flex-1 md:flex-none min-w-[100px]">
                            <span className="block text-2xl font-bold text-slate-700">{readingCount}</span>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">読書中</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 px-5 border border-slate-100 shadow-sm flex-1 md:flex-none min-w-[100px]">
                            <span className="block text-2xl font-bold text-slate-700">{wantToReadCount}</span>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">積読</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 px-5 border border-slate-100 shadow-sm flex-1 md:flex-none min-w-[100px]">
                            <span className="block text-2xl font-bold text-slate-700">{completedCount}</span>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">読了</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                {/* Tabs */}
                <div className="flex gap-2 p-1 bg-white rounded-2xl w-full sm:w-fit border border-slate-200 shadow-sm overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('reading')}
                        className={clsx(
                            "flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap",
                            activeTab === 'reading'
                                ? "bg-blue-600 text-white shadow-md transform scale-105"
                                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        読書中
                    </button>
                    <button
                        onClick={() => setActiveTab('want_to_read')}
                        className={clsx(
                            "flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap",
                            activeTab === 'want_to_read'
                                ? "bg-blue-600 text-white shadow-md transform scale-105"
                                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        積読
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={clsx(
                            "flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap",
                            activeTab === 'completed'
                                ? "bg-blue-600 text-white shadow-md transform scale-105"
                                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        読了
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center">
                    {/* Active Tag Indicator */}
                    {selectedTag && (
                        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-100 text-sm font-medium animate-in fade-in slide-in-from-right-4">
                            <span>#{selectedTag}</span>
                            <button
                                onClick={() => setSelectedTag(null)}
                                className="hover:bg-blue-100 p-0.5 rounded-full transition-colors"
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
                        variant="light"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredItems.length === 0 ? (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                        <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-400 font-medium">
                            {selectedTag ? `タグ #${selectedTag} の本はありません。` : 'このリストには本がありません。'}
                        </p>
                        {selectedTag && (
                            <button
                                onClick={() => setSelectedTag(null)}
                                className="mt-4 text-blue-600 hover:underline text-sm font-medium"
                            >
                                フィルターを解除
                            </button>
                        )}
                    </div>
                ) : (
                    filteredItems.map((book) => (
                        <div
                            key={book.id}
                            className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ring-1 ring-slate-900/5 hover:ring-blue-500/30"
                        >
                            {/* Edit Button (Visible on Hover) */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onEdit?.(book);
                                }}
                                className="absolute top-2 right-2 z-20 p-2 bg-white/90 text-slate-600 hover:bg-blue-600 hover:text-white rounded-full md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 shadow-sm border border-slate-200"
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
                                        onDelete(book.id);
                                    }
                                }}
                                className="absolute top-2 left-2 z-20 p-2 bg-white/90 text-slate-600 hover:bg-red-600 hover:text-white rounded-full md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 shadow-sm border border-slate-200"
                                title="削除"
                            >
                                <Trash2 size={16} />
                            </button>

                            <img
                                src={book.coverUrl || 'https://images.unsplash.com/photo-1543002588-6e92e62f855b?q=80&w=1000&auto=format&fit=crop'}
                                alt={book.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Status Badge */}
                            <div className="absolute top-3 right-3 shadow-sm">
                                {book.status === 'reading' && <span className="px-2 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-md border border-white/20">読書中</span>}
                                {book.status === 'want_to_read' && <span className="px-2 py-1 bg-slate-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-md border border-white/20">積読</span>}
                                {book.status === 'completed' && <span className="px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-md border border-white/20">読了</span>}
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-4 md:translate-y-4 transition-transform duration-300 md:group-hover:translate-y-0 md:opacity-0 md:group-hover:opacity-100">
                                <h3 className="font-bold text-white text-lg leading-tight line-clamp-2 mb-1 drop-shadow-md">
                                    {book.title}
                                </h3>

                                {book.rating && book.status === 'completed' && (
                                    <div className="mb-2">
                                        <StarRating rating={book.rating} readonly size={14} className="text-yellow-400" />
                                    </div>
                                )}

                                {book.tags && book.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {book.tags.slice(0, 3).map(tag => (
                                            <button
                                                key={tag}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleTagClick(tag);
                                                }}
                                                className={clsx(
                                                    "text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm border transition-colors",
                                                    selectedTag === tag
                                                        ? "bg-blue-600 text-white border-blue-500"
                                                        : "bg-white/20 text-white/90 border-white/10 hover:bg-white/30"
                                                )}
                                            >
                                                #{tag}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="space-y-3 pb-1">
                                    {book.dateWatched && (
                                        <div className="flex items-center gap-1.5 text-xs text-white/80">
                                            <Calendar size={12} />
                                            <span>読了日: {new Date(book.dateWatched).toLocaleDateString()}</span>
                                        </div>
                                    )}

                                    {book.memo && (
                                        <div
                                            className="text-xs text-slate-200/90 line-clamp-3 italic"
                                        >
                                            {book.memo}
                                        </div>
                                    )}

                                    <div className="flex gap-2 pt-1">
                                        {activeTab === 'reading' && onUpdateStatus && (
                                            <button
                                                onClick={() => onUpdateStatus(book.id, 'completed', 0)}
                                                className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 text-white py-1.5 rounded-lg text-xs font-bold hover:bg-blue-500 transition-colors shadow-sm"
                                            >
                                                <Check size={14} /> 読了
                                            </button>
                                        )}
                                        {activeTab === 'want_to_read' && onUpdateStatus && (
                                            <button
                                                onClick={() => onUpdateStatus(book.id, 'reading')}
                                                className="flex-1 flex items-center justify-center gap-1.5 bg-white text-slate-900 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors shadow-sm"
                                            >
                                                <BookOpen size={14} /> 読む
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
