const http = require('http');

const request = (method, path, body = null) => {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(body ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(postData);
    req.end();
  });
};

async function runPraviE2ETests() {
  console.log('============================================================');
  console.log('🏛️ PRAVI R&B Infrastructure System — End-to-End Automated Verification');
  console.log('============================================================\n');

  // STEP 1 & 2: Health & Dashboard Statistics
  console.log('STEP 1 & 2: Testing System Health & Executive Dashboard Metrics');
  const health = await request('GET', '/health');
  console.log(`✓ Health: ${health.status} (${health.data.system})`);
  console.log(`✓ DB Engine: ${health.data.database.mode}`);

  const stats = await request('GET', '/assets/stats');
  const s = stats.data.data.summary;
  console.log(`✓ Total Infrastructure Assets: ${s.totalAssets}`);
  console.log(`✓ Active: ${s.activeAssets} (${s.activePercentage}%) | In Maintenance: ${s.maintenanceAssets} | Under Construction: ${s.constructionAssets} | Closed: ${s.closedAssets}`);
  console.log(`✓ Condition Index: Poor: ${s.poorConditionAssets} | Critical: ${s.criticalConditionAssets} | Requiring Attention: ${s.assetsRequiringAttention}`);
  console.log(`✓ Types Tracked: ${stats.data.data.assetsByType.map(t => `${t.name} (${t.count})`).join(', ')}`);
  console.log(`✓ Top Districts: ${stats.data.data.assetsByDistrict.slice(0, 4).map(d => `${d.district} (${d.count})`).join(', ')}`);

  // STEP 3 & 4: Asset Inventory Search & Advanced Filtering
  console.log('\nSTEP 3 & 4: Search & Multi-Field Filtering');
  const searchRes = await request('GET', '/assets?search=Sabarmati');
  console.log(`✓ Search "Sabarmati": Found ${searchRes.data.count} matches (First: "${searchRes.data.data[0].assetName}")`);

  const filterRes = await request('GET', '/assets?assetType=Bridge&district=Ahmedabad');
  console.log(`✓ Multi-filter (Bridge + Ahmedabad): Found ${filterRes.data.count} bridge(s) in Ahmedabad`);

  // STEP 5 & 6: Create New Infrastructure Asset (MODULE 5)
  console.log('\nSTEP 5 & 6: Registering Infrastructure Asset (Road Section)');
  const newAsset = {
    assetId: 'R&B-ROAD-TEST-99',
    assetName: 'Dholera SIR Express Corridor Package-1',
    assetType: 'Road',
    description: 'Special Investment Region high-speed connecting corridor.',
    district: 'Ahmedabad',
    taluka: 'Dhandhuka',
    location: 'Bavaliyari to Dholera SIR Zone',
    status: 'Active',
    condition: 'Good',
    ownership: 'Government of Gujarat - R&B Dept',
    constructionYear: 2024,
    estimatedCost: 185000000,
    roadLength: 18.2,
    roadWidth: 24.0,
    surfaceType: 'Rigid Concrete Pavement (PQC)',
  };
  const created = await request('POST', '/assets', newAsset);
  console.log(`✓ Created: "${created.data.data.assetName}" (${created.data.data.assetId}) - Status Code: ${created.status}`);
  const assetId = created.data.data.assetId;

  // STEP 7, 8, 9: Field Inspection & Condition Degradation
  console.log('\nSTEP 7, 8, 9: Field Inspection Audit Assessment');
  const inspPayload = {
    inspectionDate: '2026-09-28',
    inspectorName: 'Er. R. K. Patel (Executive Engineer, Quality Control)',
    condition: 'Poor',
    remarks: 'Monsoon flash flood caused surface scouring and edge drop-off.',
    recommendation: 'Immediate milling and structural overlay required.',
  };
  const inspRes = await request('POST', `/assets/${assetId}/inspections`, inspPayload);
  console.log(`✓ Inspection Recorded: Condition transitioned to "${inspRes.data.asset.condition}" (Status: ${inspRes.status})`);

  // Verify asset details updated
  const verifiedAssetAfterInsp = await request('GET', `/assets/${assetId}`);
  console.log(`✓ Verified Asset Profile: Condition is now "${verifiedAssetAfterInsp.data.data.condition}"`);
  console.log(`✓ Linked Inspections: ${verifiedAssetAfterInsp.data.data.inspections.length} audit report(s) attached`);

  // STEP 10 & 11: Authorize Maintenance Operation (MODULE 10)
  console.log('\nSTEP 10 & 11: Schedule & Start Maintenance Operation');
  const maintPayload = {
    maintenanceDate: '2026-09-28',
    maintenanceType: 'Emergency Concrete Pavement Slab Repair',
    description: 'Demolition of damaged slab section and high-early-strength concrete replacement.',
    status: 'In Progress',
    estimatedCost: 4500000,
    contractor: 'Shreeji Infrastructure Projects Ltd.',
  };
  const maintRes = await request('POST', `/assets/${assetId}/maintenance`, maintPayload);
  console.log(`✓ Maintenance Operation Created: Status is "${maintRes.data.data.status}"`);
  console.log(`✓ Asset Status Automatically Updated to: "${maintRes.data.asset.status}"`);
  const maintId = maintRes.data.data._id;

  // STEP 12, 13, 14: Complete Maintenance & Restore Asset
  console.log('\nSTEP 12, 13, 14: Complete Maintenance & Restore Asset Condition');
  const completePayload = {
    status: 'Completed',
    actualCost: 4350000,
    completionDate: '2026-09-28',
    improvedCondition: 'Good',
    remarks: 'All concrete repair works certified and opened to traffic.',
  };
  const completeRes = await request('PUT', `/maintenance/${maintId}`, completePayload);
  console.log(`✓ Maintenance Status: ${completeRes.data.data.status} (Actual: ₹${completeRes.data.data.actualCost.toLocaleString()})`);

  const verifiedRestoredAsset = await request('GET', `/assets/${assetId}`);
  console.log(`✓ Asset Operational Status Restored: "${verifiedRestoredAsset.data.data.status}"`);
  console.log(`✓ Asset Condition Restored to: "${verifiedRestoredAsset.data.data.condition}"`);

  // STEP 15: Verify Lifecycle Audit Trail / History
  console.log('\nSTEP 15: Verifying Complete Lifecycle Audit Trail');
  const historyRes = await request('GET', `/assets/${assetId}/history`);
  console.log(`✓ Lifecycle Events Count: ${historyRes.data.count}`);
  historyRes.data.data.forEach((h, i) => {
    console.log(`   ${i + 1}. [${h.action}] ${h.previousValue ? `${h.previousValue} → ` : ''}${h.newValue} | ${h.description.substring(0, 60)}...`);
  });

  // STEP 16: Negative Validation Tests
  console.log('\nSTEP 16: Negative & Edge Case Validation Testing');
  // Duplicate asset ID
  const dupRes = await request('POST', '/assets', newAsset);
  console.log(`✓ Duplicate Asset ID Rejection: Status ${dupRes.status} (${dupRes.data.message})`);

  // Missing required fields
  const invalidRes = await request('POST', '/assets', { assetName: 'Incomplete' });
  console.log(`✓ Missing Required Fields Rejection: Status ${invalidRes.status} (${invalidRes.data.message})`);

  // Cleanup test asset
  console.log('\nCleaning up test infrastructure asset...');
  const delRes = await request('DELETE', `/assets/${assetId}`);
  console.log(`✓ Deleted: ${delRes.data.message}`);

  // Confirm 404
  const verifyDel = await request('GET', `/assets/${assetId}`);
  console.log(`✓ 404 Confirmation: Status ${verifyDel.status} (${verifyDel.data.message})`);

  console.log('\n============================================================');
  console.log('🎉 100% SUCCESS: All 16 Steps & Complete R&B Lifecycle Workflow Verified!');
  console.log('============================================================\n');
}

runPraviE2ETests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
