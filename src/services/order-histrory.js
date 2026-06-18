import axios from "../utils/axios";

export default class service {
  static baseURL = "";

  static listHistory(data) {
    return axios.get(this.baseURL + "/admin/order/getAll", {
      params: data,
    });
  }

}
