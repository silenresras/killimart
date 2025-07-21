"use client";

import { useEffect, useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";

import ShippingForm from "@/components/forms/ShippingForm";
import { useShippingStore } from "@/store/useShippingStore";

export default function OverviewPage() {
  const {
    addresses,
    loading,
    fetchAddresses,
    setDefaultAddress,
    deleteAddress,
    addOrUpdateAddress,
  } = useShippingStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [formAddress, setFormAddress] = useState({
    county: "",
    subCounty: "",
    town: "",
    phoneNumber: "",
    isDefault: false,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const openModal = (address?: any) => {
    if (address) {
      setFormAddress({
        county: address.county,
        subCounty: address.subCounty,
        town: address.town,
        phoneNumber: address.phoneNumber,
        isDefault: address.isDefault,
      });
      setEditingId(address._id);
    } else {
      setFormAddress({
        county: "",
        subCounty: "",
        town: "",
        phoneNumber: "",
        isDefault: false,
      });
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormAddress({
      county: "",
      subCounty: "",
      town: "",
      phoneNumber: "",
      isDefault: false,
    });
    setEditingId(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await addOrUpdateAddress({
        ...formAddress,
        _id: editingId || undefined,
      });
      toast.success(editingId ? "Address updated" : "Address added");
      closeModal();
    } catch (err) {
      toast.error("Failed to save address");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this address?");
    if (!confirmed) return;

    try {
      await deleteAddress(id);
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      toast.success("Default address updated");
    } catch {
      toast.error("Failed to set default");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Shipping Addresses</h2>
        <button
          onClick={() => openModal()}
          className="bg-emerald-500 text-white px-4 py-2 rounded"
        >
          Add Address
        </button>
      </div>

      {loading ? (
        <p>Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <p>No shipping address found. Please add one.</p>
      ) : (
        addresses.map((addr) => (
          <div
            key={addr._id}
            className="border p-4 rounded mb-3 bg-white shadow"
          >
            <p><strong>County:</strong> {addr.county}</p>
            <p><strong>Sub-County:</strong> {addr.subCounty}</p>
            <p><strong>Town:</strong> {addr.town}</p>
            <p><strong>Phone:</strong> {addr.phoneNumber}</p>
            <p><strong>Shipping Fee:</strong> KES {addr.shippingFee || 300}</p>

            <div className="flex items-center gap-2 mt-2">
              {!addr.isDefault ? (
                <button
                  onClick={() => handleSetDefault(addr._id!)}
                  className="text-emerald-500 text-sm"
                >
                  Set as Default
                </button>
              ) : (
                <span className="text-emerald-500 text-sm">Default Address</span>
              )}

              <MdEdit
                onClick={() => openModal(addr)}
                className="text-emerald-500 cursor-pointer text-xl"
              />
              <MdDelete
                onClick={() => handleDelete(addr._id!)}
                className="text-red-600 cursor-pointer text-xl"
              />
            </div>
          </div>
        ))
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <ShippingForm
              address={formAddress}
              onChange={(updatedAddress) =>
                setFormAddress((prev) => ({
                  ...prev,
                  ...updatedAddress,
                  isDefault: updatedAddress.isDefault ?? false, // ✅ ensures boolean
                }))
              }
              
              onSave={handleSave}
              onDelete={
                editingId
                  ? () => handleDelete(editingId)
                  : undefined
              }
              isSaving={isSaving}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
