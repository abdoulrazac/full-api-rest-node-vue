import axios from 'axios';
import { apiUrl } from '@/env';
import { authHeaders } from '@/utils' ;
import { ISociete, ISocieteUpdate, ISocieteCreate } from '@/interfaces/SocieteInterface';



export const societe = {
  async get(token: string) {
    return axios.get<ISociete[]>(`${apiUrl}/api/v1/societes/`, authHeaders(token));
  },
  async getOne(token: string, societeId: number) {
    return axios.get<ISociete>(`${apiUrl}/api/v1/societes/${societeId}`, authHeaders(token));
  },
  async update(token: string, societeId: number, data: ISocieteUpdate) {
    return axios.put(`${apiUrl}/api/v1/societes/${societeId}`, data, authHeaders(token));
  },
  async create(token: string, data: ISocieteCreate) {
    return axios.post(`${apiUrl}/api/v1/societes/`, data, authHeaders(token));
  },
  async getFacture(token: string, societeId: number) {
    return axios.get<ISociete>(`${apiUrl}/api/v1/societes/${societeId}/factures`, authHeaders(token));
  },
  async getTrajet(token: string, societeId: number) {
    return axios.get<ISociete>(`${apiUrl}/api/v1/societes/${societeId}/trajets`, authHeaders(token));
  },
};
