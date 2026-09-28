# PRAVI — Government Roads & Buildings (R&B) Infrastructure Asset Inventory & Lifecycle Management System

**PRAVI** is a full-stack, enterprise-grade **Infrastructure Asset Inventory and Lifecycle Management System** specifically designed for the **Government Roads & Buildings (R&B) Department**. Built on the **MERN stack (MongoDB, Express.js, React 18 with Vite, Node.js)** with Tailwind CSS and Recharts, it provides an end-to-end digital portfolio to register, audit, monitor, maintain, and decommission public infrastructure across all state districts.

---

## 🏛️ Problem Statement

State Roads & Buildings departments oversee tens of thousands of physical public infrastructure assets—including state highways, major district roads, river bridges, urban flyovers, drainage culverts, and administrative government secretariat complexes. 

Historically, tracking these assets suffered from fragmented paper registers, delayed condition reports, uncoordinated maintenance cycles, and an absence of a single source of truth for structural health and expenditure.

**The core problem statement:**
> *"Building an end-to-end infrastructure asset inventory to track and manage physical public assets across their entire lifecycle."*

---

## 💡 The PRAVI Solution

PRAVI delivers a unified digital governance platform where government engineers, district collectors, and department officials can:
1. **Digitally register** any physical infrastructure asset with type-specific engineering parameters.
2. **Conduct field condition audits** with instant degradation tracking (Excellent → Good → Fair → Poor → Critical).
3. **Authorize and track maintenance work orders** with automated status transitions (`Active` ↔ `Under Maintenance`).
4. **Maintain an immutable chronological lifecycle audit trail** of every event in the asset's history.
5. **Visualize real-time statewide portfolio analytics** across districts, asset types, operational statuses, and condition ratings.
6. **Generate and export verified audit reports** to CSV for ministerial reviews.

---

## 🚀 Key Modules & Capabilities

### 1. Executive Analytics Dashboard
- **8 Live KPI Metric Cards**:
  - Total Infrastructure Assets
  - Active Operational Assets
  - Under Maintenance
  - Under Construction
  - Closed / Retired
  - Poor Condition Assets
  - Critical Condition Assets (Hazard Watch)
  - Assets Requiring Immediate Attention
- **4 Recharts Visual Analytics**:
  - **Assets by Type**: Pavement vs. Structural classification.
  - **Assets by Status**: Operational donut chart with center count.
  - **Assets by Condition**: Color-coded structural integrity index (Green, Blue, Amber, Orange, Red).
  - **Assets by District**: Horizontal bar chart of geographical spread.
- **Recently Registered Infrastructure**: Live data table of recent records.

### 2. Comprehensive Asset Inventory & Management (CRUD)
- **Supported Infrastructure Classifications**:
  - **Roads**: Arterial highways, Major District Roads (MDR), bypasses, and rural roads.
  - **Bridges**: Major river crossings, tidal creek links, and masonry arch structures.
  - **Flyovers**: Elevated multi-tier corridors and railway overbridges.
  - **Culverts**: Rural drainage box culverts and canal siphon crossings.
  - **Government Buildings**: Administrative headquarters, collectorates, and polytechnics.
  - **Government Offices**: Divisional R&B engineering offices and testing labs.
  - **Other Infrastructure**: Inspection bungalows (IB) and utility complexes.
- **Dynamic Infrastructure Specifications Form**:
  - For **Roads**: Road Length (km), Carriageway Width (m), Surface Type (Bituminous, Concrete PQC, WBM, Earthen).
  - For **Bridges**: Bridge Length (m), Bridge Width (m), Superstructure Type (Pre-stressed Box Girder, Steel Truss, Arch).
  - For **Flyovers**: Elevated Length (m), Number of Traffic Lanes.
  - For **Buildings**: Built-Up Area (sq m), Number of Floors.

### 3. Field Inspection & Condition Auditing
- Record structural audits with inspector name, inspection date, observed condition, detailed remarks, and action recommendations.
- **Automatic Asset Condition Updates**: Recording an inspection immediately updates the asset's current condition rating and `lastInspectionDate` on the master record.
- Every audit is timestamped and automatically recorded in the asset's audit trail.

