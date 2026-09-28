import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AssetFormModal from '../components/assets/AssetFormModal';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';
import { useToast } from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';
import assetService from '../services/assetService';

export default function MainLayout() {
  const { showToast } = useToast();
  const { currentUser, can, isAdmin } = useAuth();
  const [dbInfo, setDbInfo] = useState(null);
  const [isReseeding, setIsReseeding] = useState(false);

  // Global modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Global delete modal
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit modal
  const [assetToEdit, setAssetToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Global refresh trigger so child views update when an asset is added/edited/deleted
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerGlobalRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Fetch health and DB status
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await assetService.getHealth();
        if (res?.database) {
          setDbInfo(res.database);
        }
      } catch (err) {
        console.warn('Could not load health info', err);
      }
    };
    fetchHealth();
  }, []);

  // Handle Create Asset submission (Guarded by RBAC)
  const handleCreateAsset = async (formData) => {
    if (!can('canCreateAsset')) {
      showToast(
        `Access Denied: Role '${currentUser.role}' is not authorized to register infrastructure assets. (Required: Executive Engineer)`,
        'error'
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await assetService.createAsset(formData);
      if (res.success) {
        showToast(`Asset "${res.data.assetName}" (${res.data.assetId}) created successfully!`, 'success');
        setIsAddModalOpen(false);
        triggerGlobalRefresh();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create asset', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Asset submission (Guarded by RBAC)
  const handleUpdateAsset = async (formData) => {
    if (!can('canEditAsset')) {
      showToast(
        `Access Denied: Role '${currentUser.role}' cannot modify asset technical specifications. (Required: Executive Engineer)`,
        'error'
      );
      return;
    }

    if (!assetToEdit) return;
    try {
      setIsSubmitting(true);
      const res = await assetService.updateAsset(assetToEdit._id || assetToEdit.assetId, formData);
      if (res.success) {
        showToast(`Asset "${res.data.assetName}" updated successfully!`, 'success');
        setIsEditModalOpen(false);
        setAssetToEdit(null);
        triggerGlobalRefresh();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update asset', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Asset confirmation (Guarded by RBAC)
  const handleConfirmDelete = async (asset) => {
    if (!can('canDeleteAsset')) {
      showToast(
        `Access Denied: Role '${currentUser.role}' cannot decommission infrastructure assets. (Required: Executive Engineer)`,
        'error'
      );
      return;
    }

    if (!asset) return;
    try {
      setIsDeleting(true);
      await assetService.deleteAsset(asset._id || asset.assetId);
      showToast(`Asset "${asset.assetName}" (${asset.assetId}) deleted.`, 'info');
      setAssetToDelete(null);
      triggerGlobalRefresh();
    } catch (err) {
      showToast(err.message || 'Failed to delete asset', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Reset / Reseed Demo Data (Admin only)
  const handleReseed = async () => {
    if (!isAdmin) {
      showToast(`Access Denied: Demo reseed is restricted to Executive Engineer (Admin).`, 'error');
      return;
    }

    try {
      setIsReseeding(true);
      const res = await assetService.seedDemoAssets();
      if (res.success) {
        showToast('Sample presentation demo assets reseeded successfully!', 'success');
        triggerGlobalRefresh();
      }
    } catch (err) {
      showToast(err.message || 'Failed to reseed demo records', 'error');
    } finally {
      setIsReseeding(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      {/* Sidebar Navigation */}
      <Sidebar
        onOpenAddModal={can('canCreateAsset') ? () => setIsAddModalOpen(true) : null}
        dbInfo={dbInfo}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          onOpenAddModal={can('canCreateAsset') ? () => setIsAddModalOpen(true) : null}
          onReseed={isAdmin ? handleReseed : null}
          isReseeding={isReseeding}
          dbInfo={dbInfo}
        />

        {/* Main Routed Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet
            context={{
              refreshTrigger,
              triggerGlobalRefresh,
              onOpenAddModal: can('canCreateAsset')
                ? () => setIsAddModalOpen(true)
                : () =>
                    showToast(
                      `Access Denied: Role '${currentUser.role}' is not authorized to register infrastructure assets.`,
                      'error'
                    ),
              onEditAsset: can('canEditAsset')
                ? (asset) => {
                    setAssetToEdit(asset);
                    setIsEditModalOpen(true);
                  }
                : () =>
                    showToast(
                      `Access Denied: Role '${currentUser.role}' cannot modify asset technical specifications.`,
                      'error'
                    ),
              onDeleteAsset: can('canDeleteAsset')
                ? (asset) => setAssetToDelete(asset)
                : () =>
                    showToast(
                      `Access Denied: Role '${currentUser.role}' cannot decommission infrastructure assets.`,
                      'error'
                    ),
              onReseed: isAdmin ? handleReseed : null,
              isReseeding,
            }}
          />
        </main>
      </div>

      {/* Register Infrastructure Modal */}
      {can('canCreateAsset') && (
        <AssetFormModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateAsset}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Edit Infrastructure Modal */}
      {can('canEditAsset') && (
        <AssetFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setAssetToEdit(null);
          }}
          onSubmit={handleUpdateAsset}
          isSubmitting={isSubmitting}
          assetToEdit={assetToEdit}
          isEditMode={true}
        />
      )}

      {/* Delete Confirmation Modal */}
      {can('canDeleteAsset') && (
        <DeleteConfirmModal
          isOpen={!!assetToDelete}
          onClose={() => setAssetToDelete(null)}
          onConfirm={() => handleConfirmDelete(assetToDelete)}
          asset={assetToDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
