"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Pencil, X, Check, Plus, Trash2, Loader2, AlertCircle, Star } from "lucide-react";
import { toast } from "react-toastify";
import ApiFetcher from "@/utils/apis";

// ── API shape ─────────────────────────────────────────────────────────────
interface ApiPlan {
  id: number;
  title: string;
  pricing: Record<string, number> | never[];
  is_recommended: 0 | 1 | boolean;
}

// ── Local shape ───────────────────────────────────────────────────────────
interface PricingRow {
  label: string;
  price: number;
}

interface LocalPlan {
  id: number;
  title: string;
  isRecommended: boolean;
  rows: PricingRow[];
}

function apiToLocal(p: ApiPlan): LocalPlan {
  const pricing = p.pricing;
  const rows: PricingRow[] = Array.isArray(pricing)
    ? []
    : Object.entries(pricing)
        .filter(([k, v]) => k !== "features" && !Array.isArray(v) && typeof v === "number")
        .map(([label, price]) => ({ label, price: price as number }));

  return {
    id: p.id,
    title: p.title,
    isRecommended: Boolean(p.is_recommended),
    rows,
  };
}

function localToApi(p: LocalPlan): Omit<ApiPlan, "id"> {
  const pricing: Record<string, number> = {};
  p.rows.forEach((r) => { if (r.label) pricing[r.label] = r.price; });
  return { title: p.title, pricing, is_recommended: p.isRecommended };
}

// ── Helpers ───────────────────────────────────────────────────────────────
function fmt(n: number): string {
  return "₦" + Number(n).toLocaleString("en-NG");
}

function formatDate(date: Date): string {
  return (
    date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " +
    date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  );
}

// ── Edit Cell Modal ───────────────────────────────────────────────────────
interface EditCellState {
  planId: number;
  rowIdx: number;
  field: "label" | "price";
  current: string;
}

function EditCellModal({
  cell, draft, onChange, onCommit, onClose,
}: {
  cell: EditCellState;
  draft: string;
  onChange: (v: string) => void;
  onCommit: () => void;
  onClose: () => void;
}) {
  const isPrice = cell.field === "price";
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">Edit {isPrice ? "Price" : "Duration"}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          {isPrice ? "Price (₦)" : "Duration label (e.g. 7 Days, 1 Month)"}
        </label>
        <input
          autoFocus
          type={isPrice ? "number" : "text"}
          value={draft}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onCommit(); if (e.key === "Escape") onClose(); }}
          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder={isPrice ? "e.g. 5000" : "e.g. 7 Days"}
        />
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
            Cancel
          </button>
          <button onClick={onCommit} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600">
            <Check className="w-4 h-4" /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Create Plan Modal ─────────────────────────────────────────────────────
