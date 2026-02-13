'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">Star Auto</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600">
              Accueil
            </Link>
            <Link href="/cars" className="text-gray-700 hover:text-primary-600">
              Véhicules
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600">
              Contact
            </Link>
            
            {user ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="text-gray-700 hover:text-primary-600">
                    Admin
                  </Link>
                )}
                <Link href="/favorites" className="text-gray-700 hover:text-primary-600">
                  Favoris
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-primary-600">
                  Profil
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-primary-600"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary-600">
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                Accueil
              </Link>
              <Link href="/cars" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                Véhicules
              </Link>
              <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                Contact
              </Link>
              
              {user ? (
                <>
                  {isAdmin && (
                    <Link href="/admin" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                      Admin
                    </Link>
                  )}
                  <Link href="/favorites" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                    Favoris
                  </Link>
                  <Link href="/profile" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                    Profil
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
