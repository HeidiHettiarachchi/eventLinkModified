import React, { useState, useEffect } from "react";
import { FiX, FiUser, FiMail, FiPhone, FiPlus, FiTrash2, FiCalendar } from "react-icons/fi";

interface CommitteeLeader {
  name: string;
  email: string;
  phone: string;
}

interface Member {
  name: string;
  role: string;
  email: string;
  phone: string;
}

interface Committee {
  _id: string;
  term: string;
  year: number;
  organizationId: string;
  president: CommitteeLeader;
  vicePresident: CommitteeLeader;
  secretary: CommitteeLeader;
  assistantSecretary: CommitteeLeader;
  treasurer: CommitteeLeader;
  members: Member[];
  createdAt: string;
  updatedAt: string;
}

interface UpdateCommitteeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  committee: Committee | null;
  organizationId: string;
}

const UpdateCommitteeModal: React.FC<UpdateCommitteeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  committee,
  organizationId,
}) => {
  const initialLeaderState: CommitteeLeader = {
    name: "",
    email: "",
    phone: ""
  };

  const [formData, setFormData] = useState({
    _id: "",
    term: "",
    year: new Date().getFullYear(),
    organizationId: organizationId,
    president: { ...initialLeaderState },
    vicePresident: { ...initialLeaderState },
    secretary: { ...initialLeaderState },
    assistantSecretary: { ...initialLeaderState },
    treasurer: { ...initialLeaderState },
    members: [] as Member[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load committee data when the committee prop changes
  useEffect(() => {
    if (committee) {
      setFormData({
        _id: committee._id,
        term: committee.term,
        year: committee.year,
        organizationId: committee.organizationId || organizationId,
        president: { 
          name: committee.president?.name || "", 
          email: committee.president?.email || "", 
          phone: committee.president?.phone || "" 
        },
        vicePresident: { 
          name: committee.vicePresident?.name || "", 
          email: committee.vicePresident?.email || "", 
          phone: committee.vicePresident?.phone || "" 
        },
        secretary: { 
          name: committee.secretary?.name || "", 
          email: committee.secretary?.email || "", 
          phone: committee.secretary?.phone || "" 
        },
        assistantSecretary: { 
          name: committee.assistantSecretary?.name || "", 
          email: committee.assistantSecretary?.email || "", 
          phone: committee.assistantSecretary?.phone || "" 
        },
        treasurer: { 
          name: committee.treasurer?.name || "", 
          email: committee.treasurer?.email || "", 
          phone: committee.treasurer?.phone || "" 
        },
        members: committee.members || []
      });
    }
  }, [committee, organizationId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      // Handle nested fields (e.g., "president.name")
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData],
          [child]: value
        }
      });
    } else {
      // Handle top-level fields
      setFormData({
        ...formData,
        [name]: name === "year" ? parseInt(value) : value
      });
    }
  };

  const addMember = () => {
    setFormData({
      ...formData,
      members: [
        ...formData.members,
        { name: "", role: "", email: "", phone: "" }
      ]
    });
  };

  const removeMember = (index: number) => {
    const updatedMembers = [...formData.members];
    updatedMembers.splice(index, 1);
    setFormData({ ...formData, members: updatedMembers });
  };

  const handleMemberChange = (index: number, field: string, value: string) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFormData({ ...formData, members: updatedMembers });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Form will be closed by parent component upon successful update
    } catch (error) {
      console.error("Error updating committee:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10 rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-800">Update Committee</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiX className="text-gray-500" size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Term and Year */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Term <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="term"
                  value={formData.term}
                  onChange={handleChange}
                  className="pl-10 w-full p-2.5 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Spring Term"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                min={2000}
                max={2100}
                required
              />
            </div>
          </div>
          
          {/* High Ranking Members */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Leadership</h3>
            
            {/* President */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-2">
                  President
                </span>
                <span className="text-red-500">*</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 text-sm text-gray-700">Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="president.name"
                      value={formData.president.name}
                      onChange={handleChange}
                      className="pl-10 w-full p-2 border rounded-lg"
                      placeholder="Full Name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700">Email <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="president.email"
                      value={formData.president.email}
                      onChange={handleChange}
                      className="pl-10 w-full p-2 border rounded-lg"
                      placeholder="Email Address"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700">Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="president.phone"
                      value={formData.president.phone}
                      onChange={handleChange}
                      className="pl-10 w-full p-2 border rounded-lg"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vice President */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-2">
                  Vice President
                </span>
                <span className="text-red-500">*</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 text-sm text-gray-700">Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="vicePresident.name"
                      value={formData.vicePresident.name}
                      onChange={handleChange}
                      className="pl-10 w-full p-2 border rounded-lg"
                      placeholder="Full Name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="vicePresident.email"
                      value={formData.vicePresident.email}
                      onChange={handleChange}
                      className="pl-10 w-full p-2 border rounded-lg"
                      placeholder="Email Address"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700">Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="vicePresident.phone"
                      value={formData.vicePresident.phone}
                      onChange={handleChange}
                      className="pl-10 w-full p-2 border rounded-lg"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Secretary */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-2">
                  Secretary
                </span>
                <span className="text-red-500">*</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 text-sm text-gray-700">Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="secretary.name"
                      value={formData.secretary.name}
                      onChange={handleChange}
                      className="pl-10 w-full p-2 border rounded-lg"
                      placeholder="Full Name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="secretary.email"
                      value={formData.secretary.email}
                      onChange={handleChange}
                      className="pl-10 w-full p-2 border rounded-lg"
                      placeholder="Email Address"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700">Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="secretary.phone"
                      value={formData.secretary.phone}
                      onChange={handleChange}
                      className="pl-10 w-full p-2 border rounded-lg"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Assistant Secretary */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-2">
                  Assistant Secretary
                </span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 text-sm text-gray-700">Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="assistantSecretary.name"
                      value={formData.assistantSecretary.name}
                      onChange={handleChange}
                      className="pl-10 w-full p-2 border rounded-lg"
                      placeholder="Full Name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="assistantSecretary.email"
                      value={formData.assistantSecretary.email}
                      onChange={handleChange}
                      className="pl-10 w-full p-2 border rounded-lg"
                      placeholder="Email Address"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700">Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="assistantSecretary.phone"
                      value={formData.assistantSecretary.phone}
                      onChange={handleChange}
                      className="pl-10 w-full p-2 border rounded-lg"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Treasurer */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-2">
                  Treasurer
                </span>
                <span className="text-red-500">*</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 text-sm text-gray-700">Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="treasurer.name"
                      value={formData.treasurer.name}
                      onChange={handleChange}
                      className="pl-10 w-full p-2 border rounded-lg"
                      placeholder="Full Name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="treasurer.email"
                      value={formData.treasurer.email}
                      onChange={handleChange}
                      className="pl-10 w-full p-2 border rounded-lg"
                      placeholder="Email Address"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700">Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="treasurer.phone"
                      value={formData.treasurer.phone}
                      onChange={handleChange}
                      className="pl-10 w-full p-2 border rounded-lg"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Committee Members */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Committee Members</h3>
              <button
                type="button"
                onClick={addMember}
                className="flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
              >
                <FiPlus className="mr-1" /> Add Member
              </button>
            </div>

            {formData.members.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                No additional committee members added yet.
              </div>
            ) : (
              formData.members.map((member, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3 relative">
                  <button
                    type="button"
                    onClick={() => removeMember(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    title="Remove member"
                  >
                    <FiTrash2 />
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block mb-1 text-sm text-gray-700">Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                          className="pl-10 w-full p-2 border rounded-lg"
                          placeholder="Full Name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm text-gray-700">Role</label>
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => handleMemberChange(index, "role", e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        placeholder="Member Role"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm text-gray-700">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) => handleMemberChange(index, "email", e.target.value)}
                          className="pl-10 w-full p-2 border rounded-lg"
                          placeholder="Email Address"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm text-gray-700">Phone</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiPhone className="text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          value={member.phone}
                          onChange={(e) => handleMemberChange(index, "phone", e.target.value)}
                          className="pl-10 w-full p-2 border rounded-lg"
                          placeholder="Phone Number"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Committee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCommitteeModal;