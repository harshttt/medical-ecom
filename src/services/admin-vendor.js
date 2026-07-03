
import axios from "../utils/axios";

export default class service {
  static baseURL = "admin/adminUser";

  static list(data) {
    return axios.get(this.baseURL + "/getAll", { params: data });
  }

  static add(data) {
    return axios.post(this.baseURL + "/vendor/create", data);
  }

  static update(userId, data) {
    return axios.put(`${this.baseURL}/users/${userId}`, data);
  }

  
  static updateCanSell(userId, canSell) {
    return axios.patch(`${this.baseURL}/vendor/${userId}/can-sell`, { canSell });
  }

  static delete(userId) {
    return axios.delete(`${this.baseURL}/users/${userId}`);
  }
}