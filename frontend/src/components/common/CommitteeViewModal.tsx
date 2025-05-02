import React from "react";
import { FiX } from "react-icons/fi";

interface CommitteeViewModalProps {
  committee: {
    _id: string;
    term: string;
    year: number;
    president: {
      name: string;
      email: string;
      phone: string;
    };
    vicePresident: {
      name: string;
      email: string;
      phone: string;
    };
    secretary: {
      name: string;
      email: string;
      phone: string;
    };
    assistantSecretary: {
      name: string;
      email: string;
      phone: string;
    };
    treasurer: {
      name: string;
      email: string;
      phone: string;
    };
    members: {
      name: string;
      role: string;
      email: string;
      phone: string;
    }[];
    createdAt: string;
    updatedAt: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const CommitteeViewModal: React.FC<CommitteeViewModalProps> = ({
  committee,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            {committee.term} Committee {committee.year}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiX className="text-gray-500" size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Committee Main Info */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {committee.term} {committee.year}
                </h3>
                <p className="text-gray-600 text-sm">
                  Created on{" "}
                  {new Date(committee.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="px-4 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                Active
              </span>
            </div>
          </div>

          {/* Leadership Positions */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
              Leadership
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* President */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div>
                  <div className="flex items-center mb-1">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded mr-2">
                      President
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900">
                    {committee.president.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {committee.president.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    {committee.president.phone}
                  </p>
                </div>
              </div>

              {/* Vice President */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div>
                  <div className="flex items-center mb-1">
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded mr-2">
                      Vice President
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900">
                    {committee.vicePresident.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {committee.vicePresident.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    {committee.vicePresident.phone}
                  </p>
                </div>
              </div>

              {/* Secretary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div>
                  <div className="flex items-center mb-1">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded mr-2">
                      Secretary
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900">
                    {committee.secretary.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {committee.secretary.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    {committee.secretary.phone}
                  </p>
                </div>
              </div>

              {/* Assistant Secretary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div>
                  <div className="flex items-center mb-1">
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded mr-2">
                      Assistant Secretary
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900">
                    {committee.assistantSecretary.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {committee.assistantSecretary.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    {committee.assistantSecretary.phone}
                  </p>
                </div>
              </div>

              {/* Treasurer */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div>
                  <div className="flex items-center mb-1">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded mr-2">
                      Treasurer
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900">
                    {committee.treasurer.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {committee.treasurer.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    {committee.treasurer.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Committee Members */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
              Committee Members
            </h3>

            {committee.members.length === 0 ? (
              <div className="text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <p className="text-gray-500">
                  No additional committee members for this term.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {committee.members.map((member, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {member.name}
                      </h4>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      <p>{member.email}</p>
                      <p>{member.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 border-t pt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitteeViewModal;