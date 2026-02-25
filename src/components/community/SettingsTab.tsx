import React, { useState } from "react";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { Member } from "../../types/community";

interface SettingsTabProps {
  members: Member[];
}

const SettingsTab: React.FC<SettingsTabProps> = ({ members }) => {
  const [settingsSubTab, setSettingsSubTab] = useState<
    "General" | "Members" | "Moderation" | "Notifications"
  >("General");
  const [searchMembers, setSearchMembers] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchMembers.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchMembers.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Community Settings</h2>
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
          {["General", "Members", "Moderation", "Notifications"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSettingsSubTab(tab as any)}
              className={`px-3 sm:px-6 py-3 font-medium transition-colors whitespace-nowrap shrink-0 ${
                settingsSubTab === tab
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {settingsSubTab === "General" && (
          <div className="pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Community Name</label>
                <input
                  type="text"
                  defaultValue="Livestock & Poultry Network"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  defaultValue="Welcome to the Livestock & Poultry Network..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <button className="flex items-center space-x-2 text-green-600 hover:text-green-700">
                  <Edit3 className="w-4 h-4" />
                  <span>Upload Cover Photo</span>
                </button>
                <button className="flex items-center space-x-2 text-green-600 hover:text-green-700">
                  <Edit3 className="w-4 h-4" />
                  <span>Change Icon</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {settingsSubTab === "Members" && (
          <div className="pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Members</h3>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
              <input
                type="text"
                placeholder="Search members..."
                value={searchMembers}
                onChange={(e) => setSearchMembers(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                <span>Invite Member</span>
              </button>
            </div>
            <div className="space-y-4">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100 gap-3 sm:gap-0"
                >
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <div className="w-10 h-10 bg-gray-300 rounded-full shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{member.name}</p>
                      <p className="text-sm text-gray-500 truncate">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start">
                    {member.role === "Member" && (
                      <select className="border border-gray-300 rounded px-2 py-1 text-sm shrink-0">
                        <option>Member</option>
                        <option>Moderator</option>
                        <option>Admin</option>
                      </select>
                    )}
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="text-blue-600 hover:text-blue-700 text-sm shrink-0"
                    >
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-700 text-sm shrink-0">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {selectedMember && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">Editing {selectedMember.name}</h4>
                <button onClick={() => setSelectedMember(null)} className="text-gray-600 underline">
                  Close
                </button>
              </div>
            )}
          </div>
        )}

        {settingsSubTab === "Moderation" && (
          <div className="pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Moderation Tools</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input type="checkbox" id="auto-moderate" className="rounded" />
                <label htmlFor="auto-moderate" className="text-sm text-gray-700">
                  Enable auto-moderation for spam
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" id="report-notifs" className="rounded" />
                <label htmlFor="report-notifs" className="text-sm text-gray-700">
                  Notify admins on new reports
                </label>
              </div>
              <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center space-x-2">
                <Trash2 className="w-4 h-4" />
                <span>Clear All Reports</span>
              </button>
            </div>
          </div>
        )}

        {settingsSubTab === "Notifications" && (
          <div className="pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                "New post notifications",
                "Member join alerts",
                "Event reminders",
              ].map((label) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-3 border-b border-gray-100"
                >
                  <span className="text-sm text-gray-700">{label}</span>
                  <input type="checkbox" className="rounded" />
                </div>
              ))}
              <button className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg">
                Reset All Notifications
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsTab;