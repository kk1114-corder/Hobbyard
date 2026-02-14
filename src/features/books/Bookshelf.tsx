import { useState } from 'react';
import { Plus, Check, Star, Book, Calendar, BookOpen } from 'lucide-react';
import type { HobbyItem } from '../../types';
import { clsx } from 'clsx';

interface BookshelfProps {
    items: HobbyItem[];
    onDelete: (id: string) => void;
    onUpdateStatus?: (id: string, status: 'reading' | 'completed' | 'want_to_read', rating?: number) => void;
}

export function Bookshelf({ items, onDelete, onUpdateStatus }: BookshelfProps) {
    const [activeTab, setActiveTab] = useState<'reading' | 'want_to_read' | 'completed'>('reading');
    const [spoilerVisible, setSpoilerVisible] = useState<Record<string, boolean>>({});

    const reading = items.filter(i => i.status === 'reading');
    const wantToRead = items.filter(i => i.status === 'want_to_read' || !i.status);
    const completed = items.filter(i => i.status === 'completed');

    const displayedItems = activeTab === 'reading' ? reading : activeTab === 'want_to_read' ? wantToRead : completed;

    const toggleSpoiler = (id: string) => {
        setSpoilerVisible(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-[#f4e4bc] p-8 text-amber-900 shadow-xl border border-amber-900/5">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/40 blur-3xl"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black tracking-tight font-serif italic text-amber-950">MY LIBRARY</h2>
                    <p className="mt-2 text-amber-800 font-medium tracking-wide font-serif">
                        {items.length} BOOKS
                    </p>
                    <div className="flex gap-4 mt-6">
                        <div className="bg-white/60 backdrop-blur-md rounded-xl p-3 px-5 border border-amber-900/10 shadow-sm">
                            <span className="block text-2xl font-bold font-serif">{reading.length}</span>
                            <span className="text-xs font-bold uppercase tracking-wider opacity-70">読書中</span>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md rounded-xl p-3 px-5 border border-amber-900/10 shadow-sm">
                            <span className="block text-2xl font-bold font-serif">{wantToRead.length}</span>
                            <span className="text-xs font-bold uppercase tracking-wider opacity-70">積読</span>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md rounded-xl p-3 px-5 border border-amber-900/10 shadow-sm">
                            <span className="block text-2xl font-bold font-serif">{completed.length}</span>
                            <span className="text-xs font-bold uppercase tracking-wider opacity-70">読了</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-[#f0e6d2] rounded-2xl w-fit border border-amber-900/5 shadow-inner">
                <button
                    onClick={() => setActiveTab('reading')}
                    className={clsx(
                        "px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 font-serif",
                        activeTab === 'reading'
                            ? "bg-white text-amber-900 shadow-md transform scale-105 border border-amber-900/5"
                            : "text-amber-800/60 hover:text-amber-900 hover:bg-white/40"
                    )}
                >
                    読書中
                </button>
                <button
                    onClick={() => setActiveTab('want_to_read')}
                    className={clsx(
                        "px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 font-serif",
                        activeTab === 'want_to_read'
                            ? "bg-white text-amber-900 shadow-md transform scale-105 border border-amber-900/5"
                            : "text-amber-800/60 hover:text-amber-900 hover:bg-white/40"
                    )}
                >
                    読みたい
                </button>
                <button
                    onClick={() => setActiveTab('completed')}
                    className={clsx(
                        "px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 font-serif",
                        activeTab === 'completed'
                            ? "bg-white text-amber-900 shadow-md transform scale-105 border border-amber-900/5"
                            : "text-amber-800/60 hover:text-amber-900 hover:bg-white/40"
                    )}
                >
                    読了
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {displayedItems.length === 0 ? (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-amber-900/10 rounded-3xl bg-[#fdfbf7]">
                        <BookOpen size={48} className="mx-auto text-amber-900/20 mb-4" />
                        <p className="text-amber-900/40 font-medium font-serif">このリストには本がありません。</p>
                    </div>
                ) : (
                    displayedItems.map((book) => (
                        <div
                            key={book.id}
                            className="group relative aspect-[2/3] rounded-tr-3xl rounded-bl-3xl rounded-tl-sm rounded-br-sm overflow-hidden bg-[#fdfbf7] shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1 border-l-4 border-l-amber-900/80"
                        >
                            <img
                                src={book.coverUrl || 'https://images.unsplash.com/photo-1543002588-6e92e62f855b?q=80&w=1000&auto=format&fit=crop'}
                                alt={book.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 sepia-[0.2]"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-amber-950 via-amber-900/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

                            {/* Status Badge */}
                            <div className="absolute top-3 right-3">
                                {book.status === 'reading' && <span className="px-2 py-1 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-lg">読書中</span>}
                                {book.status === 'want_to_read' && <span className="px-2 py-1 bg-stone-500 text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-lg">積読</span>}
                                {book.status === 'completed' && <span className="px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-lg">読了</span>}
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                                <h3 className="font-bold text-white text-lg leading-tight line-clamp-2 mb-1 drop-shadow-md font-serif">
                                    {book.title}
                                </h3>

                                {book.rating && (
                                    <div className="flex gap-0.5 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={12}
                                                className={i < book.rating! ? "fill-amber-400 text-amber-400" : "fill-white/30 text-white/30"}
                                            />
                                        ))}
                                    </div>
                                )}

                                {book.tags && book.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        {book.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white/90 backdrop-blur-sm font-serif">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="space-y-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pb-2">
                                    {book.dateWatched && (
                                        <div className="flex items-center gap-1.5 text-xs text-white/80 font-serif">
                                            <Calendar size={12} />
                                            <span>読了日: {new Date(book.dateWatched).toLocaleDateString()}</span>
                                        </div>
                                    )}

                                    {book.memo && (
                                        <div
                                            className="text-xs text-amber-100/80 line-clamp-3 cursor-pointer hover:text-white transition-colors font-serif italic"
                                            onClick={() => book.spoiler && toggleSpoiler(book.id)}
                                        >
                                            {book.spoiler && !spoilerVisible[book.id] ? (
                                                <span className="flex items-center gap-1 text-amber-300 font-bold bg-amber-950/40 px-2 py-1 rounded border border-amber-300/30 w-fit not-italic">
                                                    ⚠️ ネタバレ (クリック)
                                                </span>
                                            ) : (
                                                book.memo
                                            )}
                                        </div>
                                    )}

                                    <div className="flex gap-2 pt-2">
                                        {activeTab === 'reading' && onUpdateStatus && (
                                            <button
                                                onClick={() => onUpdateStatus(book.id, 'completed', 0)}
                                                className="flex-1 flex items-center justify-center gap-1.5 bg-[#f4e4bc] text-amber-900 py-1.5 rounded-lg text-xs font-bold hover:bg-white transition-colors shadow-lg font-serif"
                                            >
                                                <Check size={14} /> 読了
                                            </button>
                                        )}
                                        {activeTab === 'want_to_read' && onUpdateStatus && (
                                            <button
                                                onClick={() => onUpdateStatus(book.id, 'reading')}
                                                className="flex-1 flex items-center justify-center gap-1.5 bg-[#f4e4bc]/20 border border-[#f4e4bc]/40 text-[#f4e4bc] py-1.5 rounded-lg text-xs font-bold hover:bg-[#f4e4bc]/30 transition-colors font-serif"
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
