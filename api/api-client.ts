// src/services/api.ts
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "@/lib/store";

// Track active requests
const activeRequests = new Map<string, AxiosRequestConfig>();

// Axios interceptor for global error logging
axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // console.error("INTERCEPTOR ERROR:", error);
    return Promise.reject(error);
  }
);

export interface RequestOptions<T = any> {
  url: string;
  data?: Record<string, any>; // query params
  method?: AxiosRequestConfig["method"];
  body?: any; // request body
  headers?: Record<string, string>;
  publicApi?: boolean; // unused but left for compatibility
  file?: boolean;
  ignoreDuplicateCheck?: boolean;
}

function isDuplicateRequest(
  existingRequest: AxiosRequestConfig,
  newParams?: Record<string, any>,
  newBody?: any
): boolean {
  return (
    JSON.stringify(existingRequest.params) === JSON.stringify(newParams) &&
    JSON.stringify(existingRequest.data) === JSON.stringify(newBody)
  );
}

async function request<T = any>({
  url,
  data,
  method = "get",
  body,
  headers: addHeaders,
  file,
  ignoreDuplicateCheck,
  publicApi,
}: RequestOptions<T>): Promise<T> {
  // Prevent duplicate requests
  // const existingRequest = activeRequests.get(url);
  // if (existingRequest && !ignoreDuplicateCheck) {
  //   if (isDuplicateRequest(existingRequest, data, body)) {
  //     console.log("Duplicate request detected:", url);
  //     return Promise.reject(new Error("Duplicate request"));
  //   }
  // }
  activeRequests.set(url, { params: data, data: body });

  try {
    const headers: Record<string, string> = {
      "Content-Type": file ? "multipart/form-data" : "application/json",
      "Access-Control-Allow-Origin": "*",
      ...addHeaders,
    };

    const config: AxiosRequestConfig = {
      method,
      url,
      params: data,
      data: body,
      headers,
      responseType: "json",
      withCredentials: true
    };

    const res = await axios<T>(config);
    console.log(`%c SUCCESS: ${url}`, "color: #0ffaac");
    return res.data;
  } catch (err: any) {
    console.log(`%c FAILED: ${url}`, "color: #FF0000");
    throw err?.response?.data ?? err;
  } finally {
    activeRequests.delete(url);
  }
}

const api = { request };
export default api;
