import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data', 'cars.json');

function getCars() {
  try {
    if (fs.existsSync(dataFile)) {
      const data = fs.readFileSync(dataFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading cars:', e);
  }
  return [];
}

function saveCars(cars) {
  fs.writeFileSync(dataFile, JSON.stringify(cars, null, 2));
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const marque = searchParams.get('marque') || '';
  
  let cars = getCars();
  
  if (search || marque) {
    cars = cars.filter(car => {
      const matchSearch = !search || 
        car.marque?.toLowerCase().includes(search.toLowerCase()) ||
        car.modele?.toLowerCase().includes(search.toLowerCase());
      const matchMarque = !marque || car.marque === marque;
      return matchSearch && matchMarque;
    });
  }
  
  return NextResponse.json(cars);
}

export async function POST(request) {
  try {
    const car = await request.json();
    const cars = getCars();
    
    car.id = Date.now().toString();
    car.createdAt = new Date().toISOString();
    
    cars.push(car);
    saveCars(cars);
    
    return NextResponse.json(car, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
