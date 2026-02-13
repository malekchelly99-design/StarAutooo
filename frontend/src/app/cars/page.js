'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { carAPI, favoriteAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import CarCard from '@/components/CarCard';

export default function CarsPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    marque: searchParams.get('marque') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '',
  });

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.marque) params.marque = filters.marque;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (filters.sort) params.sort = filters.sort;
        
        const res = await carAPI.getAll(params);
        const carsData = res.results || res.data || res;
        setCars(Array.isArray(carsData) ? carsData : []);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const marques = ['BMW', 'Mercedes', 'Audi', 'Tesla', 'Peugeot', 'Renault', 'Volkswagen', 'Toyota'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Nos véhicules</h1>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Recherche</label>
            <input
              type="text"
              placeholder="Marque, modèle..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Marque</label>
            <select
              value={filters.marque}
              onChange={(e) => handleFilterChange('marque', e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Toutes</option>
              {marques.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Prix min</label>
            <input
              type="number"
              placeholder="Prix min"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Prix max</label>
            <input
              type="number"
              placeholder="Prix max"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Trier par</label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Plus récents</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="year-desc">Année décroissant</option>
              <option value="year-asc">Année croissant</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
        </div>
      ) : cars.length > 0 ? (
        <>
          <p className="text-gray-600 mb-4">{cars.length} véhicule(s) trouvé(s)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600 py-12">Aucun véhicule ne correspond à vos critères.</p>
      )}
    </div>
  );
}
