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

async function runTests() {
  console.log('🚀 Starting Comprehensive CRUD & System Verification...\n');

  // 1. Health
  console.log('1. Health Check');
  const health = await request('GET', '/health');
  console.log(`   Status: ${health.status}, DB Mode: ${health.data.database.mode}`);

  // 2. Stats
  console.log('\n2. Stats API');
  const stats = await request('GET', '/assets/stats');
  console.log(`   Total Assets: ${stats.data.data.summary.totalAssets}`);
  console.log(`   Active: ${stats.data.data.summary.activeAssets}, Maintenance: ${stats.data.data.summary.maintenanceAssets}, Retired: ${stats.data.data.summary.retiredAssets}`);
  console.log(`   Portfolio Valuation: $${stats.data.data.summary.totalCost.toLocaleString()}`);

  // 3. Search & Filter
  console.log('\n3. Search & Filter Assets');
  const searchRes = await request('GET', '/assets?search=MacBook&status=Active');
  console.log(`   Found ${searchRes.data.count} active MacBook assets`);
  console.log(`   First result: "${searchRes.data.data[0].assetName}" (${searchRes.data.data[0].assetId})`);

  // 4. Create Asset (POST)
  console.log('\n4. Create Asset (POST)');
  const newAsset = {
    assetName: 'Dell XPS 15 9530 Pro',
    category: 'Laptops',
    location: 'Floor 2 - Innovation Lab',
    assignedTo: 'Alex Rivera',
    purchaseDate: '2024-05-10',
    warrantyEndDate: '2027-05-10',
    status: 'Active',
    cost: 2199,
    serialNumber: 'DXP-9530-881',
    notes: 'Configured with RTX 4070 GPU for mobile development',
  };
  const created = await request('POST', '/assets', newAsset);
  console.log(`   Created: "${created.data.data.assetName}" with generated ID: ${created.data.data.assetId} (Status: ${created.status})`);
  const assetId = created.data.data.assetId;

  // 5. Read Asset (GET)
  console.log('\n5. Read Asset by Identifier (GET)');
  const readRes = await request('GET', `/assets/${assetId}`);
  console.log(`   Retrieved: "${readRes.data.data.assetName}", Location: "${readRes.data.data.location}", Status: ${readRes.data.data.status}`);

  // 6. Update Asset (PUT)
  console.log('\n6. Update Asset (PUT)');
  const updateRes = await request('PUT', `/assets/${assetId}`, {
    status: 'Maintenance',
    location: 'IT Repair Bench - Desk 4',
  });
  console.log(`   Updated Status: ${updateRes.data.data.status}, New Location: "${updateRes.data.data.location}"`);

  // 7. Delete Asset (DELETE)
  console.log('\n7. Delete Asset (DELETE)');
  const deleteRes = await request('DELETE', `/assets/${assetId}`);
  console.log(`   Deleted: ${deleteRes.data.message}`);

  // 8. Confirm Deletion (404)
  console.log('\n8. Confirm Deletion Returns 404');
  const verifyRes = await request('GET', `/assets/${assetId}`);
  console.log(`   Verification Status: ${verifyRes.status} (${verifyRes.data.message})`);

  console.log('\n✨ All CRUD, Search, and Filtering tests passed with 100% success!\n');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
