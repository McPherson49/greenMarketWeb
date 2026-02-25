import React from "react";
import Image from "next/image";
import { X, Calendar, MapPin, Users, Upload } from "lucide-react";
import { NewEvent } from "../../types/community";

interface CreateEventModalProps {
  newEvent: NewEvent;
  onChange: (event: NewEvent) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  newEvent,
  onChange,
  onClose,
  onSubmit,
}) => {
  const isValid =
    newEvent.title && newEvent.date && newEvent.location && newEvent.description;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 backdrop-blur overflow-y-auto">
      <div className="bg-white mt-20 rounded-2xl shadow-2xl max-w-2xl w-full my-8 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => onChange({ ...newEvent, title: e.target.value })}
              placeholder="e.g., agriFood Nigeria 2025 Exhibition"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
            />
          </div>

          {/* Date & Time */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => onChange({ ...newEvent, date: e.target.value })}
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time (optional)
              </label>
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => onChange({ ...newEvent, time: e.target.value })}
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              Location <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newEvent.location}
                onChange={(e) => onChange({ ...newEvent, location: e.target.value })}
                placeholder="e.g., Lagos Event Center or Online (Zoom)"
                className="flex-1 px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <label className="flex items-center gap-2 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={newEvent.isOnline}
                  onChange={(e) => onChange({ ...newEvent, isOnline: e.target.checked })}
                  className="w-5 h-5 text-green-600 rounded"
                />
                <span className="text-sm font-medium">Online Event</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={newEvent.description}
              onChange={(e) => onChange({ ...newEvent, description: e.target.value })}
              rows={6}
              placeholder="Tell people what this event is about, agenda, speakers, etc..."
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-gray-700 leading-relaxed"
            />
          </div>

          {/* Event Image */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Event Image
            </label>
            <div className="space-y-4">
              {newEvent.previewImage ? (
                <div className="relative max-w-full rounded-xl overflow-hidden shadow-md border border-gray-200 aspect-[8/4]">
                  <Image
                    src={newEvent.previewImage}
                    alt="Event preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => onChange({ ...newEvent, previewImage: null, image: null })}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors z-10"
                  >
                    <X className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              ) : (
                <div className="max-w-full aspect-[8/4] bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <p className="text-gray-400 text-center px-4">No image selected</p>
                </div>
              )}
              <div className="text-center">
                <label className="cursor-pointer inline-flex items-center gap-3 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors">
                  <Upload className="w-5 h-5" />
                  Upload Event Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        onChange({ ...newEvent, image: file, previewImage: url });
                      }
                    }}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-3">
                  Recommended: 1200×600px · JPG, PNG · Max 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Attendees */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4" />
              Expected Attendees (optional)
            </label>
            <input
              type="number"
              value={newEvent.attendees || ""}
              onChange={(e) =>
                onChange({ ...newEvent, attendees: parseInt(e.target.value) || null })
              }
              placeholder="e.g., 500"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-4 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!isValid}
            className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold shadow-md transition-colors"
          >
            Submit for Approval
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;