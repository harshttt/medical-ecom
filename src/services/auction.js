import axios from "../utils/axios";

export default class service {

  static approve(id) {
  return axios.post(`/admin/auction/approve/${id}`);
}

static reject(id, data) {
  return axios.post(`/admin/auction/reject/${id}`, data); 
}

  static listAuction(data) {
    return axios.get("/admin/auction/getAll", { params: data });
  }

  static addAuction(data) {
    return axios.post("/admin/auction/add", data);
  }

  static updateAuction(id, data) {
    return axios.put(`/admin/auction/${id}`, data);
  }

  // static publish(id) {
  //   return axios.put(`/admin/auction/publish/${id}`);
  // }

  static cancel(id, data) {
    return axios.post(`/admin/auction/cancel/${id}`, data);
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

  static listProduct(data) {
    return axios.get("/admin/product/getAll", { params: data });
  }

}