### 4. Maintenance Operations & Lifecycle Transition
- Full maintenance management tracking:
  - Work order type (e.g. *Road Resurfacing*, *Expansion Joint Replacement*, *Pier Grouting*, *Culvert Desilting*).
  - Statuses: `Planned`, `In Progress`, `Completed`.
  - Financials: Estimated sanction vs. Actual expenditure (₹ INR).
  - Contractor agency and completion date.
- **Automatic Lifecycle Synchronization**:
  - Setting a maintenance job to `In Progress` immediately transitions the asset status to `Under Maintenance`.
  - Marking maintenance as `Completed` restores asset status back to `Active` and allows upgrading the condition rating (e.g., Poor → Good).

### 5. Asset Lifecycle Audit Trail / History
- Maintains a chronological log of events:
  - `Asset Registered`
  - `Status Changed`
  - `Condition Changed`
  - `Inspection Added`
  - `Maintenance Started`
  - `Maintenance Completed`
  - `Asset Updated`
- Tracks previous values, new values, timestamps, and authorized actor (`System User` / Field Officer).

### 6. Search, Advanced Multi-Filtering & Sorting
- **Debounced search** across Asset ID, Asset Name, District, and Location.
- **Multi-field filters**:
  - Asset Type (Road, Bridge, Flyover, Culvert, Building, Office, Other)
  - District (Ahmedabad, Gandhinagar, Surat, Vadodara, Rajkot, etc.)
  - Operational Status (Under Construction, Active, Under Maintenance, Closed, Retired)
  - Condition (Excellent, Good, Fair, Poor, Critical)
  - Construction Year
- **Sorting**: Newest, Oldest, Name (A-Z), Name (Z-A), Construction Year, Estimated Valuation.
- **Backend Pagination**: Scalable for tens of thousands of records.

### 7. Executive Reports & CSV Export
- Pre-filterable reports suite:
  - Asset Inventory Master Report
  - Critical & Poor Condition Watchlist
  - District Administrative Report
  - Asset Type & Classification Report
  - Maintenance & Expenditure Audit
- Instant CSV export matching currently applied parameters.

### 8. Role-Based Access Control (RBAC) & Official Personas
- **Interactive Multi-Persona Architecture** simulating genuine state department hierarchy:
  1. **Executive Engineer (EE) / `Admin`** (`Er. Rajesh Patel`):
     - Full administrative authority across all state assets.
     - Can register assets, edit technical specifications, approve deletions, allocate budgets, and manage users.
  2. **Assistant Engineer / Field Inspector / `Inspector`** (`Kavita Mehta`):
     - Field audit authority: Record structural observations, grade condition ratings, submit maintenance recommendations.
     - Restricted from registering, deleting, or editing financial allocations.
  3. **Chief Maintenance Contractor / `Contractor`** (`Suresh Prajapati`):
     - Work order execution: Log maintenance progress, update actual expenditures, mark repairs as completed.
     - Restricted from asset creation or deletion.
  4. **Principal State Auditor / `Auditor`** (`Dr. Arvind Dave`):
     - Read-only oversight: Audit lifecycle timelines, review expenditure, export official CSV reports.
- **Dynamic Audit Attribution**: Every lifecycle history entry permanently attributes the exact official name and designation who initiated the action.
- **Interactive Role Switcher**: Quick 1-click role switcher in the top navigation bar to demonstrate permissions in real time during hackathon presentations.

---

## 🔄 R&B Asset Lifecycle Workflow

```
[ Planned / Design Phase ]
           ↓
   Under Construction
           ↓ (Commissioning)
         Active
           ↓ (Routine Audit)
   Field Inspection (Condition: Fair / Poor)
           ↓ (Maintenance Authorized)
   Under Maintenance (Work Order: In Progress)
           ↓ (Repairs Completed & Certified)
         Active (Condition Restored: Good / Excellent)
           ↓ (End-of-Service-Life)
     Closed / Retired
```

---

## 🛠️ Technology Stack (MERN)

