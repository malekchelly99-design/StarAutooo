'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { carAPI } from '@/services/api';

export default function AdminAddCarPage() {
  const router = useRouter();
  const { isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    marque: '',
    modele: '',
    annee: new Date().getFullYear(),
    prix: '',
    description: '',
    kilometrage: 0,
    carburant: 'Essence',
    transmission: 'Manuelle',
    couleur: 'Noir',
    disponibilite: true,
    images: [],
  });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/');
    }
  }, [authLoading, isAdmin, router]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await carAPI.create(formData);
      router.push('/admin/cars');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  const carburantOptions = ['Essence', 'Diesel', 'Électrique', 'Hybride', 'GPL'];
  const transmissionOptions = ['Manuelle', 'Automatique'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/admin/cars" className="mr-4 text-gray-600 hover:text-gray-800">
          ← Retour
        </Link>
        <h1 className="text-3xl font-bold">Ajouter un véhicule</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="marque" className="block text-sm font-medium text-gray-700 mb-1">
              Marque *
            </label>
            <input
              id="marque"
              name="marque"
              type="text"
              required
              value={formData.marque}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="modele" className="block text-sm font-medium text-gray-700 mb-1">
              Modèle *
            </label>
            <input
              id="modele"
              name="modele"
              type="text"
              required
              value={formData.modele}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="annee" className="block text-sm font-medium text-gray-700 mb-1">
              Année *
            </label>
            <input
              id="annee"
              name="annee"
              type="number"
              required
              value={formData.annee}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="prix" className="block text-sm font-medium text-gray-700 mb-1">
              Prix (€) *
            </label>
            <input
              id="prix"
              name="prix"
              type="number"
              required
              value={formData.prix}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="kilometrage" className="block text-sm font-medium text-gray-700 mb-1">
              Kilométrage
            </label>
            <input
              id="kilometrage"
              name="kilometrage"
              type="number"
              value={formData.kilometrage}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="carburant" className="block text-sm font-medium text-gray-700 mb-1">
              Carburant
            </label>
            <select
              id="carburant"
              name="carburant"
              value={formData.carburant}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              {carburantOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 mb-1">
              Transmission
            </label>
            <select
              id="transmission"
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              {transmissionOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="couleur" className="block text-sm font-medium text-gray-700 mb-1">
              Couleur
            </label>
            <input
              id="couleur"
              name="couleur"
              type="text"
              value={formData.couleur}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="disponibilite"
                checked={formData.disponibilite}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Disponible</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            ></textarea>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <Link
            href="/admin/cars"
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
