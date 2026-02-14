import { Trash2, Youtube } from 'lucide-react';
import type { HobbyItem } from '../../types';

interface VideoGalleryProps {
    items: HobbyItem[];
    onDelete: (id: string) => void;
}

export function VideoGallery({ items, onDelete }: VideoGalleryProps) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-white p-8 text-slate-900 shadow-xl border border-slate-200">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-red-500/10 blur-3xl"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black tracking-tight font-display italic text-red-600">YOUTUBE GALLERY</h2>
                    <p className="mt-2 text-slate-500 font-medium tracking-wide">
                        {items.length} VIDEOS SAVED
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.length === 0 ? (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                        <Youtube size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-400 font-medium">動画がありません。</p>
                    </div>
                ) : (
                    items.map((video) => (
                        <div key={video.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1">
                            <div className="relative aspect-video bg-slate-100 group-hover:brightness-90 transition-all">
                                <img
                                    src={video.coverUrl || `https://img.youtube.com/vi/${(video.url?.match(/v=([^&]+)/) || [])[1]}/maxresdefault.jpg`}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                />
                                <a
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]"
                                >
                                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                        <Youtube className="text-white fill-white" size={20} />
                                    </div>
                                </a>
                            </div>

                            <div className="p-4">
                                <h3 className="font-bold text-slate-800 line-clamp-2 mb-2 group-hover:text-red-600 transition-colors">
                                    {video.title}
                                </h3>

                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-50">
                                    <span className="text-xs text-slate-400 font-medium">
                                        {new Date(video.createdAt).toLocaleDateString()}
                                    </span>
                                    <button
                                        onClick={() => onDelete(video.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="削除"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
