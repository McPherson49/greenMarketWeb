import React from "react";
import Image from "next/image";
import { X, Calendar, MapPin, Users, Upload, Video, Link as LinkIcon } from "lucide-react";
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
    newEvent.title &&
    newEvent.date &&
    newEvent.location &&
    newEvent.description;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 px-4 backdrop-blur overflow-y-auto">
      <div className="bg-white mt-20 rounded-2xl shadow-2xl max-w-2xl w-full my-8 max-h-screen overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => onChange({ ...newEvent, title: e.target.value })}
              placeholder="e.g., AgriFood Nigeria 2026 Exhibition"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Date & Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => onChange({ ...newEvent, date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => onChange({ ...newEvent, time: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Location + Online toggle */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              Location <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newEvent.location}
                onChange={(e) => onChange({ ...newEvent, location: e.target.value })}
                placeholder="e.g., Lagos Event Center or Online"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <label className="flex items-center gap-2 whitespace-nowrap cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={newEvent.isOnline}
                  onChange={(e) =>
                    onChange({
                      ...newEvent,
                      isOnline: e.target.checked,
                      meetingLink: e.target.checked ? newEvent.meetingLink : "",
                    })
                  }
                  className="w-4 h-4 accent-green-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Online</span>
              </label>
            </div>
          </div>

          {/* Meeting Link — disabled until isOnline is checked */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 mb-1">
              <Video className={`w-4 h-4 ${newEvent.isOnline ? "text-green-600" : "text-gray-300"}`} />
              Meeting Link
              <span className="text-xs font-normal text-gray-400 ml-1">(Zoom, Google Meet, etc.)</span>
            </label>
            <p className="text-xs text-gray-400 mb-2">
              {newEvent.isOnline
                ? "Paste your virtual meeting link below."
                : 'Check "Online" above to enable this field.'}
            </p>
            <input
              type="url"
              value={newEvent.meetingLink}
              onChange={(e) => onChange({ ...newEvent, meetingLink: e.target.value })}
              placeholder="https://zoom.us/j/..."
              disabled={!newEvent.isOnline}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-all ${
                newEvent.isOnline
                  ? "border-green-400 focus:ring-2 focus:ring-green-500 bg-white"
                  : "border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed select-none"
              }`}
            />
            {newEvent.isOnline && (
              <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                Shared with attendees after registration.
              </p>
            )}
          </div>

          {/* Registration Link — always available */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 mb-1">
              <LinkIcon className="w-4 h-4 text-blue-500" />
              Registration Link
              <span className="text-xs font-normal text-gray-400 ml-1">(optional)</span>
            </label>
            <p className="text-xs text-gray-400 mb-2">
              External registration page (Eventbrite, Google Forms, etc.)
            </p>
            <input
              type="url"
              value={newEvent.registrationLink}
              onChange={(e) => onChange({ ...newEvent, registrationLink: e.target.value })}
              placeholder="https://eventbrite.com/e/..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={newEvent.description}
              onChange={(e) => onChange({ ...newEvent, description: e.target.value })}
              rows={5}
              placeholder="Tell people what this event is about, agenda, speakers, etc..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-gray-700 leading-relaxed"
            />
          </div>

          {/* Event Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Event Image <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="space-y-3">
              {newEvent.previewImage ? (
                <div className="relative rounded-xl overflow-hidden shadow-md border border-gray-200 aspect-8/4">
                  <Image src={newEvent.previewImage} alt="Event preview" fill className="object-cover" unoptimized />
                  <button
                    type="button"
                    onClick={() => onChange({ ...newEvent, previewImage: null, image: null })}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg z-10"
                  >
                    <X className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              ) : (
                <div className="aspect-8/4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">No image selected</p>
                </div>
              )}
              <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors text-sm">
                <Upload className="w-4 h-4" />
                {newEvent.previewImage ? "Replace Image" : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onChange({ ...newEvent, image: file, previewImage: URL.createObjectURL(file) });
                  }}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-400">Recommended: 1200×600px · JPG, PNG · Max 5MB</p>
            </div>
          </div>

         
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!isValid}
            className="px-8 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold shadow-md transition-colors"
          >
            Submit for Approval
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;