import axios from "../utils/axios";

export default class serviceCoupon {
  static baseURL = "admin";

  static listCoupon(data) {
    return axios.get(`${this.baseURL}/coupon/getAll`, { params: data });
  }

  static addCoupon(data) {
    return axios.post(`${this.baseURL}/coupon/add`, data);
  }

  static getCouponById(id) {
    return axios.get(`${this.baseURL}/coupon/${id}`);
  }

  static updateCoupon(id, data) {
    return axios.put(`${this.baseURL}/coupon/${id}`, data);
  }

  static delete(id) {
    return axios.delete(`${this.baseURL}/coupon/${id}`);
  }

  static getUsage(id) {
    return axios.get(`${this.baseURL}/coupon/${id}/usage`);
  }
}