'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { carAPI } from '@/services/api';

export default function AdminCarsPage() {
  const router = useRouter();
  const { isAdmin, loading: authLoading } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/');
    }
  }, [authLoading, isAdmin, router]);

  useEffect(() => {
    const fetchCars = async () => {
      if (isAdmin) {
        try {
          const res = await carAPI.getAll();
          const carsData = res.results || res.data || res;
          setCars(Array.isArray(carsData) ? carsData : []);
        } catch (error) {
          console.error('Error fetching cars:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCars();
  }, [isAdmin]);

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce véhicule?')) return;
    
    try {
      await carAPI.delete(id);
      setCars(cars.filter(car => car.id !== id));
    } catch (error) {
      console.error('Error deleting car:', error);
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des véhicules</h1>
        <Link
          href="/admin/cars/add"
          className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
        >
          Ajouter un véhicule
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Véhicule</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Année</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cars.map((car) => (
              <tr key={car.id}>
                <td className="px-6 py-4">
                  <p className="font-medium">{car.marque} {car.modele}</p>
                </td>
                <td className="px-6 py-4">{car.prix?.toLocaleString()} €</td>
                <td className="px-6 py-4">{car.annee}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded ${car.disponibilite ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {car.disponibilite ? 'Disponible' : 'Vendu'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    href={`/admin/cars/${car.id}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => handleDelete(car.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
