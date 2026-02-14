// Database abstraction layer - works with MongoDB or JSON file
const mongoose = require('mongoose');

// JSON DB class
class JsonDB {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  async read() {
    const fs = require('fs');
    const path = require('path');
    const jsonDbPath = path.join(__dirname, '..', 'data', 'db.json');
    try {
      const data = fs.readFileSync(jsonDbPath, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return { users: [], cars: [], messages: [], favorites: [] };
    }
  }

  async write(data) {
    const fs = require('fs');
    const path = require('path');
    const jsonDbPath = path.join(__dirname, '..', 'data', 'db.json');
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
      _id: data._id || (Date.now().toString() + Math.random().toString(36).substr(2, 9)),
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

// Create model function (mimics Mongoose model)
const createModel = (modelName) => {
  // Check if MongoDB is connected
  const isMongoConnected = mongoose.connection.readyState === 1;
  
  if (isMongoConnected) {
    // Use Mongoose model
    const mongooseModel = mongoose.model(modelName.charAt(0).toUpperCase() + modelName.slice(1).toLowerCase());
    return {
      find: async (query = {}) => mongooseModel.find(query),
      findOne: async (query) => mongooseModel.findOne(query),
      findById: async (id) => mongooseModel.findById(id),
      create: async (data) => mongooseModel.create(data),
      findOneAndUpdate: async (query, update, options = {}) => mongooseModel.findOneAndUpdate(query, update, { new: true, ...options }),
      findByIdAndUpdate: async (id, update, options = {}) => mongooseModel.findByIdAndUpdate(id, update, { new: true, ...options }),
      findOneAndDelete: async (query) => mongooseModel.findOneAndDelete(query),
      findByIdAndDelete: async (id) => mongooseModel.findByIdAndDelete(id),
      countDocuments: async (query = {}) => mongooseModel.countDocuments(query)
    };
  } else {
    // Use JSON DB
    const jsonDb = new JsonDB(modelName.toLowerCase());
    return {
      find: async (query = {}) => jsonDb.find(query),
      findOne: async (query) => jsonDb.findOne(query),
      findById: async (id) => jsonDb.findById(id),
      create: async (data) => jsonDb.create(data),
      findOneAndUpdate: async (query, update, options = {}) => jsonDb.findOneAndUpdate(query, update, options),
      findByIdAndUpdate: async (id, update, options = {}) => jsonDb.findByIdAndUpdate(id, update, options),
      findOneAndDelete: async (query) => jsonDb.findOneAndDelete(query),
      findByIdAndDelete: async (id) => jsonDb.findByIdAndDelete(id),
      countDocuments: async (query = {}) => jsonDb.countDocuments(query)
    };
  }
};

module.exports = { createModel };
