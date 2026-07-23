

import axios from "../utils/axios";

export default class service {

  static listProduct(data) {
    return axios.get("/admin/product/getAll", { params: data });
  }

  static addProduct(data) {
    return axios.post("/vendor/product/add", data);
  }

  // ✅ Fixed
  static updateProduct(id, data) {
    return axios.put(`/admin/product/${id}`, data);
  }

  // ✅ Fixed
  static delete(id) {
    return axios.delete(`/admin/product/${id}`);
  }

  // ✅ Fixed
  static toggle(id) {
    return axios.put(`/admin/product/${id}/status`);
  }

  static deletemany(ids) {
    const idArray = Array.isArray(ids) ? ids : [ids];
    return axios.delete("/admin/product/bulk-delete", {
      data: { ids: idArray },
    });
  }
}