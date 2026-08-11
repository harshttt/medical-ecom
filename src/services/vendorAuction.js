import axios from "../utils/axios";

export default class service {
  static listAuction(data) {
    return axios.get("/vendor/auction/getAll", { params: data });
  }

  static addAuction(data) {
    return axios.post("/vendor/auction/add", data);
  }

  static updateAuction(id, data) {
    return axios.put(`/vendor/auction/${id}`, data);
  }

  static cancel(id, data) {
    return axios.post(`/vendor/auction/cancel/${id}`, data);
  }

  static delete(id) {
    return axios.delete(`/vendor/auction/${id}`);
  }

  static getBids(auctionId) {
    return axios.get(`/vendor/auction/bids/${auctionId}`);
  }

  static getBidDetail(auctionId, bidId) {
    return axios.get(`/vendor/auction/${auctionId}/bids/${bidId}`);
  }

  static listProduct(data) {
    return axios.get("/vendor/product/getAll", { params: data });
  }
}