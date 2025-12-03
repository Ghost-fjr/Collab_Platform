import axiosClient from "./axiosClient";

export const ProjectAPI = {
  list: () => axiosClient.get("projects/"),
  get: (id) => axiosClient.get(`projects/${id}/`),
  create: (data) => axiosClient.post("projects/", data),
  update: (id, data) => axiosClient.put(`projects/${id}/`, data),
  delete: (id) => axiosClient.delete(`projects/${id}/`),
};
