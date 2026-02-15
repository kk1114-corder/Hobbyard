import type { ReactNode } from 'react';
import { Film, Book, Youtube, Plus, Sprout, MonitorPlay } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

interface LayoutProps {
    children: ReactNode;
    onOpenAddModal: () => void;
}

export function Layout({ children, onOpenAddModal }: LayoutProps) {
    const location = useLocation();
    const path = location.pathname;

    // Determine active category based on path, default to 'movie' if at root
    const activeCategory = path.startsWith('/books') ? 'book' : path.startsWith('/youtube') ? 'youtube' : path.startsWith('/anime') ? 'anime' : 'movie';

    const navItems = [
        { id: 'movie', label: 'Movies', icon: Film, path: '/movies' },
        { id: 'anime', label: 'Anime', icon: MonitorPlay, path: '/anime' },
        { id: 'book', label: 'Books', icon: Book, path: '/books' },
        { id: 'youtube', label: 'YouTube', icon: Youtube, path: '/youtube' },
    ];

    return (
        <div className="min-h-screen font-sans bg-black text-slate-100 transition-colors duration-500">
            {/* Sidebar Navigation */}
            <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-black border-r border-white/10 flex flex-col z-50 transition-all duration-300">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-white/10">
                        <Sprout size={24} className="text-black fill-black" />
                    </div>
                    <h1 className="hidden md:block text-2xl font-bold tracking-tight text-white font-display">
                        Hobbyard
                    </h1>
                </div>

                <nav className="flex-1 px-3 py-6 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) =>
                                clsx(
                                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group",
                                    isActive
                                        ? "bg-white shadow-md border border-white/20 translate-x-1"
                                        : "hover:bg-white/10 hover:translate-x-1"
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon
                                        size={22}
                                        className={clsx(
                                            "transition-colors duration-300",
                                            isActive
                                                ? "text-black"
                                                : "text-white/60 group-hover:text-white"
                                        )}
                                    />
                                    <span className={clsx(
                                        "hidden md:block font-medium text-base transition-colors",
                                        isActive ? "text-black" : "text-white/60 group-hover:text-white"
                                    )}>
                                        {item.label}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4">
                    <button
                        onClick={onOpenAddModal}
                        className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-white text-black font-bold tracking-wide shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                    >
                        <Plus size={20} className="stroke-[3]" />
                        <span className="hidden md:block">Add Item</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="pl-20 md:pl-64 min-h-screen transition-all duration-300 relative">
                {/* Background Effects */}
                {activeCategory === 'movie' && (
                    <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-800 via-black to-black opacity-100" />
                )}
                {activeCategory === 'anime' && (
                    <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#2a1b4e] via-[#0f0a1e] to-black opacity-100" />
                )}
                {activeCategory === 'book' && (
                    <div className="fixed inset-0 pointer-events-none z-0 bg-[#f8fafc] opacity-100" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent"></div>
                    </div>
                )}
                {activeCategory === 'youtube' && (
                    <div className="fixed inset-0 pointer-events-none z-0 bg-slate-50" />
                )}


                <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
