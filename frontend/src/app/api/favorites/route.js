import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const favoritesFile = path.join(process.cwd(), 'data', 'favorites.json');

function getFavorites() {
  try {
    if (fs.existsSync(favoritesFile)) {
      const data = fs.readFileSync(favoritesFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading favorites:', e);
  }
  return {};
}

function saveFavorites(favorites) {
  fs.writeFileSync(favoritesFile, JSON.stringify(favorites, null, 2));
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }
  
  const favorites = getFavorites();
  const userFavorites = favorites[userId] || [];
  
  return NextResponse.json(userFavorites);
}

export async function POST(request) {
  try {
    const { userId, carId } = await request.json();
    const favorites = getFavorites();
    
    if (!favorites[userId]) {
      favorites[userId] = [];
    }
    
    if (!favorites[userId].includes(carId)) {
      favorites[userId].push(carId);
    }
    
    saveFavorites(favorites);
    
    return NextResponse.json(favorites[userId]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const carId = searchParams.get('carId');
    
    if (!userId || !carId) {
      return NextResponse.json({ error: 'userId and carId required' }, { status: 400 });
    }
    
    const favorites = getFavorites();
    
    if (favorites[userId]) {
      favorites[userId] = favorites[userId].filter(id => id !== carId);
      saveFavorites(favorites);
    }
    
    return NextResponse.json(favorites[userId] || []);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
