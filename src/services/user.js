import axios from "../utils/axios";

export default class service {
  static baseURL = "";

  static listUser(data) {
    return axios.get(this.baseURL + "/admin/adminUser/getAll", {
      params: data,
    });
  }

  static userToggle(userId) {
    return axios.put(this.baseURL + "/user/toggle", null, {
      params: { userId },
    });
  }

  static userBlock(userId) {
    return axios.patch(this.baseURL + "/user/block", null, {
      params: { userId },
    });
  }

  static delete(id) {
    return axios.delete(`${this.baseURL}/admin/adminUser/users/${id}`);
  }
}