function CreatePlanModal({
  onClose, onCreate, isSubmitting,
}: {
  onClose: () => void;
  onCreate: (plan: Omit<ApiPlan, "id">) => Promise<void>;
  isSubmitting: boolean;
}) {
  const [title, setTitle] = useState("");
  const [isRecommended, setIsRecommended] = useState(false);
  const [rows, setRows] = useState<PricingRow[]>([{ label: "", price: 0 }]);

  const handleSubmit = async () => {
    if (!title.trim()) { toast.error("Plan title is required."); return; }
    const pricing: Record<string, number> = {};
    rows.forEach((r) => { if (r.label) pricing[r.label] = r.price; });
    await onCreate({ title, pricing, is_recommended: isRecommended });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">Create Pricing Plan</h3>
          <button onClick={onClose} disabled={isSubmitting} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plan Title <span className="text-red-500">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Premium"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isRecommended}
            onChange={(e) => setIsRecommended(e.target.checked)}
            className="w-4 h-4 accent-green-600 rounded"
          />
          <span className="text-sm font-medium text-gray-700">Mark as Recommended</span>
        </label>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Pricing Tiers</label>
            <button
              onClick={() => setRows([...rows, { label: "", price: 0 }])}
              className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add tier
            </button>
          </div>
          <div className="space-y-2">
            {rows.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={row.label}
                  onChange={(e) => { const r = [...rows]; r[i] = { ...r[i], label: e.target.value }; setRows(r); }}
                  placeholder="e.g. 7 Days"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="number"
                  value={row.price}
                  onChange={(e) => { const r = [...rows]; r[i] = { ...r[i], price: Number(e.target.value) }; setRows(r); }}
                  placeholder="0"
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button onClick={() => setRows(rows.filter((_, j) => j !== i))} className="p-1.5 text-gray-400 hover:text-red-500 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">Left: duration label (e.g. "7 Days") · Right: price in ₦</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} disabled={isSubmitting} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title || isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold"
          >
            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : "Create Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────
export default function AdPricingAdmin() {
  const [plans, setPlans] = useState<LocalPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingCell, setEditingCell] = useState<EditCellState | null>(null);
  const [draftValue, setDraftValue] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LocalPlan | null>(null);
  const [dirtyIds, setDirtyIds] = useState<Set<number>>(new Set());
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // ── Fetch ─────────────────────────────────────────────────────────────
  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await ApiFetcher.get("/admin/pricing");
      const raw: ApiPlan[] = Array.isArray(res.data)
        ? res.data
        : (res.data?.data ?? []);
      setPlans(raw.map(apiToLocal));
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Failed to load pricing plans.";
      setError(msg);
      console.error("Error loading plans:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  // ── Cell edit ─────────────────────────────────────────────────────────
  const openEdit = (planId: number, rowIdx: number, field: "label" | "price", current: string) => {
    setEditingCell({ planId, rowIdx, field, current });
    setDraftValue(current);
  };

  const commitEdit = () => {
    if (!editingCell) return;
    const { planId, rowIdx, field } = editingCell;
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;
        const rows = [...p.rows];
        rows[rowIdx] = {
          ...rows[rowIdx],
          [field]: field === "price" ? Number(draftValue) || 0 : draftValue,
        };
        return { ...p, rows };
      })
    );
    setDirtyIds((s) => new Set(s).add(planId));
    setEditingCell(null);
  };

  // ── Save plan ─────────────────────────────────────────────────────────
  const savePlan = async (plan: LocalPlan) => {
    setSavingId(plan.id);
    try {
      const res = await ApiFetcher.put(`/admin/pricing/${plan.id}`, localToApi(plan));
      if (!res.data?.status && res.data?.status !== undefined) {
        throw new Error("Update failed");
      }
      setDirtyIds((s) => { const n = new Set(s); n.delete(plan.id); return n; });
      setLastUpdated(new Date());
      toast.success(`"${plan.title}" updated successfully!`);
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Failed to save plan. Please try again.";
      toast.error(msg);
      console.error("Error saving plan:", err);
    } finally {
      setSavingId(null);
    }
  };

  // ── Create plan ───────────────────────────────────────────────────────
  const createPlan = async (body: Omit<ApiPlan, "id">) => {
    setIsCreating(true);
    try {
      const res = await ApiFetcher.post("/admin/pricing", body);
      if (!res.data?.status && res.data?.status !== undefined) {
        throw new Error("Create failed");
      }
      await fetchPlans();
      setShowCreate(false);
      toast.success("Pricing plan created successfully!");
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Failed to create plan. Please try again.";
      toast.error(msg);
      console.error("Error creating plan:", err);
    } finally {
      setIsCreating(false);
    }
  };

  // ── Delete plan ───────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      await ApiFetcher.delete(`/admin/pricing/${deleteTarget.id}`);
      setPlans((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success(`"${deleteTarget.title}" deleted successfully!`);
      setDeleteTarget(null);
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Failed to delete plan. Please try again.";
      toast.error(msg);
      console.error("Error deleting plan:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-red-500 text-sm">{error}</p>
        <button onClick={fetchPlans} className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Edit cell modal */}
      {editingCell && (
        <EditCellModal
          cell={editingCell}
          draft={draftValue}
          onChange={setDraftValue}
          onCommit={commitEdit}
          onClose={() => setEditingCell(null)}
        />
      )}

      {/* Create modal */}
      {showCreate && (
        <CreatePlanModal
          onClose={() => setShowCreate(false)}
          onCreate={createPlan}
          isSubmitting={isCreating}
        />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Plan?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Permanently delete <span className="font-medium text-gray-900">"{deleteTarget.title}"</span>? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={!!deletingId}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={!!deletingId}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
              >
                {deletingId ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ad Pricing</h1>
          <p className="text-sm text-gray-500 mt-1">Manage plan prices sellers see when boosting a listing</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> New Plan
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Plans", value: String(plans.length) },
          { label: "Recommended", value: String(plans.filter((p) => p.isRecommended).length) },
          { label: "Last Updated", value: lastUpdated ? formatDate(lastUpdated) : "Not saved yet" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
            <p className="font-bold text-gray-800 text-2xl leading-tight">{value}</p>
          </div>
        ))}
      </div>

      {/* Plan cards */}
      {plans.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <p className="text-gray-400 text-sm">No pricing plans yet. Create one above.</p>
        </div>
      ) : (
        plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Plan header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-gray-800">{plan.title}</h2>
                  {plan.isRecommended && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                      <Star className="w-3 h-3" /> Recommended
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {plan.rows.length === 0
                    ? "No pricing tiers — free plan"
                    : `${plan.rows.length} pricing tier${plan.rows.length !== 1 ? "s" : ""}`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {dirtyIds.has(plan.id) && (
                  <button
                    onClick={() => savePlan(plan)}
                    disabled={savingId === plan.id}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    {savingId === plan.id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Check className="w-3.5 h-3.5" />
                    }
                    Save
                  </button>
                )}
                <button
                  onClick={() => setDeleteTarget(plan)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete plan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tiers table */}
            {plan.rows.length === 0 ? (
              <p className="px-6 py-4 text-sm text-gray-400 italic">No pricing tiers — this plan is always free.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="py-3 px-6 w-40" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {plan.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 text-sm text-gray-800">{row.label}</td>
                        <td className="py-4 px-6 text-sm font-semibold text-gray-800">{fmt(row.price)}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => openEdit(plan.id, i, "label", row.label)}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-green-600 hover:bg-green-50 border border-gray-200 hover:border-green-200 rounded-lg transition-colors"
                            >
                              <Pencil className="w-3 h-3" /> Duration
                            </button>
                            <button
                              onClick={() => openEdit(plan.id, i, "price", String(row.price))}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-green-600 hover:bg-green-50 border border-gray-200 hover:border-green-200 rounded-lg transition-colors"
                            >
                              <Pencil className="w-3 h-3" /> Price
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
        ))
      )}
    </div>
  );
}