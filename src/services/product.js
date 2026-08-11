

import axios from "../utils/axios";

export default class service {

  static listProduct(data) {
    return axios.get("/admin/product/getAll", { params: data });
  }

  static addProduct(data) {
    return axios.post("/vendor/product/add", data);
  }

  static updateProduct(id, data) {
    return axios.put(`/admin/product/${id}`, data);
  }

  static delete(id) {
    return axios.delete(`/admin/product/${id}`);
  }

 static toggle(id, status) {
  return axios.put(`/admin/product/${id}/status`, {
    status,
  });
}

  static deletemany(ids) {
    const idArray = Array.isArray(ids) ? ids : [ids];
    return axios.delete("/admin/product/bulk-delete", {
      data: { ids: idArray },
    });
  }
}