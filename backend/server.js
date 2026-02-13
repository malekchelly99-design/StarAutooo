const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
  credentials: true
}));

// Create data directory
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize JSON database
const jsonDbPath = path.join(__dirname, 'data', 'db.json');
const initialData = { users: [], cars: [], messages: [], favorites: [] };

if (!fs.existsSync(jsonDbPath)) {
  fs.writeFileSync(jsonDbPath, JSON.stringify(initialData, null, 2));
}

// JSON Database class
class JsonDB {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  async read() {
    try {
      const data = fs.readFileSync(jsonDbPath, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return { ...initialData };
    }
  }

  async write(data) {
    fs.writeFileSync(jsonDbPath, JSON.stringify(data, null, 2));
  }

  async find(query = {}) {
    const data = await this.read();
    let documents = data[this.collectionName] || [];
    if (Object.keys(query).length > 0) {
      documents = documents.filter(doc => {
        return Object.keys(query).every(key => {
          if (key === '_id') {
            return doc._id === query._id || doc._id?.toString() === query._id;
          }
          if (key === 'role' && query.role === 'USER') {
            return doc.role === 'CLIENT';
          }
          return doc[key] === query[key];
        });
      });
    }
    return documents;
  }

  async findOne(query) {
    const documents = await this.find(query);
    return documents[0] || null;
  }

  async findById(id) {
    const documents = await this.find();
    return documents.find(doc => doc._id === id || doc._id?.toString() === id) || null;
  }

  async create(data) {
    const db = await this.read();
    const collection = db[this.collectionName] || [];
    const newDoc = {
      ...data,
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    collection.push(newDoc);
    db[this.collectionName] = collection;
    await this.write(db);
    return newDoc;
  }

  async findOneAndUpdate(query, update, options = {}) {
    const db = await this.read();
    const collection = db[this.collectionName] || [];
    const index = collection.findIndex(doc => {
      return Object.keys(query).every(key => {
        if (key === '_id') {
          return doc._id === query._id || doc._id?.toString() === query._id;
        }
        return doc[key] === query[key];
      });
    });
    if (index === -1) return null;
    const updatedDoc = { ...collection[index], ...update, updatedAt: new Date().toISOString() };
    if (options.new) {
      collection[index] = updatedDoc;
      db[this.collectionName] = collection;
      await this.write(db);
    }
    return options.new ? updatedDoc : collection[index];
  }

  async findByIdAndUpdate(id, update, options = {}) {
    return this.findOneAndUpdate({ _id: id }, update, options);
  }

  async findOneAndDelete(query) {
    const db = await this.read();
    const collection = db[this.collectionName] || [];
    const index = collection.findIndex(doc => {
      return Object.keys(query).every(key => {
        if (key === '_id') {
          return doc._id === query._id || doc._id?.toString() === query._id;
        }
        return doc[key] === query[key];
      });
    });
    if (index === -1) return null;
    const deletedDoc = collection[index];
    collection.splice(index, 1);
    db[this.collectionName] = collection;
    await this.write(db);
    return deletedDoc;
  }

  async findByIdAndDelete(id) {
    return this.findOneAndDelete({ _id: id });
  }

  async countDocuments(query = {}) {
    const documents = await this.find(query);
    return documents.length;
  }
}

// Export for use in routes
global.JsonDB = JsonDB;

// Connect to MongoDB (optional - will use JSON DB if MongoDB fails)
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return true;
    }
    return false;
  } catch (error) {
    console.log('MongoDB not available, using JSON file storage');
    return false;
  }
};

// Health check
app.get('/api/health', async (req, res) => {
  const mongoConnected = mongoose.connection.readyState === 1;
  res.json({ 
    status: 'OK', 
    message: 'Star Auto API is running',
    database: mongoConnected ? 'MongoDB' : 'JSON File'
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cars', require('./routes/cars'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/users', require('./routes/users'));
app.use('/api/chatbot', require('./routes/chatbot'));

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// The "catchall" handler
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Database: ${mongoose.connection.readyState === 1 ? 'MongoDB' : 'JSON File'}`);
  });
};

startServer();
