import axios from 'axios';
import { apiUrl } from '@/env';
import { authHeaders } from '@/utils' ;
import { IUserProfile, IUserProfileUpdate, IUserProfileCreate } from '@/interfaces/UserInterface';



export const user = {
  async getMe(token: string) {
    return axios.get<IUserProfile>(`${apiUrl}/api/v1/users/me`, authHeaders(token));
  },
  async updateMe(token: string, data: IUserProfileUpdate) {
    return axios.put<IUserProfile>(`${apiUrl}/api/v1/users/me`, data, authHeaders(token));
  },
  async getAll(token: string) {
    return axios.get<IUserProfile[]>(`${apiUrl}/api/v1/users/`, authHeaders(token));
  },
  async getOne(token: string, userId : string) {
    return axios.get<IUserProfile>(`${apiUrl}/api/v1/users/${userId}`, authHeaders(token));
  },
  async update(token: string, userId: string, data: IUserProfileUpdate) {
    return axios.put(`${apiUrl}/api/v1/users/${userId}`, data, authHeaders(token));
  },
  async create(token: string, data: IUserProfileCreate) {
    return axios.post(`${apiUrl}/api/v1/users/`, data, authHeaders(token));
  },
};
