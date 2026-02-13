'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Star Auto</h3>
            <p className="text-gray-300">
              Votre concessionnaire automobile premium. Nous proposons les meilleures marques au meilleur prix.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/cars" className="text-gray-300 hover:text-white">
                  Nos véhicules
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-300 hover:text-white">
                  Connexion
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-300 hover:text-white">
                  Inscription
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li>123 Rue de la Automobile</li>
              <li>75001 Paris, France</li>
              <li>Tél: +33 1 23 45 67 89</li>
              <li>Email: contact@starauto.com</li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Horaires</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Lundi - Vendredi: 9h - 19h</li>
              <li>Samedi: 9h - 18h</li>
              <li>Dimanche: Fermé</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Star Auto. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
