import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const messagesFile = path.join(process.cwd(), 'data', 'messages.json');

function getMessages() {
  try {
    if (fs.existsSync(messagesFile)) {
      const data = fs.readFileSync(messagesFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading messages:', e);
  }
  return [];
}

function saveMessages(messages) {
  fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
}

export async function GET(request) {
  const messages = getMessages();
  return NextResponse.json(messages);
}

export async function POST(request) {
  try {
    const message = await request.json();
    const messages = getMessages();
    
    message.id = Date.now().toString();
    message.createdAt = new Date().toISOString();
    message.lu = false;
    
    messages.push(message);
    saveMessages(messages);
    
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
