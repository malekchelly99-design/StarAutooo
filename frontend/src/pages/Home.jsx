import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carAPI } from '../services/api';
import CarCard from '../components/CarCard';

const Home = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const res = await carAPI.getAll();
        setFeaturedCars(res.data.slice(0, 6)); // Take first 6 cars
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedCars();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920"
            alt="Luxury car"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-star-dark/90 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-white">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Conduisez votre rêve avec <span className="text-star-red">Star Auto</span>
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Découvrez notre sélection exclusive de véhicules premium. 
              Qualité, transparence et service exceptionnel vous attendent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/cars" className="btn-primary text-center">
                Voir nos voitures
              </Link>
              <Link to="/register" className="btn-outline border-white text-white hover:bg-white hover:text-star-dark text-center">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-star-blue">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold text-star-orange mb-2">500+</div>
              <div className="text-gray-300">Véhicules vendus</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-star-orange mb-2">250+</div>
              <div className="text-gray-300">Clients satisfaits</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-star-orange mb-2">50+</div>
              <div className="text-gray-300">Marques partenaires</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-star-orange mb-2">15+</div>
              <div className="text-gray-300">Années d'expérience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Nos véhicules en vedette</h2>
            <p className="section-subtitle mx-auto">
              Explorez notre sélection de véhicules premium soigneusement choisis pour vous
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-star-red"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCars.map((car) => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Link to="/cars" className="btn-primary">
                  Voir toutes les voitures
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title">À propos de Star Auto</h2>
              <p className="text-gray-600 mb-6">
                Star Auto est votre concession automobile de confiance depuis plus de 15 ans. 
                Nous nous engageons à vous offrir une expérience d'achat transparente et agréable.
              </p>
              <p className="text-gray-600 mb-6">
                Notre équipe d'experts passionnés vous accompagne dans le choix de votre véhicule 
                idéal, qu'il soit neuf ou d'occasion. Nous proposons également des solutions de 
                financement adaptées à votre budget.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">Véhicules garantis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">Prix transparents</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">Service premium</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">Financement facile</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1503376763036-066120622c74?w=800"
                alt="Star Auto showroom"
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-star-red text-white p-6 rounded-xl shadow-xl">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm">Années d'expertise</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-star-dark text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à trouver votre véhicule idéal ?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Parcourez notre catalogue complet de véhicules et trouvez celui qui correspond à vos besoins et votre budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cars" className="btn-primary">
              Parcourir le catalogue
            </Link>
            <Link to="/register" className="btn-outline border-white text-white hover:bg-white hover:text-star-dark">
              Créer un compte
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
