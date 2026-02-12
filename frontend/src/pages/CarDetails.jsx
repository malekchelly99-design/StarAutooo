import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { carAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const res = await carAPI.getById(id);
        setCar(res.data);
      } catch (err) {
        setError('Véhicule non trouvé');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      try {
        await carAPI.delete(id);
        navigate('/cars');
      } catch (err) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleContact = () => {
    // In a real app, this would open a contact form or call an API
    alert(`Pour contacter Star Auto au sujet de ${car.marque} ${car.modele}, appelez le +33 1 23 45 67 89`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-star-red"></div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Véhicule non trouvé</h2>
          <Link to="/cars" className="btn-primary">
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/cars" className="text-gray-500 hover:text-star-red transition">
            ← Retour au catalogue
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src={car.images[selectedImage] || 'https://via.placeholder.com/800x600?text=No+Image'}
                alt={`${car.marque} ${car.modele}`}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Thumbnails */}
            {car.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {car.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === index ? 'border-star-red' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-star-dark">
                    {car.marque} {car.modele}
                  </h1>
                  <p className="text-gray-500">Année {car.annee}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-star-red">
                    {new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(car.prix)}
                  </div>
                  <p className="text-gray-500 text-sm">Prix négociable</p>
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Kilométrage</p>
                  <p className="font-semibold text-lg">{car.kilometrage?.toLocaleString() || 0} km</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Carburant</p>
                  <p className="font-semibold text-lg">{car.carburant}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Transmission</p>
                  <p className="font-semibold text-lg">{car.transmission}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Couleur</p>
                  <p className="font-semibold text-lg">{car.couleur}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-600">{car.description}</p>
              </div>

              {/* Actions */}
              {isAdmin ? (
                <div className="flex gap-4">
                  <Link
                    to={`/admin/edit/${car._id}`}
                    className="flex-1 btn-secondary text-center"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    Supprimer
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleContact}
                  className="w-full btn-primary"
                >
                  Acheter / Contacter
                </button>
              )}
            </div>

            {/* Contact Card */}
            {!isAdmin && (
              <div className="bg-star-blue rounded-xl shadow-lg p-8 text-white">
                <h3 className="font-semibold text-xl mb-4">Contacter Star Auto</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-star-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+33 1 23 45 67 89</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-star-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>contact@starauto.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-star-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>123 Avenue des Champs-Élysées, Paris</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
