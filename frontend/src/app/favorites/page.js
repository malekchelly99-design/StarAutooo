'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { favoriteAPI } from '@/services/api';
import CarCard from '@/components/CarCard';

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (isAuthenticated) {
        try {
          const res = await favoriteAPI.getAll();
          setFavorites(res.favorites || []);
        } catch (error) {
          console.error('Error fetching favorites:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchFavorites();
  }, [isAuthenticated]);

  const handleFavoriteToggle = async (carId) => {
    try {
      await favoriteAPI.remove(carId);
      setFavorites(favorites.filter(car => car.id !== carId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mes favoris</h1>
      
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onFavoriteToggle={handleFavoriteToggle}
              isFavorite={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Vous n'avez pas encore de favoris.</p>
          <a href="/cars" className="text-primary-600 hover:text-primary-700">
            Voir les véhicules
          </a>
        </div>
      )}
    </div>
  );
}
