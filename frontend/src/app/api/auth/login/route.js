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
    const { email, password } = await request.json();
    const users = getUsers();
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Generate simple token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Store token
    user.token = token;
    user.tokenExpiry = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
    saveUsers(users);
    
    const { password: _, token: __, tokenExpiry: ___, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
