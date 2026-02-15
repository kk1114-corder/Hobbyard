export type Category = 'movie' | 'book' | 'youtube' | 'anime';

export interface HobbyItem {
    id: string;
    title: string;
    category: Category;
    memo?: string;
    rating?: number; // 1-5 for movies/books
    status?: 'want_to_watch' | 'watching' | 'watched' | 'want_to_read' | 'reading' | 'completed'; // for books/movies
    dateWatched?: string; // ISO date string
    tags?: string[];

    url?: string; // for youtube/movies
    coverUrl?: string; // for books/movies
    channelName?: string; // for youtube
    createdAt: string;
}
