import api from './axios';

export const fetchEmployees = (params = {}) =>
  api.get('/employees', { params }).then((res) => res.data);

export const fetchEmployee = (id) =>
  api.get(`/employees/${id}`).then((res) => res.data.data);

export const createEmployee = (payload) =>
  api.post('/employees', payload).then((res) => res.data.data);

export const updateEmployee = (id, payload) =>
  api.put(`/employees/${id}`, payload).then((res) => res.data.data);

export const deleteEmployee = (id) =>
  api.delete(`/employees/${id}`).then((res) => res.data);
