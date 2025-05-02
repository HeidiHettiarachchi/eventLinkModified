import { IErrorResponse } from "../types";
import { ICommittee } from "../types/IResponse";
import { API } from "../utils";

// Create a new committee
const createCommitteeAPI = async (newCommitteeData: ICommittee) => {
  const response = await API.post<ICommittee, IErrorResponse>("/committees", newCommitteeData);
  if (response.status === 201) {
    return response.data; // Return the created committee data
  } else {
    throw new Error(response.message);
  }
};

// Get all committees
const getAllCommitteesAPI = async () => {
  const response = await API.get<ICommittee[], IErrorResponse>("/committees");
  if (response.status === 200) {
    return response.data; // Return the list of committees
  } else {
    throw new Error(response.message);
  }
};

// Get current committee (most recent)
const getCurrentCommitteeAPI = async () => {
  const response = await API.get<ICommittee, IErrorResponse>("/committees/current");
  if (response.status === 200) {
    return response.data; // Return the current committee
  } else {
    throw new Error(response.message);
  }
};

// Get committees by year
const getCommitteesByYearAPI = async (year: number) => {
  const response = await API.get<ICommittee[], IErrorResponse>(`/committees/year/${year}`);
  if (response.status === 200) {
    return response.data; // Return committees for the specified year
  } else {
    throw new Error(response.message);
  }
};

// Get a specific committee by ID
const getCommitteeByIdAPI = async (committeeId: string) => {
  const response = await API.get<ICommittee, IErrorResponse>(`/committees/${committeeId}`);
  if (response.status === 200) {
    return response.data; // Return the committee with the specified ID
  } else {
    throw new Error(response.message);
  }
};

// Get committees by organization ID
const getCommitteesByOrganizationIdAPI = async (organizationId: string) => {
  const response = await API.get<ICommittee[], IErrorResponse>(`/committees/organization/${organizationId}`);
  if (response.status === 200) {
    return response.data; // Return committees for the specified organization
  } else {
    throw new Error(response.message);
  }
};

// Update a committee
const updateCommitteeAPI = async (committeeId: string, updatedCommitteeData: ICommittee) => {
  const response = await API.put<ICommittee, IErrorResponse>(`/committees/${committeeId}`, updatedCommitteeData);
  if (response.status === 200) {
    return response.data; // Return the updated committee data
  } else {
    throw new Error(response.message);
  }
};

// Delete a committee
const deleteCommitteeAPI = async (committeeId: string) => {
  const response = await API.delete<IErrorResponse>(`/committees/${committeeId}`);
  if (response.status === 200) {
    return response.data; // Return the success message on delete
  } else {
    throw new Error(response.message);
  }
};

export {
  createCommitteeAPI,
  getAllCommitteesAPI,
  getCurrentCommitteeAPI,
  getCommitteesByYearAPI,
  getCommitteeByIdAPI,
  getCommitteesByOrganizationIdAPI,
  updateCommitteeAPI,
  deleteCommitteeAPI,
};