| Component | Technology | Description |
|---|---|---|
| **Frontend Framework** | React 18 (Vite) | Fast component-based single-page application |
| **Styling & Design System** | Tailwind CSS v3.4 | Modern, responsive government enterprise theme |
| **Data Visualization** | Recharts v2 | Responsive Donut and Bar charts |
| **Icons** | Lucide React | Clean, scalable iconography |
| **Routing** | React Router DOM v6 | Multi-page client-side navigation |
| **HTTP Client** | Axios | REST API service layer |
| **Backend Runtime** | Node.js & Express.js | Modular RESTful API server |
| **Database & ODM** | MongoDB & Mongoose | Document database with relational references |
| **Dev DB Engine** | Embedded MongoMemoryServer | Pre-cached binary fallback (runs zero-config out of the box) |

---

## 📁 Project Architecture

```
Pravi_hackthon/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # StatusBadge, ConditionBadge, AssetTypeBadge, Toast, EmptyState, LoadingSpinner
│   │   │   ├── assets/         # AssetTable, AssetFormModal, LifecycleTimeline, InspectionList, MaintenanceList, AddInspectionModal, AddMaintenanceModal, CompleteMaintenanceModal
│   │   │   └── dashboard/      # StatCard, StatusDonutChart, AssetTypeBarChart, ConditionBarChart, DistrictBarChart
│   │   ├── layouts/            # Sidebar, Navbar, MainLayout
│   │   ├── pages/              # DashboardPage, AssetListPage, AssetDetailPage, MaintenancePage, ReportsPage
│   │   ├── services/           # api.js, assetService.js, inspectionService.js, maintenanceService.js, historyService.js
│   │   ├── hooks/              # useAssets.js, useStats.js
│   │   ├── App.jsx             # React Router routing & ToastProvider
│   │   └── index.css           # Tailwind CSS directives & custom scrollbars
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Node.js + Express + Mongoose Backend
│   ├── config/                 # db.js (MongoDB connection with pre-cached fallback)
│   ├── models/                 # Asset.js, Inspection.js, Maintenance.js, AssetHistory.js
│   ├── controllers/            # assetController.js, inspectionController.js, maintenanceController.js, historyController.js
│   ├── routes/                 # assetRoutes.js, maintenanceRoutes.js
│   ├── middleware/             # validateAsset.js, errorHandler.js
│   ├── seed/                   # seedData.js, seed.js (16 R&B demo assets, inspections, maintenance, audit history)
│   ├── server.js               # Express application entry point
│   ├── test_pravi_e2e.js       # Complete 16-step automated test suite
│   ├── .env                    # Environment variables
│   └── package.json
├── package.json                # Root project orchestrator
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Running Backend Server
```bash
cd server
npm start
```
*The server will boot on `http://localhost:5000`, automatically connect to MongoDB (or launch the pre-cached in-memory engine), and verify the 16 demo assets.*

### 3. Running Frontend Client
In a new terminal:
```bash
cd client
npm run dev
```
*The client application will start on `http://localhost:5173`.*

### 4. Running the Automated Verification Suite
To verify the entire 16-step user workflow programmatically:
```bash
cd server
node test_pravi_e2e.js
```

---

## 📡 REST API Documentation

