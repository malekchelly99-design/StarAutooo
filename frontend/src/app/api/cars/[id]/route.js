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

export async function GET(request, { params }) {
  const cars = getCars();
  const car = cars.find(c => c.id === params.id);
  
  if (!car) {
    return NextResponse.json({ error: 'Car not found' }, { status: 404 });
  }
  
  return NextResponse.json(car);
}

export async function PUT(request, { params }) {
  try {
    const updates = await request.json();
    const cars = getCars();
    const index = cars.findIndex(c => c.id === params.id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }
    
    cars[index] = { ...cars[index], ...updates };
    saveCars(cars);
    
    return NextResponse.json(cars[index]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const cars = getCars();
    const index = cars.findIndex(c => c.id === params.id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }
    
    cars.splice(index, 1);
    saveCars(cars);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
