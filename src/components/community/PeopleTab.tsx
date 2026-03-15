import React from "react";
import { Member } from "../../types/community";

interface PeopleTabProps {
  members: Member[];
}

const PeopleTab: React.FC<PeopleTabProps> = ({ members }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2 sm:gap-0">
        <h2 className="text-xl font-semibold text-gray-900">Members</h2>
        <span className="text-sm text-gray-500">{members.length} members</span>
      </div>

      <div className="space-y-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100 last:border-b-0 gap-3 sm:gap-0"
          >
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="w-12 h-12 bg-gray-300 rounded-full shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-gray-900 truncate">{member.name}</p>
                  {member.role !== "Member" && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        member.role === "Admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {member.role}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">Joined {member.joined}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeopleTab;