import React, { useState } from 'react';
import { X, Upload, Star } from 'lucide-react';
import type { Category, HobbyItem } from '../types';

interface AddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (item: Omit<HobbyItem, 'id' | 'createdAt'>) => void;
    category: Category;
}

export const AddModal: React.FC<AddModalProps> = ({ isOpen, onClose, onAdd, category }) => {
    const [title, setTitle] = useState('');
    const [memo, setMemo] = useState('');
    const [rating, setRating] = useState<number>(0);
    const [status, setStatus] = useState<HobbyItem['status']>(
        category === 'movie' ? 'want_to_watch' :
            category === 'anime' ? 'watching' :
                'want_to_read'
    );
    const [coverUrl, setCoverUrl] = useState('');
    const [url, setUrl] = useState('');
    const [tags, setTags] = useState<string>('');
    const [dateWatched, setDateWatched] = useState<string>('');
    const [spoiler, setSpoiler] = useState<boolean>(false);

    // Search Functionality
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // TMDB API Key - Ideally this should be in an env variable or user settings
    // For this demo, we can ask the user for it or use a placeholder
    const [tmdbApiKey, setTmdbApiKey] = useState(localStorage.getItem('tmdb_api_key') || '0c11bdc22a3369e97912dd6151c4dddd');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            title,
            category,
            memo,
            rating: category === 'movie' || category === 'book' || category === 'anime' ? rating : undefined,
            status: category === 'book' || category === 'movie' || category === 'anime' ? status : undefined,
            coverUrl: coverUrl || undefined,
            url: url || undefined,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            dateWatched: (status === 'watched' || status === 'completed') ? dateWatched : undefined,
            spoiler
        });
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setTitle('');
        setMemo('');
        setRating(0);
        setStatus(
            category === 'movie' ? 'want_to_watch' :
                category === 'anime' ? 'watching' :
                    'want_to_read'
        );
        setCoverUrl('');
        setUrl('');
        setTags('');
        setDateWatched('');
        setSpoiler(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    const searchItems = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            if (category === 'book') {
                const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5`);
                const data = await response.json();
                setSearchResults(data.items || []);
            } else if (category === 'anime') {
                // Jikan API (Unofficial MAL)
                const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=5`);
                const data = await response.json();
                setSearchResults(data.data || []);
            } else if (category === 'movie') {
                if (!tmdbApiKey) {
                    setSearchResults([{ id: 'error', title: 'API Key Required', overview: 'TMDB APIキーが必要です。設定するか、コード内で指定してください。' }]);
                    return;
                }
                const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&language=ja-JP&query=${encodeURIComponent(query)}`);
                const data = await response.json();
                setSearchResults(data.results || []);
            }
        } catch (error) {
            console.error('Failed to search:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchItems(searchQuery);
        }
    };

    const selectItem = (item: any) => {
        if (category === 'book') {
            const info = item.volumeInfo;
            setTitle(info.title);

            const images = info.imageLinks;
            const imageUrl = images?.thumbnail || images?.smallThumbnail || '';
            setCoverUrl(imageUrl.replace('http://', 'https://'));

            const authors = info.authors?.join(', ') || '';
            const description = info.description || '';
            let newMemo = '';
            if (authors) newMemo += `著者: ${authors}\n\n`;
            if (description) newMemo += `${description}`;
            setMemo(newMemo.slice(0, 500) + (newMemo.length > 500 ? '...' : ''));
        } else if (category === 'anime') {
            // Jikan Item
            setTitle(item.title_japanese || item.title);
            setCoverUrl(item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || '');

            let newMemo = '';
            if (item.synopsis) newMemo += `${item.synopsis}`;
            setMemo(newMemo.slice(0, 500) + (newMemo.length > 500 ? '...' : ''));

            if (item.genres) {
                setTags(item.genres.map((g: any) => g.name).join(', '));
            }
        } else if (category === 'movie') {
            if (item.id === 'error') return; // Ignore error item click

            setTitle(item.title);
            if (item.poster_path) {
                setCoverUrl(`https://image.tmdb.org/t/p/w500${item.poster_path}`);
            }

            let newMemo = '';
            if (item.overview) newMemo += `${item.overview}`;
            setMemo(newMemo.slice(0, 500) + (newMemo.length > 500 ? '...' : ''));

            if (item.release_date) {
                // Could set basic release date info
            }
            setRating(Math.round(item.vote_average / 2)); // Convert 1-10 to 1-5
        }

        setSearchResults([]);
        setSearchQuery('');
    };

    const extractYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const fetchVideoTitle = async (videoId: string) => {
        try {
            const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
            const data = await response.json();
            if (data.title) {
                setTitle(data.title);
            }
        } catch (error) {
            console.error('Failed to fetch video title:', error);
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setUrl(newUrl);

        if (category === 'youtube' || category === 'movie') {
            const videoId = extractYouTubeId(newUrl);
            if (videoId) {
                setCoverUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
                if (!title) {
                    fetchVideoTitle(videoId);
                }
            }
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 300;
                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                setCoverUrl(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">
                        {category === 'movie' ? '映画を追加' : category === 'book' ? '本を追加' : category === 'anime' ? 'アニメを追加' : '動画を追加'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Universal Search Input */}
                    {(category === 'book' || category === 'anime' || category === 'movie') && (
                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {category === 'movie' ? '映画を検索' : category === 'anime' ? 'アニメを検索' : '本を検索'}
                            </label>

                            {/* TMDB Key Input Warning for Movies */}
                            {category === 'movie' && !tmdbApiKey && (
                                <div className="mb-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                                    <p className="font-bold mb-1">⚠️ TMDB APIキーが必要です</p>
                                    <p className="mb-2">映画情報の取得にはAPIキーが必要です。</p>
                                    <input
                                        type="text"
                                        placeholder="APIキーを入力してEnter..."
                                        className="w-full px-3 py-1.5 border border-amber-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const val = (e.target as HTMLInputElement).value;
                                                if (val) {
                                                    setTmdbApiKey(val);
                                                    localStorage.setItem('tmdb_api_key', val);
                                                }
                                            }
                                        }}
                                    />
                                    <p className="mt-1 text-[10px] opacity-80">※キーはブラウザに保存されます。</p>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-base"
                                    placeholder={category === 'book' ? 'タイトル、ISBN...' : category === 'anime' ? 'アニメタイトル...' : '映画タイトル...'}
                                />
                                <button
                                    type="button"
                                    onClick={() => searchItems(searchQuery)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors font-medium whitespace-nowrap"
                                >
                                    検索
                                </button>
                            </div>

                            {/* Search Results Dropdown */}
                            {searchResults.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                                    {searchResults.map((item, index) => {
                                        // Standardize display data
                                        let displayTitle = '';
                                        let displayImage = '';
                                        let displaySub = '';

                                        if (category === 'book') {
                                            displayTitle = item.volumeInfo.title;
                                            displayImage = item.volumeInfo.imageLinks?.smallThumbnail;
                                            displaySub = item.volumeInfo.authors?.join(', ');
                                        } else if (category === 'anime') {
                                            displayTitle = item.title_japanese || item.title;
                                            displayImage = item.images?.jpg?.small_image_url;
                                            displaySub = item.year ? `${item.year}年` : '';
                                        } else if (category === 'movie') {
                                            if (item.id === 'error') return <div key="err" className="p-3 text-red-500 text-sm">{item.overview}</div>;
                                            displayTitle = item.title;
                                            displayImage = item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : '';
                                            displaySub = item.release_date ? item.release_date.split('-')[0] : '';
                                        }

                                        return (
                                            <button
                                                key={item.id || index}
                                                type="button"
                                                onClick={() => selectItem(item)}
                                                className="w-full text-left p-3 hover:bg-slate-50 flex gap-3 border-b border-slate-50 last:border-none transition-colors"
                                            >
                                                {displayImage ? (
                                                    <img
                                                        src={displayImage}
                                                        alt={displayTitle}
                                                        className="w-10 h-14 object-cover rounded shadow-sm flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-14 bg-slate-200 rounded flex items-center justify-center text-xs text-slate-400 flex-shrink-0">No Img</div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="font-medium text-slate-800 text-sm line-clamp-1">{displayTitle}</p>
                                                    <p className="text-xs text-slate-500 line-clamp-1">{displaySub}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                            {isSearching && <p className="text-xs text-slate-500 mt-1">検索中...</p>}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">タイトル</label>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                            placeholder="タイトルを入力..."
                        />
                    </div>

                    {(category === 'youtube' || category === 'movie') && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">YouTube URL</label>
                            <input
                                type="text"
                                value={url}
                                onChange={handleUrlChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                                placeholder="https://youtube.com/watch?v=..."
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">カバー画像</label>
                        <div className="flex items-center gap-4">
                            {coverUrl && (
                                <img src={coverUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
                            )}
                            <label className="flex-1 cursor-pointer flex items-center justify-center px-4 py-2 border border-dashed border-slate-300 rounded-xl hover:bg-slate-50 transition-colors text-slate-500 gap-2">
                                <Upload size={18} />
                                <span className="text-sm">画像をアップロード</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                        </div>
                    </div>

                    {/* Status Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">ステータス</label>
                        <select
                            value={status || ''}
                            onChange={(e) => setStatus(e.target.value as any)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        >
                            {category === 'book' ? (
                                <>
                                    <option value="want_to_read">読みたい</option>
                                    <option value="reading">読書中</option>
                                    <option value="completed">読了</option>
                                </>
                            ) : category === 'anime' ? (
                                <>
                                    <option value="watching">視聴中</option>
                                    <option value="want_to_watch">見たい</option>
                                    <option value="watched">視聴済み</option>
                                </>
                            ) : category === 'movie' ? (
                                <>
                                    <option value="want_to_watch">見たい</option>
                                    <option value="watched">視聴済み</option>
                                </>
                            ) : (
                                <option value="">ステータスなし</option>
                            )}
                        </select>
                    </div>

                    {/* Rating */}
                    {((category === 'book' && status === 'completed') ||
                        (category === 'movie' && status === 'watched') ||
                        (category === 'anime' && status === 'watched')) && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">評価</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`p-2 rounded-full transition-all ${rating >= star ? 'text-yellow-400 scale-110' : 'text-slate-200 hover:text-slate-300'}`}
                                        >
                                            <Star size={24} fill={rating >= star ? "currentColor" : "none"} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                    {/* Date & Tags (Filmarks Style) */}
                    {(status === 'watched' || status === 'completed') && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    {category === 'book' ? '読了日' : '視聴日'}
                                </label>
                                <input
                                    type="date"
                                    value={dateWatched}
                                    onChange={(e) => setDateWatched(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">タグ (カンマ区切り)</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="アクション, SF, アカデミー賞..."
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-slate-700">レビュー / メモ</label>
                            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-500 hover:text-slate-800">
                                <input
                                    type="checkbox"
                                    checked={spoiler}
                                    onChange={(e) => setSpoiler(e.target.checked)}
                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                />
                                ネタバレあり
                            </label>
                        </div>
                        <textarea
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[100px]"
                            placeholder="ここにレビューを書いてください..."
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5"
                        >
                            追加する
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
