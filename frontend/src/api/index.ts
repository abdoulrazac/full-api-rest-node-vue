import axios from 'axios';
import { apiUrl } from '@/env';

import { user } from "./user"
import { societe } from "./societe"
import { authHeadersBasic } from '@/utils';



export const api = {

  // Requete pour login
  async logInGetToken(username: string, password: string) {
    const params = new URLSearchParams(); 
    params.append('username', username);
    params.append('password', password);

    return axios.get(`${apiUrl}/api/v1/auth/token`, authHeadersBasic(username, password));
  },
  async passwordRecovery(email: string) {
    return axios.post(`${apiUrl}/api/v1/password-recovery/${email}`);
  },
  async resetPassword(password: string, token: string) {
    return axios.post(`${apiUrl}/api/v1/reset-password/`, {
      new_password: password,
      token,
    });
  },

  // Autres requetes à importer
  user,
  societe,
};
