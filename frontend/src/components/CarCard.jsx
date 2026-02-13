'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function CarCard({ car, onFavoriteToggle, isFavorite }) {
  const imageUrl = car.images && car.images.length > 0 
    ? car.images[0] 
    : 'https://via.placeholder.com/800x600?text=No+Image';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={`${car.marque} ${car.modele}`}
          fill
          className="object-cover"
        />
        {!car.disponibilite && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-sm rounded">
            Vendu
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold">
          {car.marque} {car.modele}
        </h3>
        <p className="text-gray-600 text-sm">{car.annee}</p>
        
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded">
            {car.carburant}
          </span>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded">
            {car.transmission}
          </span>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded">
            {car.kilometrage?.toLocaleString()} km
          </span>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-primary-600">
            {car.prix?.toLocaleString()} €
          </span>
          
          <div className="flex gap-2">
            {onFavoriteToggle && (
              <button
                onClick={() => onFavoriteToggle(car.id)}
                className={`p-2 rounded-full ${
                  isFavorite 
                    ? 'bg-red-100 text-red-500' 
                    : 'bg-gray-100 text-gray-500 hover:text-red-500'
                }`}
              >
                <svg className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            )}
            
            <Link
              href={`/cars/${car.id}`}
              className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
            >
              Voir
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
