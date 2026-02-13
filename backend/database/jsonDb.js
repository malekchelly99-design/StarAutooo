// Simple JSON file-based database
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/db.json');

// Initialize data directory
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database file if it doesn't exist
const initialData = {
  users: [],
  cars: [],
  messages: [],
  favorites: []
};

if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
}

// Read database
const readDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return initialData;
  }
};

// Write to database
const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// Database class that mimics MongoDB
class JsonDB {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  // Find all documents
  async find(query = {}) {
    const db = readDB();
    let documents = db[this.collectionName] || [];

    // Apply filters
    if (Object.keys(query).length > 0) {
      documents = documents.filter(doc => {
        return Object.keys(query).every(key => {
          if (key === '_id') {
            return doc._id === query._id || doc._id?.toString() === query._id;
          }
          return doc[key] === query[key];
        });
      });
    }

    return documents;
  }

  // Find one document
  async findOne(query) {
    const documents = await this.find(query);
    return documents[0] || null;
  }

  // Find by ID
  async findById(id) {
    const documents = await this.find();
    return documents.find(doc => doc._id === id || doc._id?.toString() === id) || null;
  }

  // Create a document
  async create(data) {
    const db = readDB();
    const collection = db[this.collectionName] || [];
    
    const newDoc = {
      ...data,
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    collection.push(newDoc);
    db[this.collectionName] = collection;
    writeDB(db);
    
    return newDoc;
  }

  // Create with custom ID
  async createWithId(id, data) {
    const db = readDB();
    const collection = db[this.collectionName] || [];
    
    const newDoc = {
      ...data,
      _id: id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    collection.push(newDoc);
    db[this.collectionName] = collection;
    writeDB(db);
    
    return newDoc;
  }

  // Update one document
  async findOneAndUpdate(query, update, options = {}) {
    const db = readDB();
    const collection = db[this.collectionName] || [];
    const index = collection.findIndex(doc => {
      return Object.keys(query).every(key => {
        if (key === '_id') {
          return doc._id === query._id || doc._id?.toString() === query._id;
        }
        return doc[key] === query[key];
      });
    });

    if (index === -1) {
      return null;
    }

    const oldDoc = collection[index];
    const updatedDoc = {
      ...oldDoc,
      ...update,
      updatedAt: new Date().toISOString()
    };

    if (options.new) {
      collection[index] = updatedDoc;
      db[this.collectionName] = collection;
      writeDB(db);
      return updatedDoc;
    }

    return oldDoc;
  }

  // Update by ID
  async findByIdAndUpdate(id, update, options = {}) {
    return this.findOneAndUpdate({ _id: id }, update, options);
  }

  // Delete one document
  async findOneAndDelete(query) {
    const db = readDB();
    const collection = db[this.collectionName] || [];
    const index = collection.findIndex(doc => {
      return Object.keys(query).every(key => {
        if (key === '_id') {
          return doc._id === query._id || doc._id?.toString() === query._id;
        }
        return doc[key] === query[key];
      });
    });

    if (index === -1) {
      return null;
    }

    const deletedDoc = collection[index];
    collection.splice(index, 1);
    db[this.collectionName] = collection;
    writeDB(db);

    return deletedDoc;
  }

  // Delete by ID
  async findByIdAndDelete(id) {
    return this.findOneAndDelete({ _id: id });
  }

  // Count documents
  async countDocuments(query = {}) {
    const documents = await this.find(query);
    return documents.length;
  }

  // Delete many
  async deleteMany(query) {
    const db = readDB();
    const collection = db[this.collectionName] || [];
    const filtered = collection.filter(doc => {
      return !Object.keys(query).every(key => doc[key] === query[key]);
    });
    db[this.collectionName] = filtered;
    writeDB(db);
    return { deletedCount: collection.length - filtered.length };
  }
}

// Export model function (mimics Mongoose)
const model = (collectionName) => {
  return new JsonDB(collectionName);
};

module.exports = { model, readDB, writeDB };
