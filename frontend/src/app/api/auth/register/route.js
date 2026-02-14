import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const usersFile = path.join(process.cwd(), 'data', 'users.json');

function getUsers() {
  try {
    if (fs.existsSync(usersFile)) {
      const data = fs.readFileSync(usersFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading users:', e);
  }
  return [];
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

export async function POST(request) {
  try {
    const { email, password, nom, prenom, telephone } = await request.json();
    const users = getUsers();
    
    // Check if user exists
    if (users.find(u => u.email === email)) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }
    
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      nom: nom || '',
      prenom: prenom || '',
      telephone: telephone || '',
      isAdmin: false,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
