'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, XCircle, Trash2, Eye, Pencil, Calendar, MapPin, Users } from 'lucide-react';

const mockEvents = [
  {
    id: '1',
    title: 'agriFood Nigeria 2025 Exhibition',
    organizer: 'GreenMarket Team',
    date: '3-5 March 2025',
    location: 'Lagos State Event Center',
    attendees: 1500,
    description: 'Premier agricultural exhibition featuring livestock innovations...',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    status: 'Approved',
    createdDate: '10 Dec 2025',
  },
  {
    id: '2',
    title: 'Sustainable Poultry Farming Workshop',
    organizer: 'Adeline Enterprise',
    date: '17 June 2025',
    location: 'Online (Zoom)',
    attendees: 307,
    description: 'Learn cost-effective and eco-friendly poultry practices.',
    image: 'https://images.unsplash.com/photo-1605758405.jpg?w=800&h=400&fit=crop',
    status: 'Pending',
    createdDate: '01 Jan 2026',
  },
  {
    id: '3',
    title: 'Farm Machinery Demo Day',
    organizer: 'John Tractor Ltd',
    date: '20 July 2025',
    location: 'Ogun State Farm Hub',
    attendees: 120,
    description: 'Live demonstrations of latest tractors and harvesters.',
    image: 'https://images.unsplash.com/photo-1622214366188?w=800&h=400&fit=crop',
    status: 'Pending',
    createdDate: '02 Jan 2026',
  },
];

export default function AdminEventsPage() {
  const [events, setEvents] = useState(mockEvents);
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
      setEvents(events.filter(e => e.id !== selectedEvent.id));
    } else {
      const newStatus = actionType === 'approve' ? 'Approved' : 'Rejected';
      setEvents(events.map(e => 
        e.id === selectedEvent.id ? { ...e, status: newStatus } : e
      ));
    }

    setModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Event Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and approve member-submitted events
          </p>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Organizer
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Date
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {event.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3" />
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

                  <td className="py-4 px-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      event.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      event.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {event.status}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/events/${event.id}`}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Public Page"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </Link>

                      <Link
                        href={`/admin/events/${event.id}`}
                        className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4 text-emerald-600" />
                      </Link>

                      {event.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleAction(event, 'approve')}
                            className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </button>
                          <button
                            onClick={() => handleAction(event, 'reject')}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleAction(event, 'delete')}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
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
      </div>

      {/* Confirmation Modal */}
      {modalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {actionType === 'approve' ? 'Approve' : actionType === 'reject' ? 'Reject' : 'Delete'} Event?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              "{selectedEvent.title}" will be {actionType === 'approve' ? 'published publicly' : 
              actionType === 'reject' ? 'hidden and returned to organizer' : 'permanently deleted'}.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-5 py-2.5 rounded-lg font-medium text-white ${
                  actionType === 'delete' || actionType === 'reject' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
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