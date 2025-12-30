'use client';

import React from "react";
import { getCounties, getSubCounties, getTowns } from "@/components/utils/LocationHelper";

interface Address {
  county: string;
  subCounty: string;
  town: string;
  phoneNumber: string;
  isDefault?: boolean;
}

interface Props {
  address: Address;
  onChange: (address: Address) => void;
  onSave: () => void;
  onDelete?: () => void;
  isSaving?: boolean;
}

export default function ShippingForm({
  address,
  onChange,
  onSave,
  onDelete,
  isSaving,
}: Props) {
  const subCounties = address.county ? getSubCounties(address.county) : [];
  const towns =
    address.county && address.subCounty
      ? getTowns(address.county, address.subCounty)
      : [];

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-4">
      <select
        name="county"
        value={address.county}
        onChange={(e) => onChange({ ...address, county: e.target.value, subCounty: "", town: "" })}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Select County</option>
        {getCounties().map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        name="subCounty"
        value={address.subCounty}
        onChange={(e) => onChange({ ...address, subCounty: e.target.value, town: "" })}
        className="w-full p-2 border rounded"
        required
        disabled={!address.county}
      >
        <option value="">Select Sub-County</option>
        {subCounties.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select
        name="town"
        value={address.town}
        onChange={(e) => onChange({ ...address, town: e.target.value })}
        className="w-full p-2 border rounded"
        required
        disabled={!address.subCounty}
      >
        <option value="">Select Town</option>
        {towns.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <input
        type="tel"
        name="phoneNumber"
        value={address.phoneNumber}
        onChange={(e) => onChange({ ...address, phoneNumber: e.target.value })}
        placeholder="Phone Number"
        className="w-full p-2 border rounded"
        required
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={!!address.isDefault}
          onChange={(e) => onChange({ ...address, isDefault: e.target.checked })}
        />
        <label>Set as Default</label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-green-600 text-white hover:bg-green-500 px-4 py-2 rounded disabled:opacity-50"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        {onDelete && (
          <button
            type="button"
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
            onClick={onDelete}
            disabled={isSaving}
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
