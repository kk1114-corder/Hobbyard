import { useState } from 'react';
import { Plus, Play, Check, Star, Film, Calendar, Tag } from 'lucide-react';
import type { HobbyItem } from '../../types';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface MovieTheaterProps {
    items: HobbyItem[];
    onUpdateStatus: (id: string, status: 'want_to_watch' | 'watched', rating?: number) => void;
}

export function MovieTheater({ items, onUpdateStatus }: MovieTheaterProps) {
    const [activeTab, setActiveTab] = useState<'want_to_watch' | 'watched'>('want_to_watch');
    const [spoilerVisible, setSpoilerVisible] = useState<Record<string, boolean>>({});

    const wantToWatch = items.filter(i => i.status === 'want_to_watch' || !i.status);
    const watched = items.filter(i => i.status === 'watched');

    const displayedItems = activeTab === 'want_to_watch' ? wantToWatch : watched;

    const toggleSpoiler = (id: string) => {
        setSpoilerVisible(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-neutral-900/40 p-8 text-white shadow-2xl backdrop-blur-md border border-white/5">
                {/* Red ambient glow */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-red-900/20 blur-3xl pointer-events-none"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-black tracking-tighter font-display italic text-red-600 drop-shadow-sm">MOVIE COLLECTION</h2>
                    <p className="mt-2 text-neutral-400 font-medium tracking-wide">
                        {items.length} TITLES
                    </p>
                    <div className="flex gap-4 mt-6">
                        <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 px-5 border border-white/10 shadow-lg">
                            <span className="block text-2xl font-bold text-white">{wantToWatch.length}</span>
                            <span className="text-xs font-bold uppercase tracking-wider opacity-70 text-red-400">見たい</span>
                        </div>
                        <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 px-5 border border-white/10 shadow-lg">
                            <span className="block text-2xl font-bold text-white">{watched.length}</span>
                            <span className="text-xs font-bold uppercase tracking-wider opacity-70 text-neutral-400">視聴済み</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-black/40 rounded-2xl w-fit backdrop-blur-sm border border-white/5 mx-auto md:mx-0">
                <button
                    onClick={() => setActiveTab('want_to_watch')}
                    className={clsx(
                        "px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300",
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
                        "px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300",
                        activeTab === 'watched'
                            ? "bg-white text-black shadow-lg scale-105"
                            : "text-neutral-400 hover:text-white hover:bg-white/5"
                    )}
                >
                    視聴済み
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {displayedItems.length === 0 ? (
                    <div className="col-span-full py-32 text-center border border-dashed border-neutral-800 rounded-3xl bg-black/20">
                        <Film size={48} className="mx-auto text-neutral-700 mb-4" />
                        <p className="text-neutral-500 font-medium">リストに映画がありません。</p>
                    </div>
                ) : (
                    displayedItems.map((movie) => (
                        <div
                            key={movie.id}
                            className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-black border border-white/5 shadow-black/50 shadow-xl transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:z-10 hover:border-white/20"
                        >
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

                                {movie.rating && (
                                    <div className="flex gap-0.5 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={12}
                                                className={i < movie.rating! ? "fill-red-500 text-red-500" : "fill-neutral-700 text-neutral-700"}
                                            />
                                        ))}
                                    </div>
                                )}

                                {movie.tags && movie.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        {movie.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-sm bg-neutral-800 text-neutral-300 border border-neutral-700/50">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
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
                                            className="text-xs text-neutral-300 line-clamp-3 cursor-pointer hover:text-white transition-colors"
                                            onClick={() => movie.spoiler && toggleSpoiler(movie.id)}
                                        >
                                            {movie.spoiler && !spoilerVisible[movie.id] ? (
                                                <span className="flex items-center gap-1 text-red-400 font-bold bg-red-900/20 px-2 py-1 rounded border border-red-500/20 w-fit">
                                                    ⚠️ ネタバレ (クリック)
                                                </span>
                                            ) : (
                                                movie.memo
                                            )}
                                        </div>
                                    )}

                                    <div className="flex gap-2 pt-2">
                                        {activeTab === 'want_to_watch' && (
                                            <button
                                                onClick={() => onUpdateStatus(movie.id, 'watched', 0)}
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
