// Request validation middleware for Government R&B Infrastructure Assets

const validateAsset = (req, res, next) => {
  const { assetName, assetType, district, location, status, condition, constructionYear } = req.body;
  const isPost = req.method === 'POST';
  const errors = [];

  const validAssetTypes = [
    'Road',
    'Bridge',
    'Flyover',
    'Culvert',
    'Government Building',
    'Government Office',
    'Other Infrastructure',
  ];

  const validStatuses = ['Under Construction', 'Active', 'Under Maintenance', 'Closed', 'Retired'];
  const validConditions = ['Excellent', 'Good', 'Fair', 'Poor', 'Critical'];

  if (isPost || assetName !== undefined) {
    if (!assetName || typeof assetName !== 'string' || assetName.trim().length < 2) {
      errors.push('Asset Name is required and must be at least 2 characters long.');
    }
  }

  if (isPost || assetType !== undefined) {
    if (!assetType || !validAssetTypes.includes(assetType)) {
      errors.push(`Asset Type must be one of: ${validAssetTypes.join(', ')}.`);
    }
  }

  if (isPost || district !== undefined) {
    if (!district || typeof district !== 'string' || !district.trim()) {
      errors.push('District is required for government infrastructure assets.');
    }
  }

  if (isPost || location !== undefined) {
    if (!location || typeof location !== 'string' || !location.trim()) {
      errors.push('Location / Route corridor is required.');
    }
  }

  if (status !== undefined) {
    if (!validStatuses.includes(status)) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')}.`);
    }
  }

  if (condition !== undefined) {
    if (!validConditions.includes(condition)) {
      errors.push(`Condition must be one of: ${validConditions.join(', ')}.`);
    }
  }

  if (constructionYear !== undefined && constructionYear !== '' && constructionYear !== null) {
    const year = Number(constructionYear);
    if (isNaN(year) || year < 1800 || year > new Date().getFullYear() + 10) {
      errors.push('Construction year must be a valid four-digit year.');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed for infrastructure asset',
      errors,
    });
  }

  next();
};

module.exports = {
  validateAsset,
};
