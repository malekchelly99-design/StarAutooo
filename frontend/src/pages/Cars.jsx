import { useState, useEffect } from 'react';
import { carAPI } from '../services/api';
import CarCard from '../components/CarCard';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    marque: '',
    minPrice: '',
    maxPrice: '',
    annee: '',
    sort: ''
  });

  const marques = ['BMW', 'Mercedes-Benz', 'Audi', 'Tesla', 'Volkswagen', 'Peugeot'];
  const annees = ['2024', '2023', '2022', '2021', '2020'];

  const fetchCars = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.marque) params.marque = filters.marque;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.annee) params.annee = filters.annee;
      if (filters.sort) params.sort = filters.sort;

      const res = await carAPI.getAll(params);
      setCars(res.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      marque: '',
      minPrice: '',
      maxPrice: '',
      annee: '',
      sort: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-star-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Notre catalogue</h1>
          <p className="text-gray-400">
            Découvrez notre sélection de véhicules premium
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-star-dark">Filtres</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-star-red hover:underline"
                >
                  Réinitialiser
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recherche
                </label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Marque, modèle..."
                  className="input-field"
                />
              </div>

              {/* Marque */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marque
                </label>
                <select
                  name="marque"
                  value={filters.marque}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">Toutes les marques</option>
                  {marques.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Prix */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (€)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="input-field"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Année */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Année
                </label>
                <select
                  name="annee"
                  value={filters.annee}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">Toutes les années</option>
                  {annees.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trier par
                </label>
                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">Plus récents</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="year-desc">Année décroissante</option>
                  <option value="year-asc">Année croissante</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cars Grid */}
          <div className="lg:w-3/4">
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                {loading ? 'Recherche en cours...' : `${cars.length} véhicule(s) trouvé(s)`}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-star-red"></div>
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun véhicule trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos filtres de recherche</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cars.map((car) => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cars;
