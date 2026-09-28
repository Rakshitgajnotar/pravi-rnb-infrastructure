const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const dns = require('dns');

// Configure reliable DNS servers to ensure Windows resolves MongoDB SRV records reliably
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (dnsErr) {
  console.warn('[DB] Could not set custom DNS servers:', dnsErr.message);
}

let mongod = null;
let dbState = {
  mode: 'disconnected',
  uri: '',
  host: '',
};

const connectDB = async () => {
  const primaryUri =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    'mongodb://localhost:27017/asset_inventory';
  const isAtlas = primaryUri.includes('mongodb+srv') || (primaryUri.includes('@') && !primaryUri.includes('localhost'));

  // 1. Attempt connection to primary MongoDB (Atlas or Local)
  try {
    const maskedUri = primaryUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.log(`[DB] Attempting connection to MongoDB at: ${maskedUri}`);

    // Allow 15s for Atlas TLS handshake and connection establishment
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: isAtlas ? 15000 : 3000,
    });

    dbState = {
      mode: isAtlas ? 'MongoDB Atlas (Cloud Cluster)' : 'Local MongoDB Service',
      uri: maskedUri,
      host: conn.connection.host,
    };
    console.log(`[DB] ✅ Connected successfully to ${dbState.mode} [Host: ${conn.connection.host}]`);
    return dbState;
  } catch (err) {
    if (isAtlas) {
      console.error(`[DB] ❌ MongoDB Atlas connection failed: ${err.message}`);
      if (err.message.includes('authentication failed')) {
        console.error(`[DB] ⚠️ Authentication Failed: Please check the Database User password in MongoDB Atlas (under Database Access).`);
      } else if (err.message.includes('ECONNREFUSED') || err.message.includes('ETIMEDOUT')) {
        console.error(`[DB] ⚠️ Network / IP Error: Ensure 0.0.0.0/0 is whitelisted in MongoDB Atlas under Network Access.`);
      }
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`[DB Production Failure] Could not connect to MongoDB Atlas: ${err.message}. Please check credentials and whitelist 0.0.0.0/0 in MongoDB Atlas Network Access.`);
      }
    } else {
      console.warn(`[DB] Could not connect to local MongoDB: ${err.message}`);
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`[DB Production Failure] No valid MongoDB connection string provided in MONGO_URI or MONGODB_URI.`);
      }
    }

    console.log(`[DB] Initializing embedded MongoDB In-Memory Server fallback...`);

    // 2. Fallback to MongoMemoryServer
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');

      // Check if pre-cached 8.2.6 binary exists
      const userProfile = process.env.USERPROFILE || process.env.HOME || '';
      const cachedBinary = path.join(userProfile, '.cache', 'mongodb-binaries', 'mongod-x64-win32-8.2.6.exe');

      const memOptions = {};
      if (fs.existsSync(cachedBinary)) {
        console.log(`[DB] Using pre-cached MongoDB binary: ${cachedBinary}`);
        memOptions.binary = {
          systemBinary: cachedBinary,
          version: '8.2.6',
        };
      }

      mongod = await MongoMemoryServer.create(memOptions);
      const memUri = mongod.getUri();

      const memConn = await mongoose.connect(memUri);
      dbState = {
        mode: 'In-Memory MongoDB (Zero-Config Dev Mode)',
        uri: memUri,
        host: memConn.connection.host,
      };
      console.log(`[DB] In-Memory MongoDB running successfully at ${memUri}`);
      return dbState;
    } catch (memErr) {
      console.error(`[DB] Failed to launch In-Memory MongoDB:`, memErr);
      throw memErr;
    }
  }
};

const getDBState = () => dbState;

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
    console.log('[DB] Database disconnected.');
  } catch (err) {
    console.error('[DB] Error during disconnection:', err);
  }
};

module.exports = {
  connectDB,
  getDBState,
  disconnectDB,
};
