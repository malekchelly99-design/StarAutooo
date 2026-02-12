import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { carAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCars: 0,
    totalUsers: 0,
    totalMessages: 0,
    recentCars: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch cars count and recent cars
        const carsRes = await carAPI.getAll();
        const cars = carsRes.data;
        
        // Fetch messages count
        const messagesRes = await api.get('/messages');
        
        // Fetch users count
        const usersRes = await api.get('/users/count');
        
        setStats({
          totalCars: cars.length,
          totalUsers: usersRes.data.count,
          totalMessages: messagesRes.data.count,
          recentCars: cars.slice(0, 5)
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Bienvenue, {user?.email}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Cars */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Voitures</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalCars}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <Link to="/admin/cars" className="text-sm text-blue-600 hover:text-blue-700 mt-4 inline-block">
            Voir toutes →
          </Link>
        </div>

        {/* Total Messages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Messages Reçus</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalMessages}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <Link to="/admin/messages" className="text-sm text-yellow-600 hover:text-yellow-700 mt-4 inline-block">
            Voir les messages →
          </Link>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Utilisateurs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-4">Total Utilisateurs</p>
        </div>
      </div>

      {/* Recent Cars */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Voitures Récentes</h2>
          <Link to="/admin/cars" className="text-sm text-blue-600 hover:text-blue-700">
            Voir toutes
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marque</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modèle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentCars.map((car) => (
                <tr key={car._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={car.images?.[0] || 'https://via.placeholder.com/50'}
                      alt={`${car.marque} ${car.modele}`}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{car.marque}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{car.modele}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(car.prix)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      car.disponibilite ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {car.disponibilite ? 'Disponible' : 'Vendu'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">Actions Rapides</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/cars/add"
            className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            + Ajouter une voiture
          </Link>
          <Link
            to="/admin/messages"
            className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition"
          >
            Voir les messages
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
