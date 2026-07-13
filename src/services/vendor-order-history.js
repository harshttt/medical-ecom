import axios from "../utils/axios";

export default class service {
  static baseURL = "";

  static listHistory(data) {
    return axios.get(this.baseURL + "/vendor/orders/getAll", {
      params: data,
    });
  }

   static updateProductBooking(id, data) {
    return axios.put(`${this.baseURL}vendor/orders/${id}`, data);
  }

}
