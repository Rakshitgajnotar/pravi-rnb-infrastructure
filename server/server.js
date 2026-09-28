const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const { connectDB, getDBState } = require('./config/db');
const Asset = require('./models/Asset');
const User = require('./models/User');
const seedDatabase = require('./seed/seed');
const assetRoutes = require('./routes/assetRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const authRoutes = require('./routes/authRoutes');
const { PRESET_ROLES } = require('./controllers/authController');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-role', 'x-user-name', 'x-user-id'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check & DB Info endpoint
app.get('/api/health', (req, res) => {
  const dbInfo = getDBState();
  res.status(200).json({
    status: 'online',
    system: 'PRAVI - Roads & Buildings Department',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbInfo,
    version: '2.0.0',
    rbac: 'enabled',
  });
});

// Primary REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/maintenance', maintenanceRoutes);

const path = require('path');
const fs = require('fs');

// Check if client build output exists (enables 1-service fullstack deployment on Render/Railway/VPS)
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Root route for API documentation when backend runs as standalone service
  app.get('/', (req, res) => {
    res.json({
      name: 'PRAVI — Government Roads & Buildings (R&B) Infrastructure Asset Inventory System',
      status: 'Running',
      version: '2.0.0',
      rbac: {
        enabled: true,
        roles: ['Admin', 'Inspector', 'Contractor', 'Auditor'],
      },
      documentation: {
        health: 'GET /api/health',
        auth: 'GET /api/auth/users',
        currentAuth: 'GET /api/auth/me',
        assets: 'GET /api/assets',
        stats: 'GET /api/assets/stats',
        singleAsset: 'GET /api/assets/:id',
        createAsset: 'POST /api/assets (Admin only)',
        updateAsset: 'PUT /api/assets/:id (Admin & Inspector)',
        deleteAsset: 'DELETE /api/assets/:id (Admin only)',
        inspections: 'GET /api/assets/:id/inspections',
        createInspection: 'POST /api/assets/:id/inspections (Admin & Inspector)',
        maintenance: 'GET /api/assets/:id/maintenance',
        createMaintenance: 'POST /api/assets/:id/maintenance (Admin & Contractor)',
        allMaintenance: 'GET /api/maintenance',
        history: 'GET /api/assets/:id/history',
        seed: 'POST /api/assets/seed',
      },
    });
  });
}

// Centralized Error Handling
app.use(notFound);
app.use(errorHandler);

// Server startup & Database Initialization
const startServer = async () => {
  try {
    await connectDB();

    // Check & Seed RBAC Official Users if not present
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('[RBAC] Seeding default R&B official roles and users...');
        await User.insertMany(PRESET_ROLES);
        console.log('[RBAC] 4 Official Profiles initialized (Admin, Inspector, Contractor, Auditor)');
      }
    } catch (userSeedErr) {
      console.warn('[RBAC] User seeding notice:', userSeedErr.message);
    }

    // Check if R&B infrastructure data needs seeding
    const existingCount = await Asset.countDocuments();
    const firstAsset = await Asset.findOne();
    const needsSeed = existingCount === 0 || (firstAsset && !firstAsset.assetType);

    if (needsSeed) {
      console.log(`[Init] Populating fresh Government R&B Infrastructure demo records...`);
      await seedDatabase();
      console.log(`[Init] R&B Demo Data initialized!`);
    } else {
      console.log(`[Init] Database currently contains ${existingCount} R&B Infrastructure Assets.`);
    }

    app.listen(PORT, () => {
      console.log(`🏛️ PRAVI R&B Infrastructure Server active on port ${PORT}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api/assets`);
      console.log(`📊 Stats Endpoint: http://localhost:${PORT}/api/assets/stats`);
      console.log(`🛡️ RBAC Auth Base: http://localhost:${PORT}/api/auth`);
      console.log(`🛠️ Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('Fatal: Failed to start PRAVI server:', err);
    process.exit(1);
  }
};

startServer();
