import api from "./api-client";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const createOrganization = async (payload: any) => {
  const url = `${baseUrl}/organizations`;
  return api.request({
    url,
    method: "POST",
    body: payload,
  });
};

export const getOrganization = async (organizationId: string) => {
  const url = `${baseUrl}/organizations/${organizationId}`;
  return api.request({
    url,
    method: "GET",
  });
};

export const inviteUsers = async (payload: any) => {
  const url = `${baseUrl}/organizations/invite`;
  return api.request({
    url,
    method: "POST",
    body: payload,
  });
};

export const getAdminInvitedUsers = async (organizationId: string) => {
  const url = `${baseUrl}/organizations/invitations/${organizationId}`;
  return api.request({
    url,
    method: "GET",
  });
};

export const acceptInvitation = async (payload: { inviteCode: string }) => {
  const url = `${baseUrl}/users/accept-invite`;
  return api.request({
    url,
    method: "POST",
    body: payload,
  });
};

export const promoteToAdmin = async (payload: {
  email: string;
  organizationId: string;
}) => {
  const url = `${baseUrl}/organizations/admins/add`;
  return api.request({
    url,
    method: "POST",
    body: payload,
  });
};

export const demoteFromAdmin = async (payload: {
  email: string;
  organizationId: string;
}) => {
  const url = `${baseUrl}/organizations/admins/delete`;
  return api.request({
    url,
    method: "DELETE",
    body: payload,
  });
};

export const promoteToModerator = async (payload: {
  email: string;
  organizationId: string;
}) => {
  const url = `${baseUrl}/organizations/moderators/add`;
  return api.request({
    url,
    method: "POST",
    body: payload,
  });
};

export const demoteFromModerator = async (payload: {
  email: string;
  organizationId: string;
}) => {
  const url = `${baseUrl}/organizations/moderators/delete`;
  return api.request({
    url,
    method: "DELETE",
    body: payload,
  });
};

export const promoteToEditor = async (payload: {
  email: string;
  organizationId: string;
}) => {
  const url = `${baseUrl}/organizations/editors/add`;
  return api.request({
    url,
    method: "POST",
    body: payload,
  });
};

export const demoteFromEditor = async (payload: {
  email: string;
  organizationId: string;
}) => {
  const url = `${baseUrl}/organizations/editors/delete`;
  return api.request({
    url,
    method: "DELETE",
    body: payload,
  });
};

export const deleteOrganization = async (id: string) => {
  const url = `${baseUrl}/organizations/${id}`;
  return api.request({
    url,
    method: "DELETE",
  });
};

export const updateOrganization = async (payload: {
  organizationId: string;
  name: string;
  type: string;
  domain: string;
  isDomainOpen: boolean;
  logo: string;
}) => {
  const url = `${baseUrl}/organizations/${payload.organizationId}`;
  return api.request({
    url,
    method: "PUT",
    body: payload,
  });
};

export const removeMember = async (payload: {
  userId: string;
  organizationId: string;
}) => {
  const url = `${baseUrl}/organizations/member/remove`;
  return api.request({
    url,
    method: "DELETE",
    body: payload,
  });
};

export const cancelInvite = async (payload: {
  inviteId: string;
  organizationId: string;
}) => {
  const url = `${baseUrl}/organizations/cancel-invite/${payload.inviteId}/organization/${payload.organizationId}`;
  return api.request({
    url,
    method: "POST",
    body: payload,
  });
};

export const resendInvite = async (payload: {
  emails: Array<{
    email: string;
  }>;
  organizationId: string;
}) => {
  const url = `${baseUrl}/organizations/invite`;
  return api.request({
    url,
    method: "POST",
    body: payload,
  });
};

export const updateCategories = async (payload: {
  organizationId: string;
  renames: Array<{
    _id: string;
    name: string;
  }>;
  deletions: string[];
  adds: string[];
}) => {
  const url = `${baseUrl}/organizations/categories/update`;
  return api.request({
    url,
    method: "PUT",
    body: payload,
  });
};

export const updateUserCategories = async (payload: {
  userId: string;
  organizationId: string;
  categoryName: string;
}) => {
  const url = `${baseUrl}/organizations/members/update`;
  return api.request({
    url,
    method: "PUT",
    body: payload,
  });
};
