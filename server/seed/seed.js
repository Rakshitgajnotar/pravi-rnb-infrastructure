const dotenv = require('dotenv');
dotenv.config();

const { connectDB, disconnectDB } = require('../config/db');
const Asset = require('../models/Asset');
const Inspection = require('../models/Inspection');
const Maintenance = require('../models/Maintenance');
const AssetHistory = require('../models/AssetHistory');
const {
  sampleInfrastructureAssets,
  sampleInspections,
  sampleMaintenance,
  sampleLifecycleEvents,
} = require('./seedData');

const seedDatabase = async () => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.log('[Seed] Connecting to MongoDB...');
      await connectDB();
    }

    console.log('[Seed] Clearing existing R&B infrastructure data collections...');
    await Promise.all([
      Asset.deleteMany({}),
      Inspection.deleteMany({}),
      Maintenance.deleteMany({}),
      AssetHistory.deleteMany({}),
    ]);

    console.log(`[Seed] Inserting ${sampleInfrastructureAssets.length} R&B Infrastructure Assets...`);
    const insertedAssets = await Asset.insertMany(sampleInfrastructureAssets);

    // Build map of assetId -> Mongo ObjectId
    const assetIdMap = {};
    insertedAssets.forEach((a) => {
      assetIdMap[a.assetId] = a._id;
    });

    // Seed Inspections with valid assetId ObjectId references
    console.log(`[Seed] Inserting Inspection records...`);
    const inspectionRecords = sampleInspections
      .filter((insp) => assetIdMap[insp.assetRefId])
      .map((insp) => ({
        assetId: assetIdMap[insp.assetRefId],
        inspectionDate: insp.inspectionDate,
        inspectorName: insp.inspectorName,
        condition: insp.condition,
        remarks: insp.remarks,
        recommendation: insp.recommendation,
      }));
    await Inspection.insertMany(inspectionRecords);

    // Seed Maintenance with valid assetId ObjectId references
    console.log(`[Seed] Inserting Maintenance records...`);
    const maintenanceRecords = sampleMaintenance
      .filter((m) => assetIdMap[m.assetRefId])
      .map((m) => ({
        assetId: assetIdMap[m.assetRefId],
        maintenanceDate: m.maintenanceDate,
        maintenanceType: m.maintenanceType,
        description: m.description,
        status: m.status,
        estimatedCost: m.estimatedCost,
        actualCost: m.actualCost,
        contractor: m.contractor,
        completionDate: m.completionDate,
        remarks: m.remarks,
      }));
    await Maintenance.insertMany(maintenanceRecords);

    // Seed Lifecycle History Events with valid assetId ObjectId references
    console.log(`[Seed] Inserting Lifecycle History events...`);
    const historyRecords = sampleLifecycleEvents
      .filter((h) => assetIdMap[h.assetRefId])
      .map((h) => ({
        assetId: assetIdMap[h.assetRefId],
        action: h.action,
        previousValue: h.previousValue,
        newValue: h.newValue,
        description: h.description,
        performedBy: h.performedBy,
        createdAt: h.createdAt,
      }));
    await AssetHistory.insertMany(historyRecords);

    console.log(`[Seed] Successfully seeded:`);
    console.log(`       - ${insertedAssets.length} Infrastructure Assets`);
    console.log(`       - ${inspectionRecords.length} Inspection Reports`);
    console.log(`       - ${maintenanceRecords.length} Maintenance Operations`);
    console.log(`       - ${historyRecords.length} Lifecycle Audit Trail Events`);

    return {
      assetsCount: insertedAssets.length,
      inspectionsCount: inspectionRecords.length,
      maintenanceCount: maintenanceRecords.length,
      historyCount: historyRecords.length,
    };
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    throw err;
  }
};

if (require.main === module) {
  seedDatabase()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch(async () => {
      await disconnectDB();
      process.exit(1);
    });
}

module.exports = seedDatabase;
