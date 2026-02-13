'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { carAPI, favoriteAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export default function CarDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await carAPI.getById(params.id);
        setCar(res.data || res);
      } catch (error) {
        console.error('Error fetching car:', error);
        router.push('/cars');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [params.id, router]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (isAuthenticated) {
        try {
          const res = await favoriteAPI.check(params.id);
          setIsFavorite(res.isFavorite);
        } catch (error) {
          console.error('Error checking favorite:', error);
        }
      }
    };
    checkFavorite();
  }, [params.id, isAuthenticated]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    try {
      if (isFavorite) {
        await favoriteAPI.remove(params.id);
        setIsFavorite(false);
      } else {
        await favoriteAPI.add(params.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!car) {
    return null;
  }

  const images = car.images && car.images.length > 0 
    ? car.images 
    : ['https://via.placeholder.com/800x600?text=No+Image'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
            <Image
              src={images[currentImageIndex]}
              alt={`${car.marque} ${car.modele}`}
              fill
              className="object-cover"
            />
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-24 h-16 rounded overflow-hidden ${
                    index === currentImageIndex ? 'ring-2 ring-primary-600' : ''
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold">{car.marque} {car.modele}</h1>
              <p className="text-gray-600">{car.annee}</p>
            </div>
            
            <button
              onClick={handleFavoriteToggle}
              className={`p-2 rounded-full ${
                isFavorite 
                  ? 'bg-red-100 text-red-500' 
                  : 'bg-gray-100 text-gray-500 hover:text-red-500'
              }`}
            >
              <svg className="h-6 w-6" fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <p className="text-4xl font-bold text-primary-600 mb-6">
            {car.prix?.toLocaleString()} €
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Carburant</p>
              <p className="font-semibold">{car.carburant}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Transmission</p>
              <p className="font-semibold">{car.transmission}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Kilométrage</p>
              <p className="font-semibold">{car.kilometrage?.toLocaleString()} km</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Couleur</p>
              <p className="font-semibold">{car.couleur}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-600">{car.description}</p>
          </div>

          <div className="flex gap-4">
            {car.disponibilite ? (
              <Link
                href={`/contact?car=${car.id}`}
                className="flex-1 bg-primary-600 text-white text-center py-3 rounded-lg hover:bg-primary-700"
              >
                Contacter nous
              </Link>
            ) : (
              <div className="flex-1 bg-red-500 text-white text-center py-3 rounded">
                Vendu
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
