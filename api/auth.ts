import api from "./api-client";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const login = async (payload: any) => {
  const url = `${baseUrl}/users/login`;
  return api.request({
    url,
    method: "POST",
    body: payload,
    publicApi: true,
  });
};

export const register = async (payload: any) => {
  const url = `${baseUrl}/users/register`;
  return api.request({
    url,
    method: "POST",
    body: payload,
    publicApi: true,
  });
};

export const getUser = async () => {
  const url = `${baseUrl}/users/me`;
  return api.request({
    url,
    method: "GET",
  });
};

export const googleAuth = async (token: string) => {
  const url = `${baseUrl}/users/google-auth`;
  return api.request({
    url,
    method: "POST",
    body: { token },
    publicApi: true,
  });
};

export const getMe = async () => {
  const url = `${baseUrl}/users/me`;
  return api.request({
    url,
    method: "GET",
  });
};

export const logoutUser = async () => {
  const url = `${baseUrl}/users/logout`;
  return api.request({
    url,
    method: "POST",
  });
};

export const getInviteInfo = async (inviteCode: string) => {
  const url = `${baseUrl}/users/invitation/${inviteCode}`;
  return api.request({
    url,
    method: "GET",
  });
};

export const forgotPassword = async (payload: { email: string }) => {
  const url = `${baseUrl}/users/forgot-password`;
  return api.request({
    url,
    method: "POST",
    body: payload,
    publicApi: true,
  });
};

export const resetPassword = async (payload: {
  email: string;
  token: string;
  newPassword: string;
}) => {
  const url = `${baseUrl}/users/reset-password`;
  return api.request({
    url,
    method: "POST",
    body: payload,
    publicApi: true,
  });
};
