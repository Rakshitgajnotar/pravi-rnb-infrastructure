import { useState, useEffect, useCallback } from 'react';
import assetService from '../services/assetService';

export const useAssets = (initialParams = {}) => {
  const [assets, setAssets] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchAssets = useCallback(async (currentParams) => {
    try {
      setLoading(true);
      setError(null);
      const res = await assetService.getAssets(currentParams);
      if (res.success) {
        setAssets(res.data);
        setTotal(res.total);
        setCurrentPage(res.currentPage);
        setTotalPages(res.totalPages);
      }
    } catch (err) {
      setError(err.message || 'Failed to load assets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets(params);
  }, [fetchAssets, params]);

  const updateFilters = (newParams) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  const refetch = () => {
    fetchAssets(params);
  };

  return {
    assets,
    total,
    currentPage,
    totalPages,
    loading,
    error,
    params,
    updateFilters,
    refetch,
  };
};

export default useAssets;
