'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, XCircle, Trash2, Eye, Pencil, Calendar, MapPin, Plus } from 'lucide-react';
import CreateEventModal from '@/components/community/CreateEventModal';
import { NewEvent } from '@/types/community';

const DEFAULT_EVENT: NewEvent = {
  title: '',
  date: '',
  time: '',
  location: '',
  isOnline: false,
  description: '',
  image: null,
  previewImage: null,
  attendees: null,
};

const mockEvents: any[] = [];

export default function AdminEventsPage() {
  const [events, setEvents] = useState(mockEvents);

  // ── Create Event modal ──────────────────────────────────────────────────────
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState<NewEvent>(DEFAULT_EVENT);

  const handleCreateEvent = () => {
    const created = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.isOnline ? 'Online' : newEvent.location,
      organizer: 'Admin',
      description: newEvent.description,
      image: newEvent.previewImage ?? '/placeholder-event.jpg',
      attendees: newEvent.attendees ?? 0,
      status: 'Pending',   // always starts Pending for review
    };
    setEvents((prev: any[]) => [created, ...prev]);
    setShowCreateModal(false);
    setNewEvent(DEFAULT_EVENT);
  };

  // ── Approve / Reject / Delete modal ────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'delete'>('approve');

  const handleAction = (event: any, type: 'approve' | 'reject' | 'delete') => {
    setSelectedEvent(event);
    setActionType(type);
    setModalOpen(true);
  };

  const confirmAction = () => {
    if (!selectedEvent) return;
    if (actionType === 'delete') {
      setEvents((prev: any[]) => prev.filter((e) => e.id !== selectedEvent.id));
    } else {
      const newStatus = actionType === 'approve' ? 'Approved' : 'Rejected';
      setEvents((prev: any[]) =>
        prev.map((e) => (e.id === selectedEvent.id ? { ...e, status: newStatus } : e))
      );
    }
    setModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="space-y-6">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Event Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and approve member-submitted events
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Event
        </button>
      </div>

      {/* ── Events Table ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {events.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Yet</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
              Events submitted by community members will appear here for review.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              {[
                { label: 'Pending Review', dot: 'bg-yellow-100 border-yellow-300' },
                { label: 'Approved',       dot: 'bg-green-100 border-green-300'   },
                { label: 'Rejected',       dot: 'bg-red-100 border-red-300'       },
              ].map(({ label, dot }) => (
                <div key={label} className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full border ${dot}`} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {['Event', 'Organizer', 'Date', 'Status', 'Actions'].map((h) => (
                      <th
                        key={h}
                        className={`text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider
                          ${h === 'Organizer' ? 'hidden sm:table-cell' : ''}
                          ${h === 'Date'      ? 'hidden md:table-cell' : ''}
                          ${h === 'Actions'   ? 'text-center'          : ''}
                        `}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {events.map((event: any) => (
                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">

                      {/* Event name + image */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                            {event.image?.startsWith('http') || event.image?.startsWith('blob') ? (
                              <Image src={event.image} alt={event.title} fill className="object-cover" unoptimized />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">🗓️</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 line-clamp-2">{event.title}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 hidden sm:table-cell text-sm text-gray-700">
                        {event.organizer}
                      </td>

                      <td className="py-4 px-6 hidden md:table-cell">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{event.date}</span>
                        </div>
                      </td>

                      {/* Status badge */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          event.status === 'Approved' ? 'bg-green-100 text-green-700' :
                          event.status === 'Rejected' ? 'bg-red-100 text-red-700'    :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {event.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            href={`/admin/events/${event.id}`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/admin/events/${event.id}/edit`}
                            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>

                          {event.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleAction(event, 'approve')}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleAction(event, 'reject')}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {event.status === 'Rejected' && (
                            <button
                              onClick={() => handleAction(event, 'approve')}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Re-approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => handleAction(event, 'delete')}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing {events.length} event{events.length !== 1 ? 's' : ''}
              </p>
            </div>
          </>
        )}
      </div>

      {/* ── Create Event Modal ─────────────────────────────────────────────── */}
      {showCreateModal && (
        <CreateEventModal
          newEvent={newEvent}
          onChange={setNewEvent}
          onClose={() => { setShowCreateModal(false); setNewEvent(DEFAULT_EVENT); }}
          onSubmit={handleCreateEvent}
        />
      )}

      {/* ── Approve / Reject / Delete Confirmation Modal ──────────────────── */}
      {modalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
              actionType === 'approve' ? 'bg-green-100' :
              actionType === 'reject'  ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              {actionType === 'approve' && <CheckCircle className="w-6 h-6 text-green-600" />}
              {actionType === 'reject'  && <XCircle     className="w-6 h-6 text-yellow-600" />}
              {actionType === 'delete'  && <Trash2      className="w-6 h-6 text-red-600" />}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 capitalize">
              {actionType} Event?
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              You are about to <strong>{actionType}</strong>{' '}
              <span className="font-medium text-gray-900">"{selectedEvent.title}"</span>.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {actionType === 'approve' && 'This will publish the event publicly for all users to see.'}
              {actionType === 'reject'  && 'This will hide the event and notify the organizer.'}
              {actionType === 'delete'  && 'This will permanently remove the event. This action cannot be undone.'}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-5 py-2.5 rounded-lg font-medium text-white ${
                  actionType === 'approve' ? 'bg-green-600 hover:bg-green-700'   :
                  actionType === 'reject'  ? 'bg-yellow-600 hover:bg-yellow-700' :
                  'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionType === 'approve' ? 'Approve' : actionType === 'reject' ? 'Reject' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}