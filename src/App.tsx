import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from './components/Layout';

import { AddModal } from './components/AddModal';
import { MovieTheater } from './features/movies/MovieTheater';
import { AnimeList } from './features/anime/AnimeList';
import { Bookshelf } from './features/books/Bookshelf';
import { VideoGallery } from './features/youtube/VideoGallery';
import { useHobbyStore } from './store/useHobbyStore';
import type { Category, HobbyItem } from './types';

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -10, scale: 0.98 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="h-full"
  >
    {children}
  </motion.div>
);

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HobbyItem | null>(null);
  const location = useLocation();

  const items = useHobbyStore((state) => state.items);
  const addItem = useHobbyStore((state) => state.addItem);
  const deleteItem = useHobbyStore((state) => state.deleteItem);
  const updateItem = useHobbyStore((state) => state.updateItem);

  const getItemsByCategory = (category: Category) => items.filter((item) => item.category === category);

  const handleUpdateStatus = (id: string, status: HobbyItem['status'], rating?: number) => {
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

  const handleUpdateItem = (id: string, updates: Partial<HobbyItem>) => {
    updateItem(id, updates);
    setEditingItem(null);
  };

  const handleEditItem = (item: HobbyItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Infer category from path for Add Modal
  const getCategoryFromPath = (): Category => {
    if (editingItem) return editingItem.category;
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
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/movies" replace />} />

          <Route path="/movies" element={
            <PageWrapper>
              {getItemsByCategory('movie').length === 0 ? (
                <MovieTheater items={[]} onUpdateStatus={handleUpdateStatus} onDelete={deleteItem} onEdit={handleEditItem} />
              ) : (
                <MovieTheater items={getItemsByCategory('movie')} onUpdateStatus={handleUpdateStatus} onDelete={deleteItem} onEdit={handleEditItem} />
              )}
            </PageWrapper>
          } />

          <Route path="/anime" element={
            <PageWrapper>
              {getItemsByCategory('anime').length === 0 ? (
                <AnimeList items={[]} onUpdateStatus={handleUpdateStatus} onDelete={deleteItem} onEdit={handleEditItem} />
              ) : (
                <AnimeList items={getItemsByCategory('anime')} onUpdateStatus={handleUpdateStatus} onDelete={deleteItem} onEdit={handleEditItem} />
              )}
            </PageWrapper>
          } />

          <Route path="/books" element={
            <PageWrapper>
              {getItemsByCategory('book').length === 0 ? (
                <Bookshelf items={[]} onDelete={deleteItem} onEdit={handleEditItem} />
              ) : (
                <Bookshelf items={getItemsByCategory('book')} onDelete={deleteItem} onUpdateStatus={handleUpdateStatus} onEdit={handleEditItem} />
              )}
            </PageWrapper>
          } />

          <Route path="/youtube" element={
            <PageWrapper>
              {getItemsByCategory('youtube').length === 0 ? (
                <VideoGallery items={[]} onDelete={deleteItem} />
              ) : (
                <VideoGallery items={getItemsByCategory('youtube')} onDelete={deleteItem} />
              )}
            </PageWrapper>
          } />
        </Routes>
      </AnimatePresence>

      <AddModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddItem}
        onUpdate={handleUpdateItem}
        category={getCategoryFromPath()}
        initialData={editingItem}
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
