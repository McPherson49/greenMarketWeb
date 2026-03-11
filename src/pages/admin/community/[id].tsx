'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';   // ← Pages Router
import {
  ArrowLeft, Pencil, CheckCircle, PauseCircle,
  Trash2, Users, Calendar, Globe, Lock, Tag, AlertCircle,
} from 'lucide-react';
import { GiCow, GiWheat, GiGrain, GiCargoShip, GiMoneyStack } from 'react-icons/gi';
import { Fish, Truck, Cpu, HelpCircle } from 'lucide-react';

// ── Icon map (mirrors CreateCommunityModal) ─────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'Livestock & Poultry':     GiCow,
  'Crop Farming':            GiWheat,
  'Aquaculture':             Fish,
  'Agro-processing':         GiGrain,
  'Export & Trade':          GiCargoShip,
  'Supply & Logistics':      Truck,
  'Finance & Investment':    GiMoneyStack,
  'Technology & Innovation': Cpu,
  'Other':                   HelpCircle,
};

const statusStyles: Record<string, string> = {
  Approved:  'bg-green-100 text-green-700',
  Pending:   'bg-yellow-100 text-yellow-700',
  Suspended: 'bg-red-100 text-red-700',
};

// ── TODO: replace with real API call ────────────────────────────────────────
// e.g. const { data: community } = useSWR(`/api/admin/communities/${id}`)
interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  coverImage: string | null;
  creator: string;
  createdDate: string;
  members: number;
  status: 'Pending' | 'Approved' | 'Suspended';
  isPrivate: boolean;
  tags: string[];
}

const PLACEHOLDER: Community = {
  id: '',
  name: 'Community Name',
  description: 'Community details will load here once the API is connected.',
  category: 'Other',
  icon: 'Other',
  coverImage: null,
  creator: '—',
  createdDate: '—',
  members: 0,
  status: 'Pending',
  isPrivate: false,
  tags: [],
};
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminCommunityViewPage() {
  const router = useRouter();
  const { id } = router.query as { id: string };  // ← router.query for Pages Router

  const [community, setCommunity] = useState<Community>({ ...PLACEHOLDER });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Community['status']>('Pending');
  const [actionModal, setActionModal] = useState<'approve' | 'suspend' | 'delete' | null>(null);

  useEffect(() => {
    if (!id) return;

    // TODO: replace with real fetch
    // const data = await CommunityService.getById(id);
    // setCommunity(data);
    // setStatus(data.status);

    setCommunity({ ...PLACEHOLDER, id });
    setStatus(PLACEHOLDER.status);
    setLoading(false);
  }, [id]);

  const confirmAction = () => {
    if (actionModal === 'approve') setStatus('Approved');
    if (actionModal === 'suspend') setStatus('Suspended');
    if (actionModal === 'delete')  router.push('/admin/community');
    // TODO: call API here e.g. await CommunityService.updateStatus(id, actionModal)
    setActionModal(null);
  };

  const CommunityIcon = ICON_MAP[community.icon] ?? HelpCircle;

  if (loading || !id) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/admin/community"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Communities
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/admin/community/${id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Link>

          {status === 'Pending' && (
            <button
              onClick={() => setActionModal('approve')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </button>
          )}

          {(status === 'Pending' || status === 'Approved') && (
            <button
              onClick={() => setActionModal('suspend')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <PauseCircle className="w-4 h-4" />
              {status === 'Pending' ? 'Reject' : 'Suspend'}
            </button>
          )}

          {status === 'Suspended' && (
            <button
              onClick={() => setActionModal('approve')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Re-approve
            </button>
          )}

          <button
            onClick={() => setActionModal('delete')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* ── API notice ──────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
        <span>
          <strong>API not connected yet.</strong> Showing placeholder UI.
          Wire up the <code className="bg-amber-100 px-1 rounded text-xs">useEffect</code> fetch once the endpoint is ready.
        </span>
      </div>

      {/* ── Cover + community card ───────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="h-40 bg-linear-to-r from-green-400 to-emerald-500 relative">
          {community.coverImage && (
            <img src={community.coverImage} alt="Cover" className="w-full h-full object-cover" />
          )}
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-8 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center shrink-0">
              <CommunityIcon className="w-8 h-8 text-green-600" />
            </div>
            <span className={`self-start sm:self-auto inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}>
              {status}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">{community.name}</h1>
          <p className="text-sm text-gray-400 mb-4">{community.category}</p>
          <p className="text-gray-700 leading-relaxed">{community.description}</p>

          {community.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {community.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                  <Tag className="w-3 h-3" />{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Meta grid ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Members',  value: community.members.toLocaleString(), Icon: Users    },
          { label: 'Created',  value: community.createdDate,              Icon: Calendar },
          { label: 'Privacy',  value: community.isPrivate ? 'Private' : 'Public', Icon: community.isPrivate ? Lock : Globe },
          { label: 'Creator',  value: community.creator,                  Icon: Users    },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Action confirmation modal ────────────────────────────────────── */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
              actionModal === 'approve' ? 'bg-green-100'  :
              actionModal === 'suspend' ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              {actionModal === 'approve' && <CheckCircle className="w-6 h-6 text-green-600" />}
              {actionModal === 'suspend' && <PauseCircle  className="w-6 h-6 text-yellow-600" />}
              {actionModal === 'delete'  && <Trash2       className="w-6 h-6 text-red-600" />}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 capitalize">
              {actionModal} Community?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {actionModal === 'approve' && 'This will make the community live and visible to all users.'}
              {actionModal === 'suspend' && 'This will temporarily hide the community from all users.'}
              {actionModal === 'delete'  && 'This will permanently remove the community. This action cannot be undone.'}
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setActionModal(null)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-5 py-2.5 rounded-lg font-medium text-white ${
                  actionModal === 'approve' ? 'bg-green-600 hover:bg-green-700'   :
                  actionModal === 'suspend' ? 'bg-yellow-600 hover:bg-yellow-700' :
                  'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionModal === 'approve' ? 'Approve' : actionModal === 'suspend' ? 'Suspend' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}