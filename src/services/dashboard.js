import axios from "../utils/axios";

export default class DashboardService {
  static baseURL = "admin";

  static getDashboard(data = {}) {
    return axios.get(`${this.baseURL}/dashboard/summary`, {
      params: data,
    });
  }
}