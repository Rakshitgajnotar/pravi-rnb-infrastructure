import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  PlusCircle,
  AlertCircle,
  Sparkles,
  Layers,
  MapPin,
  Calendar,
  Building,
} from 'lucide-react';

const ASSET_TYPES = [
  'Road',
  'Bridge',
  'Flyover',
  'Culvert',
  'Government Building',
  'Government Office',
  'Other Infrastructure',
];

const DISTRICTS = [
  'Ahmedabad',
  'Gandhinagar',
  'Surat',
  'Vadodara',
  'Rajkot',
  'Bhavnagar',
  'Jamnagar',
  'Junagadh',
  'Kheda',
  'Anand',
  'Mehsana',
  'Patan',
  'Banaskantha',
  'Sabarkantha',
  'Kutch',
  'Bharuch',
  'Navsari',
  'Valsad',
  'Amreli',
  'Surendranagar',
  'Morbi',
  'Gir Somnath',
  'Panchmahal',
  'Dahod',
];

const STATUSES = [
  'Under Construction',
  'Active',
  'Under Maintenance',
  'Closed',
  'Retired',
];

const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor', 'Critical'];

const ROAD_SURFACES = [
  'Bituminous (Dense Bituminous Macadam)',
  'Rigid Concrete Pavement (PQC)',
  'Water Bound Macadam (WBM)',
  'Interlocking Concrete Paver Blocks',
  'Earthen / Gravel Track',
];

const initialFormData = {
  assetId: '',
  assetName: '',
  assetType: 'Road',
  description: '',
  district: 'Ahmedabad',
  taluka: '',
  location: '',
  address: '',
  latitude: '',
  longitude: '',
  status: 'Active',
  condition: 'Good',
  ownership: 'Government',
  constructionYear: new Date().getFullYear(),
  estimatedCost: '',
  // Road
  roadLength: '',
  roadWidth: '',
  surfaceType: ROAD_SURFACES[0],
  // Bridge
  bridgeLength: '',
  bridgeWidth: '',
  bridgeType: '',
  // Flyover
  flyoverLength: '',
  numberOfLanes: '',
  // Building
  builtUpArea: '',
  numberOfFloors: '',
};

