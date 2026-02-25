import React, { useState } from "react";
import { Pencil, X, Check } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type PricingRow = {
  id: string;
  duration: string;
  price: number;
};

type Plan = {
  id: number;
  title: string;
  type: "free" | "premium" | "top";
  recommended?: boolean;
  pricing: PricingRow[];
};

type EditingCell = {
  planId: number;
  rowId: string;
  field: "duration" | "price";
  currentVal: string | number;
};

// ── Data ──────────────────────────────────────────────────────────────────────

const initialPlans: Plan[] = [
  {
    id: 1,
    title: "Freemium",
    type: "free",
    pricing: [],
  },
  {
    id: 2,
    title: "Premium",
    type: "premium",
    recommended: true,
    pricing: [
      { id: "p1", duration: "7 days", price: 2500 },
      { id: "p2", duration: "14 days", price: 4500 },
      { id: "p3", duration: "30 days", price: 8000 },
    ],
  },
  {
    id: 3,
    title: "Top Listing",
    type: "top",
    recommended: false,
    pricing: [
      { id: "t1", duration: "7 days", price: 5000 },
      { id: "t2", duration: "14 days", price: 9000 },
      { id: "t3", duration: "30 days", price: 15000 },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return "₦" + Number(n).toLocaleString("en-NG");
}

// fmt is used in the table rows for displaying prices

// ── Edit Modal ────────────────────────────────────────────────────────────────

function EditModal({
  cell,
  draftValue,
  onDraftChange,
  onCommit,
  onClose,
}: {
  cell: EditingCell;
  draftValue: string;
  onDraftChange: (val: string) => void;
  onCommit: () => void;
  onClose: () => void;
}): React.JSX.Element {
  const isPrice = cell.field === "price";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        {/* Modal header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">
            Edit {isPrice ? "Price" : "Duration"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input */}
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          {isPrice ? "Price (₦)" : "Duration"}
        </label>
        <input
          autoFocus
          type={isPrice ? "number" : "text"}
          min={isPrice ? "0" : undefined}
          value={draftValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onDraftChange(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") onCommit();
            if (e.key === "Escape") onClose();
          }}
          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39B54A] focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder={isPrice ? "e.g. 5000" : "e.g. 7 days"}
        />

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onCommit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#39B54A] rounded-lg hover:bg-green-600 transition-colors"
          >
            <Check className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdPricingAdmin(): React.JSX.Element {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [dirty, setDirty] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [draftValue, setDraftValue] = useState<string>("");

  const mark = (): void => {
    setDirty(true);
    setSaved(false);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) + " · " + date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openEdit = (
    planId: number,
    rowId: string,
    field: EditingCell["field"],
    currentVal: string | number
  ): void => {
    setEditingCell({ planId, rowId, field, currentVal });
    setDraftValue(String(currentVal));
  };

  const commitEdit = (): void => {
    if (!editingCell) return;
    const { planId, rowId, field } = editingCell;
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;
        return {
          ...p,
          pricing: p.pricing.map((r) => {
            if (r.id !== rowId) return r;
            return {
              ...r,
              [field]: field === "price" ? Number(draftValue) || 0 : draftValue,
            };
          }),
        };
      })
    );
    setEditingCell(null);
    mark();
  };

  const handleSave = async (): Promise<void> => {
    setSaving(true);
    // TODO: replace with real API call
    await new Promise<void>((r) => setTimeout(r, 900));
    setSaving(false);
    setDirty(false);
    setSaved(true);
    setLastUpdated(new Date());
    setTimeout(() => setSaved(false), 3000);
  };

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const paidPlans = plans.filter((p) => p.pricing.length > 0);

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen">

      {/* Edit Modal */}
      {editingCell && (
        <EditModal
          cell={editingCell}
          draftValue={draftValue}
          onDraftChange={setDraftValue}
          onCommit={commitEdit}
          onClose={() => setEditingCell(null)}
        />
      )}

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Ad Pricing</h1>
          <p className="text-sm text-gray-500">
            Manage plan prices sellers see when boosting a listing
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={!dirty || saving}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            saved
              ? "bg-green-100 text-green-700 cursor-not-allowed"
              : dirty
              ? "bg-[#39B54A] hover:bg-green-600 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {saving ? "Saving…" : saved ? "✓ Saved" : "Save Changes"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Total Plans
          </p>
          <p className="text-3xl font-bold text-gray-800">{plans.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Paid Plans
          </p>
          <p className="text-3xl font-bold text-gray-800">{paidPlans.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Last Updated
          </p>
          <p className={`text-sm font-semibold mt-1 ${lastUpdated ? "text-gray-800" : "text-gray-400"}`}>
            {lastUpdated ? formatDate(lastUpdated) : "Not saved yet"}
          </p>
        </div>
      </div>

      {/* Plan cards */}
      {plans.map((plan) => {
        const isFree = plan.pricing.length === 0;

        return (
          <div
            key={plan.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            {/* Plan header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-800">{plan.title}</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {isFree
                    ? "Basic listing, always free"
                    : `${plan.pricing.length} pricing tiers`}
                </p>
              </div>
              {isFree && (
                <span className="inline-flex px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">
                  Free
                </span>
              )}
              {plan.recommended && (
                <span className="inline-flex px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                  ★ Recommended
                </span>
              )}
            </div>

            {isFree ? (
              <p className="px-6 py-4 text-sm text-gray-400 italic">
                No pricing tiers — this plan is always free.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {plan.pricing.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 text-sm text-gray-800">
                          {row.duration}
                        </td>
                        <td className="py-4 px-6 text-sm font-semibold text-gray-800">
                          {fmt(row.price)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 justify-end">
                            {/* Edit duration */}
                            <button
                              onClick={() =>
                                openEdit(plan.id, row.id, "duration", row.duration)
                              }
                              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-[#39B54A] hover:bg-green-50 border border-gray-200 hover:border-green-200 rounded-lg transition-colors"
                              title="Edit duration"
                            >
                              <Pencil className="w-3 h-3" />
                              Duration
                            </button>
                            {/* Edit price */}
                            <button
                              onClick={() =>
                                openEdit(plan.id, row.id, "price", row.price)
                              }
                              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-[#39B54A] hover:bg-green-50 border border-gray-200 hover:border-green-200 rounded-lg transition-colors"
                              title="Edit price"
                            >
                              <Pencil className="w-3 h-3" />
                              Price
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}

      {/* Hint */}
      <p className="text-xs text-gray-400 text-center pb-4">
        Click the edit buttons to update duration or price for each tier.
      </p>
    </div>
  );
}