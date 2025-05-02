import React, { useState, useEffect } from "react";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiUsers,
} from "react-icons/fi";
import SideBarOrg from "../../components/SideBar/SideBarOrg";
import SideBarStaff from "../../components/SideBar/SideBarStaff";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import CommitteeViewModal from "../../components/common/CommitteeViewModal";
import CreateCommitteeModal from "../../components/common/CreateCommitteeModal";
import UpdateCommitteeModal from "../../components/common/UpdateCommitteeModal";
import { toast } from "react-toastify";
import { getUserDetailsAPI } from "../../services";
import { getUsersAPI } from "../../services/UserService";
import { getOrganizationsAPI } from "../../services/OrganizationService";

import {
  createCommitteeAPI,
  getAllCommitteesAPI,
  getCommitteesByOrganizationIdAPI,
  updateCommitteeAPI,
  deleteCommitteeAPI
} from "../../services/Commitee";

interface Member {
  name: string;
  role: string;
  email: string;
  phone: string;
}

interface CommitteeLeader {
  name: string;
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

interface IUser {
  _id: string;
  email: string;
  name?: string;
  role?: string;
}

const CommitteePage: React.FC = () => {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [sortField, setSortField] = useState<string>("year");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<IUser | null>(null);
  const [organizationId, setOrganizationId] = useState<string>("");
  const [orgName, setOrgName] = useState<string>("");
  const [userRole, setUserRole] = useState<"president" | "staffAdvisor" | "">(""); 

  useEffect(() => {
    // Initialize the component data flow
    const initData = async () => {
      try {
        await fetchUserDetails();
      } catch (error) {
        console.error("Failed to initialize component data:", error);
        setLoading(false);
      }
    };

    initData();
  }, []);

  // When userDetails is updated, fetch organizations
  useEffect(() => {
    if (userDetails && userDetails._id) {
      fetchOrganizations();
    }
  }, [userDetails]);

  const fetchUserDetails = async () => {
    try {
      // Get current user's details (including email)
      const currentUser = await getUserDetailsAPI();

      if (!currentUser || !currentUser.data || !currentUser.data.email) {
        console.error("Failed to get current user details or email");
        setLoading(false);
        setError("Could not retrieve your user information");
        return;
      }

      // Get all users
      const allUsers = await getUsersAPI();

      // Find the user with matching email
      const matchedUser = allUsers.find(
        (user) => user.email === currentUser.data.email
      );

      if (matchedUser) {
        // Set the full user details including ID and any other properties
        setUserDetails(matchedUser);
        console.log("User details matched and set:", matchedUser);
      } else {
        console.error(
          "No matching user found with email:",
          currentUser.data.email
        );
        // Set error state and stop loading
        setError("User not found in the system");
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch user details", error);
      setError("Failed to load user information");
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      // First check if userDetails exists
      if (!userDetails || !userDetails._id) {
        console.error("User details not available");
        setLoading(false);
        return;
      }

      // Get all organizations
      const response = await getOrganizationsAPI();

      if (!Array.isArray(response) || response.length === 0) {
        console.error(
          "Invalid organization data received or no organizations found"
        );
        setError("No organizations found");
        setLoading(false);
        return;
      }

      // Find organization where user is president or staff advisor
      const userOrg = response.find((org) => {
        const isPresident =
          org.president &&
          (org.president._id === userDetails._id ||
            org.president === userDetails._id);

        const isStaffAdvisor =
          org.staffAdvisor &&
          (org.staffAdvisor._id === userDetails._id ||
            org.staffAdvisor === userDetails._id);

        // Save the user's role in the organization
        if (isPresident) {
          setUserRole("president");
        } else if (isStaffAdvisor) {
          setUserRole("staffAdvisor");
        }

        return isPresident || isStaffAdvisor;
      });

      if (userOrg) {
        console.log("Found user's organization:", userOrg.name);
        setOrganizationId(userOrg._id);
        setOrgName(userOrg.name);

        // Now that we have the organization ID, fetch committees for this organization
        fetchCommitteesByOrganization(userOrg._id);
      } else {
        console.log("User is not assigned to any organization");
        setError("You are not assigned to any organization");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      setError("Failed to load organizations");
      setLoading(false);
    }
  };

  const fetchCommitteesByOrganization = async (orgId: string) => {
    try {
      setLoading(true);
      const response = await getCommitteesByOrganizationIdAPI(orgId);

      // Check if the response.data.data is an array before setting state
      if (Array.isArray(response.data.data)) {
        setCommittees(response.data.data);
      } else if (Array.isArray(response.data)) {
        // Fallback in case data is directly in response.data
        setCommittees(response.data);
      } else {
        // If neither is an array, set to empty array and show error
        console.error("API response is not in expected format:", response.data);
        setCommittees([]);
        setError("Invalid data format received from server");
        toast.error("Failed to load committees: Invalid data format");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching committees:", err);
      setCommittees([]); // Ensure committees is always an array
      setError("Failed to fetch committees");
      setLoading(false);
      toast.error("Failed to load committees");
    }
  };

  const handleCreateCommittee = async (formData: any) => {
    if (!organizationId) {
      toast.error("No organization selected");
      return;
    }
  
    try {
      // Include the organization ID
      const committeeData = {
        ...formData,
        organizationId: organizationId
      };
      
      await createCommitteeAPI(committeeData);
      toast.success('Committee created successfully');
      setIsCreateModalOpen(false);
      fetchCommitteesByOrganization(organizationId);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create committee');
    }
  };

  const handleUpdateCommittee = async (formData: any) => {
    if (!organizationId || !formData._id) {
      toast.error("Cannot update committee");
      return;
    }
  
    try {
      await updateCommitteeAPI(formData._id, formData);
      toast.success('Committee updated successfully');
      setIsUpdateModalOpen(false);
      fetchCommitteesByOrganization(organizationId);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update committee');
    }
  };

  const handleEditCommittee = (committee: Committee) => {
    setSelectedCommittee(committee);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (committee: Committee) => {
    setSelectedCommittee(committee);
    setIsDeleteModalOpen(true);
  };

  const handleViewCommittee = (committee: Committee) => {
    setSelectedCommittee(committee);
    setIsViewModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCommittee) return;
  
    try {
      await deleteCommitteeAPI(selectedCommittee._id);
      toast.success('Committee deleted successfully');
      setIsDeleteModalOpen(false);
      
      // Refetch the committees for the organization
      if (organizationId) {
        fetchCommitteesByOrganization(organizationId);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete committee');
    }
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedCommittees = [...committees]
    .filter((committee) => {
      // Apply search filter
      const searchLower = searchTerm.toLowerCase();
      return (
        committee.term.toLowerCase().includes(searchLower) ||
        committee.president.name.toLowerCase().includes(searchLower)
      );
    })
    .filter((committee) => {
      // Apply year filter
      return filterYear ? committee.year === filterYear : true;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortField === "year") {
        return sortDirection === "asc" ? a.year - b.year : b.year - a.year;
      } else if (sortField === "term") {
        return sortDirection === "asc"
          ? a.term.localeCompare(b.term)
          : b.term.localeCompare(a.term);
      } else if (sortField === "president") {
        return sortDirection === "asc"
          ? a.president.name.localeCompare(b.president.name)
          : b.president.name.localeCompare(a.president.name);
      }
      return 0;
    });

  // Extract unique years for filter dropdown - with defensive programming
  const years = Array.isArray(committees)
    ? Array.from(new Set(committees.map((c) => c.year))).sort((a, b) => b - a)
    : [];

  // Determine which sidebar to show based on user role
  const Sidebar = () => {
    if (userRole === "president") {
      return <SideBarOrg />;
    } else if (userRole === "staffAdvisor") {
      return <SideBarStaff />;
    } else {
      return <SideBarOrg />; // Default to organization sidebar
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-auto p-6 mt-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Committee Management
            </h1>
            <p className="text-gray-600">
              {orgName
                ? `Managing committees for ${orgName}`
                : "No organization selected"}
            </p>
          </div>

          {userRole && (
            <div className="mt-2 md:mt-0 px-4 py-2 bg-blue-50 text-blue-700 rounded-md flex items-center">
              <FiUsers className="mr-2" />
              <p>
                {userRole === "president"
                  ? "Organization President"
                  : "Staff Advisor"}
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Controls Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 p-2 border rounded-lg w-full"
                placeholder="Search committees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
                className="pl-10 p-2 border rounded-lg appearance-none pr-8 bg-white"
                value={filterYear || ""}
                onChange={(e) =>
                  setFilterYear(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FiChevronDown className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Add Committee Button */}
          <button
            onClick={() => {
              if (!organizationId) {
                toast.error("Please select an organization first");
                return;
              }
              setSelectedCommittee(null);
              setIsCreateModalOpen(true);
            }}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="mr-2" />
            Add Committee
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
          </div>
        ) : !organizationId ? (
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center">
            <FiUsers className="mx-auto text-4xl text-yellow-500 mb-3" />
            <h3 className="text-lg font-medium text-gray-800">
              Organization Required
            </h3>
            <p className="text-gray-600 mt-1">
              You need to be associated with an organization to manage
              committees.
            </p>
          </div>
        ) : sortedCommittees.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <FiUsers className="mx-auto text-4xl text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-800">
              No Committees Found
            </h3>
            <p className="text-gray-600 mt-1">
              {searchTerm || filterYear
                ? "No committees match your search criteria."
                : "Start by adding your first committee."}
            </p>
            <button
              onClick={() => {
                setSelectedCommittee(null);
                setIsCreateModalOpen(true);
              }}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-700 transition-colors mx-auto"
            >
              <FiPlus className="mr-2" />
              Add Committee
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort("term")}
                    >
                      <div className="flex items-center">
                        Term
                        {sortField === "term" &&
                          (sortDirection === "asc" ? (
                            <FiChevronUp className="ml-1" />
                          ) : (
                            <FiChevronDown className="ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort("year")}
                    >
                      <div className="flex items-center">
                        Year
                        {sortField === "year" &&
                          (sortDirection === "asc" ? (
                            <FiChevronUp className="ml-1" />
                          ) : (
                            <FiChevronDown className="ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort("president")}
                    >
                      <div className="flex items-center">
                        President
                        {sortField === "president" &&
                          (sortDirection === "asc" ? (
                            <FiChevronUp className="ml-1" />
                          ) : (
                            <FiChevronDown className="ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Leaders
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Members
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedCommittees.map((committee) => (
                    <tr key={committee._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {committee.term}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {committee.year}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {committee.president.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {committee.president.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded">
                            VP
                          </span>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                            Sec
                          </span>
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">
                            Tres
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {committee.members.length} members
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewCommittee(committee)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FiEye />
                          </button>
                          <button
                            onClick={() => handleEditCommittee(committee)}
                            className="text-amber-600 hover:text-amber-900"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(committee)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create Committee Modal */}
      <CreateCommitteeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCommittee}
        organizationId={organizationId}
      />

      {/* Update Committee Modal */}
      <UpdateCommitteeModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdateCommittee}
        committee={selectedCommittee}
        organizationId={organizationId}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Committee"
        message={`Are you sure you want to delete the committee for ${selectedCommittee?.term} ${selectedCommittee?.year}? This action cannot be undone.`}
      />

      {/* View Committee Modal */}
      {selectedCommittee && (
        <CommitteeViewModal
          committee={selectedCommittee}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CommitteePage;