import axios from "../utils/axios";

export default class service {

  static listAuction(data) {
    return axios.get("/admin/auction/getAll", { params: data });
  }

  static addAuction(data) {
    return axios.post("/admin/auction/add", data);
  }

  static updateAuction(id, data) {
    return axios.put(`/admin/auction/${id}`, data);
  }

  static publish(id) {
    return axios.put(`/admin/auction/publish/${id}`);
  }

  static cancel(id) {
    return axios.put(`/admin/auction/cancel/${id}`);
  }

  static delete(id) {
    return axios.delete(`/admin/auction/${id}`);
  }

  static getBids(auctionId) {
    return axios.get(`/admin/auction/bids/${auctionId}`);
  }

  static getBidDetail(auctionId, bidId) {
    return axios.get(`/admin/auction/${auctionId}/bids/${bidId}`);
  }
}




