import React, { useState } from "react";
import { FiX, FiUser, FiMail, FiPhone, FiPlus, FiTrash2, FiCalendar } from "react-icons/fi";
import { toast } from "react-toastify";

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
  term: string;
  year: number;
  organizationId: string;
  president: CommitteeLeader;
  vicePresident: CommitteeLeader;
  secretary: CommitteeLeader;
  assistantSecretary: CommitteeLeader;
  treasurer: CommitteeLeader;
  members: Member[];
}

interface CreateCommitteeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Committee) => void;
  organizationId: string;
}

const initialLeaderState: CommitteeLeader = {
  name: "",
  email: "",
  phone: "",
};

const initialMemberState: Member = {
  name: "",
  role: "",
  email: "",
  phone: "",
};

const CreateCommitteeModal: React.FC<CreateCommitteeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  organizationId,
}) => {
  const [formData, setFormData] = useState<Committee>({
    term: "",
    year: new Date().getFullYear(),
    organizationId: organizationId,
    president: { ...initialLeaderState },
    vicePresident: { ...initialLeaderState },
    secretary: { ...initialLeaderState },
    assistantSecretary: { ...initialLeaderState },
    treasurer: { ...initialLeaderState },
    members: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      // Handle nested fields (e.g., "president.name")
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof Committee],
          [child]: value,
        },
      }));
    } else {
      // Handle top-level fields
      setFormData((prev) => ({
        ...prev,
        [name]: name === "year" ? parseInt(value) : value,
      }));
    }
  };

  const handleMemberChange = (
    index: number,
    field: keyof Member,
    value: string
  ) => {
    setFormData((prev) => {
      const updatedMembers = [...prev.members];
      updatedMembers[index] = {
        ...updatedMembers[index],
        [field]: value,
      };
      return {
        ...prev,
        members: updatedMembers,
      };
    });
  };

  const addMember = () => {
    setFormData((prev) => ({
      ...prev,
      members: [...prev.members, { ...initialMemberState }],
    }));
  };

  const removeMember = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    // Validate basic fields
    if (!formData.term.trim()) {
      newErrors.term = "Term is required";
    }
    
    if (!formData.year || formData.year < 2000 || formData.year > 2100) {
      newErrors.year = "Enter a valid year";
    }

    // Validate president (required)
    if (!formData.president.name.trim()) {
      newErrors["president.name"] = "President name is required";
    }
    if (!formData.president.email.trim()) {
      newErrors["president.email"] = "President email is required";
    } else if (!isValidEmail(formData.president.email)) {
      newErrors["president.email"] = "Enter a valid email address";
    }

    // Validate other required leaders
    const requiredLeaders = ["vicePresident", "secretary", "treasurer"];
    requiredLeaders.forEach(leader => {
      if (!formData[leader as keyof Committee]?.name?.trim()) {
        newErrors[`${leader}.name`] = `${leader.replace(/([A-Z])/g, ' $1').trim()} name is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string): boolean => {
    // Basic email validation
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
          <h2 className="text-2xl font-semibold text-gray-800">
            Add New Committee
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="text-gray-500" size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Committee Details */}
            <div className="bg-gray-50 p-4 rounded-lg col-span-full">
              <h3 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b">
                Committee Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className={`pl-10 w-full p-2 border ${
                        errors.term ? "border-red-500" : "border-gray-300"
                      } rounded-md`}
                      placeholder="e.g. Spring, Fall, Annual"
                    />
                  </div>
                  {errors.term && (
                    <p className="text-red-500 text-xs mt-1">{errors.term}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    min="2000"
                    max="2100"
                    className={`w-full p-2 border ${
                      errors.year ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                  />
                  {errors.year && (
                    <p className="text-red-500 text-xs mt-1">{errors.year}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Leadership Positions */}
            {['president', 'vicePresident', 'secretary', 'assistantSecretary', 'treasurer'].map((role) => (
              <div key={role} className="bg-gray-50 p-4 rounded-lg col-span-full md:col-span-1">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  {role === 'president' ? 'President' : 
                   role === 'vicePresident' ? 'Vice President' :
                   role === 'secretary' ? 'Secretary' :
                   role === 'assistantSecretary' ? 'Assistant Secretary' : 'Treasurer'}
                  {role !== 'assistantSecretary' && <span className="text-red-500"> *</span>}
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name {role !== 'assistantSecretary' && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name={`${role}.name`}
                        value={formData[role as keyof Committee].name}
                        onChange={handleChange}
                        className={`pl-10 w-full p-2 border ${
                          errors[`${role}.name`] ? "border-red-500" : "border-gray-300"
                        } rounded-md`}
                        required={role !== 'assistantSecretary'}
                      />
                    </div>
                    {errors[`${role}.name`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`${role}.name`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email {role === 'president' && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name={`${role}.email`}
                        value={formData[role as keyof Committee].email}
                        onChange={handleChange}
                        className={`pl-10 w-full p-2 border ${
                          errors[`${role}.email`] ? "border-red-500" : "border-gray-300"
                        } rounded-md`}
                        required={role === 'president'}
                      />
                    </div>
                    {errors[`${role}.email`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`${role}.email`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name={`${role}.phone`}
                        value={formData[role as keyof Committee].phone}
                        onChange={handleChange}
                        className="pl-10 w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Committee Members Section */}
          <div className="mt-8 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Committee Members</h3>
              <button
                type="button"
                onClick={addMember}
                className="flex items-center bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="mr-1" /> Add Member
              </button>
            </div>

            {formData.members.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                No additional committee members added yet. Click "Add Member" to add members.
              </div>
            ) : (
              <div className="space-y-6">
                {formData.members.map((member, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 relative"
                  >
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded-full"
                    >
                      <FiTrash2 size={16} />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                            className="pl-10 w-full p-2 border border-gray-300 rounded-md"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => handleMemberChange(index, "role", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="e.g. Event Coordinator"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="text-gray-400" />
                          </div>
                          <input
                            type="email"
                            value={member.email}
                            onChange={(e) => handleMemberChange(index, "email", e.target.value)}
                            className="pl-10 w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiPhone className="text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            value={member.phone}
                            onChange={(e) => handleMemberChange(index, "phone", e.target.value)}
                            className="pl-10 w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Saving...
                </>
              ) : (
                "Create Committee"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommitteeModal;