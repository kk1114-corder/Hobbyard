import { useState } from 'react';
import { Plus, Play, Check, Star, MonitorPlay, Calendar, Tag } from 'lucide-react';
import type { HobbyItem } from '../../types';
import { clsx } from 'clsx';

interface AnimeListProps {
    items: HobbyItem[];
    onUpdateStatus: (id: string, status: 'want_to_watch' | 'watching' | 'watched', rating?: number) => void;
}

export function AnimeList({ items, onUpdateStatus }: AnimeListProps) {
    const [activeTab, setActiveTab] = useState<'watching' | 'want_to_watch' | 'watched'>('watching');
    const [spoilerVisible, setSpoilerVisible] = useState<Record<string, boolean>>({});

    const watching = items.filter(i => i.status === 'watching');
    const wantToWatch = items.filter(i => i.status === 'want_to_watch' || !i.status);
    const watched = items.filter(i => i.status === 'watched');

    const displayedItems = activeTab === 'watching' ? watching : activeTab === 'want_to_watch' ? wantToWatch : watched;

    const toggleSpoiler = (id: string) => {
        setSpoilerVisible(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const getTabLabel = (tab: string) => {
        switch (tab) {
            case 'watching': return '視聴中';
            case 'want_to_watch': return '見たい';
            case 'watched': return '視聴済み';
            default: return tab;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Anime Stats / Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-8 text-white shadow-2xl shadow-fuchsia-500/20">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black tracking-tight font-display italic">ANIME COLLECTION</h2>
                    <p className="mt-2 text-fuchsia-100 font-medium tracking-wide">
                        {items.length} TITLES TRACKED
                    </p>
                    <div className="flex gap-4 mt-6">
                        <div className="bg-black/20 backdrop-blur-md rounded-xl p-3 px-5 border border-white/10">
                            <span className="block text-2xl font-bold">{watching.length}</span>
                            <span className="text-xs font-bold uppercase tracking-wider opacity-70">視聴中</span>
                        </div>
                        <div className="bg-black/20 backdrop-blur-md rounded-xl p-3 px-5 border border-white/10">
                            <span className="block text-2xl font-bold">{wantToWatch.length}</span>
                            <span className="text-xs font-bold uppercase tracking-wider opacity-70">見たい</span>
                        </div>
                        <div className="bg-black/20 backdrop-blur-md rounded-xl p-3 px-5 border border-white/10">
                            <span className="block text-2xl font-bold">{watched.length}</span>
                            <span className="text-xs font-bold uppercase tracking-wider opacity-70">視聴済み</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pop Tabs */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit backdrop-blur-sm border border-white/10">
                {(['watching', 'want_to_watch', 'watched'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={clsx(
                            "px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300",
                            activeTab === tab
                                ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/25 scale-105"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        {getTabLabel(tab)}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {displayedItems.length === 0 ? (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-white/10 rounded-3xl">
                        <MonitorPlay size={48} className="mx-auto text-white/20 mb-4" />
                        <p className="text-white/40 font-medium">リストにアニメがありません。</p>
                    </div>
                ) : (
                    displayedItems.map((anime) => (
                        <div
                            key={anime.id}
                            className="group relative aspect-[2/3] rounded-2xl overflow-hidden bg-slate-900 border border-white/5 shadow-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-fuchsia-500/10 hover:border-fuchsia-500/50"
                        >
                            <img
                                src={anime.coverUrl || 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1000&auto=format&fit=crop'}
                                alt={anime.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />

                            {/* Status Badge */}
                            <div className="absolute top-3 right-3">
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
                                {anime.rating && (
                                    <div className="flex gap-0.5 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={12}
                                                className={i < anime.rating! ? "fill-yellow-400 text-yellow-400" : "fill-white/20 text-white/20"}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Tags */}
                                {anime.tags && anime.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        {anime.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/80 border border-white/10 backdrop-blur-sm">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Hover Actions / Details */}
                                <div className="space-y-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pb-2">
                                    {anime.dateWatched && (
                                        <div className="flex items-center gap-1.5 text-xs text-white/60">
                                            <Calendar size={12} />
                                            <span>{activeTab === 'watching' ? '開始:' : '完了:'} {new Date(anime.dateWatched).toLocaleDateString()}</span>
                                        </div>
                                    )}

                                    {anime.memo && (
                                        <div
                                            className="text-xs text-slate-300 line-clamp-3 cursor-pointer hover:text-white transition-colors"
                                            onClick={() => anime.spoiler && toggleSpoiler(anime.id)}
                                        >
                                            {anime.spoiler && !spoilerVisible[anime.id] ? (
                                                <span className="flex items-center gap-1 text-fuchsia-400 font-bold bg-fuchsia-400/10 px-2 py-1 rounded border border-fuchsia-400/20 w-fit">
                                                    ⚠️ ネタバレ (クリックで表示)
                                                </span>
                                            ) : (
                                                anime.memo
                                            )}
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
                                        {activeTab === 'watched' && (
                                            <div className="w-full text-center text-[10px] text-white/40 font-medium tracking-widest uppercase mt-1">
                                                視聴済み
                                            </div>
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