| HTTP Method | Route | Description |
|---|---|---|
| `GET` | `/api/health` | System health check and database connection mode |
| `GET` | `/api/assets` | Get filtered assets (supports `search`, `assetType`, `district`, `status`, `condition`, `sortBy`, `order`, `page`, `limit`) |
| `GET` | `/api/assets/stats` | Aggregated dashboard KPI numbers, donut and bar chart analytics |
| `GET` | `/api/assets/:id` | Get detailed asset profile with attached inspections, maintenance, and history |
| `POST` | `/api/assets` | Register new infrastructure asset (auto-generates Asset ID if omitted) |
| `PUT` | `/api/assets/:id` | Update infrastructure asset profile (logs status/condition changes to audit trail) |
| `DELETE` | `/api/assets/:id` | Delete asset and cascade-delete linked inspections, maintenance, and history |
| `GET` | `/api/assets/:id/inspections` | Get all field inspection reports for an asset |
| `POST` | `/api/assets/:id/inspections` | Record a new inspection (automatically updates asset condition & last inspection date) |
| `GET` | `/api/assets/:id/maintenance` | Get maintenance records for a specific asset |
| `POST` | `/api/assets/:id/maintenance` | Schedule maintenance (if `In Progress`, updates asset status to `Under Maintenance`) |
| `GET` | `/api/maintenance` | Get all statewide maintenance operations across all infrastructure |
| `PUT` | `/api/maintenance/:id` | Update maintenance status (if `Completed`, restores asset to `Active` and upgrades condition) |
| `GET` | `/api/assets/:id/history` | Get complete chronological lifecycle audit trail for an asset |
| `POST` | `/api/assets/seed` | Reseed realistic R&B infrastructure demo records |

---

## 🎯 Step-by-Step Hackathon Demonstration Script

1. **Dashboard Overview**:
   - Open `http://localhost:5173/`.
   - Point out the 8 primary KPI cards (Total Assets, Active, Under Maintenance, Under Construction, Poor, Critical, Requiring Attention).
   - Review the Recharts visualizations (Assets by Status donut, Assets by Type, Condition ratings, District spread).
2. **Search & Multi-Filtering**:
   - Navigate to **Infrastructure Assets** in the sidebar.
   - Type `"Sabarmati"` in the debounced search bar to filter instantly.
   - Filter by **Asset Type: Bridge** and **District: Ahmedabad**.
   - Click **Export Filtered CSV** to download the ledger.
3. **Asset Registration**:
   - Click **+ Register Asset** in the top bar.
   - Select **Asset Type: Road**, enter name `"Dholera SIR Express Corridor"`, district `"Ahmedabad"`, location `"Bavaliyari"`.
   - Notice the dynamic Road fields (Length in km, Width in m, Surface material).
   - Save and observe the auto-generated Asset ID (`R&B-ROAD-xxx`).
4. **Field Inspection & Condition Downgrade**:
   - Open an asset (e.g. `R&B-ROAD-001` or newly registered asset).
   - Click **+ Inspect**.
   - Set Assessed Condition to **Poor**, enter remarks `"Surface scouring observed post-monsoon"`.
   - Submit: Notice the asset condition immediately updates to **Poor** on the profile and in the audit trail!
5. **Maintenance Operation & Status Synchronization**:
   - Click **+ Maintain**.
   - Select **In Progress**, enter scope `"Milling & Bituminous Overlay"`, estimated cost `₹4,500,000`.
   - Authorize: Notice the asset status transitions automatically to **Under Maintenance**!
6. **Maintenance Completion & Condition Restoration**:
   - Open the **Maintenance** tab or navigate to the statewide **Maintenance** page.
   - Click **Mark as Completed** on the work order.
   - Enter actual cost `₹4,350,000` and select Restored Condition: **Good**.
   - Confirm: The asset status is restored to **Active** and condition rating returns to **Good**!
7. **Lifecycle Audit Trail**:
   - Return to the asset's **Lifecycle Audit Trail** tab to view the complete chronological sequence of events logged with timestamps and actors.
8. **Executive Reports**:
   - Navigate to **Reports & Audits** in the sidebar.
   - Switch between **Critical & Poor Condition Watchlist**, **District Report**, and **Maintenance Audit**.
   - Download the official report CSV.

---

## 🔮 Future Scope

- **State Government Single Sign-On (SSO)** & Role-Based Access Control (Superintending Engineer vs. Field Officer).
- **GIS Map & Geospatial Layer Integration** leveraging the stored latitude/longitude coordinates.
- **Mobile PWA Field Inspection App** with offline sync and photo uploads.
- **Automated Weather & Monsoon Flood Alerts** mapped to low-lying culverts and bridges.
- **AI-assisted Pavement Deterioration Modeling** to predict road maintenance requirements 6 months in advance.
- **Integration with State Treasury (IFMS)** and government procurement e-tendering portals.
