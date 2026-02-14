import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ItemCard } from './components/ui/ItemCard';
import { AddModal } from './components/AddModal';
import { MovieTheater } from './features/movies/MovieTheater';
import { AnimeList } from './features/anime/AnimeList';
import { Bookshelf } from './features/books/Bookshelf';
import { VideoGallery } from './features/youtube/VideoGallery';
import { useHobbyStore } from './store/useHobbyStore';
import type { Category, HobbyItem } from './types';

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const items = useHobbyStore((state) => state.items);
  const addItem = useHobbyStore((state) => state.addItem);
  const deleteItem = useHobbyStore((state) => state.deleteItem);
  const updateItem = useHobbyStore((state) => state.updateItem);

  const getItemsByCategory = (category: Category) => items.filter((item) => item.category === category);

  const handleUpdateStatus = (id: string, status: any, rating?: number) => {
    updateItem(id, { status, rating });
  };

  const handleAddItem = (newItem: Omit<HobbyItem, 'id' | 'createdAt'>) => {
    const item: HobbyItem = {
      ...newItem,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    addItem(item);
  };

  // Infer category from path for Add Modal
  const getCategoryFromPath = (): Category => {
    const path = location.pathname;
    if (path.includes('book')) return 'book';
    if (path.includes('youtube')) return 'youtube';
    if (path.includes('anime')) return 'anime';
    return 'movie';
  };

  return (
    <Layout
      onOpenAddModal={() => setIsModalOpen(true)}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/movies" replace />} />

        <Route path="/movies" element={
          getItemsByCategory('movie').length === 0 ? (
            <MovieTheater items={[]} onUpdateStatus={handleUpdateStatus} />
          ) : (
            <MovieTheater items={getItemsByCategory('movie')} onUpdateStatus={handleUpdateStatus} />
          )
        } />

        <Route path="/anime" element={
          getItemsByCategory('anime').length === 0 ? (
            <AnimeList items={[]} onUpdateStatus={handleUpdateStatus} />
          ) : (
            <AnimeList items={getItemsByCategory('anime')} onUpdateStatus={handleUpdateStatus} />
          )
        } />

        <Route path="/books" element={
          getItemsByCategory('book').length === 0 ? (
            <Bookshelf items={[]} onDelete={deleteItem} />
          ) : (
            <Bookshelf items={getItemsByCategory('book')} onDelete={deleteItem} onUpdateStatus={handleUpdateStatus} />
          )
        } />

        <Route path="/youtube" element={
          getItemsByCategory('youtube').length === 0 ? (
            <VideoGallery items={[]} onDelete={deleteItem} />
          ) : (
            <VideoGallery items={getItemsByCategory('youtube')} onDelete={deleteItem} />
          )
        } />
      </Routes>

      <AddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddItem}
        category={getCategoryFromPath()}
      />
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