export default function AssetFormModal({
  isOpen,
  onClose,
  onSubmit,
  assetToEdit = null,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (assetToEdit) {
      setFormData({
        assetId: assetToEdit.assetId || '',
        assetName: assetToEdit.assetName || '',
        assetType: assetToEdit.assetType || 'Road',
        description: assetToEdit.description || '',
        district: assetToEdit.district || 'Ahmedabad',
        taluka: assetToEdit.taluka || '',
        location: assetToEdit.location || '',
        address: assetToEdit.address || '',
        latitude: assetToEdit.latitude !== null && assetToEdit.latitude !== undefined ? assetToEdit.latitude : '',
        longitude: assetToEdit.longitude !== null && assetToEdit.longitude !== undefined ? assetToEdit.longitude : '',
        status: assetToEdit.status || 'Active',
        condition: assetToEdit.condition || 'Good',
        ownership: assetToEdit.ownership || 'Government',
        constructionYear: assetToEdit.constructionYear || '',
        estimatedCost: assetToEdit.estimatedCost !== undefined ? assetToEdit.estimatedCost : '',
        roadLength: assetToEdit.roadLength || '',
        roadWidth: assetToEdit.roadWidth || '',
        surfaceType: assetToEdit.surfaceType || ROAD_SURFACES[0],
        bridgeLength: assetToEdit.bridgeLength || '',
        bridgeWidth: assetToEdit.bridgeWidth || '',
        bridgeType: assetToEdit.bridgeType || '',
        flyoverLength: assetToEdit.flyoverLength || '',
        numberOfLanes: assetToEdit.numberOfLanes || '',
        builtUpArea: assetToEdit.builtUpArea || '',
        numberOfFloors: assetToEdit.numberOfFloors || '',
      });
      setErrors({});
      setActiveTab('basic');
    } else {
      setFormData(initialFormData);
      setErrors({});
      setActiveTab('basic');
    }
  }, [assetToEdit, isOpen]);

  if (!isOpen) return null;

  const isEditMode = Boolean(assetToEdit);

  const validate = () => {
    const newErrors = {};

    if (!formData.assetName.trim()) {
      newErrors.assetName = 'Asset name is required';
    } else if (formData.assetName.trim().length < 2) {
      newErrors.assetName = 'Asset name must be at least 2 characters';
    }

    if (!formData.assetType) {
      newErrors.assetType = 'Asset type is required';
    }

    if (!formData.district.trim()) {
      newErrors.district = 'District is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location / route corridor is required';
    }

    if (formData.constructionYear) {
      const year = Number(formData.constructionYear);
      if (isNaN(year) || year < 1800 || year > new Date().getFullYear() + 10) {
        newErrors.constructionYear = 'Enter a valid construction year';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      // If validation error in basic or location, switch tab
      if (errors.assetName || errors.assetType) setActiveTab('basic');
      else if (errors.district || errors.location) setActiveTab('location');
      return;
    }

    const payload = {
      ...formData,
      constructionYear: formData.constructionYear ? Number(formData.constructionYear) : null,
      estimatedCost: formData.estimatedCost ? Number(formData.estimatedCost) : 0,
      latitude: formData.latitude ? Number(formData.latitude) : null,
      longitude: formData.longitude ? Number(formData.longitude) : null,
      roadLength: formData.roadLength ? Number(formData.roadLength) : null,
      roadWidth: formData.roadWidth ? Number(formData.roadWidth) : null,
      bridgeLength: formData.bridgeLength ? Number(formData.bridgeLength) : null,
      bridgeWidth: formData.bridgeWidth ? Number(formData.bridgeWidth) : null,
      flyoverLength: formData.flyoverLength ? Number(formData.flyoverLength) : null,
      numberOfLanes: formData.numberOfLanes ? Number(formData.numberOfLanes) : null,
      builtUpArea: formData.builtUpArea ? Number(formData.builtUpArea) : null,
      numberOfFloors: formData.numberOfFloors ? Number(formData.numberOfFloors) : null,
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-6 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/75">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100">
              {isEditMode ? <Save className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {isEditMode
                  ? `Update Asset Profile: ${assetToEdit.assetId}`
                  : 'Register New Infrastructure Asset'}
              </h2>
              <p className="text-xs text-slate-500">
                Roads & Buildings Department Central Asset Inventory
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Section Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 gap-2 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'basic', label: '1. Basic Info', icon: Layers },
            { id: 'location', label: '2. Location & Geo', icon: MapPin },
            { id: 'lifecycle', label: '3. Lifecycle & Cost', icon: Calendar },
            { id: 'technical', label: '4. Technical Specs', icon: Building },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-3 border-b-2 font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-brand-600 text-brand-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[68vh] overflow-y-auto">
          {/* TAB 1: BASIC INFORMATION */}
          {activeTab === 'basic' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Asset ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="assetId"
                      placeholder="e.g. R&B-ROAD-021 (leave blank to auto-generate)"
                      value={formData.assetId}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 uppercase font-mono"
                    />
                    {!formData.assetId && !isEditMode && (
                      <span className="absolute right-3 top-2 text-[11px] text-brand-600 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Auto
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Unique government inventory ledger code</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Asset Type *
                  </label>
                  <select
                    name="assetType"
                    value={formData.assetType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white font-semibold"
                  >
                    {ASSET_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Infrastructure Asset Name *
                </label>
                <input
                  type="text"
                  name="assetName"
                  placeholder="e.g. Ahmedabad-Gandhinagar Arterial Road Corridor or Sabarmati River Major Bridge"
                  value={formData.assetName}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-brand-500 ${
                    errors.assetName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.assetName && (
                  <p className="flex items-center gap-1 text-xs text-rose-500 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.assetName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description / Structural Scope
                </label>
                <textarea
                  name="description"
                  rows="3"
                  placeholder="Functional classification, connecting junctions, purpose of infrastructure..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: LOCATION & GEO */}
          {activeTab === 'location' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    District *
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white font-medium"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Taluka / Sub-Division
                  </label>
                  <input
                    type="text"
                    name="taluka"
                    placeholder="e.g. Daskroi, Ghatlodiya, City"
                    value={formData.taluka}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Location / Route Corridor / Chainage *
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. S.G. Highway to Infocity Junction or KM 14/2 on Nadiad-Vaso Road"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-brand-500 ${
                    errors.location ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.location && (
                  <p className="flex items-center gap-1 text-xs text-rose-500 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.location}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Detailed Address / Landmark
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="e.g. Near Mahatma Mandir, Sector 10-A"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Latitude (Optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    placeholder="e.g. 23.0225"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Longitude (Optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    placeholder="e.g. 72.5714"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIFECYCLE & COST */}
          {activeTab === 'lifecycle' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Operational Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white font-semibold"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Physical Condition *
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white font-semibold"
                  >
                    {CONDITIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Ownership Authority
                  </label>
                  <input
                    type="text"
                    name="ownership"
                    value={formData.ownership}
                    onChange={handleChange}
                    placeholder="Government of Gujarat - R&B Dept"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Construction / Commissioning Year
                  </label>
                  <input
                    type="number"
                    name="constructionYear"
                    placeholder="e.g. 2021"
                    value={formData.constructionYear}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Estimated Asset Valuation / Construction Cost (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2 text-xs text-slate-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    name="estimatedCost"
                    placeholder="e.g. 125000000 (12.5 Crores)"
                    value={formData.estimatedCost}
                    onChange={handleChange}
                    className="w-full pl-8 pr-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TECHNICAL SPECIFICATIONS (DYNAMIC) */}
          {activeTab === 'technical' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3 bg-brand-50/60 border border-brand-100 rounded-xl text-xs text-brand-800">
                Displaying technical specification fields specific to <strong>{formData.assetType}</strong>.
              </div>

              {/* ROAD SPECIFIC FIELDS */}
              {formData.assetType === 'Road' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Road Length (Kilometers)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="roadLength"
                      placeholder="e.g. 24.5"
                      value={formData.roadLength}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Carriageway Width (Meters)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="roadWidth"
                      placeholder="e.g. 14.0 or 22.0"
                      value={formData.roadWidth}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Surface Material Classification
                    </label>
                    <select
                      name="surfaceType"
                      value={formData.surfaceType}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
                    >
                      {ROAD_SURFACES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* BRIDGE SPECIFIC FIELDS */}
              {formData.assetType === 'Bridge' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Bridge Length (Meters)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="bridgeLength"
                      placeholder="e.g. 480.0"
                      value={formData.bridgeLength}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Bridge Width (Meters)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="bridgeWidth"
                      placeholder="e.g. 16.5"
                      value={formData.bridgeWidth}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Bridge Structural Superstructure Type
                    </label>
                    <input
                      type="text"
                      name="bridgeType"
                      placeholder="e.g. Pre-stressed Concrete (PSC) Box Girder or Steel Truss"
                      value={formData.bridgeType}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              )}

              {/* FLYOVER SPECIFIC FIELDS */}
              {formData.assetType === 'Flyover' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Elevated Flyover Length (Meters)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="flyoverLength"
                      placeholder="e.g. 1350.0"
                      value={formData.flyoverLength}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Number of Traffic Lanes
                    </label>
                    <input
                      type="number"
                      name="numberOfLanes"
                      placeholder="e.g. 4 or 6"
                      value={formData.numberOfLanes}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              )}

              {/* BUILDING / OFFICE SPECIFIC FIELDS */}
              {(formData.assetType === 'Government Building' || formData.assetType === 'Government Office') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Built-Up Area (Square Meters)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="builtUpArea"
                      placeholder="e.g. 18500.0"
                      value={formData.builtUpArea}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Number of Floors
                    </label>
                    <input
                      type="number"
                      name="numberOfFloors"
                      placeholder="e.g. 8"
                      value={formData.numberOfFloors}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              )}

              {/* CULVERT / OTHER INFRASTRUCTURE */}
              {(formData.assetType === 'Culvert' || formData.assetType === 'Other Infrastructure') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Structure Width / Span (Meters)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="roadWidth"
                      placeholder="e.g. 7.5 or 12.0"
                      value={formData.roadWidth}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Culvert Slab / Pipe Type
                    </label>
                    <input
                      type="text"
                      name="surfaceType"
                      placeholder="e.g. RCC Box Culvert or Pipe Culvert"
                      value={formData.surfaceType}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              {activeTab !== 'basic' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'technical') setActiveTab('lifecycle');
                    else if (activeTab === 'lifecycle') setActiveTab('location');
                    else if (activeTab === 'location') setActiveTab('basic');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  ← Previous Step
                </button>
              )}
              {activeTab !== 'technical' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'basic') setActiveTab('location');
                    else if (activeTab === 'location') setActiveTab('lifecycle');
                    else if (activeTab === 'lifecycle') setActiveTab('technical');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-50 rounded-xl transition-all"
                >
                  Next Step →
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isEditMode ? (
                  <Save className="w-3.5 h-3.5" />
                ) : (
                  <PlusCircle className="w-3.5 h-3.5" />
                )}
                <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Update Infrastructure Asset' : 'Register Asset'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
