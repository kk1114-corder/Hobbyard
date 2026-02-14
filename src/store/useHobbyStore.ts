import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HobbyItem, Category } from '../types';

interface HobbyState {
    items: HobbyItem[];
    addItem: (item: HobbyItem) => void;
    updateItem: (id: string, updates: Partial<HobbyItem>) => void;
    deleteItem: (id: string) => void;
    getItemsByCategory: (category: Category) => HobbyItem[];
}

export const useHobbyStore = create<HobbyState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => set((state) => ({ items: [item, ...state.items] })),
            updateItem: (id, updates) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, ...updates } : item
                    ),
                })),
            deleteItem: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),
            getItemsByCategory: (category) => {
                return get().items.filter((item) => item.category === category);
            },
        }),
        {
            name: 'hobby-manager-storage', // Keep same key to persist data
        }
    )
);
