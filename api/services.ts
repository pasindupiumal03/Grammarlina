import api from "./api-client";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const deleteService = async (payload: any) => {
  const url = `${baseUrl}/services/${payload.serviceId}/organizationId/${payload.organizationId}`;
  return api.request({
    url,
    method: "DELETE",
  });
};

export const getServiceById = async (payload:any)=>{
  const url = `${baseUrl}/services/${payload.serviceId}/organizationId/${payload.organizationId}`;
  return api.request({
    url,
    method: "GET",
  });
}

export const getEncryptionKeys = async (id:string)=>{
  const url = `${baseUrl}/services/keys/${id}`;
  return api.request({
    url,
    method: "GET",
  });
} 