import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CarCard = ({ car }) => {
  const { _id, marque, modele, annee, prix, images } = car;
  const { isAuthenticated, isAdmin } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || isAdmin) return;

    setLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${_id}`);
        setIsFavorite(false);
      } else {
        await api.post(`/favorites/${_id}`);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={images[0] || 'https://via.placeholder.com/800x600?text=No+Image'}
          alt={`${marque} ${modele}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-star-red text-white px-3 py-1 rounded-full text-sm font-semibold">
          {new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(prix)}
        </div>
        {isAuthenticated && !isAdmin && (
          <button
            onClick={handleToggleFavorite}
            disabled={loading}
            className={`absolute top-4 left-4 p-2 rounded-full transition ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-star-dark mb-2">
          {marque} {modele}
        </h3>
        <p className="text-gray-500 mb-4">
          Année: {annee}
        </p>

        <Link
          to={`/cars/${_id}`}
          className="block w-full text-center bg-star-blue text-white py-3 rounded-lg font-semibold
                     hover:bg-blue-900 transition-all duration-300"
        >
          Voir détails
        </Link>
      </div>
    </div>
  );
};

export default CarCard;
