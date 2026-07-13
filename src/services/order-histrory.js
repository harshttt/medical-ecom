import axios from "../utils/axios";

export default class service {
  static baseURL = "";

  static listHistory(data) {
    return axios.get(this.baseURL + "/admin/order/getAll", {
      params: data,
    });
  }

   static updateProductBooking(id, data) {
    console.log("updateProductBooking", id, data);
    return axios.put(`${this.baseURL}admin/manage/status/${id}`, data);
  }

}
