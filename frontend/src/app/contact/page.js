'use client';

import { useState, useEffect, Suspense, useSearchParams } from 'react';
import { useSearchParams } from 'next/navigation';
import { messageAPI, carAPI } from '@/services/api';

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Chargement...</div>}>
      <ContactContent />
    </Suspense>
  );
}

function ContactContent() {
  const searchParams = useSearchParams();
  const carId = searchParams.get('car');
  
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: '',
    voiture: carId || '',
  });
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCar = async () => {
      if (carId) {
        try {
          const res = await carAPI.getById(carId);
          const car = res.data || res;
          setSelectedCar(car);
          setFormData(prev => ({
            ...prev,
            sujet: `Demande d'information - ${car.marque} ${car.modele}`,
            message: `Bonjour,\n\nJe suis intéressé(e) par le véhicule ${car.annee} ${car.marque} ${car.modele} au prix de ${car.prix}€.\n\nMerci de me contacter pour plus d'informations.\n\n`
          }));
        } catch (error) {
          console.error('Error fetching car:', error);
        }
      }
    };
    fetchCar();
  }, [carId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await messageAPI.create(formData);
      setSuccess(true);
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: '',
        voiture: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'envoi du message");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Message envoyé!</h2>
          <p className="text-gray-600 mb-6">Nous vous répondrons dans les plus brefs délais.</p>
          <a href="/" className="text-primary-600 hover:text-primary-700">
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Nous contacter</h1>
        <p className="text-gray-600 mb-8">
          Une question? N'hésitez pas à nous envoyer un message.
        </p>

        {selectedCar && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-primary-700">
              Vous êtes intéressé par: <strong>{selectedCar.annee} {selectedCar.marque} {selectedCar.modele}</strong>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <input
                id="nom"
                name="nom"
                type="text"
                required
                value={formData.nom}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                id="telephone"
                name="telephone"
                type="tel"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="sujet" className="block text-sm font-medium text-gray-700 mb-1">
                Sujet
              </label>
              <input
                id="sujet"
                name="sujet"
                type="text"
                value={formData.sujet}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Envoi en cours...' : 'Envoyer'}
          </button>
        </form>
      </div>
    </div>
  );
}
